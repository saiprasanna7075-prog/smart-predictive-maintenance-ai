import React from 'react';
import { 
  GitBranch, 
  ArrowDown, 
  ArrowRight, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Sliders, 
  Split, 
  Binary, 
  FileCheck,
  Flame,
  Zap,
  Gauge,
  Wrench,
  ShieldCheck
} from 'lucide-react';
import { DATASET_STATS, SPLIT_DISTRIBUTION } from '../../data/datasetInfo';
import { NavigationPage } from '../../types';

interface PreprocessingViewProps {
  onNavigate: (page: NavigationPage) => void;
}

export const PreprocessingView: React.FC<PreprocessingViewProps> = ({ onNavigate }) => {
  const steps = [
    {
      num: '01',
      title: 'RAW MULTI-SENSOR INGESTION',
      desc: 'Acquisition of 5 primary physical telemetry channels recorded per milling cycle from industrial CNC sensors.',
      detail: 'Air Temp [K], Process Temp [K], Rotational Speed [rpm], Torque [Nm], Tool Wear [min]'
    },
    {
      num: '02',
      title: 'PRODUCT VARIANT ENCODING',
      desc: 'Mapping industrial machine quality grades (L: 60%, M: 30%, H: 10%) into one-hot binary indicator vectors.',
      detail: 'L \u2192 [1, 0, 0], M \u2192 [0, 1, 0], H \u2192 [0, 0, 1]'
    },
    {
      num: '03',
      title: 'PHYSICAL FEATURE ENGINEERING',
      desc: 'Deriving domain-specific thermodynamics and mechanical stress metrics that govern failure boundaries.',
      detail: '\u0394T (Process - Air), Mechanical Power (P = \u03c4 \u00b7 \u03c9), Overstrain Product (\u03c4 \u00d7 wear)'
    },
    {
      num: '04',
      title: 'STRATIFIED 70 / 20 / 10 SPLIT',
      desc: 'Partitioning 10,000 cycles with stratified class proportions across Training, Testing, and Validation subsets.',
      detail: 'Training: 7,000 (70%) | Testing: 2,000 (20%) | Validation: 1,000 (10%)'
    },
    {
      num: '05',
      title: 'REPRESENTATION BRANCHING',
      desc: 'Dual preparation pipelines: Z-score standardized tabular vectors for classical ML vs temporal sequence tensors for 1D CNN.',
      detail: 'StandardScaler (\u03bc=0, \u03c3=1) vs 1D Sequential Tensor'
    },
    {
      num: '06',
      title: 'MULTI-MODEL INGESTION',
      desc: 'Feeding balanced mini-batches and weighted samples into XGBoost, Random Forest, SVM, and 1D CNN.',
      detail: 'Cost-sensitive loss weighting applied to counter 3.48% minority failure rate'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Data Preprocessing & Physics Feature Pipeline
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            End-to-end data transformation: raw CNC telemetry &rarr; thermodynamics feature engineering &rarr; stratified 70/20/10 split &rarr; model inputs.
          </p>
        </div>

        <button
          onClick={() => onNavigate('results')}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 flex items-center gap-1.5"
        >
          <span>Examine Split Results</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Six Step Sequential Pipeline */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider">
          Six-Stage Preprocessing Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((st, i) => (
            <div 
              key={st.num} 
              className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                    STAGE {st.num}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Step {i + 1} of 6</span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="truncate">{st.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stratified Partitioning Protocol (Exact User Requirement) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-blue-950/30 border border-cyan-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Rigorous 70% / 20% / 10% Dataset Partitioning
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Guarantees identical failure class proportions across all three subsets to prevent distribution shift.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            Total Dataset: <strong>10,000 Machine Cycles</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Train */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/40 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Training Partition</span>
              <span className="text-sm font-bold text-white font-mono">70.0%</span>
            </div>
            <div className="text-2xl font-bold font-mono text-cyan-300">7,000 <span className="text-xs font-normal text-slate-400">cycles</span></div>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              &bull; 6,756 Normal Cycles<br />
              &bull; 244 Failure Cycles across 5 modes<br />
              &bull; Used for fitting tree structures and gradient updates.
            </div>
          </div>

          {/* Test */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/40 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase">Testing Partition</span>
              <span className="text-sm font-bold text-white font-mono">20.0%</span>
            </div>
            <div className="text-2xl font-bold font-mono text-rose-300">2,000 <span className="text-xs font-normal text-slate-400">cycles</span></div>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              &bull; 1,930 Normal Cycles<br />
              &bull; 70 Failure Cycles across 5 modes<br />
              &bull; Held out for unbiased final 6x6 test confusion matrix.
            </div>
          </div>

          {/* Val */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/40 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase">Validation Partition</span>
              <span className="text-sm font-bold text-white font-mono">10.0%</span>
            </div>
            <div className="text-2xl font-bold font-mono text-purple-300">1,000 <span className="text-xs font-normal text-slate-400">cycles</span></div>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              &bull; 966 Normal Cycles<br />
              &bull; 34 Failure Cycles across 5 modes<br />
              &bull; Hyperparameter tuning, tree depth limits, early stopping.
            </div>
          </div>
        </div>
      </div>

      {/* Feature Engineering Equations Section */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Binary className="w-5 h-5 text-cyan-400" />
          Engineered Physics Features & Mathematical Formulations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
              <Flame className="w-4 h-4" />
              <span>THERMAL GRADIENT (\u0394T)</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 font-mono text-xs text-cyan-300">
              \u0394T = T_process - T_air [Kelvin]
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Quantifies cooling efficiency. Low gradient (&lt;8.6 K) at low RPM signals imminent Heat Dissipation Failure (HDF).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold">
              <Zap className="w-4 h-4" />
              <span>MECHANICAL POWER (P)</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 font-mono text-xs text-cyan-300">
              P = \u03c4 \u00b7 (2\u03c0 \u00b7 rpm / 60) [Watts]
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Product of torque and angular velocity. Outside [3,500 W - 9,000 W] signals Power Failure (PWF).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold">
              <Gauge className="w-4 h-4" />
              <span>OVERSTRAIN PRODUCT (S)</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 font-mono text-xs text-cyan-300">
              S = Tool Wear \u00d7 Torque [min\u00b7Nm]
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Measures cumulative mechanical cutting stress. Exceeding type limits (11k L, 12k M, 13k H) signals Overstrain Failure (OSF).
            </p>
          </div>
        </div>
      </div>

      {/* Traditional ML vs 1D CNN Input Branching */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Branch 1: Traditional ML */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">Traditional ML & Ensemble Pipeline</h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">SVM / RF / XGBoost</span>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              5 Sensor Dimensions + 3 Engineered Physics Features
            </div>
            <div className="text-center text-slate-500">&darr;</div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              StandardScaler: z = (x - \u03bc) / \u03c3
            </div>
            <div className="text-center text-slate-500">&darr;</div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300">
              Non-linear Tree Partitions & Hyperplane Decision Boundaries
            </div>
          </div>
        </div>

        {/* Branch 2: 1D CNN */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-white text-sm">Deep 1D CNN Pipeline</h3>
            </div>
            <span className="text-[10px] font-mono text-purple-400">1D ConvNet</span>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              Sensor Tensor: Shape (Batch, 8 Channels, 1)
            </div>
            <div className="text-center text-slate-500">&darr;</div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              1D Convolutions &times; 3 Layers + Batch Normalization + MaxPool
            </div>
            <div className="text-center text-slate-500">&darr;</div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-purple-300">
              Global Average Pooling + Dropout(0.35) + Softmax (6 Classes)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
