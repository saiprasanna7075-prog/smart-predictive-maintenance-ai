import { ModulationType, SignalSample } from '../types';

/**
 * Standard Box-Muller transform for generating Gaussian random numbers
 */
function randomGaussian(mean = 0, stdev = 1): number {
  let u = 1 - Math.random();
  let v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

/**
 * Generates an academically accurate 128-sample I/Q frame
 * for AM-DSB, AM-SSB, or WBFM at a specified SNR in dB.
 */
export function generateSignal(
  modulation: ModulationType,
  snrDb: number = 10,
  seedPhase: number = 0.2
): SignalSample {
  const N = 128;
  const rawI: number[] = new Array(N);
  const rawQ: number[] = new Array(N);

  const fm = 2.0; // message frequency normalized across 128 samples
  const fc = 8.0; // carrier frequency

  for (let t = 0; t < N; t++) {
    const normT = t / N;
    // Multi-tone baseband message signal
    const m_t = 0.7 * Math.cos(2 * Math.PI * fm * normT) + 0.3 * Math.cos(4 * Math.PI * fm * normT + 0.5);
    // Hilbert transform approximation for Single Sideband (90 degree phase lag of message tones)
    const m_hat_t = 0.7 * Math.sin(2 * Math.PI * fm * normT) + 0.3 * Math.sin(4 * Math.PI * fm * normT + 0.5);

    switch (modulation) {
      case 'AM-DSB': {
        // Amplitude Modulation - Double Sideband with transmitted carrier
        // s(t) = [Ac + m(t)] * cos(wc*t + phi)
        // In baseband I/Q representation with carrier phase offset:
        const Ac = 1.0;
        const envelope = Ac + 0.85 * m_t;
        const phase = seedPhase;
        rawI[t] = envelope * Math.cos(phase);
        rawQ[t] = envelope * Math.sin(phase);
        break;
      }

      case 'AM-SSB': {
        // Amplitude Modulation - Single Sideband (Upper Sideband: USB)
        // I(t) = m(t), Q(t) = -m_hat(t) plus small pilot carrier
        const pilot = 0.15;
        const phaseRot = seedPhase;
        const sI = pilot + m_t;
        const sQ = -m_hat_t;
        // Apply channel phase rotation
        rawI[t] = sI * Math.cos(phaseRot) - sQ * Math.sin(phaseRot);
        rawQ[t] = sI * Math.sin(phaseRot) + sQ * Math.cos(phaseRot);
        break;
      }

      case 'WBFM': {
        // Wideband Frequency Modulation
        // Envelope is ideally constant; phase is integral of message signal
        // beta is modulation index (typically 2.5 - 5 for WBFM)
        const beta = 3.2;
        const instantaneousPhase = beta * (0.7 * Math.sin(2 * Math.PI * fm * normT) + 0.15 * Math.sin(4 * Math.PI * fm * normT + 0.5)) + seedPhase;
        const Ac = 1.0;
        rawI[t] = Ac * Math.cos(instantaneousPhase);
        rawQ[t] = Ac * Math.sin(instantaneousPhase);
        break;
      }
    }
  }

  // Calculate clean signal power
  let signalPower = 0;
  for (let i = 0; i < N; i++) {
    signalPower += (rawI[i] * rawI[i] + rawQ[i] * rawQ[i]);
  }
  signalPower /= N;

  // Add AWGN noise according to specified SNR (dB)
  // SNR_dB = 10 * log10(P_signal / P_noise) => P_noise = P_signal / 10^(SNR/10)
  const noisePower = signalPower / Math.pow(10, snrDb / 10);
  const noiseSigma = Math.sqrt(noisePower / 2.0); // split equally between I and Q

  const noisyI: number[] = new Array(N);
  const noisyQ: number[] = new Array(N);

  for (let i = 0; i < N; i++) {
    noisyI[i] = Number((rawI[i] + randomGaussian(0, noiseSigma)).toFixed(5));
    noisyQ[i] = Number((rawQ[i] + randomGaussian(0, noiseSigma)).toFixed(5));
  }

  return {
    id: `sample-${modulation.toLowerCase()}-${snrDb}db-${Date.now().toString(36)}`,
    name: `${modulation} (${snrDb >= 0 ? '+' : ''}${snrDb} dB SNR)`,
    modulation,
    snr: snrDb,
    i: noisyI,
    q: noisyQ,
    description: `Synthesized 128-point I/Q frame with AWGN noise at ${snrDb} dB SNR matching RadioML 2016.10A specifications.`
  };
}

/**
 * Generate a set of preset demo signals across classes and SNR levels
 */
export function getPresetDemoSignals(): SignalSample[] {
  return [
    generateSignal('AM-DSB', 12, 0.4),
    generateSignal('AM-SSB', 10, 0.1),
    generateSignal('WBFM', 14, 0.8),
    generateSignal('AM-DSB', 0, 0.5),
    generateSignal('AM-SSB', -4, 0.2),
    generateSignal('WBFM', -2, 0.9),
    generateSignal('AM-DSB', -14, 0.3),
    generateSignal('WBFM', 8, 1.2),
  ];
}
