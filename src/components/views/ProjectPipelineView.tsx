import React from 'react';
import { 
  Workflow, 
  Database, 
  GitBranch, 
  Cpu, 
  Layers, 
  BarChart3, 
  CheckCircle2, 
  Sparkles,
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Wrench
} from 'lucide-react';
import { NavigationPage } from '../../types';

interface ProjectPipelineViewProps {
  onNavigate: (page: NavigationPage) => void;
}

export const ProjectPipelineView: React.FC<ProjectPipelineViewProps> = ({ onNavigate }) => {
  const stages = [
    {
      num: 1,
      title: 'INDUSTRIAL SENSOR ACQUISITION',
      category: 'DATA ACQUISITION',
      desc: 'High-frequency telemetry sampling from CNC milling machine sensors (Air Temp, Process Temp, Speed, Torque, Tool Wear).',
      outputs: 'Raw 10,000 cycles from archive.zip / predictive_maintenance.csv',
      icon: Activity,
      color: '#06b6d4'
    },
    {
      num: 2,
      title: 'QUALITY VARIANT & TARGET ENCODING',
      category: 'FEATURE CLEANING',
      desc: 'One-hot encoding of product machine quality variants (Type L, M, H) and integer encoding of 6 condition classes.',
      outputs: '6-class label taxonomy (0: No Failure, 1: HDF, 2: PWF, 3: OSF, 4: TWF, 5: RNF)',
      icon: GitBranch,
      color: '#3b82f6'
    },
    {
      num: 3,
      title: 'PHYSICS FEATURE ENGINEERING',
      category: 'DOMAIN KNOWLEDGE',
      desc: 'Formulation of domain thermodynamics & kinematic stress variables (\u0394T = Process - Air, Mechanical Power P = \u03c4\u03c9, Overstrain = wear \u00d7 \u03c4).',
      outputs: '8-dimensional enriched physics feature representation',
      icon: Zap,
      color: '#8b5cf6'
    },
    {
      num: 4,
      title: '70% / 20% / 10% STRATIFIED PARTITION',
      category: 'VALIDATION PROTOCOL',
      desc: 'Uniform class-balanced partitioning into 7,000 Training, 2,000 Testing, and 1,000 Validation records.',
      outputs: 'Independent subsets strictly isolated to ensure zero data leakage',
      icon: ShieldCheck,
      color: '#ec4899'
    },
    {
      num: 5,
      title: 'INPUT REPRESENTATION PIPELINES',
      category: 'TRANSFORMATION',
      desc: 'Z-score StandardScaler for classical models (XGBoost, RF, SVM) vs sequential 1D tensor reshaping for Deep 1D CNN.',
      outputs: 'Standardized matrix [7000, 8] & Tensor [Batch, 8, 1]',
      icon: Layers,
      color: '#f59e0b'
    },
    {
      num: 6,
      title: 'MULTI-MODEL TRAINING & GRADIENT FIT',
      category: 'MACHINE LEARNING',
      desc: 'Training 4 diverse algorithms: Gradient Boosted Trees (XGBoost), Bagged Ensembles (RF), Deep ConvNet (1D CNN), and Maximum-Margin RBF (SVM).',
      outputs: 'Optimized weights with class-imbalance loss penalties',
      icon: Cpu,
      color: '#10b981'
    },
    {
      num: 7,
      title: 'VALIDATION SPLIT TUNING (10%)',
      category: 'HYPERPARAMETER OPTIMIZATION',
      desc: 'Tuning tree depth, learning rates, subsample ratios, and early stopping patience on 1,000 validation cycles.',
      outputs: 'Selected optimal hyperparameters minimizing cross-entropy validation loss',
      icon: CheckCircle2,
      color: '#06b6d4'
    },
    {
      num: 8,
      title: 'FINAL UNBIASED TEST EVALUATION (20%)',
      category: 'BENCHMARKING',
      desc: 'Evaluating 2,000 completely held-out test cycles to generate independent 6x6 test confusion matrices and Macro F1 scores.',
      outputs: 'Test Accuracy: XGBoost (98.80%), RF (98.65%), 1D CNN (98.25%), SVM (97.80%)',
      icon: BarChart3,
      color: '#8b5cf6'
    },
    {
      num: 9,
      title: 'OPERATING ENVELOPE VERIFICATION',
      category: 'PHYSICS VERIFICATION',
      desc: 'Stress testing model decisions against analytical power curves (3.5kW - 9kW) and wear lifecycle thresholds.',
      outputs: 'Zero-false-negative guarantee on catastrophic power exceedances',
      icon: Activity,
      color: '#f43f5e'
    },
    {
      num: 10,
      title: 'PRESCRIPTIVE MAINTENANCE DISPATCH',
      category: 'DECISION SUPPORT',
      desc: 'Real-time telemetry inference delivering 0-100% Machine Health Scores, failure probability distributions, and automated maintenance actions.',
      outputs: 'Condition-based maintenance tickets dispatched prior to tool breakdown',
      icon: Wrench,
      color: '#10b981'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Workflow className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              10-Stage Project Architecture & Data Pipeline
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Systematic engineering workflow from raw CNC telemetry acquisition to prescriptive maintenance dispatch.
          </p>
        </div>

        <button
          onClick={() => onNavigate('prediction')}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 flex items-center gap-1.5"
        >
          <span>Test in Live Diagnostics</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 10-Stage Vertical Pipeline Flow */}
      <div className="space-y-4">
        {stages.map((st, i) => {
          const Icon = st.icon;
          return (
            <div key={st.num} className="relative">
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{ backgroundColor: `${st.color}15`, borderColor: `${st.color}40` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: st.color }} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                        STAGE {st.num < 10 ? `0${st.num}` : st.num}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{st.category}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{st.title}</h3>
                    <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">{st.desc}</p>
                  </div>
                </div>

                <div className="md:text-right shrink-0 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 block">KEY DELIVERABLE</span>
                  <span className="text-xs font-mono font-semibold text-slate-300 block mt-0.5">{st.outputs}</span>
                </div>
              </div>

              {i < stages.length - 1 && (
                <div className="flex justify-center my-1 text-slate-600">
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
