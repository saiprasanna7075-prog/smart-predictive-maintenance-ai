export type FailureType = 
  | 'No Failure'
  | 'Heat Dissipation Failure'
  | 'Power Failure'
  | 'Overstrain Failure'
  | 'Tool Wear Failure'
  | 'Random Failures';

export type MachineType = 'L' | 'M' | 'H';

export type ModelId = 'rf' | 'xgboost' | 'cnn' | 'svm';

export interface TelemetryRecord {
  udi: number;
  productId: string;
  type: MachineType;
  airTemp: number;       // [K]
  processTemp: number;   // [K]
  speed: number;         // [rpm]
  torque: number;        // [Nm]
  toolWear: number;      // [min]
  target: number;        // 0 = Normal, 1 = Failure
  failureType: FailureType;
  description?: string;
}

export interface DerivedPhysicsFeatures {
  deltaTemp: number;       // Process Temp - Air Temp [K]
  powerWatts: number;      // Torque * (2 * pi * speed / 60) [W]
  strainProduct: number;   // Tool wear * Torque [min * Nm]
  speedToTorqueRatio: number;
  toolWearRateNorm: number;
}

export interface PredictionProbabilities {
  'No Failure': number;
  'Heat Dissipation Failure': number;
  'Power Failure': number;
  'Overstrain Failure': number;
  'Tool Wear Failure': number;
  'Random Failures': number;
  [key: string]: number;
}

export interface PredictionResult {
  predictedClass: FailureType | string;
  confidence: number;
  probabilities: PredictionProbabilities;
  isHealthy: boolean;
  healthScore: number; // 0 - 100%
  modelId: ModelId;
  modelName: string;
  inferenceTimeMs: number;
  isSimulated: boolean;
  timestamp: string;
  derivedPhysics: DerivedPhysicsFeatures;
  maintenanceAdvice: string;
  features?: any;
}

export interface ModelBenchmark {
  id: ModelId;
  name: string;
  shortName: string;
  category: 'Ensemble Learning' | 'Gradient Boosting' | 'Deep Learning' | 'Traditional Machine Learning';
  trainAccuracy: number; // 70% split
  trainMacroF1: number;
  testAccuracy: number;  // 20% split
  testMacroF1: number;
  valAccuracy: number;   // 10% split
  macroF1: number;       // valMacroF1
  rocAuc: number;
  generalizationGap: number; // trainAcc - testAcc
  hyperparameters: Record<string, string | number | boolean>;
  description: string;
  strengths: string[];
  limitations: string[];
  color: string;
  badgeColor: string;
}

export type DatasetSplitType = 'training' | 'testing' | 'validation';

export interface SplitPerformanceDetail {
  sampleCount: number;
  percentage: number;
  accuracy: number;
  macroF1: number;
  rocAuc: number;
  loss?: number;
  classMetrics: {
    className: FailureType;
    precision: number;
    recall: number;
    f1Score: number;
    support: number;
  }[];
  confusionMatrix: number[][]; // 6x6 matrix
}

export interface ModelSplitReport {
  modelId: ModelId;
  modelName: string;
  shortName: string;
  color: string;
  training: SplitPerformanceDetail;
  testing: SplitPerformanceDetail;
  validation: SplitPerformanceDetail;
}

export type NavigationPage = 
  | 'dashboard'
  | 'sensor-analyzer'
  | 'failure-types'
  | 'dataset'
  | 'preprocessing'
  | 'models'
  | 'deep-architecture'
  | 'prediction'
  | 'results'
  | 'confusion-matrix'
  | 'operating-envelope'
  | 'research-insights'
  | 'project-pipeline'
  | 'about';

// Legacy compatibility types for signal modules
export type ModulationType = 'AM-DSB' | 'AM-SSB' | 'WBFM';

export interface SignalSample {
  id: string;
  name?: string;
  description?: string;
  modulation: ModulationType;
  snr: number;
  i: number[];
  q: number[];
  sampleRate?: number;
  label?: string;
  isSimulated?: boolean;
}

export interface SignalFeatureStats {
  instantaneousPowerAvg: number;
  peakToAverageRatio: number;
  iVariance: number;
  qVariance: number;
  iMean: number;
  qMean: number;
  crossCorrelation: number;
  estimatedSNR: number;
}
