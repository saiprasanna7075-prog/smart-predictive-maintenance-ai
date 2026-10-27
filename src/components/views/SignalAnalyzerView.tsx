import React, { useState } from 'react';
import { 
  Activity, 
  Upload, 
  Sliders, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  Zap, 
  FileText, 
  ShieldCheck, 
  Check, 
  Cpu
} from 'lucide-react';
import { ModulationType, SignalSample, NavigationPage } from '../../types';
import { generateSignal, getPresetDemoSignals } from '../../utils/signalGenerator';
import { extractSignalFeatures } from '../../utils/featureExtractor';
import { SignalVisualizer } from '../signal/SignalVisualizer';

interface SignalAnalyzerViewProps {
  currentSignal: SignalSample;
  onSignalChange: (signal: SignalSample) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const SignalAnalyzerView: React.FC<SignalAnalyzerViewProps> = ({
  currentSignal,
  onSignalChange,
  onNavigate
}) => {
  const [selectedModulation, setSelectedModulation] = useState<ModulationType>(currentSignal.modulation);
  const [selectedSnr, setSelectedSnr] = useState<number>(currentSignal.snr);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const presets = React.useMemo(() => getPresetDemoSignals(), []);
  const features = React.useMemo(() => {
    return extractSignalFeatures(currentSignal.i, currentSignal.q);
  }, [currentSignal]);

  const handleGenerateSignal = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newSignal = generateSignal(selectedModulation, selectedSnr, Math.random() * Math.PI);
      onSignalChange(newSignal);
      setIsGenerating(false);
    }, 150);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        // Try parsing JSON
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed.i) && Array.isArray(parsed.q)) {
            const newSig: SignalSample = {
              id: `upload-${Date.now()}`,
              name: file.name.replace('.json', ''),
              modulation: parsed.modulation || selectedModulation,
              snr: parsed.snr !== undefined ? Number(parsed.snr) : selectedSnr,
              i: parsed.i.slice(0, 128),
              q: parsed.q.slice(0, 128),
              description: `Uploaded from ${file.name}`
            };
            onSignalChange(newSig);
            return;
          }
        }

        // CSV parsing: assuming lines formatted as i, q or two columns
        const lines = text.trim().split(/\r?\n/);
        const parsedI: number[] = [];
        const parsedQ: number[] = [];

        for (const line of lines) {
          const parts = line.split(/[,\t\s]+/).filter(Boolean);
          if (parts.length >= 2) {
            const valI = parseFloat(parts[0]);
            const valQ = parseFloat(parts[1]);
            if (!isNaN(valI) && !isNaN(valQ)) {
              parsedI.push(valI);
              parsedQ.push(valQ);
            }
          }
        }

        if (parsedI.length >= 16) {
          // Pad or slice to 128
          while (parsedI.length < 128) {
            parsedI.push(0);
            parsedQ.push(0);
          }
          const newSig: SignalSample = {
            id: `upload-${Date.now()}`,
            name: file.name,
            modulation: selectedModulation,
            snr: selectedSnr,
            i: parsedI.slice(0, 128),
            q: parsedQ.slice(0, 128),
            description: `Imported ${parsedI.length} raw time series data points`
          };
          onSignalChange(newSig);
        } else {
          setUploadError('Invalid format. Please supply at least 16 I/Q sample pairs in JSON or 2-column CSV.');
        }
      } catch (err) {
        setUploadError('Failed to parse signal file. Please provide valid JSON or CSV format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Interactive Signal Analyzer
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Synthesize, inspect, and extract spectral features from 128-sample In-Phase and Quadrature (I/Q) radio vectors.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={() => onNavigate('prediction')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs md:text-sm shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Zap className="w-4 h-4" />
          <span>Run Classification on This Signal</span>
        </button>
      </div>

      {/* Control Configuration Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Signal Controls Panel */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Signal Synthesis & Generator Controls
            </span>
            <span className="text-[11px] font-mono text-cyan-400">
              RadioML 2016.10A Standards
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Modulation Selector */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Target Modulation Type</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                {(['AM-DSB', 'AM-SSB', 'WBFM'] as ModulationType[]).map((mod) => (
                  <button
                    key={mod}
                    onClick={() => setSelectedModulation(mod)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium font-mono transition-all ${
                      selectedModulation === mod
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mod}
                  </button>
                ))}
              </div>
            </div>

            {/* SNR Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-medium text-slate-300">Signal-to-Noise Ratio (SNR)</label>
                <span className="font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                  {selectedSnr >= 0 ? `+${selectedSnr}` : selectedSnr} dB
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-500">-20 dB</span>
                <input
                  type="range"
                  min="-20"
                  max="18"
                  step="2"
                  value={selectedSnr}
                  onChange={(e) => setSelectedSnr(Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <span className="text-[10px] font-mono text-slate-500">+18 dB</span>
              </div>
            </div>
          </div>

          {/* Action Row: Generate Demo Signal or Upload */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateSignal}
                disabled={isGenerating}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center gap-2 shadow-md shadow-cyan-600/20 transition-all active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Generate Demo Signal</span>
              </button>

              {/* Upload Input */}
              <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs cursor-pointer border border-slate-700 flex items-center gap-2 transition-colors">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload I/Q File</span>
                <input
                  type="file"
                  accept=".json,.csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick Demo Presets Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">Presets:</span>
              <div className="flex items-center gap-1">
                {presets.slice(0, 3).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSignalChange(p)}
                    className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-850 text-slate-300 font-mono text-[10px] border border-slate-800"
                  >
                    {p.modulation} ({p.snr}dB)
                  </button>
                ))}
              </div>
            </div>
          </div>

          {uploadError && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
              {uploadError}
            </div>
          )}
        </div>

        {/* Right: Signal Information & Physics Stats */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                Signal Information
              </span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                <span className="text-slate-400">Total Samples:</span>
                <span className="text-cyan-300 font-bold">128 I + 128 Q (256 float32)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                <span className="text-slate-400">Representation:</span>
                <span className="text-slate-200">Complex I/Q Baseband</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                <span className="text-slate-400">Signal Type:</span>
                <span className="text-emerald-400 font-bold">{currentSignal.modulation}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                <span className="text-slate-400">Target SNR:</span>
                <span className="text-slate-200">{currentSignal.snr} dB</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                <span className="text-slate-400">Est. Signal Power:</span>
                <span className="text-slate-200">{features.instantaneousPowerAvg}</span>
              </div>
              <div className="flex justify-between py-1 font-mono">
                <span className="text-slate-400">PAPR (Peak-to-Avg):</span>
                <span className="text-amber-400">{features.peakToAverageRatio}</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
            <span className="text-cyan-400 font-mono">Notice:</span> 128 samples per channel represent the standard sequence length fed directly to the 1D CNN architecture.
          </div>
        </div>
      </div>

      {/* Main Signal Visualizer Component */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-slate-200 font-mono uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Waveform Display • {currentSignal.name}
          </h2>
          <span className="text-xs font-mono text-slate-500">Dual Channel 128-Point Grid</span>
        </div>

        <SignalVisualizer signal={currentSignal} height={340} showControls={true} />
      </div>

      {/* Bottom Educational Insights Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
          <div className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            In-Phase Channel I(t)
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Represents the orthogonal component aligned with the cosine carrier reference <code className="text-slate-300 font-mono">cos(2πf_c t)</code>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Quadrature Channel Q(t)
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Represents the 90° phase-shifted orthogonal component aligned with <code className="text-slate-300 font-mono">-sin(2πf_c t)</code>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
          <div className="text-xs font-semibold text-purple-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            Complex Trajectory & Phase
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instantaneous envelope <code className="text-slate-300 font-mono">A(t) = √(I² + Q²)</code> and phase <code className="text-slate-300 font-mono">θ(t) = atan2(Q, I)</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
