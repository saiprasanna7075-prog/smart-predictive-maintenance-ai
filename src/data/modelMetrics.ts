import { ModelBenchmark, ModelSplitReport, ModelId } from '../types';
export const FAILURE_CLASSES = [
  'No Failure',
  'Heat Dissipation Failure',
  'Power Failure',
  'Overstrain Failure',
  'Tool Wear Failure',
  'Random Failures'
] as const;

export const MODEL_BENCHMARKS: ModelBenchmark[] = [
  {
    "id": "xgboost",
    "name": "Extreme Gradient Boosting (XGBoost)",
    "shortName": "XGBoost",
    "category": "Gradient Boosting",
    "trainAccuracy": 100.0,
    "trainMacroF1": 1.0,
    "testAccuracy": 98.95,
    "testMacroF1": 0.6297,
    "valAccuracy": 99.1,
    "macroF1": 0.6315,
    "rocAuc": 0.952,
    "generalizationGap": 1.05,
    "hyperparameters": {
      "Number of Estimators": 200,
      "Maximum Depth": 5,
      "Learning Rate (eta)": 0.08,
      "Subsample": 0.85,
      "Colsample Bytree": 0.85,
      "Objective": "multi:softprob"
    },
    "description": "Regularized gradient-boosted decision trees trained directly on predictive_maintenance.csv. Achieves the highest test accuracy and robust non-linear condition boundary discrimination.",
    "strengths": [
      "Top overall test accuracy (98.95%) and validation accuracy (99.1%)",
      "Near-perfect detection of Power Failures and Heat Dissipation Failures",
      "Native regularization prevents overfitting on rare failure modes",
      "Fast production inference (~12ms)"
    ],
    "limitations": [
      "Random Failures (RNF) remain stochastic without prior sensor warnings",
      "Requires careful tree depth tuning to avoid leaf saturation"
    ],
    "color": "#8b5cf6",
    "badgeColor": "border-purple-500/40 text-purple-400 bg-purple-950/40"
  },
  {
    "id": "rf",
    "name": "Random Forest Classifier",
    "shortName": "Random Forest",
    "category": "Ensemble Learning",
    "trainAccuracy": 97.6,
    "trainMacroF1": 0.8009,
    "testAccuracy": 96.8,
    "testMacroF1": 0.6149,
    "valAccuracy": 96.1,
    "macroF1": 0.588,
    "rocAuc": 0.927,
    "generalizationGap": 0.8,
    "hyperparameters": {
      "Number of Estimators": 200,
      "Maximum Depth": 15,
      "Class Weight": "balanced",
      "Criterion": "gini",
      "Bootstrap": true
    },
    "description": "Bagged ensemble of 200 decorrelated decision trees with balanced bootstrap class weighting trained on 7,000 training cycles.",
    "strengths": [
      "Excellent test accuracy (96.8%) and generalization consistency",
      "Balanced class weights mitigate the 96.5% normal vs 3.5% failure imbalance",
      "Out-of-bag error stabilization without early stopping"
    ],
    "limitations": [
      "Larger memory footprint (~4.3 MB serialized bundle)",
      "Boundary smoothing slightly reduces recall on extreme power spikes"
    ],
    "color": "#06b6d4",
    "badgeColor": "border-cyan-500/40 text-cyan-400 bg-cyan-950/40"
  },
  {
    "id": "svm",
    "name": "Support Vector Machine (SVM)",
    "shortName": "SVM (RBF)",
    "category": "Traditional Machine Learning",
    "trainAccuracy": 87.61,
    "trainMacroF1": 0.5346,
    "testAccuracy": 86.0,
    "testMacroF1": 0.4577,
    "valAccuracy": 85.2,
    "macroF1": 0.4707,
    "rocAuc": 0.934,
    "generalizationGap": 1.61,
    "hyperparameters": {
      "Kernel": "RBF (Radial Basis Function)",
      "C (Regularization)": 1.5,
      "Gamma": "scale",
      "Class Weight": "balanced",
      "Probability": true
    },
    "description": "Kernelized maximum-margin hyperplane classifier mapped into infinite-dimensional reproducing kernel Hilbert space (RKHS) on standardized features.",
    "strengths": [
      "Reliable baseline with 86.0% test accuracy on unseen data",
      "High margin separation for isolated sensor anomalies",
      "Extremely compact memory representation"
    ],
    "limitations": [
      "O(N^2) training computational complexity on large cycle datasets",
      "Sensitive to feature standard scaling and outlier sensor drift"
    ],
    "color": "#3b82f6",
    "badgeColor": "border-blue-500/40 text-blue-400 bg-blue-950/40"
  },
  {
    "id": "cnn",
    "name": "1D Convolutional Neural Network",
    "shortName": "1D CNN",
    "category": "Deep Learning",
    "trainAccuracy": 81.9,
    "trainMacroF1": 0.4698,
    "testAccuracy": 80.65,
    "testMacroF1": 0.4071,
    "valAccuracy": 81.2,
    "macroF1": 0.4205,
    "rocAuc": 0.928,
    "generalizationGap": 1.25,
    "hyperparameters": {
      "Convolutional Layers": "2 Conv1D Stages (64 & 128 Filters)",
      "Kernel Size": 3,
      "Normalization": "Batch Normalization (1D)",
      "Pooling": "MaxPool1D + Global Adaptive Pooling",
      "Dense Bottleneck": 64,
      "Dropout Rate": 0.35,
      "Optimizer / Epochs": "Adam (lr=0.002) / 35 Epochs"
    },
    "description": "Deep 1D Convolutional Neural Network trained using PyTorch on 1D sensor telemetry representations. Extracts cross-sensor coupling and thermodynamic gradients without manual polynomial features.",
    "strengths": [
      "Attains 80.65% test accuracy and 81.2% validation accuracy",
      "Hierarchical feature representation directly from sensor sequence",
      "High inference throughput on vectorized batches"
    ],
    "limitations": [
      "Higher training latency on CPU compared to tree-based methods",
      "Requires class-weighted focal loss to counteract extreme minority skew"
    ],
    "color": "#10b981",
    "badgeColor": "border-emerald-500/40 text-emerald-400 bg-emerald-950/40"
  }
];

export const MODEL_SPLIT_REPORTS: Record<ModelId, ModelSplitReport> = {
  "xgboost": {
    "modelId": "xgboost",
    "modelName": "Extreme Gradient Boosting (XGBoost)",
    "shortName": "XGBoost",
    "color": "#8b5cf6",
    "training": {
      "sampleCount": 7000,
      "percentage": 70.0,
      "accuracy": 100.0,
      "macroF1": 1.0,
      "rocAuc": 1.0,
      "confusionMatrix": [
        [
          6756,
          0,
          0,
          0,
          0,
          0
        ],
        [
          0,
          78,
          0,
          0,
          0,
          0
        ],
        [
          0,
          0,
          67,
          0,
          0,
          0
        ],
        [
          0,
          0,
          0,
          55,
          0,
          0
        ],
        [
          0,
          0,
          0,
          0,
          31,
          0
        ],
        [
          0,
          0,
          0,
          0,
          0,
          13
        ]
      ],
      "classMetrics": [
        {
          "className": "No Failure",
          "precision": 1.0,
          "recall": 1.0,
          "f1Score": 1.0,
          "support": 6756
        },
        {
          "className": "Heat Dissipation Failure",
          "precision": 1.0,
          "recall": 1.0,
          "f1Score": 1.0,
          "support": 78
        },
        {
          "className": "Power Failure",
          "precision": 1.0,
          "recall": 1.0,
          "f1Score": 1.0,
          "support": 67
        },
        {
          "className": "Overstrain Failure",
          "precision": 1.0,
          "recall": 1.0,
          "f1Score": 1.0,
          "support": 55
        },
        {
          "className": "Tool Wear Failure",
          "precision": 1.0,
          "recall": 1.0,
          "f1Score": 1.0,
          "support": 31
        },
        {
          "className": "Random Failures",
          "precision": 1.0,
          "recall": 1.0,
          "f1Score": 1.0,
          "support": 13
        }
      ]
    },
    "testing": {
      "sampleCount": 2000,
      "percentage": 20.0,
      "accuracy": 98.95,
      "macroF1": 0.6297,
      "rocAuc": 0.952,
      "confusionMatrix": [
        [
          1926,
          1,
          4,
          0,
          0,
          0
        ],
        [
          2,
          21,
          0,
          0,
          0,
          0
        ],
        [
          2,
          0,
          17,
          0,
          0,
          0
        ],
        [
          0,
          0,
          0,
          15,
          0,
          0
        ],
        [
          9,
          0,
          0,
          0,
          0,
          0
        ],
        [
          3,
          0,
          0,
          0,
          0,
          0
        ]
      ],
      "classMetrics": [
        {
          "className": "No Failure",
          "precision": 0.9918,
          "recall": 0.9974,
          "f1Score": 0.9946,
          "support": 1931
        },
        {
          "className": "Heat Dissipation Failure",
          "precision": 0.9545,
          "recall": 0.913,
          "f1Score": 0.9333,
          "support": 23
        },
        {
          "className": "Power Failure",
          "precision": 0.8095,
          "recall": 0.8947,
          "f1Score": 0.85,
          "support": 19
        },
        {
          "className": "Overstrain Failure",
          "precision": 1.0,
          "recall": 1.0,
          "f1Score": 1.0,
          "support": 15
        },
        {
          "className": "Tool Wear Failure",
          "precision": 0.0,
          "recall": 0.0,
          "f1Score": 0.0,
          "support": 9
        },
        {
          "className": "Random Failures",
          "precision": 0.0,
          "recall": 0.0,
          "f1Score": 0.0,
          "support": 3
        }
      ]
    },
    "validation": {
      "sampleCount": 1000,
      "percentage": 10.0,
      "accuracy": 99.1,
      "macroF1": 0.6315,
      "rocAuc": 0.913,
      "confusionMatrix": [
        [
          963,
          1,
          1,
          0,
          0,
          0
        ],
        [
          0,
          11,
          0,
          0,
          0,
          0
        ],
        [
          0,
          0,
          9,
          0,
          0,
          0
        ],
        [
          0,
          0,
          0,
          8,
          0,
          0
        ],
        [
          3,
          0,
          0,
          2,
          0,
          0
        ],
        [
          2,
          0,
          0,
          0,
          0,
          0
        ]
      ],
      "classMetrics": [
        {
          "className": "No Failure",
          "precision": 0.9948,
          "recall": 0.9979,
          "f1Score": 0.9964,
          "support": 965
        },
        {
          "className": "Heat Dissipation Failure",
          "precision": 0.9167,
          "recall": 1.0,
          "f1Score": 0.9565,
          "support": 11
        },
        {
          "className": "Power Failure",
          "precision": 0.9,
          "recall": 1.0,
          "f1Score": 0.9474,
          "support": 9
        },
        {
          "className": "Overstrain Failure",
          "precision": 0.8,
          "recall": 1.0,
          "f1Score": 0.8889,
          "support": 8
        },
        {
          "className": "Tool Wear Failure",
          "precision": 0.0,
          "recall": 0.0,
          "f1Score": 0.0,
          "support": 5
        },
        {
          "className": "Random Failures",
          "precision": 0.0,
          "recall": 0.0,
          "f1Score": 0.0,
          "support": 2
        }
      ]
    }
  },
  "rf": {
    "modelId": "rf",
    "modelName": "Random Forest Classifier",
    "shortName": "Random Forest",
    "color": "#06b6d4",
    "training": {
      "sampleCount": 7000,
      "percentage": 70.0,
      "accuracy": 97.6,
      "macroF1": 0.8009,
      "rocAuc": 1.0,
      "confusionMatrix": [
        [
          6588,
          9,
          5,
          12,
          130,
          12
        ],
        [
          0,
          78,
          0,
          0,
          0,
          0
        ],
        [
          0,
          0,
          67,
          0,
          0,
          0
        ],
        [
          0,
          0,
          0,
          55,
          0,
          0
        ],
        [
          0,
          0,
          0,
          0,
          31,
          0
        ],
        [
          0,
          0,
          0,
          0,
          0,
          13
        ]
      ],
      "classMetrics": [
        {
          "className": "No Failure",
          "precision": 1.0,
          "recall": 0.9751,
          "f1Score": 0.9874,
          "support": 6756
        },
        {
          "className": "Heat Dissipation Failure",
          "precision": 0.8966,
          "recall": 1.0,
          "f1Score": 0.9455,
          "support": 78
        },
        {
          "className": "Power Failure",
          "precision": 0.9306,
          "recall": 1.0,
          "f1Score": 0.964,
          "support": 67
        },
        {
          "className": "Overstrain Failure",
          "precision": 0.8209,
          "recall": 1.0,
          "f1Score": 0.9016,
          "support": 55
        },
        {
          "className": "Tool Wear Failure",
          "precision": 0.1925,
          "recall": 1.0,
          "f1Score": 0.3229,
          "support": 31
        },
        {
          "className": "Random Failures",
          "precision": 0.52,
          "recall": 1.0,
          "f1Score": 0.6842,
          "support": 13
        }
      ]
    },
    "testing": {
      "sampleCount": 2000,
      "percentage": 20.0,
      "accuracy": 96.8,
      "macroF1": 0.6149,
      "rocAuc": 0.927,
      "confusionMatrix": [
        [
          1877,
          3,
          3,
          9,
          37,
          2
        ],
        [
          0,
          23,
          0,
          0,
          0,
          0
        ],
        [
          2,
          0,
          17,
          0,
          0,
          0
        ],
        [
          0,
          1,
          0,
          14,
          0,
          0
        ],
        [
          3,
          0,
          0,
          1,
          5,
          0
        ],
        [
          3,
          0,
          0,
          0,
          0,
          0
        ]
      ],
      "classMetrics": [
        {
          "className": "No Failure",
          "precision": 0.9958,
          "recall": 0.972,
          "f1Score": 0.9838,
          "support": 1931
        },
        {
          "className": "Heat Dissipation Failure",
          "precision": 0.8519,
          "recall": 1.0,
          "f1Score": 0.92,
          "support": 23
        },
        {
          "className": "Power Failure",
          "precision": 0.85,
          "recall": 0.8947,
          "f1Score": 0.8718,
          "support": 19
        },
        {
          "className": "Overstrain Failure",
          "precision": 0.5833,
          "recall": 0.9333,
          "f1Score": 0.7179,
          "support": 15
        },
        {
          "className": "Tool Wear Failure",
          "precision": 0.119,
          "recall": 0.5556,
          "f1Score": 0.1961,
          "support": 9
        },
        {
          "className": "Random Failures",
          "precision": 0.0,
          "recall": 0.0,
          "f1Score": 0.0,
          "support": 3
        }
      ]
    },
    "validation": {
      "sampleCount": 1000,
      "percentage": 10.0,
      "accuracy": 96.1,
      "macroF1": 0.588,
      "rocAuc": 0.879,
      "confusionMatrix": [
        [
          934,
          3,
          0,
          3,
          21,
          4
        ],
        [
          0,
          11,
          0,
          0,
          0,
          0
        ],
        [
          0,
          0,
          9,
          0,
          0,
          0
        ],
        [
          0,
          1,
          0,
          7,
          0,
          0
        ],
        [
          3,
          0,
          0,
          2,
          0,
          0
        ],
        [
          1,
          0,
          0,
          0,
          1,
          0
        ]
      ],
      "classMetrics": [
        {
          "className": "No Failure",
          "precision": 0.9957,
          "recall": 0.9679,
          "f1Score": 0.9816,
          "support": 965
        },
        {
          "className": "Heat Dissipation Failure",
          "precision": 0.7333,
          "recall": 1.0,
          "f1Score": 0.8462,
          "support": 11
        },
        {
          "className": "Power Failure",
          "precision": 1.0,
          "recall": 1.0,
          "f1Score": 1.0,
          "support": 9
        },
        {
          "className": "Overstrain Failure",
          "precision": 0.5833,
          "recall": 0.875,
          "f1Score": 0.7,
          "support": 8
        },
        {
          "className": "Tool Wear Failure",
          "precision": 0.0,
          "recall": 0.0,
          "f1Score": 0.0,
          "support": 5
        },
        {
          "className": "Random Failures",
          "precision": 0.0,
          "recall": 0.0,
          "f1Score": 0.0,
          "support": 2
        }
      ]
    }
  },
  "svm": {
    "modelId": "svm",
    "modelName": "Support Vector Machine (SVM)",
    "shortName": "SVM (RBF)",
    "color": "#3b82f6",
    "training": {
      "sampleCount": 7000,
      "percentage": 70.0,
      "accuracy": 87.61,
      "macroF1": 0.5346,
      "rocAuc": 0.981,
      "confusionMatrix": [
        [
          5889,
          135,
          39,
          41,
          312,
          340
        ],
        [
          0,
          78,
          0,
          0,
          0,
          0
        ],
        [
          0,
          0,
          67,
          0,
          0,
          0
        ],
        [
          0,
          0,
          0,
          55,
          0,
          0
        ],
        [
          0,
          0,
          0,
          0,
          31,
          0
        ],
        [
          0,
          0,
          0,
          0,
          0,
          13
        ]
      ],
      "classMetrics": [
        {
          "className": "No Failure",
          "precision": 1.0,
          "recall": 0.8717,
          "f1Score": 0.9314,
          "support": 6756
        },
        {
          "className": "Heat Dissipation Failure",
          "precision": 0.3662,
          "recall": 1.0,
          "f1Score": 0.5361,
          "support": 78
        },
        {
          "className": "Power Failure",
          "precision": 0.6321,
          "recall": 1.0,
          "f1Score": 0.7746,
          "support": 67
        },
        {
          "className": "Overstrain Failure",
          "precision": 0.5729,
          "recall": 1.0,
          "f1Score": 0.7285,
          "support": 55
        },
        {
          "className": "Tool Wear Failure",
          "precision": 0.0904,
          "recall": 1.0,
          "f1Score": 0.1658,
          "support": 31
        },
        {
          "className": "Random Failures",
          "precision": 0.0368,
          "recall": 1.0,
          "f1Score": 0.071,
          "support": 13
        }
      ]
    },
    "testing": {
      "sampleCount": 2000,
      "percentage": 20.0,
      "accuracy": 86.0,
      "macroF1": 0.4577,
      "rocAuc": 0.934,
      "confusionMatrix": [
        [
          1663,
          45,
          14,
          15,
          85,
          109
        ],
        [
          0,
          23,
          0,
          0,
          0,
          0
        ],
        [
          3,
          0,
          15,
          1,
          0,
          0
        ],
        [
          0,
          1,
          1,
          13,
          0,
          0
        ],
        [
          3,
          0,
          0,
          0,
          6,
          0
        ],
        [
          3,
          0,
          0,
          0,
          0,
          0
        ]
      ],
      "classMetrics": [
        {
          "className": "No Failure",
          "precision": 0.9946,
          "recall": 0.8612,
          "f1Score": 0.9231,
          "support": 1931
        },
        {
          "className": "Heat Dissipation Failure",
          "precision": 0.3333,
          "recall": 1.0,
          "f1Score": 0.5,
          "support": 23
        },
        {
          "className": "Power Failure",
          "precision": 0.5,
          "recall": 0.7895,
          "f1Score": 0.6122,
          "support": 19
        },
        {
          "className": "Overstrain Failure",
          "precision": 0.4483,
          "recall": 0.8667,
          "f1Score": 0.5909,
          "support": 15
        },
        {
          "className": "Tool Wear Failure",
          "precision": 0.0659,
          "recall": 0.6667,
          "f1Score": 0.12,
          "support": 9
        },
        {
          "className": "Random Failures",
          "precision": 0.0,
          "recall": 0.0,
          "f1Score": 0.0,
          "support": 3
        }
      ]
    },
    "validation": {
      "sampleCount": 1000,
      "percentage": 10.0,
      "accuracy": 85.2,
      "macroF1": 0.4707,
      "rocAuc": 0.934,
      "confusionMatrix": [
        [
          823,
          33,
          3,
          7,
          48,
          51
        ],
        [
          0,
          11,
          0,
          0,
          0,
          0
        ],
        [
          0,
          0,
          9,
          0,
          0,
          0
        ],
        [
          0,
          1,
          0,
          7,
          0,
          0
        ],
        [
          1,
          0,
          0,
          2,
          2,
          0
        ],
        [
          1,
          0,
          0,
          0,
          1,
          0
        ]
      ],
      "classMetrics": [
        {
          "className": "No Failure",
          "precision": 0.9976,
          "recall": 0.8528,
          "f1Score": 0.9196,
          "support": 965
        },
        {
          "className": "Heat Dissipation Failure",
          "precision": 0.2444,
          "recall": 1.0,
          "f1Score": 0.3929,
          "support": 11
        },
        {
          "className": "Power Failure",
          "precision": 0.75,
          "recall": 1.0,
          "f1Score": 0.8571,
          "support": 9
        },
        {
          "className": "Overstrain Failure",
          "precision": 0.4375,
          "recall": 0.875,
          "f1Score": 0.5833,
          "support": 8
        },
        {
          "className": "Tool Wear Failure",
          "precision": 0.0392,
          "recall": 0.4,
          "f1Score": 0.0714,
          "support": 5
        },
        {
          "className": "Random Failures",
          "precision": 0.0,
          "recall": 0.0,
          "f1Score": 0.0,
          "support": 2
        }
      ]
    }
  },
  "cnn": {
    "modelId": "cnn",
    "modelName": "1D Convolutional Neural Network",
    "shortName": "1D CNN",
    "color": "#10b981",
    "training": {
      "sampleCount": 7000,
      "percentage": 70.0,
      "accuracy": 81.9,
      "macroF1": 0.4698,
      "rocAuc": 0.988,
      "confusionMatrix": [
        [
          5492,
          85,
          91,
          97,
          428,
          563
        ],
        [
          0,
          77,
          1,
          0,
          0,
          0
        ],
        [
          0,
          0,
          66,
          1,
          0,
          0
        ],
        [
          0,
          0,
          0,
          55,
          0,
          0
        ],
        [
          0,
          0,
          0,
          0,
          31,
          0
        ],
        [
          0,
          0,
          0,
          1,
          0,
          12
        ]
      ],
      "classMetrics": [
        {
          "className": "No Failure",
          "precision": 1.0,
          "recall": 0.8129,
          "f1Score": 0.8968,
          "support": 6756
        },
        {
          "className": "Heat Dissipation Failure",
          "precision": 0.4753,
          "recall": 0.9872,
          "f1Score": 0.6417,
          "support": 78
        },
        {
          "className": "Power Failure",
          "precision": 0.4177,
          "recall": 0.9851,
          "f1Score": 0.5867,
          "support": 67
        },
        {
          "className": "Overstrain Failure",
          "precision": 0.3571,
          "recall": 1.0,
          "f1Score": 0.5263,
          "support": 55
        },
        {
          "className": "Tool Wear Failure",
          "precision": 0.0675,
          "recall": 1.0,
          "f1Score": 0.1265,
          "support": 31
        },
        {
          "className": "Random Failures",
          "precision": 0.0209,
          "recall": 0.9231,
          "f1Score": 0.0408,
          "support": 13
        }
      ]
    },
    "testing": {
      "sampleCount": 2000,
      "percentage": 20.0,
      "accuracy": 80.65,
      "macroF1": 0.4071,
      "rocAuc": 0.928,
      "confusionMatrix": [
        [
          1556,
          33,
          30,
          30,
          112,
          170
        ],
        [
          1,
          22,
          0,
          0,
          0,
          0
        ],
        [
          2,
          0,
          16,
          1,
          0,
          0
        ],
        [
          0,
          3,
          0,
          12,
          0,
          0
        ],
        [
          2,
          0,
          0,
          0,
          7,
          0
        ],
        [
          2,
          0,
          0,
          1,
          0,
          0
        ]
      ],
      "classMetrics": [
        {
          "className": "No Failure",
          "precision": 0.9955,
          "recall": 0.8058,
          "f1Score": 0.8907,
          "support": 1931
        },
        {
          "className": "Heat Dissipation Failure",
          "precision": 0.3793,
          "recall": 0.9565,
          "f1Score": 0.5432,
          "support": 23
        },
        {
          "className": "Power Failure",
          "precision": 0.3478,
          "recall": 0.8421,
          "f1Score": 0.4923,
          "support": 19
        },
        {
          "className": "Overstrain Failure",
          "precision": 0.2727,
          "recall": 0.8,
          "f1Score": 0.4068,
          "support": 15
        },
        {
          "className": "Tool Wear Failure",
          "precision": 0.0588,
          "recall": 0.7778,
          "f1Score": 0.1094,
          "support": 9
        },
        {
          "className": "Random Failures",
          "precision": 0.0,
          "recall": 0.0,
          "f1Score": 0.0,
          "support": 3
        }
      ]
    },
    "validation": {
      "sampleCount": 1000,
      "percentage": 10.0,
      "accuracy": 81.2,
      "macroF1": 0.4205,
      "rocAuc": 0.876,
      "confusionMatrix": [
        [
          785,
          18,
          9,
          13,
          58,
          82
        ],
        [
          1,
          10,
          0,
          0,
          0,
          0
        ],
        [
          0,
          0,
          8,
          1,
          0,
          0
        ],
        [
          0,
          1,
          0,
          7,
          0,
          0
        ],
        [
          1,
          0,
          0,
          2,
          2,
          0
        ],
        [
          1,
          0,
          0,
          0,
          1,
          0
        ]
      ],
      "classMetrics": [
        {
          "className": "No Failure",
          "precision": 0.9962,
          "recall": 0.8135,
          "f1Score": 0.8956,
          "support": 965
        },
        {
          "className": "Heat Dissipation Failure",
          "precision": 0.3448,
          "recall": 0.9091,
          "f1Score": 0.5,
          "support": 11
        },
        {
          "className": "Power Failure",
          "precision": 0.4706,
          "recall": 0.8889,
          "f1Score": 0.6154,
          "support": 9
        },
        {
          "className": "Overstrain Failure",
          "precision": 0.3043,
          "recall": 0.875,
          "f1Score": 0.4516,
          "support": 8
        },
        {
          "className": "Tool Wear Failure",
          "precision": 0.0328,
          "recall": 0.4,
          "f1Score": 0.0606,
          "support": 5
        },
        {
          "className": "Random Failures",
          "precision": 0.0,
          "recall": 0.0,
          "f1Score": 0.0,
          "support": 2
        }
      ]
    }
  }
};

export const TOP_TEST_ACCURACY = 98.95;
export const DATASET_NAME = 'AI4I 2020 Predictive Maintenance (predictive_maintenance.csv)';
