import { TelemetryRecord } from '../types';

export const DATASET_STATS = {
  name: 'AI4I 2020 Predictive Maintenance Dataset',
  author: 'Prof. Dr. Stephan Matzka, HTW Berlin (University of Applied Sciences)',
  source: 'UCI Machine Learning Repository & Kaggle (archive.zip / predictive_maintenance.csv)',
  totalRecords: 10000,
  productTypes: {
    L: { count: 6000, percentage: 60.0, description: 'Low variant (50% of all products in industry)' },
    M: { count: 2997, percentage: 29.97, description: 'Medium variant (30% of all products in industry)' },
    H: { count: 1003, percentage: 10.03, description: 'High variant (20% of all products in industry)' }
  },
  sensorFeatures: [
    { name: 'Air temperature [K]', min: 295.3, max: 304.5, mean: 300.0, std: 2.0, unit: 'Kelvin' },
    { name: 'Process temperature [K]', min: 305.7, max: 313.8, mean: 310.01, std: 1.48, unit: 'Kelvin' },
    { name: 'Rotational speed [rpm]', min: 1168, max: 2886, mean: 1538.78, std: 179.28, unit: 'RPM' },
    { name: 'Torque [Nm]', min: 3.8, max: 76.6, mean: 39.99, std: 9.97, unit: 'Newton-meters' },
    { name: 'Tool wear [min]', min: 0, max: 253, mean: 107.95, std: 63.65, unit: 'Minutes' }
  ],
  failureBreakdown: [
    { className: 'No Failure', count: 9652, percentage: 96.52, color: '#10b981' },
    { className: 'Heat Dissipation Failure', count: 112, percentage: 1.12, color: '#f59e0b' },
    { className: 'Power Failure', count: 95, percentage: 0.95, color: '#ef4444' },
    { className: 'Overstrain Failure', count: 78, percentage: 0.78, color: '#8b5cf6' },
    { className: 'Tool Wear Failure', count: 45, percentage: 0.45, color: '#06b6d4' },
    { className: 'Random Failures', count: 18, percentage: 0.18, color: '#ec4899' }
  ],
  totalFailures: 348,
  totalHealthy: 9652,
  trainSplit: {
    percentage: 70,
    count: 7000,
    description: '7,000 machine cycles used for model fitting, gradient updates, and tree learning.'
  },
  testSplit: {
    percentage: 20,
    count: 2000,
    description: '2,000 completely unseen cycles held out for final multi-class confusion matrix & ROC-AUC.'
  },
  valSplit: {
    percentage: 10,
    count: 1000,
    description: '1,000 cycles used for tuning tree depths, learning rates, and early stopping.'
  }
};

export const SPLIT_DISTRIBUTION = [
  { name: 'Training (70%)', percentage: 70, count: 7000, color: '#06b6d4' },
  { name: 'Testing (20%)', percentage: 20, count: 2000, color: '#f43f5e' },
  { name: 'Validation (10%)', percentage: 10, count: 1000, color: '#8b5cf6' }
];

// Curated authentic records from predictive_maintenance.csv
export const PRESET_TELEMETRY_SAMPLES: TelemetryRecord[] = [
  {
    udi: 1,
    productId: 'M14860',
    type: 'M',
    airTemp: 298.1,
    processTemp: 308.6,
    speed: 1551,
    torque: 42.8,
    toolWear: 0,
    target: 0,
    failureType: 'No Failure',
    description: 'Fresh tooling cycle under nominal temperature and rotational speed.'
  },
  {
    udi: 51,
    productId: 'L47230',
    type: 'L',
    airTemp: 298.9,
    processTemp: 309.1,
    speed: 2861,
    torque: 4.6,
    toolWear: 143,
    target: 1,
    failureType: 'Power Failure',
    description: 'Excessive speed with inadequate torque causing mechanical power deficit (< 3500 W).'
  },
  {
    udi: 70,
    productId: 'L47249',
    type: 'L',
    airTemp: 298.9,
    processTemp: 309.0,
    speed: 1410,
    torque: 65.7,
    toolWear: 191,
    target: 1,
    failureType: 'Power Failure',
    description: 'Overloaded spindle power (9,700 W > 9,000 W limit).'
  },
  {
    udi: 78,
    productId: 'L47257',
    type: 'L',
    airTemp: 298.8,
    processTemp: 308.9,
    speed: 1455,
    torque: 41.3,
    toolWear: 208,
    target: 1,
    failureType: 'Tool Wear Failure',
    description: 'Critical tool wear threshold exceeded (208 min > 200 min wear boundary).'
  },
  {
    udi: 161,
    productId: 'L47340',
    type: 'L',
    airTemp: 298.4,
    processTemp: 308.2,
    speed: 1282,
    torque: 60.7,
    toolWear: 216,
    target: 1,
    failureType: 'Overstrain Failure',
    description: 'High torque combined with worn tool (216 * 60.7 = 13,111 > 11,000 limit for Type L).'
  },
  {
    udi: 3237,
    productId: 'M18096',
    type: 'M',
    airTemp: 300.8,
    processTemp: 309.4,
    speed: 1342,
    torque: 62.4,
    toolWear: 113,
    target: 1,
    failureType: 'Heat Dissipation Failure',
    description: 'Low air-to-process delta T (8.6 K) at sub-critical speed (1342 rpm) causing thermal breakdown.'
  },
  {
    udi: 1222,
    productId: 'M16081',
    type: 'M',
    airTemp: 297.0,
    processTemp: 308.3,
    speed: 1399,
    torque: 46.4,
    toolWear: 132,
    target: 0,
    failureType: 'Random Failures',
    description: 'Sporadic anomalous sensory noise pattern without structural mechanical damage.'
  }
];
