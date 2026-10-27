import React, { useState } from 'react';
import { 
  Sparkles, 
  Upload, 
  Zap, 
  CheckCircle2, 
  RefreshCw, 
  Cpu, 
  Clock, 
  ShieldAlert, 
  Check, 
  Sliders,
  Flame,
  Gauge,
  Wrench,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  FileText
} from 'lucide-react';
import { ModelId, FailureType, PredictionResult, TelemetryRecord, MachineType, NavigationPage } from '../../types';
import { apiService } from '../../services/apiService';
import { PRESET_TELEMETRY_SAMPLES } from '../../data/datasetInfo';
import { MODEL_BENCHMARKS } from '../../data/modelMetrics';
import { calculateDerivedPhysics } from '../../utils/physicsEngine';

interface LivePredictionViewProps {
  currentTelemetry: TelemetryRecord;
  onTelemetryChange: (telemetry: TelemetryRecord) => void;
  onNavigate: (page: NavigationPage) => void;
}

type PipelineStep = 'idle' | 'analyzing' | 'physics' | 'standardizing' | 'inference' | 'complete';

export const LivePredictionView: React.FC<LivePredictionViewProps> = ({
  currentTelemetry,
  onTelemetryChange,
  onNavigate
}) => {
  const [telemetry, setTelemetry] = useState<TelemetryRecord>(currentTelemetry);
  const [selectedModel, setSelectedModel] = useState<ModelId>('xgboost');
  const [pipelineStep, setPipelineStep] = useState<PipelineStep>('idle');
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const updateField = (field: keyof TelemetryRecord, val: any) => {
    const updated = { ...telemetry, [field]: val };
    setTelemetry(updated);
    onTelemetryChange(updated);
  };

  const loadPreset = (preset: TelemetryRecord) => {
    setTelemetry(preset);
    onTelemetryChange(preset);
    setResult(null);
  };

  const runClassification = async () => {
    setPipelineStep('analyzing');
    setResult(null);

    // Realistic sequential diagnostics steps
    await new Promise((r) => setTimeout(r, 220));
    setPipelineStep('physics');
    await new Promise((r) => setTimeout(r, 200));
    setPipelineStep('standardizing');
    await new Promise((r) => setTimeout(r, 180));
    setPipelineStep('inference');

    const res = await apiService.predict(telemetry, selectedModel);
    await new Promise((r) => setTimeout(r, 160));

    setResult(res);
    setPipelineStep('complete');
  };

  // CSV Row File Upload Parser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) {
          throw new Error('CSV file must have a header line and at least one data row.');
        }

        const dataLine = lines[1];
        const parts = dataLine.split(',');
        if (parts.length >= 6) {
          // Expected: UDI, ProductID, Type, AirTemp, ProcessTemp, Speed, Torque, ToolWear
          const parsedType = (parts[2]?.trim() || 'L') as MachineType;
          const air = parseFloat(parts[3]) || 300.0;
          const proc = parseFloat(parts[4]) || 310.0;
          const spd = parseInt(parts[5]) || 1500;
          const trq = parseFloat(parts[6]) || 40.0;
          const wear = parseInt(parts[7]) || 0;

          const newTelemetry: TelemetryRecord = {
            udi: parseInt(parts[0]) || 9999,
            productId: parts[1] || 'UPLOADED_CYCLE',
            type: parsedType,
            airTemp: air,
            processTemp: proc,
            speed: spd,
            torque: trq,
            toolWear: wear,
            target: 0,
            failureType: 'No Failure',
            description: `Imported from CSV (${file.name})`
          };

          setTelemetry(newTelemetry);
          onTelemetryChange(newTelemetry);
          setResult(null);
        } else {
          throw new Error('CSV line does not contain expected columns (UDI, Product ID, Type, Air temp, Process temp, Speed, Torque, Tool wear).');
        }
      } catch (err: any) {
        setUploadError(err.message || 'Error parsing CSV telemetry data.');
      }
    };
    reader.readAsText(file);
  };

  const derived = calculateDerivedPhysics(
    telemetry.airTemp,
    telemetry.processTemp,
    telemetry.speed,
    telemetry.torque,
    telemetry.toolWear,
    telemetry.type
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              AI Machine Failure Diagnostic Studio
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Real-time inference and multi-class failure risk assessment for industrial milling machines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            Upload CSV Cycle
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Preset Failures Quick-Load Bar */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
          Quick-Load Benchmark Cycles from predictive_maintenance.csv:
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

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Telemetry Sliders & Model Selector */}
        <div className="lg:col-span-6 space-y-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Machine Telemetry Inputs
            </h2>
            <div className="flex items-center gap-1.5">
              {(['L', 'M', 'H'] as MachineType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => updateField('type', t)}
                  className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-all ${
                    telemetry.type === t
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Type {t}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            {/* Air Temp */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Air Temperature [K]</span>
                <span className="font-mono text-cyan-400 font-bold">{telemetry.airTemp.toFixed(1)} K</span>
              </div>
              <input
                type="range"
                min="295.0"
                max="305.0"
                step="0.1"
                value={telemetry.airTemp}
                onChange={(e) => updateField('airTemp', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-950 rounded-lg cursor-pointer"
              />
            </div>

            {/* Process Temp */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Process Temperature [K]</span>
                <span className="font-mono text-cyan-400 font-bold">{telemetry.processTemp.toFixed(1)} K</span>
              </div>
              <input
                type="range"
                min="305.0"
                max="315.0"
                step="0.1"
                value={telemetry.processTemp}
                onChange={(e) => updateField('processTemp', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-950 rounded-lg cursor-pointer"
              />
            </div>

            {/* Rotational Speed */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Rotational Speed [rpm]</span>
                <span className="font-mono text-cyan-400 font-bold">{telemetry.speed} rpm</span>
              </div>
              <input
                type="range"
                min="1150"
                max="2900"
                step="5"
                value={telemetry.speed}
                onChange={(e) => updateField('speed', parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-950 rounded-lg cursor-pointer"
              />
            </div>

            {/* Torque */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Torque [Nm]</span>
                <span className="font-mono text-cyan-400 font-bold">{telemetry.torque.toFixed(1)} Nm</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="80.0"
                step="0.2"
                value={telemetry.torque}
                onChange={(e) => updateField('torque', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-950 rounded-lg cursor-pointer"
              />
            </div>

            {/* Tool Wear */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Tool Wear Time [min]</span>
                <span className="font-mono text-cyan-400 font-bold">{telemetry.toolWear} min</span>
              </div>
              <input
                type="range"
                min="0"
                max="260"
                step="1"
                value={telemetry.toolWear}
                onChange={(e) => updateField('toolWear', parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-950 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Model Selector Bar */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Active Classifier:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MODEL_BENCHMARKS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`p-2 rounded-lg border text-xs font-mono text-center transition-all ${
                    selectedModel === m.id
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold truncate">{m.shortName}</div>
                  <div className="text-[10px] text-slate-500">{m.testAccuracy.toFixed(1)}% Test</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={runClassification}
            disabled={pipelineStep !== 'idle' && pipelineStep !== 'complete'}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {pipelineStep !== 'idle' && pipelineStep !== 'complete' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Diagnosing Telemetry...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Classify Machine Condition</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Animated Diagnostics Pipeline & Inference Results */}
        <div className="lg:col-span-6 space-y-5">
          {/* Diagnostic Pipeline Status Bar */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              Inference Pipeline Status
            </span>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
              <div className={`p-2 rounded border transition-colors ${
                pipelineStep === 'analyzing'
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300 animate-pulse'
                  : pipelineStep === 'physics' || pipelineStep === 'standardizing' || pipelineStep === 'inference' || pipelineStep === 'complete'
                  ? 'bg-slate-950 border-emerald-500/60 text-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                1. TELEMETRY
              </div>
              <div className={`p-2 rounded border transition-colors ${
                pipelineStep === 'physics'
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300 animate-pulse'
                  : pipelineStep === 'standardizing' || pipelineStep === 'inference' || pipelineStep === 'complete'
                  ? 'bg-slate-950 border-emerald-500/60 text-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                2. PHYSICS
              </div>
              <div className={`p-2 rounded border transition-colors ${
                pipelineStep === 'standardizing'
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300 animate-pulse'
                  : pipelineStep === 'inference' || pipelineStep === 'complete'
                  ? 'bg-slate-950 border-emerald-500/60 text-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                3. SCALING
              </div>
              <div className={`p-2 rounded border transition-colors ${
                pipelineStep === 'inference'
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300 animate-pulse'
                  : pipelineStep === 'complete'
                  ? 'bg-slate-950 border-emerald-500/60 text-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                4. INFERENCE
              </div>
            </div>
          </div>

          {/* Result Card or Placeholder */}
          {result ? (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5 animate-fadeIn">
              {/* Header: Health Score & Predicted Class */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Diagnostic Output ({result.modelName})
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-black text-white">{result.predictedClass}</span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
                      result.isHealthy
                        ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40'
                        : 'border-rose-500/40 text-rose-400 bg-rose-950/40'
                    }`}>
                      {result.isHealthy ? 'NOMINAL' : 'FAILURE PREDICTED'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right">
                  <div className="text-[10px] font-mono text-slate-400">HEALTH SCORE</div>
                  <div className={`text-2xl font-black font-mono mt-0.5 ${
                    result.healthScore > 75 ? 'text-emerald-400' : result.healthScore > 40 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {result.healthScore}%
                  </div>
                </div>
              </div>

              {/* Confidence & Probability Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-mono">Prediction Confidence:</span>
                  <span className="font-mono text-cyan-400 font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                </div>

                {/* Class Probabilities Bar Stack */}
                <div className="space-y-2 pt-1">
                  {Object.entries(result.probabilities).map(([cName, prob]) => {
                    const pct = (prob * 100).toFixed(1);
                    const isWinner = cName === result.predictedClass;
                    return (
                      <div key={cName} className="space-y-1">
                        <div className="flex justify-between items-center text-[11px] font-mono">
                          <span className={isWinner ? 'text-white font-bold' : 'text-slate-400'}>{cName}</span>
                          <span className={isWinner ? 'text-cyan-400 font-bold' : 'text-slate-500'}>{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isWinner ? 'bg-cyan-400' : 'bg-slate-700'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Prescriptive Maintenance Advice */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                  Prescriptive Action:
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.maintenanceAdvice}
                </p>
              </div>

              {/* Footnote */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                <span>Inference Latency: ~{result.inferenceTimeMs}ms</span>
                <span>{result.isSimulated ? 'Physics-Calibrated Simulator' : 'FastAPI Connected'}</span>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-4 rounded-full bg-slate-950 border border-slate-800 text-slate-600">
                <Cpu className="w-8 h-8" />
              </div>
              <div className="text-sm font-semibold text-slate-300">Ready for Telemetry Diagnosis</div>
              <p className="text-xs text-slate-500 max-w-sm">
                Adjust sensor sliders or pick a quick-load benchmark cycle, then click "Classify Machine Condition" to run inference.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
