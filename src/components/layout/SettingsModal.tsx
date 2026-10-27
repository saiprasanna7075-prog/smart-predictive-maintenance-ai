import React, { useState } from 'react';
import { X, Server, CheckCircle2, AlertCircle, RefreshCw, Cpu, Sparkles } from 'lucide-react';
import { apiService } from '../../services/apiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  isBackendConnected: boolean;
  onStatusChange: (status: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  reducedMotion,
  onToggleReducedMotion,
  isBackendConnected,
  onStatusChange
}) => {
  const currentConfig = apiService.getConfig();
  const [backendUrl, setBackendUrl] = useState(currentConfig.baseUrl);
  const [forceSimulated, setForceSimulated] = useState(currentConfig.forceSimulated);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    apiService.setConfig({ baseUrl: backendUrl, forceSimulated: false });
    const isOnline = await apiService.checkHealth();
    setTesting(false);
    onStatusChange(isOnline);
    if (isOnline) {
      setTestResult({ success: true, message: 'Backend connected successfully! Real model predictions are active.' });
    } else {
      setTestResult({
        success: false,
        message: 'Could not reach backend server at specified URL. Using client-side simulated engine.'
      });
    }
  };

  const handleSave = () => {
    apiService.setConfig({
      baseUrl: backendUrl,
      forceSimulated
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0b1222] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-semibold text-slate-100">
              System & Backend Configuration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-sm">
          {/* Backend API Configuration */}
          <div className="space-y-3">
            <label className="block text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase">
              FastAPI / Python Backend Endpoint
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                placeholder="http://localhost:8000"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>Test</span>
              </button>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                  testResult.success
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If a real Python backend is running, the app makes HTTP POST calls to <code className="text-cyan-300 font-mono">/predict</code>. If not detected, the app automatically switches to the authentic high-fidelity research simulation engine.
            </p>
          </div>

          {/* Engine Mode Toggle */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-200 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Force Simulated Engine Mode
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Always use internal mathematical signal synthesis and research benchmark simulation.
                </div>
              </div>
              <input
                type="checkbox"
                checked={forceSimulated}
                onChange={(e) => setForceSimulated(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-200 text-xs flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  Reduced Motion & Visual Performance
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Stops 3D rotating animations and continuous transitions for low-power devices.
                </div>
              </div>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={onToggleReducedMotion}
                className="w-4 h-4 rounded text-cyan-500 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-medium text-white shadow-md shadow-cyan-600/20"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
