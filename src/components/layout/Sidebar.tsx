import React from 'react';
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  Database,
  GitBranch,
  Cpu,
  Layers,
  Sparkles,
  BarChart3,
  Grid,
  TrendingUp,
  Lightbulb,
  Workflow,
  Info,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { NavigationPage } from '../../types';

interface SidebarProps {
  activePage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavSection {
  title: string;
  items: {
    id: NavigationPage;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const NAVIGATION_SECTIONS: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'prediction', label: 'Live Diagnostics', icon: Sparkles, badge: 'Live' },
      { id: 'sensor-analyzer', label: 'Sensor Telemetry', icon: Activity }
    ]
  },
  {
    title: 'INDUSTRIAL DATASET',
    items: [
      { id: 'failure-types', label: 'Failure Modes', icon: AlertTriangle },
      { id: 'dataset', label: 'Dataset Explorer', icon: Database },
      { id: 'preprocessing', label: 'Feature Engineering', icon: GitBranch }
    ]
  },
  {
    title: 'MODELS & ARCHITECTURE',
    items: [
      { id: 'models', label: 'Model Lab', icon: Cpu },
      { id: 'deep-architecture', label: 'Deep 1D CNN', icon: Layers }
    ]
  },
  {
    title: 'MULTI-SPLIT EVALUATION',
    items: [
      { id: 'results', label: 'Results Dashboard', icon: BarChart3, badge: '70/20/10' },
      { id: 'confusion-matrix', label: 'Confusion Matrices', icon: Grid },
      { id: 'operating-envelope', label: 'Operating Envelope', icon: TrendingUp },
      { id: 'research-insights', label: 'Research Insights', icon: Lightbulb }
    ]
  },
  {
    title: 'PROJECT SPECIFICATION',
    items: [
      { id: 'project-pipeline', label: 'Pipeline Flow', icon: Workflow },
      { id: 'about', label: 'About Project', icon: Info }
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          flex flex-col bg-[#070b14]/95 md:bg-[#070b14]/70
          border-r border-slate-800 backdrop-blur-md
          transition-all duration-300 ease-in-out
          ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}
          w-72
        `}
      >
        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="font-bold text-white text-sm">PREDICTIVE AI</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
          {NAVIGATION_SECTIONS.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pb-1.5 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
                  {section.title}
                </div>
              )}
              {isCollapsed && (
                <div className="h-px bg-slate-800/80 my-2 mx-2" />
              )}

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        onCloseMobile();
                      }}
                      title={isCollapsed ? item.label : undefined}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium
                        transition-all duration-150 group relative
                        ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/40 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                        }
                        ${isCollapsed ? 'justify-center px-0 py-2.5' : ''}
                      `}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />

                      {!isCollapsed && (
                        <span className="truncate flex-1 text-left">{item.label}</span>
                      )}

                      {!isCollapsed && item.badge && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                          item.badge === '70/20/10'
                            ? 'bg-purple-950/80 text-purple-300 border border-purple-800/60'
                            : 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
                        }`}>
                          {item.badge}
                        </span>
                      )}

                      {/* Active indicator bar on left */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-400 rounded-r-full shadow-sm shadow-cyan-400/50" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer with Collapse Toggle */}
        <div className="p-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          {!isCollapsed && (
            <div className="font-mono text-[11px] text-slate-500">
              <span className="text-emerald-400 font-semibold">10,000</span> cycles loaded
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden md:flex p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors ml-auto"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
