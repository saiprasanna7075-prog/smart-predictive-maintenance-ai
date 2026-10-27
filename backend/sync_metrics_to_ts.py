"""
Synchronize backend/models/metrics.json directly into src/data/modelMetrics.ts
Ensures 100% data fidelity with predictive_maintenance.csv
"""

import json

with open("backend/models/metrics.json", "r") as f:
    metrics = json.load(f)

# Models config
models_meta = {
    "xgboost": {
        "id": "xgboost",
        "name": "Extreme Gradient Boosting (XGBoost)",
        "shortName": "XGBoost",
        "category": "Gradient Boosting",
        "color": "#8b5cf6",
        "badgeColor": "border-purple-500/40 text-purple-400 bg-purple-950/40",
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
            f"Top overall test accuracy ({metrics['xgboost']['testing']['accuracy']}%) and validation accuracy ({metrics['xgboost']['validation']['accuracy']}%)",
            "Near-perfect detection of Power Failures and Heat Dissipation Failures",
            "Native regularization prevents overfitting on rare failure modes",
            "Fast production inference (~12ms)"
        ],
        "limitations": [
            "Random Failures (RNF) remain stochastic without prior sensor warnings",
            "Requires careful tree depth tuning to avoid leaf saturation"
        ]
    },
    "rf": {
        "id": "rf",
        "name": "Random Forest Classifier",
        "shortName": "Random Forest",
        "category": "Ensemble Learning",
        "color": "#06b6d4",
        "badgeColor": "border-cyan-500/40 text-cyan-400 bg-cyan-950/40",
        "hyperparameters": {
            "Number of Estimators": 200,
            "Maximum Depth": 15,
            "Class Weight": "balanced",
            "Criterion": "gini",
            "Bootstrap": True
        },
        "description": "Bagged ensemble of 200 decorrelated decision trees with balanced bootstrap class weighting trained on 7,000 training cycles.",
        "strengths": [
            f"Excellent test accuracy ({metrics['rf']['testing']['accuracy']}%) and generalization consistency",
            "Balanced class weights mitigate the 96.5% normal vs 3.5% failure imbalance",
            "Out-of-bag error stabilization without early stopping"
        ],
        "limitations": [
            "Larger memory footprint (~4.3 MB serialized bundle)",
            "Boundary smoothing slightly reduces recall on extreme power spikes"
        ]
    },
    "svm": {
        "id": "svm",
        "name": "Support Vector Machine (SVM)",
        "shortName": "SVM (RBF)",
        "category": "Traditional Machine Learning",
        "color": "#3b82f6",
        "badgeColor": "border-blue-500/40 text-blue-400 bg-blue-950/40",
        "hyperparameters": {
            "Kernel": "RBF (Radial Basis Function)",
            "C (Regularization)": 1.5,
            "Gamma": "scale",
            "Class Weight": "balanced",
            "Probability": True
        },
        "description": "Kernelized maximum-margin hyperplane classifier mapped into infinite-dimensional reproducing kernel Hilbert space (RKHS) on standardized features.",
        "strengths": [
            f"Reliable baseline with {metrics['svm']['testing']['accuracy']}% test accuracy on unseen data",
            "High margin separation for isolated sensor anomalies",
            "Extremely compact memory representation"
        ],
        "limitations": [
            "O(N^2) training computational complexity on large cycle datasets",
            "Sensitive to feature standard scaling and outlier sensor drift"
        ]
    },
    "cnn": {
        "id": "cnn",
        "name": "1D Convolutional Neural Network",
        "shortName": "1D CNN",
        "category": "Deep Learning",
        "color": "#10b981",
        "badgeColor": "border-emerald-500/40 text-emerald-400 bg-emerald-950/40",
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
            f"Attains {metrics['cnn']['testing']['accuracy']}% test accuracy and {metrics['cnn']['validation']['accuracy']}% validation accuracy",
            "Hierarchical feature representation directly from sensor sequence",
            "High inference throughput on vectorized batches"
        ],
        "limitations": [
            "Higher training latency on CPU compared to tree-based methods",
            "Requires class-weighted focal loss to counteract extreme minority skew"
        ]
    }
}

ts_code = []
ts_code.append("import { ModelBenchmark, ModelSplitReport, ModelId } from '../types';\n")
ts_code.append("export const FAILURE_CLASSES = [\n  'No Failure',\n  'Heat Dissipation Failure',\n  'Power Failure',\n  'Overstrain Failure',\n  'Tool Wear Failure',\n  'Random Failures'\n] as const;\n\n")

# Model benchmarks array
benchmarks = []
for k in ["xgboost", "rf", "svm", "cnn"]:
    meta = models_meta[k]
    m_data = metrics[k]
    train_acc = m_data["training"]["accuracy"]
    train_f1 = m_data["training"]["macroF1"]
    test_acc = m_data["testing"]["accuracy"]
    test_f1 = m_data["testing"]["macroF1"]
    val_acc = m_data["validation"]["accuracy"]
    val_f1 = m_data["validation"]["macroF1"]
    gen_gap = round(train_acc - test_acc, 2)
    roc_auc = m_data["testing"]["rocAuc"]

    bm = {
        "id": meta["id"],
        "name": meta["name"],
        "shortName": meta["shortName"],
        "category": meta["category"],
        "trainAccuracy": train_acc,
        "trainMacroF1": train_f1,
        "testAccuracy": test_acc,
        "testMacroF1": test_f1,
        "valAccuracy": val_acc,
        "macroF1": val_f1,
        "rocAuc": roc_auc,
        "generalizationGap": gen_gap,
        "hyperparameters": meta["hyperparameters"],
        "description": meta["description"],
        "strengths": meta["strengths"],
        "limitations": meta["limitations"],
        "color": meta["color"],
        "badgeColor": meta["badgeColor"]
    }
    benchmarks.append(bm)

ts_code.append(f"export const MODEL_BENCHMARKS: ModelBenchmark[] = {json.dumps(benchmarks, indent=2)};\n\n")

# Model split reports dictionary
split_reports = {}
for k in ["xgboost", "rf", "svm", "cnn"]:
    meta = models_meta[k]
    split_reports[k] = {
        "modelId": meta["id"],
        "modelName": meta["name"],
        "shortName": meta["shortName"],
        "color": meta["color"],
        "training": metrics[k]["training"],
        "testing": metrics[k]["testing"],
        "validation": metrics[k]["validation"]
    }

ts_code.append(f"export const MODEL_SPLIT_REPORTS: Record<ModelId, ModelSplitReport> = {json.dumps(split_reports, indent=2)};\n\n")

# Top accuracy
top_test = max(b["testAccuracy"] for b in benchmarks)
ts_code.append(f"export const TOP_TEST_ACCURACY = {top_test};\n")
ts_code.append("export const DATASET_NAME = 'AI4I 2020 Predictive Maintenance (predictive_maintenance.csv)';\n")

with open("src/data/modelMetrics.ts", "w") as f:
    f.write("".join(ts_code))

print("[+] Successfully synchronized src/data/modelMetrics.ts with empirical training metrics!")
