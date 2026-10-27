import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ReferenceLine
} from 'recharts';
import { ZoomIn, ZoomOut, RotateCcw, Download, Eye, Layers, Compass } from 'lucide-react';
import { SignalSample } from '../../types';

interface SignalVisualizerProps {
  signal: SignalSample;
  height?: number;
  showControls?: boolean;
}

type ViewMode = 'combined' | 'i-only' | 'q-only' | 'constellation';

export const SignalVisualizer: React.FC<SignalVisualizerProps> = ({
  signal,
  height = 300,
  showControls = true
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('combined');
  const [sampleRange, setSampleRange] = useState<[number, number]>([0, 128]);

  const rawData = useMemo(() => {
    const points = [];
    const len = Math.min(signal.i.length, signal.q.length, 128);
    for (let idx = 0; idx < len; idx++) {
      const iVal = signal.i[idx];
      const qVal = signal.q[idx];
      const mag = Math.sqrt(iVal * iVal + qVal * qVal);
      const phaseRad = Math.atan2(qVal, iVal);
      const phaseDeg = (phaseRad * 180) / Math.PI;

      points.push({
        sample: idx,
        i: iVal,
        q: qVal,
        mag: Number(mag.toFixed(4)),
        phase: Number(phaseDeg.toFixed(1))
      });
    }
    return points;
  }, [signal]);

  const filteredData = useMemo(() => {
    return rawData.filter(d => d.sample >= sampleRange[0] && d.sample < sampleRange[1]);
  }, [rawData, sampleRange]);

  const handleResetZoom = () => {
    setSampleRange([0, 128]);
  };

  const handleZoomIn = () => {
    const currentSpan = sampleRange[1] - sampleRange[0];
    if (currentSpan > 32) {
      const mid = Math.floor((sampleRange[0] + sampleRange[1]) / 2);
      const half = Math.floor(currentSpan / 3);
      setSampleRange([Math.max(0, mid - half), Math.min(128, mid + half)]);
    }
  };

  const handleZoomOut = () => {
    const currentSpan = sampleRange[1] - sampleRange[0];
    const mid = Math.floor((sampleRange[0] + sampleRange[1]) / 2);
    const half = Math.min(64, Math.floor(currentSpan * 0.8));
    setSampleRange([Math.max(0, mid - half), Math.min(128, mid + half)]);
  };

  const exportSignalJson = () => {
    const exportObj = {
      name: signal.name,
      modulation: signal.modulation,
      snr: signal.snr,
      totalSamples: signal.i.length,
      i_samples: signal.i,
      q_samples: signal.q,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${signal.modulation}_${signal.snr}dB_128samples.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col bg-slate-900/60 rounded-xl border border-slate-800 p-4">
      {/* Header with Mode Selection & Controls */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 mb-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('combined')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'combined'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Combined I/Q
            </button>
            <button
              onClick={() => setViewMode('i-only')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'i-only'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              I Channel
            </button>
            <button
              onClick={() => setViewMode('q-only')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'q-only'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              Q Channel
            </button>
            <button
              onClick={() => setViewMode('constellation')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'constellation'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              I/Q Phase Plot
            </button>
          </div>

          {/* Quick Zoom & Export Actions */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              Samples [{sampleRange[0]}..{sampleRange[1] - 1}]
            </span>
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1.5 rounded-md bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700/60"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1.5 rounded-md bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700/60"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset Zoom"
              className="p-1.5 rounded-md bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700/60"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={exportSignalJson}
              title="Export Signal Data (JSON)"
              className="px-2 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-750 text-slate-300 text-xs font-mono border border-slate-700/60 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Export</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Plot Area */}
      <div style={{ height: `${height}px` }} className="w-full">
        {viewMode !== 'constellation' ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 10, right: 20, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis
                dataKey="sample"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                domain={['dataMin', 'dataMax']}
                unit=""
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                domain={[-2.2, 2.2]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090e1a',
                  borderColor: '#1e293b',
                  borderRadius: '8px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  fontSize: '12px'
                }}
                labelFormatter={(value) => `Sample #${value}`}
                formatter={(val: any, name: any) => [
                  Number(val).toFixed(4),
                  name === 'i' ? 'In-Phase I(t)' : 'Quadrature Q(t)'
                ]}
              />
              <ReferenceLine y={0} stroke="#334155" strokeDasharray="2 2" />

              {(viewMode === 'combined' || viewMode === 'i-only') && (
                <Line
                  type="monotone"
                  dataKey="i"
                  stroke="#38bdf8"
                  strokeWidth={1.8}
                  dot={false}
                  activeDot={{ r: 4, stroke: '#38bdf8', fill: '#0284c7' }}
                  isAnimationActive={false}
                  name="i"
                />
              )}

              {(viewMode === 'combined' || viewMode === 'q-only') && (
                <Line
                  type="monotone"
                  dataKey="q"
                  stroke="#10b981"
                  strokeWidth={1.8}
                  dot={false}
                  activeDot={{ r: 4, stroke: '#10b981', fill: '#059669' }}
                  isAnimationActive={false}
                  name="q"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          /* Constellation / Polar I vs Q Scatter Chart */
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis
                type="number"
                dataKey="i"
                name="In-Phase (I)"
                stroke="#64748b"
                domain={[-2.2, 2.2]}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="q"
                name="Quadrature (Q)"
                stroke="#64748b"
                domain={[-2.2, 2.2]}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090e1a',
                  borderColor: '#1e293b',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: any, name: any) => [Number(value).toFixed(4), name]}
              />
              <ReferenceLine x={0} stroke="#334155" strokeWidth={1} />
              <ReferenceLine y={0} stroke="#334155" strokeWidth={1} />
              <Scatter
                name="I/Q Points"
                data={filteredData}
                fill="#a855f7"
                line={{ stroke: '#8b5cf6', strokeWidth: 1, strokeOpacity: 0.4 }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Signal Legend & Legend Indicator */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60 mt-1">
        <div className="flex items-center gap-4">
          {(viewMode === 'combined' || viewMode === 'i-only') && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-sky-400 rounded-full" />
              <span className="font-mono text-slate-300">I (In-Phase)</span>
            </div>
          )}
          {(viewMode === 'combined' || viewMode === 'q-only') && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-400 rounded-full" />
              <span className="font-mono text-slate-300">Q (Quadrature)</span>
            </div>
          )}
          {viewMode === 'constellation' && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="font-mono text-purple-300">Complex Plane Trajectory (I vs Q)</span>
            </div>
          )}
        </div>
        <div className="font-mono text-[11px] text-slate-500">
          RadioML 2016.10A Frame (128 complex samples)
        </div>
      </div>
    </div>
  );
};
