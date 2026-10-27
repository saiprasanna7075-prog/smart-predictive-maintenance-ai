import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Zap, 
  Gauge, 
  Wrench, 
  HelpCircle, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Info,
  Scale
} from 'lucide-react';
import { FailureType, NavigationPage } from '../../types';

interface FailureTypesViewProps {
  onNavigate: (page: NavigationPage) => void;
}

export const FailureTypesView: React.FC<FailureTypesViewProps> = ({ onNavigate }) => {
  const [selectedFailure, setSelectedFailure] = useState<FailureType>('Heat Dissipation Failure');

  const failureDetails = [
    {
      id: 'No Failure' as FailureType,
      name: 'Normal Operation (No Failure)',
      short: 'Normal',
      color: '#10b981',
      badge: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40',
      icon: CheckCircle2,
      count: 9652,
      percentage: '96.52%',
      formula: '3,500 W \u2264 P \u2264 9,000 W  |  \u0394T \u2265 8.6 K  |  Strain < Limit',
      description: 'The milling center operates within nominal thermodynamic, kinematic, and structural stress boundaries. Tooling is within wear limits and power delivery is stable.',
      triggerConditions: [
        'Process temperature tracks air temperature with \u0394T \u2265 8.6 K',
        'Rotational speed within stable 1,300 - 2,500 rpm band',
        'Torque between 15 - 55 Nm depending on feed rate',
        'Cumulative tool wear under 200 minutes'
      ],
      maintenanceAction: 'Execute standard autonomous lubrication and periodic inspection cycle.',
      classificationDifficulty: 'Low - baseline distribution with 9,652 samples.'
    },
    {
      id: 'Heat Dissipation Failure' as FailureType,
      name: 'Heat Dissipation Failure (HDF)',
      short: 'HDF',
      color: '#f59e0b',
      badge: 'border-amber-500/40 text-amber-400 bg-amber-950/40',
      icon: Flame,
      count: 112,
      percentage: '1.12%',
      formula: '\u0394T = (T_process - T_air) < 8.6 K  AND  Speed < 1,380 rpm',
      description: 'Insufficient convection and thermal dissipation caused by low fan airflow at reduced spindle speeds, leading to overheating of the milling spindle bearings and thermal expansion.',
      triggerConditions: [
        'Process-to-air temperature differential drops below 8.6 Kelvin',
        'Spindle motor rotational speed drops below 1,380 rpm',
        'Forced convection cooling fan lacks sufficient volumetric flow rate'
      ],
      maintenanceAction: 'Clear cooling airflow passages, inspect spindle fan impeller, verify coolant delivery pressure.',
      classificationDifficulty: 'Medium - cleanly resolved by non-linear decision trees (XGBoost recall: 95.6%).'
    },
    {
      id: 'Power Failure' as FailureType,
      name: 'Power Failure (PWF)',
      short: 'PWF',
      color: '#ef4444',
      badge: 'border-rose-500/40 text-rose-400 bg-rose-950/40',
      icon: Zap,
      count: 95,
      percentage: '0.95%',
      formula: 'P = \u03c4 \u00b7 (2\u03c0 \u00b7 rpm / 60) < 3,500 W  OR  > 9,000 W',
      description: 'The electrical and mechanical power delivered to the milling cutter falls outside allowable operational limits. Overpower causes circuit breaker trip or motor burnout; underpower leads to cutter stalling.',
      triggerConditions: [
        'Torque \u00d7 angular velocity product falls below 3,500 Watts (cutter stall / motor under-drive)',
        'Torque \u00d7 angular velocity exceeds 9,000 Watts (overload / motor drive surge)'
      ],
      maintenanceAction: 'Inspect motor VFD inverter, check drive belt tension, inspect electrical supply phase balance.',
      classificationDifficulty: 'Low - deterministic hyperbolic power boundary (100% recall achieved by XGBoost).'
    },
    {
      id: 'Overstrain Failure' as FailureType,
      name: 'Overstrain Failure (OSF)',
      short: 'OSF',
      color: '#8b5cf6',
      badge: 'border-purple-500/40 text-purple-400 bg-purple-950/40',
      icon: Gauge,
      count: 78,
      percentage: '0.78%',
      formula: 'Tool Wear \u00d7 Torque > 11,000 (L) | 12,000 (M) | 13,000 (H) [min\u00b7Nm]',
      description: 'Cumulative tool degradation combined with excessive cutting force exerts mechanical stress beyond the yield limit of the workpiece material and machine structure.',
      triggerConditions: [
        'Low variant (L): Tool Wear \u00d7 Torque > 11,000 min\u00b7Nm',
        'Medium variant (M): Tool Wear \u00d7 Torque > 12,000 min\u00b7Nm',
        'High variant (H): Tool Wear \u00d7 Torque > 13,000 min\u00b7Nm'
      ],
      maintenanceAction: 'Reduce feed rate and cut depth immediately; replace degraded end-mill blade.',
      classificationDifficulty: 'Medium-High - requires interaction term between tool wear and torque.'
    },
    {
      id: 'Tool Wear Failure' as FailureType,
      name: 'Tool Wear Failure (TWF)',
      short: 'TWF',
      color: '#06b6d4',
      badge: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40',
      icon: Wrench,
      count: 45,
      percentage: '0.45%',
      formula: 'Tool Wear \u2265 200 \u2013 240 minutes cumulative cutting time',
      description: 'Severe micro-flank wear and blade cratering on the cutting edges causing surface finish degradation, workpiece dimension violations, and chatter vibrations.',
      triggerConditions: [
        'Total operational cutting duration exceeds 200 to 240 minutes',
        'Cutting edge sharpness degraded beyond micro-tolerance'
      ],
      maintenanceAction: 'Replace worn cutter inserts with freshly calibrated carbide tooling.',
      classificationDifficulty: 'Medium - linear threshold on tool wear counter.'
    },
    {
      id: 'Random Failures' as FailureType,
      name: 'Random Failures (RNF)',
      short: 'RNF',
      color: '#ec4899',
      badge: 'border-pink-500/40 text-pink-400 bg-pink-950/40',
      icon: HelpCircle,
      count: 18,
      percentage: '0.18%',
      formula: 'P(failure) = 0.001 (Stochastic Poisson Distribution)',
      description: 'Unpredictable, spontaneous faults including electrical surges, micro-switch failures, or foreign debris entanglement without prior telemetry warnings.',
      triggerConditions: [
        'Occurs uniformly across arbitrary operational parameters',
        'Independent of thermal, kinematic, or mechanical wear state'
      ],
      maintenanceAction: 'Perform comprehensive electrical isolation diagnostics and debris cleaning.',
      classificationDifficulty: 'Extremely High - inherently irreducible error due to lack of distinct sensory precursors.'
    }
  ];

  const current = failureDetails.find(f => f.id === selectedFailure) || failureDetails[1];
  const Icon = current.icon;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Failure Modes & Physical Governing Equations
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Deterministic physical principles and sensory conditions defined in the AI4I 2020 predictive maintenance benchmark.
          </p>
        </div>

        <button
          onClick={() => onNavigate('prediction')}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 flex items-center gap-1.5"
        >
          <span>Test in Live Diagnostics</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {failureDetails.map((f) => {
          const FIcon = f.icon;
          const isSelected = selectedFailure === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFailure(f.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-950/40'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <FIcon className="w-4 h-4" style={{ color: f.color }} />
                <span className="text-[10px] font-mono text-slate-400">{f.percentage}</span>
              </div>
              <div className="font-bold text-xs mt-2 text-white truncate">{f.short}</div>
              <div className="text-[10px] font-mono text-slate-400">{f.count.toLocaleString()} cases</div>
            </button>
          );
        })}
      </div>

      {/* Selected Failure Detail Showcase */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${current.color}15`, border: `1px solid ${current.color}40` }}>
              <Icon className="w-6 h-6" style={{ color: current.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{current.name}</h2>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${current.badge}`}>
                  {current.count} Samples ({current.percentage})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Deterministic physics boundary and sensor indicator profile</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400">PHYSICAL CRITERIA</div>
            <div className="font-mono text-xs font-bold text-cyan-300 mt-0.5">{current.formula}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 space-y-4">
            <div>
              <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-1">Phenomenon Description</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{current.description}</p>
            </div>

            <div>
              <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">Trigger Conditions & Physical Indicators</h3>
              <ul className="space-y-1.5">
                {current.triggerConditions.map((tc, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: current.color }} />
                    <span>{tc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-slate-400 font-semibold uppercase">Recommended Maintenance Action</div>
              <p className="text-xs text-emerald-300 leading-relaxed">{current.maintenanceAction}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-slate-400 font-semibold uppercase">Classification Complexity</div>
              <p className="text-xs text-slate-300 leading-relaxed">{current.classificationDifficulty}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Comparison Table */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Scale className="w-4 h-4 text-cyan-400" />
          Multi-Class Failure Mode Comparison Matrix
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-mono text-slate-400 border-b border-slate-800 uppercase">
              <tr>
                <th className="py-3 px-4">Failure Mode</th>
                <th className="py-3 px-4">Sample Count</th>
                <th className="py-3 px-4">Key Sensory Trigger</th>
                <th className="py-3 px-4">Physical Threshold</th>
                <th className="py-3 px-4">Top Model Recall</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {failureDetails.map((f) => (
                <tr key={f.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
                    {f.name}
                  </td>
                  <td className="py-3 px-4 font-mono">{f.count.toLocaleString()} ({f.percentage})</td>
                  <td className="py-3 px-4 text-slate-400">{f.triggerConditions[0]}</td>
                  <td className="py-3 px-4 font-mono text-cyan-300">{f.formula}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                    {f.id === 'Power Failure' ? '100.0%' : f.id === 'Heat Dissipation Failure' ? '95.6%' : f.id === 'Overstrain Failure' ? '92.3%' : f.id === 'Tool Wear Failure' ? '88.9%' : f.id === 'No Failure' ? '99.4%' : '33.3%'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
