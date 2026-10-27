import React from 'react';
import { 
  Activity, 
  Database, 
  BrainCircuit, 
  Sparkles,
  Server,
  Cpu,
  Menu,
  Settings
} from 'lucide-react';
import { NavigationPage } from '../../types';

interface TopbarProps {
  activePage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onOpenSettings: () => void;
  isBackendConnected: boolean;
  reducedMotion: boolean;
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onNavigate,
  onOpenSettings,
  isBackendConnected,
  onToggleSidebar
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#070b14]/90 backdrop-blur-md sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Project Logo / Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-sm md:text-base font-sans">
                SMART PREDICTIVE <span className="text-cyan-400">MAINTENANCE AI</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                AI4I 2020 • 70/20/10
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-mono">
              Industrial Spindle Telemetry • 4 Multi-Split Models
            </p>
          </div>
        </div>
      </div>

      {/* Center / Right: System Status Indicators */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Dataset Split Status */}
        <div 
          onClick={() => onNavigate('dataset')}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 cursor-pointer transition-colors"
          title="10,000 Total Records: 70% Training (7,000), 20% Testing (2,000), 10% Validation (1,000)"
        >
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-mono text-slate-400">Split:</span>
          <span className="font-semibold text-slate-200">70% / 20% / 10%</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" />
        </div>

        {/* Models Status */}
        <div 
          onClick={() => onNavigate('models')}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 cursor-pointer transition-colors"
          title="Models: XGBoost, Random Forest, 1D CNN, SVM"
        >
          <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-mono text-slate-400">Models:</span>
          <span className="font-semibold text-purple-300">4 Trained</span>
        </div>

        {/* Backend / Simulation Status Indicator */}
        <div 
          onClick={onOpenSettings}
          title={isBackendConnected ? "Connected to Python/FastAPI Backend" : "Running on Built-in Physical Simulation Engine (Click to configure backend)"}
          className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors text-xs"
        >
          {isBackendConnected ? (
            <>
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-emerald-300 hidden sm:inline">Backend API</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-cyan-300 hidden sm:inline">Physics Engine</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
            </>
          )}
        </div>

        {/* Quick Diagnostics CTA Button */}
        <button
          onClick={() => onNavigate('prediction')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-md shadow-cyan-900/30 transition-all active:scale-95 border border-cyan-400/30"
        >
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">Live</span> Diagnose
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          aria-label="Application Settings"
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
