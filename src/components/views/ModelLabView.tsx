import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  Scale, 
  X,
  ShieldCheck,
  Award
} from 'lucide-react';
import { MODEL_BENCHMARKS } from '../../data/modelMetrics';
import { NavigationPage } from '../../types';

interface ModelLabViewProps {
  onNavigate: (page: NavigationPage) => void;
}

export const ModelLabView: React.FC<ModelLabViewProps> = ({ onNavigate }) => {
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Machine Learning Model Laboratory
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Comparative analysis of ensemble methods, deep 1D CNN, and support vector machines across Training (70%), Testing (20%), and Validation (10%) partitions.
          </p>
        </div>

        <button
          onClick={() => setShowComparisonModal(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-cyan-600/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Scale className="w-4 h-4" />
          <span>Compare All 4 Models</span>
        </button>
      </div>

      {/* Four Detailed Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MODEL_BENCHMARKS.map((model) => (
          <div
            key={model.id}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-xl space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header pill & category */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${model.badgeColor}`}>
                  {model.category}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Test Acc: {model.testAccuracy.toFixed(2)}%
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: model.color }} />
                  {model.name}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {model.description}
                </p>
              </div>

              {/* 3-Split Separate Metrics Box */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Separate Outputs Across 3 Splits:
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] font-mono text-cyan-400">TRAIN (70%)</div>
                    <div className="text-sm font-bold font-mono text-white mt-0.5">{model.trainAccuracy.toFixed(2)}%</div>
                    <div className="text-[10px] text-slate-500 font-mono">F1: {model.trainMacroF1.toFixed(3)}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-rose-900/40">
                    <div className="text-[10px] font-mono text-rose-400">TEST (20%)</div>
                    <div className="text-sm font-bold font-mono text-white mt-0.5">{model.testAccuracy.toFixed(2)}%</div>
                    <div className="text-[10px] text-slate-500 font-mono">F1: {model.testMacroF1.toFixed(3)}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-purple-900/40">
                    <div className="text-[10px] font-mono text-purple-400">VAL (10%)</div>
                    <div className="text-sm font-bold font-mono text-white mt-0.5">{model.valAccuracy.toFixed(2)}%</div>
                    <div className="text-[10px] text-slate-500 font-mono">F1: {model.macroF1.toFixed(3)}</div>
                  </div>
                </div>
              </div>

              {/* Hyperparameters */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase">
                  Selected Hyperparameters:
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                  {Object.entries(model.hyperparameters).slice(0, 4).map(([k, v]) => (
                    <div key={k} className="p-1.5 rounded bg-slate-950/60 border border-slate-800/80 text-[11px]">
                      <span className="text-slate-500 block truncate">{k}:</span>
                      <span className="text-slate-200 font-semibold truncate block">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Limitations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Strengths</span>
                  <ul className="space-y-1">
                    {model.strengths.slice(0, 2).map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">Limitations</span>
                  <ul className="space-y-1">
                    {model.limitations.slice(0, 2).map((l, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-slate-400 text-[11px]">
                        <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Generalization Gap: <strong className="text-slate-200">{model.generalizationGap.toFixed(2)}%</strong>
              </span>
              <button
                onClick={() => onNavigate('results')}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group/btn"
              >
                <span>Full Confusion Matrix</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Model Comparison Modal */}
      {showComparisonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-cyan-400" />
                  Four-Model Comparative Benchmark Matrix
                </h3>
                <p className="text-xs text-slate-400">Complete performance breakdown across Training (70%), Testing (20%), and Validation (10%)</p>
              </div>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 font-mono text-slate-400 uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Model Architecture</th>
                    <th className="py-3 px-4">Train Acc (70%)</th>
                    <th className="py-3 px-4">Test Acc (20%)</th>
                    <th className="py-3 px-4">Val Acc (10%)</th>
                    <th className="py-3 px-4">Test Macro F1</th>
                    <th className="py-3 px-4">ROC-AUC</th>
                    <th className="py-3 px-4">Gen Gap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {MODEL_BENCHMARKS.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-850/50">
                      <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                        {m.name}
                      </td>
                      <td className="py-3 px-4 text-cyan-400 font-bold">{m.trainAccuracy.toFixed(2)}%</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">{m.testAccuracy.toFixed(2)}%</td>
                      <td className="py-3 px-4 text-purple-400 font-bold">{m.valAccuracy.toFixed(2)}%</td>
                      <td className="py-3 px-4 text-white font-bold">{m.testMacroF1.toFixed(4)}</td>
                      <td className="py-3 px-4 text-slate-200">{m.rocAuc.toFixed(3)}</td>
                      <td className="py-3 px-4 text-slate-400">{m.generalizationGap.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowComparisonModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
