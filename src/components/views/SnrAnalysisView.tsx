import React, { useState } from 'react';
import { 
  TrendingUp, 
  Layers, 
  Sliders, 
  HelpCircle, 
  Volume2, 
  Activity, 
  Info,
  ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { SNR_DATA, SNR_EXPLANATION } from '../../data/snrData';
import { WaveformThumbnail } from '../signal/WaveformThumbnail';
import { generateSignal } from '../../utils/signalGenerator';
import { SignalVisualizer } from '../signal/SignalVisualizer';
import { NavigationPage } from '../../types';

interface SnrAnalysisViewProps {
  onNavigate: (page: NavigationPage) => void;
}

type ModelFilter = 'all' | 'cnn' | 'svm' | 'rf' | 'xgboost' | 'classes';

export const SnrAnalysisView: React.FC<SnrAnalysisViewProps> = ({ onNavigate }) => {
  const [modelFilter, setModelFilter] = useState<ModelFilter>('all');
  const [interactiveSnr, setInteractiveSnr] = useState<number>(0);

  // Generate dynamic noisy signal based on interactive slider
  const noiseSignal = React.useMemo(() => {
    return generateSignal('AM-DSB', interactiveSnr, 0.4);
  }, [interactiveSnr]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Signal-to-Noise Ratio (SNR) Performance Analysis
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Analyzing classification accuracy across thermal noise variations spanning -20 dB to +18 dB.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300">
            SNR Range: <strong className="text-white">-20 dB to +18 dB (2 dB Step)</strong>
          </span>
        </div>
      </div>

      {/* SNR Definition & Fundamental Concept */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs space-y-1">
          <div className="font-bold text-slate-200 font-mono">
            Understanding SNR (Signal-to-Noise Ratio) in Radio Machine Learning
          </div>
          <p className="text-slate-400 leading-relaxed">
            "Lower SNR means the signal is more affected by noise. Classification generally becomes more difficult as SNR decreases." At -20 dB, thermal noise power is 100 times stronger than the signal power, rendering carrier phase and amplitude unrecognizable from pure AWGN.
          </p>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-semibold tracking-wider font-mono text-slate-200 uppercase">
              Accuracy vs SNR Curve
            </h2>
            <p className="text-xs text-slate-400">Hover points to view exact validation accuracy at each decibel.</p>
          </div>

          {/* Model Toggle Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            {[
              { id: 'all', label: 'All Models' },
              { id: 'cnn', label: '1D CNN' },
              { id: 'svm', label: 'SVM (RBF)' },
              { id: 'xgboost', label: 'XGBoost' },
              { id: 'rf', label: 'Random Forest' },
              { id: 'classes', label: 'Per-Class Curves' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setModelFilter(btn.id as ModelFilter)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                  modelFilter === btn.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Line Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SNR_DATA} margin={{ top: 10, right: 30, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis
                dataKey="snr"
                stroke="#64748b"
                tick={{ fill: '#cbd5e1', fontSize: 11 }}
                unit="dB"
              />
              <YAxis
                domain={[25, 100]}
                stroke="#64748b"
                tick={{ fill: '#cbd5e1', fontSize: 11 }}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090e1a',
                  borderColor: '#1e293b',
                  borderRadius: '8px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  fontSize: '12px'
                }}
                formatter={(val: any, name: any) => [`${val}%`, name]}
                labelFormatter={(l) => `SNR = ${l} dB`}
              />
              {/* Random Guess Reference Line at 33.3% */}
              <ReferenceLine
                y={33.3}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{ value: 'Random Guess Floor (33.3%)', fill: '#f87171', fontSize: 10, position: 'insideBottomRight' }}
              />

              {/* Models Lines */}
              {(modelFilter === 'all' || modelFilter === 'cnn') && (
                <Line
                  type="monotone"
                  dataKey="cnn"
                  name="1D CNN (Deep)"
                  stroke="#06b6d4"
                  strokeWidth={2.6}
                  dot={{ r: 3, fill: '#06b6d4' }}
                  activeDot={{ r: 6 }}
                />
              )}

              {(modelFilter === 'all' || modelFilter === 'svm') && (
                <Line
                  type="monotone"
                  dataKey="svm"
                  name="SVM (RBF)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: '#3b82f6' }}
                  activeDot={{ r: 5 }}
                />
              )}

              {(modelFilter === 'all' || modelFilter === 'xgboost') && (
                <Line
                  type="monotone"
                  dataKey="xgboost"
                  name="XGBoost"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: '#8b5cf6' }}
                  activeDot={{ r: 5 }}
                />
              )}

              {(modelFilter === 'all' || modelFilter === 'rf') && (
                <Line
                  type="monotone"
                  dataKey="rf"
                  name="Random Forest"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: '#10b981' }}
                  activeDot={{ r: 5 }}
                />
              )}

              {/* Class-Specific Lines */}
              {modelFilter === 'classes' && (
                <>
                  <Line
                    type="monotone"
                    dataKey="amSsb"
                    name="AM-SSB (Class 1)"
                    stroke="#10b981"
                    strokeWidth={2.4}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amDsb"
                    name="AM-DSB (Class 0)"
                    stroke="#38bdf8"
                    strokeWidth={2.4}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="wbfm"
                    name="WBFM (Class 2)"
                    stroke="#f59e0b"
                    strokeWidth={2.4}
                    dot={{ r: 3 }}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Three Performance Regimes Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-xs font-mono font-bold text-rose-400">1. Noise Cliff (-20 to -10 dB)</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Thermal noise completely masks the carrier. All classifiers perform near 33.3% random guess floor.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-xs font-mono font-bold text-amber-400">2. Knee Transition (-8 to 0 dB)</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Rapid accuracy ascent as envelope dynamics emerge. AM-SSB surges to &gt;95% accuracy while 1D CNN reaches 77%.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-xs font-mono font-bold text-emerald-400">3. Saturation Region (+2 to +18 dB)</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              High signal clarity where CNN reaches 93.9% peak accuracy. AM-SSB achieves 99.6% accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* Educational Interactive Noise Visualizer */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Interactive Noise Degradation Simulator
            </h2>
            <p className="text-xs text-slate-400">
              Drag the slider to observe how white Gaussian noise disrupts the carrier envelope in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">Current Noise Level:</span>
            <span className="text-sm font-mono font-bold px-3 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              {interactiveSnr >= 0 ? `+${interactiveSnr}` : interactiveSnr} dB SNR
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-xs font-mono text-rose-400 font-bold">-20 dB (Heavy Noise)</span>
          <input
            type="range"
            min="-20"
            max="18"
            step="2"
            value={interactiveSnr}
            onChange={(e) => setInteractiveSnr(Number(e.target.value))}
            className="flex-1 h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-xs font-mono text-emerald-400 font-bold">+18 dB (Clean Carrier)</span>
        </div>

        {/* Render Live Waveform of the dynamically synthesized noisy signal */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-slate-400 flex justify-between">
            <span>Live Degraded Waveform Preview</span>
            <span className="text-cyan-400">AM-DSB at {interactiveSnr} dB</span>
          </div>
          <SignalVisualizer signal={noiseSignal} height={200} showControls={false} />
        </div>
      </div>
    </div>
  );
};
