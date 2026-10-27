import React from 'react';
import { Waves, ArrowRight, Zap, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { WaveformThumbnail } from '../signal/WaveformThumbnail';
import { NavigationPage } from '../../types';

interface ModulationTypesViewProps {
  onNavigate: (page: NavigationPage) => void;
}

export const ModulationTypesView: React.FC<ModulationTypesViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Waves className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Analog Modulation Principles & Spectral Comparison
          </h1>
        </div>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Detailed comparison of the three analog modulation schemes evaluated in the RadioML dataset: AM-DSB, AM-SSB, and WBFM.
        </p>
      </div>

      {/* Three Detailed Modulation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: AM-DSB */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 transition-all space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                CLASS 0 • LABEL 0
              </span>
              <span className="text-xs font-mono text-slate-400">Double Sideband</span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">AM-DSB</h2>
              <p className="text-xs font-medium text-sky-300">
                Amplitude Modulation — Double Sideband with Carrier
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              The carrier amplitude varies according to the modulating message signal, and both sidebands (upper and lower) are symmetrically transmitted around the discrete carrier frequency.
            </p>

            {/* Time-Domain Waveform Preview */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                <span>Time-Domain Envelope s(t)</span>
                <span className="text-sky-400">AM Waveform</span>
              </div>
              <WaveformThumbnail type="AM-DSB" color="#38bdf8" height={64} />
            </div>

            {/* Frequency-Domain Illustration SVG */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="text-[10px] font-mono text-slate-400">Frequency Spectrum |S(f)|</div>
              <div className="h-16 flex items-end justify-center relative px-2">
                <div className="w-full h-0.5 bg-slate-800 absolute bottom-2" />
                {/* Lower Sideband */}
                <div className="w-12 h-8 bg-sky-500/30 border-t border-l border-r border-sky-400/60 rounded-t mr-1 flex items-center justify-center text-[9px] font-mono text-sky-300">
                  LSB
                </div>
                {/* Carrier Spike */}
                <div className="w-1.5 h-14 bg-sky-400 mx-1 flex items-center justify-center relative">
                  <span className="absolute -top-4 text-[9px] font-mono text-sky-300">f_c</span>
                </div>
                {/* Upper Sideband */}
                <div className="w-12 h-8 bg-sky-500/30 border-t border-l border-r border-sky-400/60 rounded-t ml-1 flex items-center justify-center text-[9px] font-mono text-sky-300">
                  USB
                </div>
              </div>
              <div className="text-[10px] font-mono text-center text-slate-500">
                Total Bandwidth = 2 × f_m (Dual Sidebands)
              </div>
            </div>

            {/* I/Q Visualization summary */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1.5 text-xs">
              <div className="font-semibold text-slate-200">I/Q Complex Plane Behavior:</div>
              <p className="text-[11px] text-slate-400">
                I-channel contains the large modulated envelope while Q-channel fluctuates near zero (up to carrier phase offset). Results in a linear trajectory across the constellation.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Test Recall: <strong className="text-sky-300">70.0%</strong></span>
            <span>Precision: <strong className="text-sky-300">0.56</strong></span>
          </div>
        </div>

        {/* Card 2: AM-SSB */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                CLASS 1 • LABEL 1
              </span>
              <span className="text-xs font-mono text-slate-400">Single Sideband</span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">AM-SSB</h2>
              <p className="text-xs font-medium text-emerald-300">
                Amplitude Modulation — Single Sideband (USB/LSB)
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Only one sideband is transmitted, reducing the required radio frequency bandwidth by 50% compared with double-sideband transmission, while eliminating carrier power wastage.
            </p>

            {/* Time-Domain Waveform Preview */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                <span>Time-Domain Waveform s(t)</span>
                <span className="text-emerald-400">SSB Waveform</span>
              </div>
              <WaveformThumbnail type="AM-SSB" color="#10b981" height={64} />
            </div>

            {/* Frequency-Domain Illustration SVG */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="text-[10px] font-mono text-slate-400">Frequency Spectrum |S(f)|</div>
              <div className="h-16 flex items-end justify-center relative px-2">
                <div className="w-full h-0.5 bg-slate-800 absolute bottom-2" />
                {/* Suppressed LSB dashed */}
                <div className="w-12 h-8 border border-dashed border-slate-700 rounded-t mr-1 flex items-center justify-center text-[9px] font-mono text-slate-600">
                  Suppressed
                </div>
                {/* Suppressed carrier dot */}
                <div className="w-1.5 h-3 bg-slate-700 mx-1 flex items-center justify-center relative">
                  <span className="absolute -top-4 text-[9px] font-mono text-slate-500">f_c</span>
                </div>
                {/* Active Upper Sideband */}
                <div className="w-12 h-12 bg-emerald-500/40 border-t border-l border-r border-emerald-400 rounded-t ml-1 flex items-center justify-center text-[9px] font-mono text-emerald-300">
                  USB Transmitted
                </div>
              </div>
              <div className="text-[10px] font-mono text-center text-slate-500">
                Total Bandwidth = 1 × f_m (Single Spectrum Half)
              </div>
            </div>

            {/* I/Q Visualization summary */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1.5 text-xs">
              <div className="font-semibold text-slate-200">I/Q Complex Plane Behavior:</div>
              <p className="text-[11px] text-slate-400">
                Quadrature channel is the exact Hilbert transform of In-phase channel: <code className="text-emerald-300 font-mono">Q(t) = ±H[I(t)]</code>. Produces a distinct circular rotation that the CNN classifies with near 100% precision.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Test Recall: <strong className="text-emerald-300">98.2% (Top)</strong></span>
            <span>Precision: <strong className="text-emerald-300">0.66</strong></span>
          </div>
        </div>

        {/* Card 3: WBFM */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                CLASS 2 • LABEL 2
              </span>
              <span className="text-xs font-mono text-slate-400">Wideband FM</span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">WBFM</h2>
              <p className="text-xs font-medium text-amber-300">
                Wideband Frequency Modulation
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              The instantaneous frequency of the RF carrier wave varies directly proportional to the baseband message signal amplitude, keeping the overall signal power envelope essentially constant.
            </p>

            {/* Time-Domain Waveform Preview */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                <span>FM Modulated Waveform s(t)</span>
                <span className="text-amber-400">Varying Frequency</span>
              </div>
              <WaveformThumbnail type="WBFM" color="#f59e0b" height={64} />
            </div>

            {/* Frequency-Domain Illustration SVG */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="text-[10px] font-mono text-slate-400">Bessel Sideband Spectrum</div>
              <div className="h-16 flex items-end justify-center relative px-2 gap-1">
                <div className="w-full h-0.5 bg-slate-800 absolute bottom-2" />
                <div className="w-2 h-4 bg-amber-500/40 rounded-t" />
                <div className="w-2 h-7 bg-amber-500/60 rounded-t" />
                <div className="w-2 h-11 bg-amber-500/80 rounded-t" />
                <div className="w-2 h-14 bg-amber-400 rounded-t" />
                <div className="w-2 h-11 bg-amber-500/80 rounded-t" />
                <div className="w-2 h-7 bg-amber-500/60 rounded-t" />
                <div className="w-2 h-4 bg-amber-500/40 rounded-t" />
              </div>
              <div className="text-[10px] font-mono text-center text-slate-500">
                Carson's Rule: B_T = 2(Δf + f_m) (Infinite Bessel lines)
              </div>
            </div>

            {/* I/Q Visualization summary */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1.5 text-xs">
              <div className="font-semibold text-slate-200">I/Q Complex Plane Behavior:</div>
              <p className="text-[11px] text-slate-400">
                Traces a circular ring of constant radius <code className="text-amber-300 font-mono">r = A_c</code> whose angular speed speeds up and slows down with the instantaneous frequency.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Test Recall: <strong className="text-amber-300">20.2% (Low)</strong></span>
            <span>Precision: <strong className="text-amber-300">0.79 (High)</strong></span>
          </div>
        </div>
      </div>

      {/* Comprehensive Academic Comparison Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">
            Modulation Characteristic Matrix
          </h2>
          <span className="text-xs font-mono text-cyan-400">Comparative Analysis</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950/60">
                <th className="py-3 px-4">Feature / Property</th>
                <th className="py-3 px-4 text-sky-400">AM-DSB (Class 0)</th>
                <th className="py-3 px-4 text-emerald-400">AM-SSB (Class 1)</th>
                <th className="py-3 px-4 text-amber-400">WBFM (Class 2)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-sans">
              <tr>
                <td className="py-3 px-4 font-medium text-slate-400 font-mono">Modulation Principle</td>
                <td className="py-3 px-4">Linear amplitude scaling of high-frequency carrier wave.</td>
                <td className="py-3 px-4">Quadrature phase cancellation using Hilbert transform.</td>
                <td className="py-3 px-4">Non-linear frequency deviation proportional to signal amplitude.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-400 font-mono">Transmission Bandwidth</td>
                <td className="py-3 px-4 font-mono text-sky-300">2 × f_m (Dual sideband)</td>
                <td className="py-3 px-4 font-mono text-emerald-300">1 × f_m (50% bandwidth saving)</td>
                <td className="py-3 px-4 font-mono text-amber-300">2(Δf + f_m) (Wideband spectrum)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-400 font-mono">Envelope Trajectory</td>
                <td className="py-3 px-4">Varying envelope with high peak-to-average ratio.</td>
                <td className="py-3 px-4">Varying envelope with circular/spiral phase progression.</td>
                <td className="py-3 px-4">Ideally constant modulus envelope |s(t)| = A_c.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-400 font-mono">I/Q Quadrature Behavior</td>
                <td className="py-3 px-4">Collinear line on I axis (Q ≈ 0 up to channel phase).</td>
                <td className="py-3 px-4">90° phase shift between I and Q channels.</td>
                <td className="py-3 px-4">Constellation lies on outer circle with non-uniform angular speed.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-400 font-mono">Classification Difficulty</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Moderate (69.7% recall)
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Easiest to classify (98.2% recall)
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Hardest: 53.8% confused with AM-DSB
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
