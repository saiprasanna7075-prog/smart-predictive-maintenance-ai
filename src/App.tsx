import React, { useState, useEffect } from 'react';
import { NavigationPage, TelemetryRecord } from './types';
import { PRESET_TELEMETRY_SAMPLES } from './data/datasetInfo';
import { apiService } from './services/apiService';

// Layout Components
import { Topbar } from './components/layout/Topbar';
import { Sidebar } from './components/layout/Sidebar';
import { SettingsModal } from './components/layout/SettingsModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { SensorAnalyzerView } from './components/views/SensorAnalyzerView';
import { FailureTypesView } from './components/views/FailureTypesView';
import { DatasetExplorerView } from './components/views/DatasetExplorerView';
import { PreprocessingView } from './components/views/PreprocessingView';
import { ModelLabView } from './components/views/ModelLabView';
import { CnnArchitectureView } from './components/views/CnnArchitectureView';
import { LivePredictionView } from './components/views/LivePredictionView';
import { ResultsDashboardView } from './components/views/ResultsDashboardView';
import { ConfusionMatrixView } from './components/views/ConfusionMatrixView';
import { OperatingEnvelopeView } from './components/views/OperatingEnvelopeView';
import { ResearchInsightsView } from './components/views/ResearchInsightsView';
import { ProjectPipelineView } from './components/views/ProjectPipelineView';
import { AboutProjectView } from './components/views/AboutProjectView';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<NavigationPage>('dashboard');
  const [currentTelemetry, setCurrentTelemetry] = useState<TelemetryRecord>(
    () => PRESET_TELEMETRY_SAMPLES[0]
  );
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Initial health check to see if local Python backend is reachable
  useEffect(() => {
    apiService.checkHealth().then((healthy) => {
      setIsBackendConnected(healthy);
    });
  }, []);

  const handleSelectTelemetry = (record: TelemetryRecord) => {
    setCurrentTelemetry(record);
  };

  const renderActiveView = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView onNavigate={setActivePage} reducedMotion={reducedMotion} />;
      case 'sensor-analyzer':
        return (
          <SensorAnalyzerView
            currentTelemetry={currentTelemetry}
            onTelemetryChange={setCurrentTelemetry}
            onNavigate={setActivePage}
          />
        );
      case 'failure-types':
        return <FailureTypesView onNavigate={setActivePage} />;
      case 'dataset':
        return (
          <DatasetExplorerView
            onSelectTelemetry={handleSelectTelemetry}
            onNavigate={setActivePage}
          />
        );
      case 'preprocessing':
        return <PreprocessingView onNavigate={setActivePage} />;
      case 'models':
        return <ModelLabView onNavigate={setActivePage} />;
      case 'deep-architecture':
        return <CnnArchitectureView onNavigate={setActivePage} />;
      case 'prediction':
        return (
          <LivePredictionView
            currentTelemetry={currentTelemetry}
            onTelemetryChange={setCurrentTelemetry}
            onNavigate={setActivePage}
          />
        );
      case 'results':
        return <ResultsDashboardView onNavigate={setActivePage} />;
      case 'confusion-matrix':
        return <ConfusionMatrixView onNavigate={setActivePage} />;
      case 'operating-envelope':
        return <OperatingEnvelopeView onNavigate={setActivePage} />;
      case 'research-insights':
        return <ResearchInsightsView onNavigate={setActivePage} />;
      case 'project-pipeline':
        return <ProjectPipelineView onNavigate={setActivePage} />;
      case 'about':
        return <AboutProjectView onNavigate={setActivePage} />;
      default:
        return <DashboardView onNavigate={setActivePage} reducedMotion={reducedMotion} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Navigation Bar */}
      <Topbar
        activePage={activePage}
        onNavigate={setActivePage}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isBackendConnected={isBackendConnected}
        reducedMotion={reducedMotion}
        onToggleSidebar={() => setIsSidebarOpenMobile((prev) => !prev)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto min-w-0 p-4 md:p-8 bg-grid-pattern bg-radial-gradient">
          <div className="max-w-7xl mx-auto pb-16">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
        isBackendConnected={isBackendConnected}
        onStatusChange={setIsBackendConnected}
      />
    </div>
  );
};
