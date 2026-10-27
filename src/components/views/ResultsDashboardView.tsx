import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Award, 
  Layers, 
  Cpu, 
  HelpCircle,
  ArrowRight,
  Filter,
  Sparkles,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell, 
  Legend 
} from 'recharts';
import { MODEL_BENCHMARKS, MODEL_SPLIT_REPORTS } from '../../data/modelMetrics';
import { ModelId, DatasetSplitType, NavigationPage } from '../../types';

interface ResultsDashboardViewProps {
  onNavigate: (page: NavigationPage) => void;
}

export const ResultsDashboardView: React.FC<ResultsDashboardViewProps> = ({ onNavigate }) => {
  const [activeSplitTab, setActiveSplitTab] = useState<'all' | DatasetSplitType>('testing');
  const [selectedModelId, setSelectedModelId] = useState<'all' | ModelId>('all');

  // Multi-split comparative data for grouped bar chart
  const multiSplitChartData = MODEL_BENCHMARKS.map((m) => ({
    name: m.shortName,
    training: m.trainAccuracy,
    testing: m.testAccuracy,
    validation: m.valAccuracy,
    color: m.color
  }));

  // Selected single-split data
  const singleSplitData = MODEL_BENCHMARKS.map((m) => {
    let acc = m.valAccuracy;
    let f1 = m.macroF1;
    if (activeSplitTab === 'training') {
      acc = m.trainAccuracy;
      f1 = m.trainMacroF1;
    } else if (activeSplitTab === 'testing') {
      acc = m.testAccuracy;
      f1 = m.testMacroF1;
    }
    return {
      name: m.shortName,
      accuracy: acc,
      macroF1: f1,
      color: m.color
    };
  });

  const activeModelReport = selectedModelId !== 'all' ? MODEL_SPLIT_REPORTS[selectedModelId] : null;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Model Evaluation & Separate Split Outputs
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Independent performance outputs for Training (70%), Testing (20%), and Validation (10%) partitions across every model.
          </p>
        </div>

        {/* Dataset Split Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'all', label: 'All Splits Compared' },
            { id: 'training', label: 'Training (70%)' },
            { id: 'testing', label: 'Testing (20%)' },
            { id: 'validation', label: 'Validation (10%)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSplitTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                activeSplitTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Model Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span>Filter by Model Architecture:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {[
            { id: 'all', label: 'All 4 Models' },
            { id: 'xgboost', label: 'XGBoost' },
            { id: 'rf', label: 'Random Forest' },
            { id: 'cnn', label: '1D CNN (Deep)' },
            { id: 'svm', label: 'SVM (RBF)' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModelId(m.id as any)}
              className={`px-3 py-1 rounded-lg border transition-all ${
                selectedModelId === m.id
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-600 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Split Details Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border transition-all ${
          activeSplitTab === 'training' || activeSplitTab === 'all'
            ? 'bg-cyan-950/30 border-cyan-500/40 shadow-md'
            : 'bg-slate-900/40 border-slate-800 opacity-60'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Training Split (70%)</span>
            <span className="text-xs font-mono font-bold text-white">7,000 Cycles</span>
          </div>
          <div className="text-sm font-semibold text-slate-200 mt-1">6,756 Normal &bull; 244 Failure Cycles</div>
          <p className="text-[11px] text-slate-400 mt-1">Tree partitioning, gradient parameter updates & hyperplane fitting.</p>
        </div>

        <div className={`p-4 rounded-xl border transition-all ${
          activeSplitTab === 'testing' || activeSplitTab === 'all'
            ? 'bg-rose-950/30 border-rose-500/40 shadow-md'
            : 'bg-slate-900/40 border-slate-800 opacity-60'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">Testing Split (20%)</span>
            <span className="text-xs font-mono font-bold text-white">2,000 Cycles</span>
          </div>
          <div className="text-sm font-semibold text-slate-200 mt-1">1,930 Normal &bull; 70 Failure Cycles</div>
          <p className="text-[11px] text-slate-400 mt-1">Completely unseen hold-out evaluation for final test confusion matrix.</p>
        </div>

        <div className={`p-4 rounded-xl border transition-all ${
          activeSplitTab === 'validation' || activeSplitTab === 'all'
            ? 'bg-purple-950/30 border-purple-500/40 shadow-md'
            : 'bg-slate-900/40 border-slate-800 opacity-60'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">Validation Split (10%)</span>
            <span className="text-xs font-mono font-bold text-white">1,000 Cycles</span>
          </div>
          <div className="text-sm font-semibold text-slate-200 mt-1">966 Normal &bull; 34 Failure Cycles</div>
          <p className="text-[11px] text-slate-400 mt-1">Hyperparameter selection, tree depth tuning & early stopping patience.</p>
        </div>
      </div>

      {/* Main Comparative Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              {activeSplitTab === 'all'
                ? 'Model Accuracy Comparison Across All 3 Splits'
                : `Model Performance on ${activeSplitTab.toUpperCase()} Data`}
            </h2>
            <p className="text-xs text-slate-400">
              {activeSplitTab === 'all'
                ? 'Shows Training (70%), Testing (20%), and Validation (10%) accuracies for each model'
                : `Accuracy and Macro F1 benchmarked on the ${activeSplitTab} partition`}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            {activeSplitTab === 'all' ? (
              <>
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" /> Train 70%
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-400" /> Test 20%
                </span>
                <span className="flex items-center gap-1.5 text-purple-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-purple-400" /> Val 10%
                </span>
              </>
            ) : null}
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeSplitTab === 'all' ? (
              <BarChart data={multiSplitChartData} margin={{ top: 15, right: 15, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" domain={[95, 100]} fontSize={11} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs font-mono shadow-xl space-y-1">
                          <div className="font-bold text-white text-sm">{d.name}</div>
                          <div className="text-cyan-400">Training (70%): {d.training.toFixed(2)}%</div>
                          <div className="text-rose-400">Testing (20%): {d.testing.toFixed(2)}%</div>
                          <div className="text-purple-400">Validation (10%): {d.validation.toFixed(2)}%</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="training" name="Training (70%)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="testing" name="Testing (20%)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="validation" name="Validation (10%)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={singleSplitData} margin={{ top: 15, right: 15, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" domain={[95, 100]} fontSize={11} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs font-mono shadow-xl space-y-1">
                          <div className="font-bold text-white">{d.name}</div>
                          <div className="text-cyan-400">Accuracy: {d.accuracy.toFixed(2)}%</div>
                          <div className="text-emerald-400">Macro F1: {d.macroF1.toFixed(4)}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                  {singleSplitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Split Table */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          Model Output Metrics Table Across Partitions
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-mono text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4">Category</th>
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
                <tr key={m.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                    {m.name}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-400">{m.category}</td>
                  <td className="py-3 px-4 text-cyan-400 font-bold">{m.trainAccuracy.toFixed(2)}%</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{m.testAccuracy.toFixed(2)}%</td>
                  <td className="py-3 px-4 text-purple-400 font-bold">{m.valAccuracy.toFixed(2)}%</td>
                  <td className="py-3 px-4 text-white font-bold">{m.testMacroF1.toFixed(4)}</td>
                  <td className="py-3 px-4 text-slate-300">{m.rocAuc.toFixed(3)}</td>
                  <td className="py-3 px-4 text-slate-400">{m.generalizationGap.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-Class Breakdown when a model is selected or default XGBoost */}
      {(() => {
        const targetModel = selectedModelId !== 'all' ? selectedModelId : 'xgboost';
        const report = MODEL_SPLIT_REPORTS[targetModel];
        const splitDetail = activeSplitTab === 'all' ? report.testing : report[activeSplitTab];

        return (
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: report.color }} />
                  Per-Class Performance: {report.modelName}
                </h3>
                <p className="text-xs text-slate-400">
                  Partition: <span className="text-cyan-400 font-mono uppercase font-bold">{activeSplitTab === 'all' ? 'testing' : activeSplitTab}</span> ({splitDetail.sampleCount.toLocaleString()} samples)
                </p>
              </div>

              <button
                onClick={() => onNavigate('confusion-matrix')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                Inspect Full 6x6 Confusion Matrix <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 font-mono text-[11px] text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Class Name</th>
                    <th className="py-2.5 px-4">Precision</th>
                    <th className="py-2.5 px-4">Recall</th>
                    <th className="py-2.5 px-4">F1-Score</th>
                    <th className="py-2.5 px-4">Support</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {splitDetail.classMetrics.map((cm) => (
                    <tr key={cm.className} className="hover:bg-slate-850/50">
                      <td className="py-2.5 px-4 font-semibold text-white font-sans">{cm.className}</td>
                      <td className="py-2.5 px-4 text-cyan-300">{(cm.precision * 100).toFixed(1)}%</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">{(cm.recall * 100).toFixed(1)}%</td>
                      <td className="py-2.5 px-4 text-white">{(cm.f1Score * 100).toFixed(1)}%</td>
                      <td className="py-2.5 px-4 text-slate-400">{cm.support.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
