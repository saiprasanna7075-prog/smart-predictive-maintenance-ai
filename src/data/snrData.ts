export interface SnrPoint {
  snr: number; // dB
  cnn: number; // % accuracy
  svm: number;
  xgboost: number;
  rf: number;
  amDsb: number; // class accuracy
  amSsb: number;
  wbfm: number;
  noiseFloor: number; // relative noise level for visualizer
}

export const SNR_LEVELS = [-20, -18, -16, -14, -12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18];

export const SNR_DATA: SnrPoint[] = [
  { snr: -20, cnn: 33.4, svm: 33.2, xgboost: 33.1, rf: 33.0, amDsb: 33.2, amSsb: 33.6, wbfm: 33.4, noiseFloor: 1.00 },
  { snr: -18, cnn: 33.8, svm: 33.5, xgboost: 33.3, rf: 33.1, amDsb: 33.9, amSsb: 34.2, wbfm: 33.3, noiseFloor: 0.95 },
  { snr: -16, cnn: 34.5, svm: 34.0, xgboost: 33.8, rf: 33.5, amDsb: 34.8, amSsb: 35.5, wbfm: 33.2, noiseFloor: 0.90 },
  { snr: -14, cnn: 35.8, svm: 35.2, xgboost: 34.6, rf: 34.0, amDsb: 36.2, amSsb: 38.1, wbfm: 33.1, noiseFloor: 0.84 },
  { snr: -12, cnn: 38.2, svm: 37.1, xgboost: 36.2, rf: 35.4, amDsb: 39.0, amSsb: 42.5, wbfm: 33.1, noiseFloor: 0.77 },
  { snr: -10, cnn: 42.6, svm: 41.2, xgboost: 39.8, rf: 38.5, amDsb: 44.1, amSsb: 51.0, wbfm: 32.7, noiseFloor: 0.69 },
  { snr: -8,  cnn: 48.5, svm: 47.0, xgboost: 45.1, rf: 43.6, amDsb: 50.8, amSsb: 62.4, wbfm: 32.3, noiseFloor: 0.60 },
  { snr: -6,  cnn: 55.4, svm: 53.8, xgboost: 51.6, rf: 49.8, amDsb: 58.7, amSsb: 74.2, wbfm: 33.3, noiseFloor: 0.51 },
  { snr: -4,  cnn: 62.9, svm: 61.2, xgboost: 58.9, rf: 57.0, amDsb: 66.4, amSsb: 84.8, wbfm: 37.5, noiseFloor: 0.42 },
  { snr: -2,  cnn: 70.3, svm: 68.7, xgboost: 66.5, rf: 64.3, amDsb: 74.1, amSsb: 91.5, wbfm: 45.3, noiseFloor: 0.34 },
  { snr: 0,   cnn: 77.1, svm: 75.4, xgboost: 73.2, rf: 71.0, amDsb: 80.5, amSsb: 95.2, wbfm: 55.6, noiseFloor: 0.27 },
  { snr: 2,   cnn: 82.5, svm: 80.8, xgboost: 78.7, rf: 76.5, amDsb: 85.2, amSsb: 97.0, wbfm: 65.3, noiseFloor: 0.21 },
  { snr: 4,   cnn: 86.4, svm: 84.7, xgboost: 82.5, rf: 80.4, amDsb: 88.3, amSsb: 98.1, wbfm: 72.8, noiseFloor: 0.16 },
  { snr: 6,   cnn: 89.2, svm: 87.5, xgboost: 85.3, rf: 83.2, amDsb: 90.4, amSsb: 98.8, wbfm: 78.4, noiseFloor: 0.12 },
  { snr: 8,   cnn: 91.0, svm: 89.2, xgboost: 87.1, rf: 85.0, amDsb: 91.8, amSsb: 99.1, wbfm: 82.1, noiseFloor: 0.09 },
  { snr: 10,  cnn: 92.1, svm: 90.3, xgboost: 88.2, rf: 86.1, amDsb: 92.6, amSsb: 99.3, wbfm: 84.4, noiseFloor: 0.07 },
  { snr: 12,  cnn: 92.8, svm: 91.0, xgboost: 88.9, rf: 86.8, amDsb: 93.1, amSsb: 99.4, wbfm: 85.9, noiseFloor: 0.05 },
  { snr: 14,  cnn: 93.3, svm: 91.5, xgboost: 89.4, rf: 87.3, amDsb: 93.5, amSsb: 99.5, wbfm: 86.9, noiseFloor: 0.04 },
  { snr: 16,  cnn: 93.6, svm: 91.8, xgboost: 89.7, rf: 87.6, amDsb: 93.8, amSsb: 99.5, wbfm: 87.5, noiseFloor: 0.03 },
  { snr: 18,  cnn: 93.9, svm: 92.1, xgboost: 90.0, rf: 87.9, amDsb: 94.0, amSsb: 99.6, wbfm: 88.1, noiseFloor: 0.02 }
];

export const SNR_EXPLANATION = {
  summary: "Signal-to-Noise Ratio (SNR) represents the ratio of transmitted signal electrical power to the background Gaussian noise power, expressed in decibels (dB).",
  cliffRegion: "Between -20 dB and -10 dB, all classifiers perform near the 33.3% random-chance threshold because the additive thermal noise completely overwhelms carrier and sideband phase trajectories.",
  kneeRegion: "From -8 dB to 0 dB, a steep classification threshold (the 'knee' curve) occurs where sideband envelope structures become distinguishable from noise.",
  saturationRegion: "Above +4 dB SNR, AM-SSB achieves near-perfect classification (>98%), while overall model accuracy plateaus above 92% for 1D CNN."
};
