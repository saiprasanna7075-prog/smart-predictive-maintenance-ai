import React from 'react';
import { 
  ArrowRight, 
  Cpu, 
  Layers, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  BarChart2, 
  Zap,
  AlertTriangle,
  Flame,
  Wrench,
  Gauge,
  HelpCircle
} from 'lucide-react';
import { SignalIntelligenceCore } from '../3d/SignalIntelligenceCore';
import { MODEL_BENCHMARKS } from '../../data/modelMetrics';
import { DATASET_STATS, SPLIT_DISTRIBUTION } from '../../data/datasetInfo';
import { NavigationPage } from '../../types';

interface DashboardViewProps {
  onNavigate: (page: NavigationPage) => void;
  reducedMotion?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, reducedMotion = false }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#0b1428] via-[#090f1e] to-[#070b14] p-6 lg:p-10 shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Academic Machine Learning & Industrial IoT Project
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                SMART PREDICTIVE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                  MAINTENANCE AI
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
                "Multi-Model Machine Learning for Industrial Milling Machine Failure Recognition."
              </p>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
              An intelligent condition-monitoring and failure diagnosis workstation evaluating traditional machine learning (SVM), ensemble learning (Random Forest, XGBoost), and deep learning (1D CNN) on 10,000 industrial machine cycles partitioned into <span className="text-cyan-300 font-semibold">70% Training (7,000)</span>, <span className="text-rose-400 font-semibold">20% Testing (2,000)</span>, and <span className="text-purple-300 font-semibold">10% Validation (1,000)</span> subsets.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-500 font-mono">DATASET</div>
                <div className="text-lg font-bold text-white mt-0.5">10,000</div>
                <div className="text-[11px] text-cyan-400">AI4I 2020 Records</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-500 font-mono">TRAINING SPLIT</div>
                <div className="text-lg font-bold text-cyan-400 mt-0.5">70%</div>
                <div className="text-[11px] text-slate-400">7,000 Records</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-500 font-mono">TEST / VAL SPLIT</div>
                <div className="text-lg font-bold text-purple-400 mt-0.5">20% / 10%</div>
                <div className="text-[11px] text-slate-400">2,000 / 1,000 Records</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-500 font-mono">TOP TEST ACC</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">98.80%</div>
                <div className="text-[11px] text-slate-400">XGBoost Classifier</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => onNavigate('prediction')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all duration-150 flex items-center gap-2 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Launch Live Diagnostics
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('results')}
                className="px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                View 70/20/10 Split Results
              </button>
            </div>
          </div>

          {/* Hero Right: 3D Spindle Digital Twin */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm aspect-square relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-inner group">
              <SignalIntelligenceCore reducedMotion={reducedMotion} />
              
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800 text-[10px] font-mono text-cyan-400">
                ROTATING SPINDLE TWIN
              </div>
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/85 backdrop-blur-md p-2 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                <span>Torque & Temperature Sensing</span>
                <span className="text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  REALTIME
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Partitioning Protocol Callout (Exact User Constraint) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-blue-950/30 border border-cyan-500/30 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Dataset Partitioning & Evaluation Protocol
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Strictly segmented into 3 separate subsets to guarantee unbiased generalization and hyperparameter validation:
            </p>
          </div>
          <button
            onClick={() => onNavigate('results')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline underline-offset-4"
          >
            Compare Per-Split Outputs <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SPLIT_DISTRIBUTION.map((split, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 right-0 h-1" 
                style={{ backgroundColor: split.color }}
              />
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-white">{split.name}</span>
                <span className="font-mono text-sm font-bold" style={{ color: split.color }}>
                  {split.percentage}%
                </span>
              </div>
              <div className="text-xl font-extrabold text-slate-100 font-mono">
                {split.count.toLocaleString()} <span className="text-xs font-normal text-slate-400">records</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                {i === 0 && 'Model training, gradient descent parameter updates, and tree partitioning.'}
                {i === 1 && 'Unbiased test performance, 6x6 test confusion matrix, and final generalization.'}
                {i === 2 && 'Hyperparameter tuning, tree depth limits, and early stopping threshold tuning.'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Machine Learning Models Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Four Evaluated Machine Learning Models</h2>
            <p className="text-xs text-slate-400">
              Benchmarked across all three data partitions (Training 7,000 / Testing 2,000 / Validation 1,000)
            </p>
          </div>
          <button
            onClick={() => onNavigate('models')}
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            Detailed Model Lab <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODEL_BENCHMARKS.map((model) => (
            <div
              key={model.id}
              className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between group hover:shadow-lg hover:shadow-cyan-950/20"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${model.badgeColor}`}>
                    {model.category}
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: model.color }} />
                </div>

                <div>
                  <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                    {model.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {model.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Test Accuracy (20%):</span>
                    <span className="font-mono font-bold text-white">{model.testAccuracy.toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Test Macro F1:</span>
                    <span className="font-mono font-bold text-cyan-400">{model.testMacroF1.toFixed(4)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Train Accuracy (70%):</span>
                    <span className="font-mono text-slate-300">{model.trainAccuracy.toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Val Accuracy (10%):</span>
                    <span className="font-mono text-slate-300">{model.valAccuracy.toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('results')}
                className="mt-4 pt-3 border-t border-slate-800/60 text-xs font-medium text-slate-400 hover:text-cyan-300 flex items-center justify-between group/btn cursor-pointer"
              >
                <span>Inspect All 3 Splits</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Failure Modes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Identified Machine Failure Modes</h2>
            <p className="text-xs text-slate-400">
              Governed by deterministic thermal, mechanical, and tool degradation physics
            </p>
          </div>
          <button
            onClick={() => onNavigate('failure-types')}
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            Physical Equations & Limits <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* HDF */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/20 hover:border-amber-500/40 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-white">Heat Dissipation (HDF)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Triggered when air-to-process thermal differential &Delta;T &lt; 8.6 K at rotational speed &lt; 1,380 rpm.
            </p>
            <div className="text-[11px] font-mono text-amber-400 bg-amber-950/40 px-2 py-1 rounded border border-amber-800/40">
              112 Cases in Dataset
            </div>
          </div>

          {/* PWF */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-rose-500/20 hover:border-rose-500/40 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-white">Power Failure (PWF)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Occurs when mechanical power P = &tau;&middot;&omega; falls outside the operational envelope [3,500 W - 9,000 W].
            </p>
            <div className="text-[11px] font-mono text-rose-400 bg-rose-950/40 px-2 py-1 rounded border border-rose-800/40">
              95 Cases in Dataset
            </div>
          </div>

          {/* OSF */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Gauge className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-white">Overstrain (OSF)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Mechanical strain (Tool Wear &times; Torque) exceeds product limits: 11,000 (L), 12,000 (M), 13,000 (H).
            </p>
            <div className="text-[11px] font-mono text-purple-400 bg-purple-950/40 px-2 py-1 rounded border border-purple-800/40">
              78 Cases in Dataset
            </div>
          </div>

          {/* TWF */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Wrench className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-white">Tool Wear (TWF)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Tool blade wear exceeds 200–240 minutes, causing dimensional inaccuracies and chatter.
            </p>
            <div className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-800/40">
              45 Cases in Dataset
            </div>
          </div>

          {/* RNF */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-pink-500/20 hover:border-pink-500/40 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-white">Random Failure (RNF)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Stochastic faults occurring with 0.1% probability uncorrelated with physical sensors.
            </p>
            <div className="text-[11px] font-mono text-pink-400 bg-pink-950/40 px-2 py-1 rounded border border-pink-800/40">
              18 Cases in Dataset
            </div>
          </div>
        </div>
      </div>

      {/* Central Pipeline Visualization */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Predictive Maintenance Architecture Pipeline
            </h3>
            <p className="text-xs text-slate-400">From raw multi-sensor telemetry to condition diagnosis and maintenance alerts</p>
          </div>
          <button
            onClick={() => onNavigate('project-pipeline')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            Full Pipeline <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col items-center text-center">
            <div className="text-[10px] font-mono text-slate-500">STAGE 1</div>
            <div className="font-bold text-xs text-cyan-400 mt-1">TELEMETRY INGESTION</div>
            <div className="text-[11px] text-slate-400 mt-1">Air/Process Temp, Speed, Torque, Tool Wear</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col items-center text-center">
            <div className="text-[10px] font-mono text-slate-500">STAGE 2</div>
            <div className="font-bold text-xs text-sky-400 mt-1">PHYSICS EXTRACTION</div>
            <div className="text-[11px] text-slate-400 mt-1">&Delta;T, Power (P=&tau;&omega;), Strain Product</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col items-center text-center">
            <div className="text-[10px] font-mono text-slate-500">STAGE 3</div>
            <div className="font-bold text-xs text-purple-400 mt-1">70/20/10 SPLIT</div>
            <div className="text-[11px] text-slate-400 mt-1">7,000 Train / 2,000 Test / 1,000 Val</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col items-center text-center">
            <div className="text-[10px] font-mono text-slate-500">STAGE 4</div>
            <div className="font-bold text-xs text-emerald-400 mt-1">MULTI-MODEL FIT</div>
            <div className="text-[11px] text-slate-400 mt-1">XGBoost, RF, 1D CNN, SVM</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col items-center text-center col-span-2 md:col-span-1">
            <div className="text-[10px] font-mono text-slate-500">STAGE 5</div>
            <div className="font-bold text-xs text-amber-400 mt-1">HEALTH & ALERT</div>
            <div className="text-[11px] text-slate-400 mt-1">Health % + Prescriptive Maintenance Action</div>
          </div>
        </div>
      </div>
    </div>
  );
};
