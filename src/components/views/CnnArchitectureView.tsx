import React, { useState } from 'react';
import { 
  Layers, 
  ArrowDown, 
  Cpu, 
  Sliders, 
  CheckCircle2, 
  Sparkles, 
  Activity, 
  Info,
  ChevronRight
} from 'lucide-react';
import { CNN_LAYERS, CNN_TRAINING_CONFIG, CnnLayerInfo } from '../../data/cnnArchitecture';
import { NavigationPage } from '../../types';

interface CnnArchitectureViewProps {
  onNavigate: (page: NavigationPage) => void;
}

export const CnnArchitectureView: React.FC<CnnArchitectureViewProps> = ({ onNavigate }) => {
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer-conv1');

  const selectedLayer: CnnLayerInfo = React.useMemo(() => {
    return CNN_LAYERS.find(l => l.id === selectedLayerId) || CNN_LAYERS[1];
  }, [selectedLayerId]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              1D CNN Architecture & Deep Feature Learning
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Deep 1D Convolutional Neural Network for multi-sensor industrial milling failure diagnosis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300">
            Total Parameters: <strong className="text-white">{CNN_TRAINING_CONFIG.totalParameters.toLocaleString()}</strong>
          </span>
        </div>
      </div>

      {/* Main Two-Column View: Interactive Layer Pipeline on Left, Deep Layer Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Layer Flow Column */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
              Layer Pipeline (Click to Inspect)
            </span>
            <span className="text-[11px] font-mono text-cyan-400">{CNN_LAYERS.length} Sequential Stages</span>
          </div>

          <div className="space-y-2">
            {CNN_LAYERS.map((layer, index) => {
              const isSelected = layer.id === selectedLayerId;
              return (
                <React.Fragment key={layer.id}>
                  <div
                    onClick={() => setSelectedLayerId(layer.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/60 border-cyan-500 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-850/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                            {layer.name}
                          </span>
                          {layer.params > 0 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800 text-slate-400">
                              {layer.params.toLocaleString()} params
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          Output: <span className="text-slate-300">{layer.outputShape}</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'}`} />
                  </div>

                  {index < CNN_LAYERS.length - 1 && (
                    <div className="flex justify-center my-0.5 text-slate-700">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right: Layer Inspector & Training Configuration */}
        <div className="lg:col-span-5 space-y-5">
          {/* Layer Detail Inspector Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Layer Inspection
              </span>
              <span className="text-xs font-mono text-slate-400">
                Type: <strong className="text-white uppercase">{selectedLayer.layerType}</strong>
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">{selectedLayer.name}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedLayer.purpose}</p>
            </div>

            {/* Shape Dimensions Box */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">INPUT TENSOR</span>
                <span className="text-cyan-300 font-bold">{selectedLayer.inputShape}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">OUTPUT TENSOR</span>
                <span className="text-purple-300 font-bold">{selectedLayer.outputShape}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-mono font-semibold uppercase text-[10px] block mb-1">
                  Technical Specification:
                </span>
                <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  {selectedLayer.details}
                </p>
              </div>

              <div>
                <span className="text-cyan-400 font-mono font-semibold uppercase text-[10px] block mb-1">
                  Architectural Justification:
                </span>
                <p className="text-slate-300 leading-relaxed bg-cyan-950/20 p-3 rounded-xl border border-cyan-800/40">
                  {selectedLayer.whyUsed}
                </p>
              </div>
            </div>

            {/* Training Configuration Box */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                Model Hyperparameters:
              </span>
              <div className="space-y-1.5 text-xs font-mono text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Optimizer:</span>
                  <span>{CNN_TRAINING_CONFIG.optimizer}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Loss Function:</span>
                  <span>{CNN_TRAINING_CONFIG.loss}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Batch Size / Max Epochs:</span>
                  <span>{CNN_TRAINING_CONFIG.batchSize} / {CNN_TRAINING_CONFIG.maximumEpochs}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Early Stopping Patience:</span>
                  <span>{CNN_TRAINING_CONFIG.earlyStoppingPatience} epochs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
