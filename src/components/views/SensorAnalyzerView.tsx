import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Flame, 
  Zap, 
  Gauge, 
  Wrench, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Sparkles, 
  ArrowRight,
  Info,
  Sliders
} from 'lucide-react';
import { TelemetryRecord, MachineType, NavigationPage } from '../../types';
import { calculateDerivedPhysics } from '../../utils/physicsEngine';
import { PRESET_TELEMETRY_SAMPLES } from '../../data/datasetInfo';

interface SensorAnalyzerViewProps {
  currentTelemetry: TelemetryRecord;
  onTelemetryChange: (telemetry: TelemetryRecord) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const SensorAnalyzerView: React.FC<SensorAnalyzerViewProps> = ({
  currentTelemetry,
  onTelemetryChange,
  onNavigate
}) => {
  const [telemetry, setTelemetry] = useState<TelemetryRecord>(currentTelemetry);

  const physics = useMemo(() => {
    return calculateDerivedPhysics(
      telemetry.airTemp,
      telemetry.processTemp,
      telemetry.speed,
      telemetry.torque,
      telemetry.toolWear,
      telemetry.type
    );
  }, [telemetry]);

  const updateParam = (field: keyof TelemetryRecord, val: any) => {
    const updated = { ...telemetry, [field]: val };
    setTelemetry(updated);
    onTelemetryChange(updated);
  };

  const loadPreset = (preset: TelemetryRecord) => {
    setTelemetry(preset);
    onTelemetryChange(preset);
  };

  // Physical status alerts
  const isHdfRisk = physics.deltaTemp < 8.6 && telemetry.speed < 1380;
  const isPwfLowRisk = physics.powerWatts < 3500;
  const isPwfHighRisk = physics.powerWatts > 9000;
  const strainLimit = telemetry.type === 'L' ? 11000 : telemetry.type === 'M' ? 12000 : 13000;
  const isOsfRisk = physics.strainProduct > strainLimit;
  const isTwfRisk = telemetry.toolWear >= 200;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Sensor Telemetry & Physics Analyzer
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Real-time multi-sensor condition monitoring, physical feature derivation (&Delta;T, Power, Strain), and operational boundary checks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadPreset(PRESET_TELEMETRY_SAMPLES[0])}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Nominal
          </button>
          <button
            onClick={() => onNavigate('prediction')}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-md shadow-cyan-900/30 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Run Classification
          </button>
        </div>
      </div>

      {/* Preset Failures Quick-Load Bar */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
          Curated Machine Cycles from predictive_maintenance.csv:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PRESET_TELEMETRY_SAMPLES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(sample)}
              className={`p-2.5 rounded-lg border text-left transition-all text-xs font-mono ${
                telemetry.udi === sample.udi
                  ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-200 shadow-md shadow-cyan-950'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="text-[10px] text-slate-500">{sample.productId} ({sample.type})</div>
              <div className="font-semibold truncate mt-0.5 text-white">{sample.failureType}</div>
              <div className="text-[10px] text-slate-400 mt-1">{sample.speed} rpm | {sample.torque} Nm</div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Controls & Realtime Physics Gauges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 6 Sensor Input Sliders */}
        <div className="lg:col-span-7 space-y-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Primary Sensor Measurements
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Product Variant:</span>
              {(['L', 'M', 'H'] as MachineType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => updateParam('type', t)}
                  className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold transition-all ${
                    telemetry.type === t
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Type {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* Air Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Air Temperature [K]</span>
                <span className="font-mono text-cyan-400 font-bold">{telemetry.airTemp.toFixed(1)} K ({(telemetry.airTemp - 273.15).toFixed(1)} &deg;C)</span>
              </div>
              <input
                type="range"
                min="295.0"
                max="305.0"
                step="0.1"
                value={telemetry.airTemp}
                onChange={(e) => updateParam('airTemp', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>295.0 K (Min)</span>
                <span>300.0 K (Dataset Mean)</span>
                <span>305.0 K (Max)</span>
              </div>
            </div>

            {/* Process Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Process Temperature [K]</span>
                <span className="font-mono text-cyan-400 font-bold">{telemetry.processTemp.toFixed(1)} K ({(telemetry.processTemp - 273.15).toFixed(1)} &deg;C)</span>
              </div>
              <input
                type="range"
                min="305.0"
                max="315.0"
                step="0.1"
                value={telemetry.processTemp}
                onChange={(e) => updateParam('processTemp', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>305.0 K (Min)</span>
                <span>310.0 K (Dataset Mean)</span>
                <span>315.0 K (Max)</span>
              </div>
            </div>

            {/* Rotational Speed */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Rotational Speed [rpm]</span>
                <span className="font-mono text-cyan-400 font-bold">{telemetry.speed} rpm</span>
              </div>
              <input
                type="range"
                min="1150"
                max="2900"
                step="5"
                value={telemetry.speed}
                onChange={(e) => updateParam('speed', parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1,150 rpm (Min)</span>
                <span>1,538 rpm (Dataset Mean)</span>
                <span>2,900 rpm (Max)</span>
              </div>
            </div>

            {/* Torque */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Torque [Nm]</span>
                <span className="font-mono text-cyan-400 font-bold">{telemetry.torque.toFixed(1)} Nm</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="80.0"
                step="0.2"
                value={telemetry.torque}
                onChange={(e) => updateParam('torque', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>3.0 Nm (Min)</span>
                <span>40.0 Nm (Dataset Mean)</span>
                <span>80.0 Nm (Max)</span>
              </div>
            </div>

            {/* Tool Wear */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Tool Wear Time [min]</span>
                <span className="font-mono text-cyan-400 font-bold">{telemetry.toolWear} min</span>
              </div>
              <input
                type="range"
                min="0"
                max="260"
                step="1"
                value={telemetry.toolWear}
                onChange={(e) => updateParam('toolWear', parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 min (Fresh Blade)</span>
                <span>108 min (Mean)</span>
                <span>200+ min (Wear Threshold)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Physical Features & Boundaries */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Power Calculation */}
          <div className={`p-4 rounded-xl border transition-all ${
            isPwfLowRisk || isPwfHighRisk
              ? 'bg-rose-950/30 border-rose-500/50 shadow-md shadow-rose-950/30'
              : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${isPwfLowRisk || isPwfHighRisk ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-cyan-400'}`}>
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase font-mono">Mechanical Power P = &tau;&middot;&omega;</h3>
                  <p className="text-[10px] text-slate-400">&tau;&middot;(2&pi;&middot;rpm / 60)</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold font-mono text-white">{physics.powerWatts.toLocaleString()} W</div>
                <div className={`text-[10px] font-mono font-bold ${
                  isPwfLowRisk ? 'text-rose-400' : isPwfHighRisk ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {isPwfLowRisk ? 'UNDER POWER (<3,500W)' : isPwfHighRisk ? 'OVER POWER (>9,000W)' : 'SAFE ENVELOPE'}
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-3 relative">
              <div 
                className={`h-full transition-all duration-200 ${
                  isPwfLowRisk || isPwfHighRisk ? 'bg-rose-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, (physics.powerWatts / 10000) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0 W</span>
              <span className="text-amber-400">3,500 W</span>
              <span className="text-emerald-400">Normal Range</span>
              <span className="text-amber-400">9,000 W</span>
              <span>10 kW</span>
            </div>
          </div>

          {/* Card 2: Thermal Differential */}
          <div className={`p-4 rounded-xl border transition-all ${
            isHdfRisk
              ? 'bg-amber-950/30 border-amber-500/50 shadow-md shadow-amber-950/30'
              : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${isHdfRisk ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-cyan-400'}`}>
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase font-mono">Thermal Differential &Delta;T</h3>
                  <p className="text-[10px] text-slate-400">T_process - T_air</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold font-mono text-white">{physics.deltaTemp.toFixed(2)} K</div>
                <div className={`text-[10px] font-mono font-bold ${
                  isHdfRisk ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {isHdfRisk ? 'HDF FAILURE RISK (&Delta;T<8.6K & rpm<1380)' : 'STABLE THERMAL DISSIPATION'}
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-3">
              <div 
                className={`h-full transition-all duration-200 ${isHdfRisk ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(100, Math.max(0, (physics.deltaTemp / 14) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0 K</span>
              <span className="text-amber-400">8.6 K Boundary</span>
              <span>10.0 K Mean</span>
              <span>14 K Max</span>
            </div>
          </div>

          {/* Card 3: Strain Product */}
          <div className={`p-4 rounded-xl border transition-all ${
            isOsfRisk
              ? 'bg-purple-950/30 border-purple-500/50 shadow-md shadow-purple-950/30'
              : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${isOsfRisk ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-cyan-400'}`}>
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase font-mono">Overstrain Product</h3>
                  <p className="text-[10px] text-slate-400">Tool Wear &times; Torque [min&middot;Nm]</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold font-mono text-white">{physics.strainProduct.toLocaleString()} min&middot;Nm</div>
                <div className={`text-[10px] font-mono font-bold ${
                  isOsfRisk ? 'text-purple-400' : 'text-emerald-400'
                }`}>
                  {isOsfRisk ? `OVERSTRAIN (> ${strainLimit.toLocaleString()})` : `SAFE (< ${strainLimit.toLocaleString()})`}
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-3">
              <div 
                className={`h-full transition-all duration-200 ${isOsfRisk ? 'bg-purple-500' : 'bg-blue-500'}`}
                style={{ width: `${Math.min(100, Math.max(0, (physics.strainProduct / 16000) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0</span>
              <span className="text-purple-400">Type {telemetry.type} Limit: {strainLimit.toLocaleString()}</span>
              <span>16,000</span>
            </div>
          </div>

          {/* Card 4: Tool Wear Threshold */}
          <div className={`p-4 rounded-xl border transition-all ${
            isTwfRisk
              ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md shadow-cyan-950/30'
              : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${isTwfRisk ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-cyan-400'}`}>
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase font-mono">Tool Blade Life Counter</h3>
                  <p className="text-[10px] text-slate-400">Critical Wear Limit: 200–240 min</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold font-mono text-white">{telemetry.toolWear} min</div>
                <div className={`text-[10px] font-mono font-bold ${
                  isTwfRisk ? 'text-cyan-400' : 'text-emerald-400'
                }`}>
                  {isTwfRisk ? 'REPLACE BLADE (TWF RISK)' : 'OPERATIONAL'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
