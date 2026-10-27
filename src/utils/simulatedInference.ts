import { ModelId, ModulationType, PredictionProbabilities, PredictionResult, SignalSample } from '../types';
import { extractSignalFeatures } from './featureExtractor';

export function runSimulatedInference(
  signal: SignalSample,
  modelId: ModelId = 'cnn'
): PredictionResult {
  const { i, q, modulation: trueClass, snr } = signal;
  const features = extractSignalFeatures(i, q);

  // Base classification probabilities conditioned on trueClass, SNR, and Model characteristics
  let pDsb = 0.33;
  let pSsb = 0.33;
  let pWbfm = 0.34;

  const effectiveSnr = snr !== undefined ? snr : features.estimatedSNR;

  // At very low SNR (<= -10 dB), signals are largely buried in noise
  if (effectiveSnr <= -12) {
    const jitter1 = (Math.random() - 0.5) * 0.12;
    const jitter2 = (Math.random() - 0.5) * 0.12;
    pDsb = 0.33 + jitter1;
    pSsb = 0.33 + jitter2;
    pWbfm = Math.max(0.05, 1.0 - pDsb - pSsb);
  } else {
    // Sigmoid SNR factor scaled between 0 (noisy) and 1 (clean)
    const snrFactor = Math.min(1.0, Math.max(0.1, (effectiveSnr + 10) / 24.0));

    switch (trueClass) {
      case 'AM-SSB': {
        // AM-SSB is recognized very reliably by the CNN (98% recall on test set)
        const ssbBoost = 0.45 + 0.52 * snrFactor;
        pSsb = Math.min(0.97, ssbBoost);
        pDsb = (1.0 - pSsb) * 0.65;
        pWbfm = Math.max(0.01, 1.0 - pSsb - pDsb);
        break;
      }

      case 'AM-DSB': {
        // AM-DSB has ~70% recall, confused with AM-SSB (25%) and occasionally WBFM (5%)
        const dsbBoost = 0.40 + 0.45 * snrFactor;
        pDsb = Math.min(0.92, dsbBoost);
        pSsb = (1.0 - pDsb) * 0.80;
        pWbfm = Math.max(0.02, 1.0 - pDsb - pSsb);
        break;
      }

      case 'WBFM': {
        // As documented in research findings: WBFM is the main classification challenge.
        // It has 20% recall, 53.8% misclassified as AM-DSB, 26% as AM-SSB.
        if (effectiveSnr < 4) {
          // Low/medium SNR: biased strongly toward AM-DSB
          pDsb = 0.52 + (Math.random() - 0.5) * 0.1;
          pSsb = 0.28 + (Math.random() - 0.5) * 0.08;
          pWbfm = Math.max(0.05, 1.0 - pDsb - pSsb);
        } else {
          // At higher SNR (> 4 dB), WBFM probability rises
          const wbfmPower = 0.35 + 0.45 * (effectiveSnr / 18.0);
          pWbfm = Math.min(0.88, wbfmPower);
          pDsb = (1.0 - pWbfm) * 0.65;
          pSsb = Math.max(0.03, 1.0 - pWbfm - pDsb);
        }
        break;
      }
    }
  }

  // Model-specific variance adjustments
  if (modelId === 'svm') {
    // SVM has slightly higher macro F1 balance
    pSsb = pSsb * 0.96;
    pDsb = pDsb * 1.02;
  } else if (modelId === 'rf') {
    // Random forest is slightly more conservative
    pDsb = pDsb * 0.95 + 0.02;
    pSsb = pSsb * 0.94 + 0.02;
    pWbfm = pWbfm * 0.93 + 0.03;
  } else if (modelId === 'xgboost') {
    pWbfm = pWbfm * 1.05;
  }

  // Normalize probabilities to sum exactly to 1.0
  const sum = pDsb + pSsb + pWbfm;
  const normDsb = Number((pDsb / sum).toFixed(4));
  const normSsb = Number((pSsb / sum).toFixed(4));
  const normWbfm = Number((Math.max(0.001, 1.0 - normDsb - normSsb)).toFixed(4));

  const probabilities: PredictionProbabilities = {
    'AM-DSB': normDsb,
    'AM-SSB': normSsb,
    'WBFM': normWbfm
  } as any;

  // Determine top class
  let predictedClass: ModulationType = 'AM-DSB';
  let maxP = normDsb;
  if (normSsb > maxP) {
    maxP = normSsb;
    predictedClass = 'AM-SSB';
  }
  if (normWbfm > maxP) {
    maxP = normWbfm;
    predictedClass = 'WBFM';
  }

  const modelNames: Record<ModelId, string> = {
    cnn: '1D Convolutional Neural Network',
    svm: 'Support Vector Machine (RBF)',
    rf: 'Random Forest (200 Trees)',
    xgboost: 'Extreme Gradient Boosting (XGBoost)'
  };

  const latencies: Record<ModelId, number> = {
    cnn: 34.2,
    svm: 11.5,
    rf: 19.8,
    xgboost: 14.6
  };

  return {
    predictedClass,
    confidence: Number((maxP * 100).toFixed(1)),
    probabilities,
    modelId,
    modelName: modelNames[modelId],
    inferenceTimeMs: latencies[modelId] + Number((Math.random() * 4 - 2).toFixed(1)),
    isSimulated: true,
    timestamp: new Date().toISOString(),
    features,
    isHealthy: true,
    healthScore: 90,
    derivedPhysics: {
      deltaTemp: 10.0,
      powerWatts: 5500,
      strainProduct: 4000,
      speedToTorqueRatio: 38.0,
      toolWearRateNorm: 0.4
    },
    maintenanceAdvice: 'Nominal signal baseline.'
  } as any;
}
