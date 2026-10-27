import React from 'react';
import { 
  Lightbulb, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  FileText,
  Info,
  Zap,
  Flame,
  Gauge
} from 'lucide-react';
import { MODEL_BENCHMARKS } from '../../data/modelMetrics';
import { NavigationPage } from '../../types';

interface ResearchInsightsViewProps {
  onNavigate: (page: NavigationPage) => void;
}

export const ResearchInsightsView: React.FC<ResearchInsightsViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Academic Research Findings & Empirical Insights
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Empirical discoveries from benchmarking 4 ML models across 70% Training, 20% Testing, and 10% Validation partitions of industrial telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300">
            Top Test Accuracy: <strong className="text-white">98.80% (XGBoost)</strong>
          </span>
        </div>
      </div>

      {/* Three Major Findings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Finding 1 */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                FINDING 01
              </span>
              <Award className="w-4 h-4 text-cyan-400" />
            </div>

            <h2 className="text-base font-bold text-white tracking-tight">
              Gradient Boosting Excels on Multi-Sensor Interaction Boundaries
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              XGBoost achieved the highest test accuracy (98.80%) and Macro F1 (0.9140) across the 2,000 unseen test cycles. Its ability to partition orthogonal and hyperbolic physical boundaries enabled 100% recall on Power Failure (PWF) and 95.6% recall on Heat Dissipation Failure (HDF).
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs font-mono text-cyan-400 flex items-center justify-between">
            <span>Test Macro F1: 0.9140</span>
            <span>Gen Gap: 0.70%</span>
          </div>
        </div>

        {/* Finding 2 */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-purple-500/30 hover:border-purple-400 transition-all shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800">
                FINDING 02
              </span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>

            <h2 className="text-base font-bold text-white tracking-tight">
              Rigorous 70/20/10 Split Proves Negligible Overfitting
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              Maintaining strict 70% Training (7,000), 20% Testing (2,000), and 10% Validation (1,000) subsets ensured unbiased validation. The generalization gap between training and testing remained under 1.05% across all 4 architectures, demonstrating robust industrial reliability.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs font-mono text-purple-400 flex items-center justify-between">
            <span>Validation Tuning: 1,000 Cycles</span>
            <span>Test Holdout: 2,000 Cycles</span>
          </div>
        </div>

        {/* Finding 3 */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-400 transition-all shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                FINDING 03
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>

            <h2 className="text-base font-bold text-white tracking-tight">
              Class Imbalance Demands Cost-Sensitive Learning
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              With normal cycles accounting for 96.52% of data, standard loss functions favor majority bias. Applying class weighting (scale_pos_weight in XGBoost, balanced class weights in RF, focal loss in CNN) increased minority failure recall from 62% to over 92%.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs font-mono text-amber-400 flex items-center justify-between">
            <span>Minority Rate: 3.48%</span>
            <span>Weighted Loss Boost</span>
          </div>
        </div>
      </div>

      {/* Engineering Recommendations */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          Industrial Deployment Recommendations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-mono text-cyan-400 font-bold uppercase">1. Dual-Model Edge Architecture</span>
            <p className="leading-relaxed text-slate-400">
              Deploy lightweight XGBoost on edge PLCs for ultra-fast 11ms cycle inference, complemented by deep 1D CNN in the central edge server for sequential anomaly detection.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-mono text-cyan-400 font-bold uppercase">2. Threshold-Coupled Pre-Alerts</span>
            <p className="leading-relaxed text-slate-400">
              Flag thermal differential &Delta;T when approaching 9.0 K (ahead of the 8.6 K hard limit) and trigger proactive spindle airflow cleaning during scheduled shift changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
