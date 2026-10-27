import { DerivedPhysicsFeatures, FailureType, MachineType, PredictionProbabilities, PredictionResult, TelemetryRecord } from '../types';

export function calculateDerivedPhysics(
  airTemp: number,
  processTemp: number,
  speed: number,
  torque: number,
  toolWear: number,
  type: MachineType = 'L'
): DerivedPhysicsFeatures {
  const deltaTemp = Number((processTemp - airTemp).toFixed(2));
  // Power in Watts: Torque (Nm) * Omega (rad/s) = Torque * (2 * pi * rpm / 60)
  const omega = (2 * Math.PI * speed) / 60;
  const powerWatts = Number((torque * omega).toFixed(1));
  const strainProduct = Number((toolWear * torque).toFixed(1));
  const speedToTorqueRatio = torque > 0 ? Number((speed / torque).toFixed(2)) : 0;
  const toolWearRateNorm = Number((toolWear / 240.0).toFixed(3));

  return {
    deltaTemp,
    powerWatts,
    strainProduct,
    speedToTorqueRatio,
    toolWearRateNorm
  };
}

export function evaluateFailureProbabilities(
  record: Partial<TelemetryRecord>,
  modelId: string = 'rf'
): PredictionResult {
  const airTemp = record.airTemp ?? 300.0;
  const processTemp = record.processTemp ?? 310.0;
  const speed = record.speed ?? 1500;
  const torque = record.torque ?? 40.0;
  const toolWear = record.toolWear ?? 100;
  const type = record.type ?? 'L';

  const physics = calculateDerivedPhysics(airTemp, processTemp, speed, torque, toolWear, type);

  // Overstrain threshold per quality variant (AI4I dataset spec)
  const strainThreshold = type === 'L' ? 11000 : type === 'M' ? 12000 : 13000;

  // Unnormalized logits
  let logitNoFail = 4.5;
  let logitHDF = 0.05;
  let logitPWF = 0.05;
  let logitOSF = 0.05;
  let logitTWF = 0.05;
  let logitRNF = 0.02;

  // 1. Heat Dissipation Failure (HDF) check: Delta T < 8.6 K and Speed < 1380 rpm
  if (physics.deltaTemp < 8.6 && speed < 1380) {
    const severity = Math.max(0, (8.6 - physics.deltaTemp) * 1.5) + ((1380 - speed) / 100);
    logitHDF += 5.0 + severity;
    logitNoFail -= 3.5;
  } else if (physics.deltaTemp < 8.9 && speed < 1420) {
    logitHDF += 1.8;
  }

  // 2. Power Failure (PWF) check: Power < 3500 W or Power > 9000 W
  if (physics.powerWatts < 3500) {
    const deficit = (3500 - physics.powerWatts) / 500;
    logitPWF += 5.2 + Math.min(4, deficit);
    logitNoFail -= 3.8;
  } else if (physics.powerWatts > 9000) {
    const excess = (physics.powerWatts - 9000) / 600;
    logitPWF += 5.5 + Math.min(4, excess);
    logitNoFail -= 4.0;
  }

  // 3. Overstrain Failure (OSF) check: Tool Wear * Torque > threshold
  if (physics.strainProduct > strainThreshold) {
    const overage = (physics.strainProduct - strainThreshold) / 800;
    logitOSF += 5.5 + Math.min(4, overage);
    logitNoFail -= 3.8;
  } else if (physics.strainProduct > strainThreshold * 0.92) {
    logitOSF += 2.0;
  }

  // 4. Tool Wear Failure (TWF) check: Tool wear between 200 - 240+ min
  if (toolWear >= 200) {
    const wearOverage = (toolWear - 200) / 10;
    logitTWF += 4.2 + Math.min(4, wearOverage);
    logitNoFail -= 3.0;
  } else if (toolWear >= 180) {
    logitTWF += 1.2;
  }

  // Model-specific adjustments
  if (modelId === 'xgboost') {
    logitPWF *= 1.05;
    logitOSF *= 1.05;
  } else if (modelId === 'svm') {
    logitNoFail *= 1.02;
  }

  // Softmax conversion
  const logits = [logitNoFail, logitHDF, logitPWF, logitOSF, logitTWF, logitRNF];
  const expLogits = logits.map((l) => Math.exp(l));
  const sumExp = expLogits.reduce((a, b) => a + b, 0);
  const probs = expLogits.map((e) => e / sumExp);

  const classes: FailureType[] = [
    'No Failure',
    'Heat Dissipation Failure',
    'Power Failure',
    'Overstrain Failure',
    'Tool Wear Failure',
    'Random Failures'
  ];

  let maxIdx = 0;
  for (let i = 1; i < probs.length; i++) {
    if (probs[i] > probs[maxIdx]) maxIdx = i;
  }

  const predictedClass = classes[maxIdx];
  const confidence = Number((probs[maxIdx] * 100).toFixed(1));
  const isHealthy = predictedClass === 'No Failure';

  // Overall Health Score (0 - 100%)
  const healthScore = Math.max(0, Math.min(100, Math.round(probs[0] * 100)));

  // Generate specific actionable industrial maintenance advice
  let maintenanceAdvice = 'Equipment is operating within safe mechanical and thermal tolerances. Routine inspection recommended.';
  if (predictedClass === 'Heat Dissipation Failure') {
    maintenanceAdvice = `CRITICAL: Thermal dissipation deficit detected (Delta T = ${physics.deltaTemp} K < 8.6 K at ${speed} rpm). Inspect coolant delivery, heat exchangers, and lower spindle bearing lubrication immediately.`;
  } else if (predictedClass === 'Power Failure') {
    maintenanceAdvice = `WARNING: Mechanical power anomaly (${physics.powerWatts} W outside nominal 3500 W - 9000 W envelope). Check drive belt tension, spindle motor windings, and power supply inverter.`;
  } else if (predictedClass === 'Overstrain Failure') {
    maintenanceAdvice = `URGENT: Tool strain product (${physics.strainProduct} min*Nm) exceeds maximum allowable limit (${strainThreshold} min*Nm for Type ${type}). Reduce feed rate / torque load immediately to prevent catastrophic workpiece rupture.`;
  } else if (predictedClass === 'Tool Wear Failure') {
    maintenanceAdvice = `ALERT: Cutting insert has exceeded service life (${toolWear} min / 200 min limit). Schedule automatic tool replacement (ATC) during next cycle stop.`;
  } else if (predictedClass === 'Random Failures') {
    maintenanceAdvice = `NOTICE: Potential sporadic vibration or sensory jitter detected. Conduct diagnostic sensor recalibration.`;
  }

  const modelNames: Record<string, string> = {
    rf: 'Random Forest (200 Trees)',
    xgboost: 'Extreme Gradient Boosting (XGBoost)',
    cnn: 'Deep 1D CNN Spatio-Temporal Net',
    svm: 'Support Vector Machine (RBF)'
  };

  const latencies: Record<string, number> = {
    rf: 8.2,
    xgboost: 11.4,
    cnn: 18.6,
    svm: 6.5
  };

  return {
    predictedClass,
    confidence,
    probabilities: {
      'No Failure': Number(probs[0].toFixed(4)),
      'Heat Dissipation Failure': Number(probs[1].toFixed(4)),
      'Power Failure': Number(probs[2].toFixed(4)),
      'Overstrain Failure': Number(probs[3].toFixed(4)),
      'Tool Wear Failure': Number(probs[4].toFixed(4)),
      'Random Failures': Number(probs[5].toFixed(4))
    },
    isHealthy,
    healthScore,
    modelId: (modelId as any) || 'rf',
    modelName: modelNames[modelId] || 'Random Forest',
    inferenceTimeMs: Number((latencies[modelId] || 8.2 + Math.random()).toFixed(1)),
    isSimulated: true,
    timestamp: new Date().toISOString(),
    derivedPhysics: physics,
    maintenanceAdvice
  };
}
