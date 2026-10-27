import React from 'react';
import { 
  Info, 
  Cpu, 
  Database, 
  Layers, 
  Award, 
  FileText, 
  Code2, 
  CheckCircle2, 
  ExternalLink,
  Mail,
  ShieldCheck,
  Server
} from 'lucide-react';
import { DATASET_STATS, SPLIT_DISTRIBUTION } from '../../data/datasetInfo';
import { NavigationPage } from '../../types';

interface AboutProjectViewProps {
  onNavigate: (page: NavigationPage) => void;
}

export const AboutProjectView: React.FC<AboutProjectViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              About Smart Predictive Maintenance AI
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Academic engineering machine-learning project for industrial condition monitoring and milling failure prediction.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300">
          Version 2.0 &bull; Final Year Capstone Project
        </span>
      </div>

      {/* Abstract Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-blue-950/30 border border-cyan-500/30 shadow-xl space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-400" />
          Project Abstract & Objective
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Modern automated manufacturing relies on continuous CNC machining centers where unscheduled tool breakages or thermal failures result in catastrophic downtime and ruined workpieces. This research presents an intelligent predictive maintenance system utilizing the AI4I 2020 benchmark dataset (10,000 industrial machine cycles from <code className="text-cyan-300">predictive_maintenance.csv</code>). We systematically formulate domain physical variables (&Delta;T, mechanical power, tool strain product), partition the data using a strict <strong>70% Training (7,000) / 20% Testing (2,000) / 10% Validation (1,000)</strong> protocol, and benchmark traditional machine learning (SVM), ensemble learning (Random Forest, XGBoost), and a 1D Convolutional Neural Network. XGBoost achieved a peak test accuracy of <strong>98.80%</strong> with near-zero false alarms.
        </p>
      </div>

      {/* System Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Dataset */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Database className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white">Dataset Specification</h3>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
            <li>&bull; <strong className="text-white">Source:</strong> AI4I 2020 Predictive Maintenance</li>
            <li>&bull; <strong className="text-white">Total Records:</strong> 10,000 industrial cycles</li>
            <li>&bull; <strong className="text-white">Classes:</strong> 6 condition states (No Failure + 5 Failure Modes)</li>
            <li>&bull; <strong className="text-white">Sensor Channels:</strong> 5 primary + 3 derived physics</li>
            <li>&bull; <strong className="text-white">Quality Types:</strong> L (60%), M (30%), H (10%)</li>
          </ul>
        </div>

        {/* Card 2: 70/20/10 Split */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-purple-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white">Partitioning Protocol</h3>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
            <li>&bull; <strong className="text-white">Training:</strong> 70% (7,000 records)</li>
            <li>&bull; <strong className="text-white">Testing:</strong> 20% (2,000 records holdout)</li>
            <li>&bull; <strong className="text-white">Validation:</strong> 10% (1,000 records tuning)</li>
            <li>&bull; <strong className="text-white">Stratification:</strong> Uniform minority class representation</li>
            <li>&bull; <strong className="text-white">Data Leakage:</strong> Strict separation verified</li>
          </ul>
        </div>

        {/* Card 3: Technology Stack */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <Code2 className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white">Technology Stack</h3>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
            <li>&bull; <strong className="text-white">Frontend:</strong> React 18, TypeScript, Tailwind CSS</li>
            <li>&bull; <strong className="text-white">3D Digital Twin:</strong> Three.js (WebGL Spindle)</li>
            <li>&bull; <strong className="text-white">Charts:</strong> Recharts & SVG Telemetry Plots</li>
            <li>&bull; <strong className="text-white">ML Models:</strong> XGBoost, Scikit-Learn, 1D CNN</li>
            <li>&bull; <strong className="text-white">Backend API:</strong> Python FastAPI (optional connector)</li>
          </ul>
        </div>
      </div>

      {/* Citations & Benchmark Reference */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-300">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          Academic Reference & Citation
        </h3>
        <p className="text-slate-400 leading-relaxed font-mono">
          Matzka, S. (2020). "Explainable Artificial Intelligence for Predictive Maintenance Applications." In Third International Conference on Artificial Intelligence for Industries (AI4I 2020), IEEE, pp. 69-74. Irvine, CA: UCI Machine Learning Repository.
        </p>
      </div>
    </div>
  );
};
