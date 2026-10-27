export interface ConfusionCell {
  actual: string;
  predicted: string;
  actualIndex: number;
  predictedIndex: number;
  count: number;
  percentageOfRow: number;
  percentageOfTotal: number;
  isDiagonal: boolean;
}

export const CONFUSION_CLASSES = ['AM-DSB', 'AM-SSB', 'WBFM'] as const;

// Project Test Set Confusion Matrix (CNN Model, 12,000 samples)
// Rows: Actual Class, Columns: Predicted Class
export const CONFUSION_MATRIX_DATA = [
  // Actual AM-DSB
  [2788, 1017, 195],
  // Actual AM-SSB
  [51, 3927, 22],
  // Actual WBFM
  [2152, 1041, 807]
];

export const CONFUSION_INSIGHTS = {
  totalSamples: 12000,
  correctPredictions: 2788 + 3927 + 807, // 7522
  accuracy: 62.68,
  classBreakdown: [
    {
      className: 'AM-DSB',
      actualCount: 4000,
      correctCount: 2788,
      recallPct: 69.70,
      misclassifiedAs: [
        { target: 'AM-SSB', count: 1017, pct: 25.43 },
        { target: 'WBFM', count: 195, pct: 4.88 }
      ]
    },
    {
      className: 'AM-SSB',
      actualCount: 4000,
      correctCount: 3927,
      recallPct: 98.18,
      misclassifiedAs: [
        { target: 'AM-DSB', count: 51, pct: 1.28 },
        { target: 'WBFM', count: 22, pct: 0.55 }
      ]
    },
    {
      className: 'WBFM',
      actualCount: 4000,
      correctCount: 807,
      recallPct: 20.18,
      misclassifiedAs: [
        { target: 'AM-DSB', count: 2152, pct: 53.80 },
        { target: 'AM-SSB', count: 1041, pct: 26.02 }
      ]
    }
  ],
  keyTakeaway: 'WBFM exhibits a pronounced confusion bias toward AM-DSB (53.80% misclassification). Because broadcast FM speech/audio pauses possess near-constant carrier envelopes in short 128-sample time windows, the 1D CNN frequently mistakes low-deviation frequency variations for double-sideband amplitude carriers in the presence of noise.'
};
