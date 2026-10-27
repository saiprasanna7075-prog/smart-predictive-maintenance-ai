import { SignalFeatureStats } from '../types';

export function extractSignalFeatures(i: number[], q: number[]): SignalFeatureStats {
  const N = Math.min(i.length, q.length);
  if (N === 0) {
    return {
      instantaneousPowerAvg: 0,
      peakToAverageRatio: 0,
      iVariance: 0,
      qVariance: 0,
      iMean: 0,
      qMean: 0,
      crossCorrelation: 0,
      estimatedSNR: 0
    };
  }

  let sumI = 0;
  let sumQ = 0;
  let sumPower = 0;
  let maxPower = 0;
  const powers: number[] = new Array(N);

  for (let k = 0; k < N; k++) {
    const ik = i[k];
    const qk = q[k];
    sumI += ik;
    sumQ += qk;
    const p = ik * ik + qk * qk;
    powers[k] = p;
    sumPower += p;
    if (p > maxPower) maxPower = p;
  }

  const iMean = sumI / N;
  const qMean = sumQ / N;
  const avgPower = sumPower / N;
  const papr = avgPower > 0 ? maxPower / avgPower : 0;

  let varI = 0;
  let varQ = 0;
  let covIQ = 0;
  let powerVariance = 0;

  for (let k = 0; k < N; k++) {
    const diffI = i[k] - iMean;
    const diffQ = q[k] - qMean;
    varI += diffI * diffI;
    varQ += diffQ * diffQ;
    covIQ += diffI * diffQ;

    const diffP = powers[k] - avgPower;
    powerVariance += diffP * diffP;
  }

  varI /= N;
  varQ /= N;
  covIQ /= N;
  powerVariance /= N;

  const stdI = Math.sqrt(varI);
  const stdQ = Math.sqrt(varQ);
  const crossCorr = (stdI > 0 && stdQ > 0) ? covIQ / (stdI * stdQ) : 0;

  // Approximate SNR estimate based on envelope variance ratio
  // Constant envelope signals like WBFM have low variance in high SNR;
  // High noise increases power variance relative to mean
  const envelopeVarRatio = avgPower > 0 ? Math.sqrt(powerVariance) / avgPower : 1;
  const estimatedSNR = Number((15 - 12 * envelopeVarRatio).toFixed(1));

  return {
    instantaneousPowerAvg: Number(avgPower.toFixed(4)),
    peakToAverageRatio: Number(papr.toFixed(3)),
    iVariance: Number(varI.toFixed(4)),
    qVariance: Number(varQ.toFixed(4)),
    iMean: Number(iMean.toFixed(4)),
    qMean: Number(qMean.toFixed(4)),
    crossCorrelation: Number(crossCorr.toFixed(3)),
    estimatedSNR: Math.max(-20, Math.min(18, estimatedSNR))
  };
}
