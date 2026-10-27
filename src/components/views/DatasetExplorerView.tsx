import React, { useState, useMemo } from 'react';
import { 
  Database, 
  BarChart2, 
  PieChart as PieIcon, 
  Search, 
  Filter, 
  ArrowRight, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  Download,
  Flame,
  Zap,
  Gauge,
  Wrench,
  HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { DATASET_STATS, SPLIT_DISTRIBUTION, PRESET_TELEMETRY_SAMPLES } from '../../data/datasetInfo';
import { TelemetryRecord, FailureType, MachineType, NavigationPage } from '../../types';

interface DatasetExplorerViewProps {
  onSelectTelemetry: (telemetry: TelemetryRecord) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const DatasetExplorerView: React.FC<DatasetExplorerViewProps> = ({
  onSelectTelemetry,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFailureFilter, setSelectedFailureFilter] = useState<'ALL' | FailureType>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'ALL' | MachineType>('ALL');

  // Filtered samples
  const filteredRecords = useMemo(() => {
    return PRESET_TELEMETRY_SAMPLES.filter((rec) => {
      const matchSearch = rec.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rec.failureType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFailure = selectedFailureFilter === 'ALL' || rec.failureType === selectedFailureFilter;
      const matchType = selectedTypeFilter === 'ALL' || rec.type === selectedTypeFilter;
      return matchSearch && matchFailure && matchType;
    });
  }, [searchTerm, selectedFailureFilter, selectedTypeFilter]);

  const failureChartData = useMemo(() => {
    return DATASET_STATS.failureBreakdown.map((f) => ({
      name: f.className.replace(' Failure', '').replace(' Failures', ''),
      count: f.count,
      fullName: f.className,
      color: f.color,
      pct: f.percentage
    }));
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Dataset Explorer & Telemetry Repository
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            AI4I 2020 Predictive Maintenance Dataset ({DATASET_STATS.totalRecords.toLocaleString()} industrial milling telemetry records).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            Source: <strong className="text-cyan-400">archive.zip / predictive_maintenance.csv</strong>
          </span>
        </div>
      </div>

      {/* Dataset Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-mono text-slate-500 uppercase">Total Machine Cycles</span>
          <div className="text-2xl font-bold text-white font-mono mt-1">10,000</div>
          <div className="text-[11px] text-cyan-400 mt-0.5">Synthetic Milling Machine Runs</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-mono text-slate-500 uppercase">Training Partition</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">70%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">7,000 Records for Training</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-mono text-slate-500 uppercase">Testing / Val Partition</span>
          <div className="text-2xl font-bold text-purple-400 font-mono mt-1">20% / 10%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">2,000 Test | 1,000 Validation</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-mono text-slate-500 uppercase">Failure Class Imbalance</span>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-1">3.48%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">348 Total Failures / 9,652 Normal</div>
        </div>
      </div>

      {/* Charts Grid: Class Distribution & 70/20/10 Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Class Distribution Chart */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              Failure Mode Distribution (6 Classes)
            </h2>
            <span className="text-xs font-mono text-slate-400">Total: 10,000</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failureChartData} margin={{ top: 15, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={10} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={11} scale="log" domain={['auto', 'auto']} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs shadow-xl font-mono">
                          <div className="font-bold text-white">{data.fullName}</div>
                          <div className="text-cyan-400 mt-1">Count: {data.count.toLocaleString()}</div>
                          <div className="text-slate-400">Share: {data.pct}% of dataset</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {failureChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-500 font-mono text-center">
            Logarithmic scale applied to visualize rare failure modes alongside 9,652 normal samples.
          </div>
        </div>

        {/* Split Partitioning Visualization */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-purple-400" />
              Dataset Partitioning Protocol
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Exact 70% Training, 20% Testing, and 10% Validation stratification.
            </p>
          </div>

          <div className="space-y-3">
            {SPLIT_DISTRIBUTION.map((split, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: split.color }} />
                    {split.name}
                  </span>
                  <span className="font-mono font-bold" style={{ color: split.color }}>
                    {split.count.toLocaleString()} records ({split.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${split.percentage}%`, backgroundColor: split.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-slate-300 space-y-1">
            <div className="font-semibold text-cyan-300 font-mono">Stratification Guarantee:</div>
            <div>All 6 failure classes are partitioned uniformly across Train, Test, and Validation to maintain balanced failure representations.</div>
          </div>
        </div>
      </div>

      {/* Sensor Statistics Table */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          Primary Sensor Ranges & Dataset Statistics
        </h2>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-mono text-slate-400 border-b border-slate-800 uppercase">
              <tr>
                <th className="py-3 px-4">Sensor Feature</th>
                <th className="py-3 px-4">Physical Unit</th>
                <th className="py-3 px-4">Min</th>
                <th className="py-3 px-4">Max</th>
                <th className="py-3 px-4">Mean (&mu;)</th>
                <th className="py-3 px-4">Std Dev (&sigma;)</th>
                <th className="py-3 px-4">Normalizing Scaler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {DATASET_STATS.sensorFeatures.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{s.name}</td>
                  <td className="py-3 px-4 text-cyan-400">{s.unit}</td>
                  <td className="py-3 px-4">{s.min}</td>
                  <td className="py-3 px-4">{s.max}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{s.mean}</td>
                  <td className="py-3 px-4 text-slate-400">&plusmn;{s.std}</td>
                  <td className="py-3 px-4 text-slate-400 font-sans">Z-score StandardScaler</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Records Explorer Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              Machine Records Explorer & Diagnostic Loader
            </h2>
            <p className="text-xs text-slate-400">Search and select any real sample from predictive_maintenance.csv to test in the live pipeline.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search Product ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />

            <select
              value={selectedFailureFilter}
              onChange={(e) => setSelectedFailureFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="ALL">All Failures</option>
              <option value="No Failure">No Failure</option>
              <option value="Heat Dissipation Failure">Heat Dissipation</option>
              <option value="Power Failure">Power Failure</option>
              <option value="Overstrain Failure">Overstrain</option>
              <option value="Tool Wear Failure">Tool Wear</option>
              <option value="Random Failures">Random Failures</option>
            </select>

            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="ALL">All Types</option>
              <option value="L">Type L (Low)</option>
              <option value="M">Type M (Med)</option>
              <option value="H">Type H (High)</option>
            </select>
          </div>
        </div>

        {/* Table of records */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-mono text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">UDI / ID</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Air Temp</th>
                <th className="py-2.5 px-3">Process Temp</th>
                <th className="py-2.5 px-3">Speed</th>
                <th className="py-2.5 px-3">Torque</th>
                <th className="py-2.5 px-3">Tool Wear</th>
                <th className="py-2.5 px-3">Ground Truth Class</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {filteredRecords.map((rec) => (
                <tr key={rec.udi} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white">#{rec.udi} ({rec.productId})</td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-cyan-300 border border-slate-700">
                      Type {rec.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">{rec.airTemp} K</td>
                  <td className="py-2.5 px-3">{rec.processTemp} K</td>
                  <td className="py-2.5 px-3">{rec.speed} rpm</td>
                  <td className="py-2.5 px-3">{rec.torque} Nm</td>
                  <td className="py-2.5 px-3">{rec.toolWear} min</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                      rec.failureType === 'No Failure'
                        ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40'
                        : rec.failureType === 'Heat Dissipation Failure'
                        ? 'border-amber-500/40 text-amber-400 bg-amber-950/40'
                        : rec.failureType === 'Power Failure'
                        ? 'border-rose-500/40 text-rose-400 bg-rose-950/40'
                        : rec.failureType === 'Overstrain Failure'
                        ? 'border-purple-500/40 text-purple-400 bg-purple-950/40'
                        : rec.failureType === 'Tool Wear Failure'
                        ? 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40'
                        : 'border-pink-500/40 text-pink-400 bg-pink-950/40'
                    }`}>
                      {rec.failureType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => {
                        onSelectTelemetry(rec);
                        onNavigate('prediction');
                      }}
                      className="px-2.5 py-1 rounded-md bg-cyan-600/30 hover:bg-cyan-600 text-cyan-200 hover:text-white border border-cyan-500/40 text-[11px] font-sans font-medium transition-colors inline-flex items-center gap-1"
                    >
                      Diagnose <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
