import React, { useState } from 'react';
import { 
  TrendingUp, 
  Zap, 
  Flame, 
  Gauge, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Info,
  Sliders
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line, 
  ReferenceLine, 
  Area, 
  AreaChart,
  Cell
} from 'recharts';
import { NavigationPage } from '../../types';

interface OperatingEnvelopeViewProps {
  onNavigate: (page: NavigationPage) => void;
}

export const OperatingEnvelopeView: React.FC<OperatingEnvelopeViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'power' | 'toolwear' | 'thermal'>('power');

  // Synthetic points representing Torque vs Speed operating space
  const powerEnvelopePoints = [
    { speed: 1200, torque: 25, power: 3141, status: 'Underpower (PWF)', color: '#ef4444' },
    { speed: 1350, torque: 35, power: 4948, status: 'Normal', color: '#10b981' },
    { speed: 1450, torque: 42, power: 6377, status: 'Normal', color: '#10b981' },
    { speed: 1550, torque: 40, power: 6492, status: 'Normal', color: '#10b981' },
    { speed: 1650, torque: 38, power: 6565, status: 'Normal', color: '#10b981' },
    { speed: 1800, torque: 30, power: 5654, status: 'Normal', color: '#10b981' },
    { speed: 2000, torque: 26, power: 5445, status: 'Normal', color: '#10b981' },
    { speed: 2200, torque: 22, power: 5068, status: 'Normal', color: '#10b981' },
    { speed: 2500, torque: 18, power: 4712, status: 'Normal', color: '#10b981' },
    { speed: 2800, torque: 12, power: 3518, status: 'Near Stall Boundary', color: '#f59e0b' },
    { speed: 1400, torque: 68, power: 9969, status: 'Overpower (PWF)', color: '#ef4444' },
    { speed: 1700, torque: 58, power: 10325, status: 'Overpower (PWF)', color: '#ef4444' },
    { speed: 1300, torque: 20, power: 2722, status: 'Underpower (PWF)', color: '#ef4444' }
  ];

  // Tool wear curve: Minutes vs Cumulative Wear & Failure Risk %
  const toolWearLifecycle = [
    { time: 0, wearNorm: 0, failureProb: 0.1, phase: 'Break-in' },
    { time: 30, wearNorm: 15, failureProb: 0.2, phase: 'Steady State' },
    { time: 60, wearNorm: 32, failureProb: 0.4, phase: 'Steady State' },
    { time: 90, wearNorm: 48, failureProb: 0.8, phase: 'Steady State' },
    { time: 120, wearNorm: 65, failureProb: 1.5, phase: 'Steady State' },
    { time: 150, wearNorm: 84, failureProb: 3.2, phase: 'Steady State' },
    { time: 180, wearNorm: 105, failureProb: 8.5, phase: 'Accelerated' },
    { time: 200, wearNorm: 130, failureProb: 35.0, phase: 'Critical Limit' },
    { time: 220, wearNorm: 165, failureProb: 72.0, phase: 'Severe Failure' },
    { time: 240, wearNorm: 210, failureProb: 94.0, phase: 'Total Failure' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Operating Envelopes & Physical Boundary Analysis
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Multivariate stress boundaries governing mechanical power, tool degradation lifecycle, and thermal dissipation.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('power')}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
              activeTab === 'power'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Power Envelope
          </button>
          <button
            onClick={() => setActiveTab('toolwear')}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
              activeTab === 'toolwear'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tool Wear Lifecycle
          </button>
          <button
            onClick={() => setActiveTab('thermal')}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
              activeTab === 'thermal'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Thermal Dissipation
          </button>
        </div>
      </div>

      {/* Main Interactive Chart Section */}
      {activeTab === 'power' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-rose-400" />
                Torque vs Rotational Speed Power Envelope
              </h2>
              <p className="text-xs text-slate-400">
                Safe operational corridor: 3,500 W &le; P = &tau;&middot;(2&pi;&middot;rpm / 60) &le; 9,000 W
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Safe Power
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Failure Point
              </span>
            </div>
          </div>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  type="number" 
                  dataKey="speed" 
                  name="Speed" 
                  unit=" rpm" 
                  stroke="#64748b" 
                  domain={[1000, 3000]} 
                  fontSize={11}
                />
                <YAxis 
                  type="number" 
                  dataKey="torque" 
                  name="Torque" 
                  unit=" Nm" 
                  stroke="#64748b" 
                  domain={[0, 80]} 
                  fontSize={11}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs font-mono shadow-xl space-y-1">
                          <div className="font-bold text-white">{data.status}</div>
                          <div className="text-cyan-400">Speed: {data.speed} rpm</div>
                          <div className="text-purple-400">Torque: {data.torque} Nm</div>
                          <div className="text-white">Mechanical Power: {data.power.toLocaleString()} W</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Operating Points" data={powerEnvelopePoints} fill="#06b6d4">
                  {powerEnvelopePoints.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-mono text-rose-400 font-bold">Underpower &lt; 3,500 W</span>
              <p className="text-slate-400 mt-1">Spindle stall or motor controller current collapse under cutting resistance.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-mono text-emerald-400 font-bold">Stable Envelope [3,500 - 9,000 W]</span>
              <p className="text-slate-400 mt-1">Continuous machining operation with balanced spindle motor torque delivery.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-mono text-rose-400 font-bold">Overpower &gt; 9,000 W</span>
              <p className="text-slate-400 mt-1">Thermal circuit trip, stator overload, or instantaneous cutting jam.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'toolwear' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-400" />
              Tool Wear Degradation Curve & Failure Probability Trajectory
            </h2>
            <p className="text-xs text-slate-400">
              Progression from initial break-in wear (0-30 min) to critical catastrophic failure threshold (200-240 min).
            </p>
          </div>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={toolWearLifecycle} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <defs>
                  <linearGradient id="wearGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} unit=" min" />
                <YAxis stroke="#64748b" fontSize={11} unit="%" domain={[0, 100]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs font-mono shadow-xl space-y-1">
                          <div className="font-bold text-white">{data.phase}</div>
                          <div className="text-cyan-400">Cutting Time: {data.time} min</div>
                          <div className="text-rose-400">Failure Probability: {data.failureProb}%</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine x={200} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: '200 min Limit', fill: '#f43f5e', fontSize: 10 }} />
                <Area type="monotone" dataKey="failureProb" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#wearGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'thermal' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Thermal Dissipation Gradient & Rotational Airflow
            </h2>
            <p className="text-xs text-slate-400">
              Coupling between convective fan cooling (proportional to RPM) and temperature differential &Delta;T.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="font-mono text-cyan-300 font-bold uppercase">Governing Thermal Balance:</div>
            <p className="leading-relaxed">
              At low spindle speeds (&lt; 1,380 rpm), the mechanical shaft fan cannot generate sufficient forced air convection. If process heating causes &Delta;T (Process - Air) to shrink below 8.6 Kelvin, the thermal boundary layer collapses, creating the Heat Dissipation Failure (HDF) condition.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
