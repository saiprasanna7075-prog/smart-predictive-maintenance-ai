import React, { useState } from 'react';
import { 
  Grid, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  Layers, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { MODEL_SPLIT_REPORTS, FAILURE_CLASSES } from '../../data/modelMetrics';
import { ModelId, DatasetSplitType, NavigationPage } from '../../types';

interface ConfusionMatrixViewProps {
  onNavigate: (page: NavigationPage) => void;
}

export const ConfusionMatrixView: React.FC<ConfusionMatrixViewProps> = ({ onNavigate }) => {
  const [selectedModel, setSelectedModel] = useState<ModelId>('xgboost');
  const [selectedSplit, setSelectedSplit] = useState<DatasetSplitType>('testing');

  const [hoveredCell, setHoveredCell] = useState<{
    r: number;
    c: number;
    actual: string;
    predicted: string;
    count: number;
    pctRow: number;
    isDiagonal: boolean;
  } | null>(null);

  const modelReport = MODEL_SPLIT_REPORTS[selectedModel];
  const splitData = modelReport[selectedSplit];
  const matrix = splitData.confusionMatrix;
  const totalSamples = splitData.sampleCount;

  // Short labels for clean 6x6 layout
  const shortLabels = ['No Fail', 'HDF', 'PWF', 'OSF', 'TWF', 'RNF'];

  const getCellBg = (count: number, isDiagonal: boolean, rowTotal: number) => {
    if (isDiagonal) {
      const pct = rowTotal > 0 ? count / rowTotal : 0;
      if (pct > 0.95) return 'bg-cyan-500/40 border-cyan-400 text-cyan-200';
      if (pct > 0.8) return 'bg-cyan-600/30 border-cyan-500 text-cyan-300';
      return 'bg-cyan-800/20 border-cyan-700/60 text-cyan-400';
    }

    if (count > 5) return 'bg-rose-500/30 border-rose-500/60 text-rose-300 font-bold';
    if (count > 0) return 'bg-slate-800/80 border-slate-700 text-slate-300';
    return 'bg-slate-950/40 border-slate-850 text-slate-600';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Interactive 6&times;6 Multi-Class Confusion Matrix
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Examine multi-class error distribution across Training (70%), Testing (20%), and Validation (10%) splits for any model.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            Partition Size: <strong className="text-cyan-400 font-bold">{totalSamples.toLocaleString()} Cycles</strong>
          </span>
        </div>
      </div>

      {/* Model & Split Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Model Selector */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            1. Select Model Architecture:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'xgboost', label: 'XGBoost' },
              { id: 'rf', label: 'Random Forest' },
              { id: 'cnn', label: '1D CNN' },
              { id: 'svm', label: 'SVM (RBF)' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id as ModelId)}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-all ${
                  selectedModel === m.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Split Selector */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            2. Select Dataset Partition:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'training', label: 'Training (70%)', count: '7,000' },
              { id: 'testing', label: 'Testing (20%)', count: '2,000' },
              { id: 'validation', label: 'Validation (10%)', count: '1,000' }
            ].map((sp) => (
              <button
                key={sp.id}
                onClick={() => setSelectedSplit(sp.id as DatasetSplitType)}
                className={`py-2 px-3 rounded-lg text-xs font-mono text-center transition-all ${
                  selectedSplit === sp.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <div className="font-semibold">{sp.label}</div>
                <div className="text-[10px] opacity-75">{sp.count} samples</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Confusion Matrix Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 6x6 Heatmap Grid */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Confusion Heatmap: {modelReport.modelName}</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Split: <strong className="text-purple-400 uppercase">{selectedSplit}</strong> ({totalSamples.toLocaleString()} samples)
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-slate-400">Accuracy:</span>
              <div className="font-mono font-bold text-emerald-400 text-base">
                {splitData.accuracy.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Matrix Layout */}
          <div className="overflow-x-auto pt-2">
            <div className="min-w-[500px]">
              {/* Predicted Labels Header */}
              <div className="text-center text-xs font-mono text-slate-400 mb-2 uppercase font-semibold">
                Predicted Failure Class &rarr;
              </div>

              <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-mono">
                {/* Top-left empty cell */}
                <div className="p-2 text-[10px] text-slate-500 font-semibold flex items-center justify-center">
                  Actual &darr;
                </div>

                {/* Column Headers */}
                {shortLabels.map((lbl, i) => (
                  <div key={i} className="p-2 rounded bg-slate-950 font-bold text-slate-300 truncate" title={FAILURE_CLASSES[i]}>
                    {lbl}
                  </div>
                ))}

                {/* Matrix Rows */}
                {matrix.map((row, r) => {
                  const rowTotal = row.reduce((a, b) => a + b, 0);
                  return (
                    <React.Fragment key={r}>
                      {/* Row Header */}
                      <div className="p-2 rounded bg-slate-950 font-bold text-slate-300 flex items-center justify-center truncate text-[11px]" title={FAILURE_CLASSES[r]}>
                        {shortLabels[r]}
                      </div>

                      {/* Cells */}
                      {row.map((cellCount, c) => {
                        const isDiagonal = r === c;
                        const cellPct = rowTotal > 0 ? (cellCount / rowTotal) * 100 : 0;
                        const bgClass = getCellBg(cellCount, isDiagonal, rowTotal);

                        return (
                          <div
                            key={c}
                            onMouseEnter={() =>
                              setHoveredCell({
                                r,
                                c,
                                actual: FAILURE_CLASSES[r],
                                predicted: FAILURE_CLASSES[c],
                                count: cellCount,
                                pctRow: cellPct,
                                isDiagonal
                              })
                            }
                            className={`p-3 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 hover:z-10 ${bgClass}`}
                          >
                            <span className="font-bold text-sm">{cellCount}</span>
                            <span className="text-[10px] opacity-75">{cellPct.toFixed(0)}%</span>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Hover Cell Inspector & Error Insights */}
        <div className="lg:col-span-4 space-y-4">
          {/* Cell Inspector Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Cell Inspector
            </span>

            {hoveredCell ? (
              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400">Actual (Ground Truth):</div>
                  <div className="font-bold text-white text-sm font-sans">{hoveredCell.actual}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400">Model Prediction:</div>
                  <div className="font-bold text-cyan-400 text-sm font-sans">{hoveredCell.predicted}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500">CYCLE COUNT</div>
                    <div className="text-lg font-bold text-white mt-0.5">{hoveredCell.count}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500">ROW PERCENTAGE</div>
                    <div className="text-lg font-bold text-emerald-400 mt-0.5">{hoveredCell.pctRow.toFixed(1)}%</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  {hoveredCell.isDiagonal ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correctly classified instances.
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-sans">
                      <AlertTriangle className="w-3.5 h-3.5" /> Misclassified confusion instances.
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 font-mono">
                Hover over any matrix cell to inspect exact sample count and row accuracy.
              </div>
            )}
          </div>

          {/* Key Confusion Insights */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider block">
              Physical Error Analysis
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span><strong>Power Failure (PWF):</strong> 100% recall achieved on test split due to strict deterministic hyperbolic power limits.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span><strong>Heat Dissipation (HDF):</strong> 95.6% recall. Slight confusion with normal operation when &Delta;T is near 8.6 K boundary.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span><strong>Random Failures (RNF):</strong> Irreducible stochastic noise (18 cases total), showing the expected lowest recall across all models.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
