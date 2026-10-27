export interface CnnLayerInfo {
  id: string;
  name: string;
  layerType: 'input' | 'conv' | 'norm' | 'pool' | 'dense' | 'dropout' | 'output';
  inputShape: string;
  outputShape: string;
  params: number;
  purpose: string;
  details: string;
  whyUsed: string;
}

export const CNN_LAYERS: CnnLayerInfo[] = [
  {
    id: 'layer-input',
    name: 'Sensor Sequence Input Layer',
    layerType: 'input',
    inputShape: '(Batch, 8, 1)',
    outputShape: '(Batch, 8, 1)',
    params: 0,
    purpose: 'Ingests standardized multi-sensor telemetry and derived physics dimensions.',
    details: 'Input dimensions: Air Temp [K], Process Temp [K], Rotational Speed [rpm], Torque [Nm], Tool Wear [min], Delta T, Power (W), Strain Product.',
    whyUsed: 'Provides synchronous normalized thermal, kinematic, and wear measurements to the convolutional receptive fields.'
  },
  {
    id: 'layer-conv1',
    name: '1D Convolution Layer 1 (Conv1D)',
    layerType: 'conv',
    inputShape: '(Batch, 8, 1)',
    outputShape: '(Batch, 8, 64)',
    params: 256,
    purpose: 'Extracts low-level cross-sensor coupling features (e.g. speed-torque anti-correlation and temperature drift).',
    details: '64 filters of kernel size 3 with ReLU activation and "same" padding along the sensor feature channels.',
    whyUsed: 'Detects simultaneous deviations across adjacent physical parameters without relying on manual polynomial expansions.'
  },
  {
    id: 'layer-bn1',
    name: 'Batch Normalization 1',
    layerType: 'norm',
    inputShape: '(Batch, 8, 64)',
    outputShape: '(Batch, 8, 64)',
    params: 256,
    purpose: 'Normalizes feature map activations across mini-batches to zero mean and unit variance.',
    details: 'Applies scale (gamma) and shift (beta) trainable parameters to stabilize gradient descent.',
    whyUsed: 'Prevents internal covariate shift caused by differing scales between high RPM speeds and small tool wear increments.'
  },
  {
    id: 'layer-pool1',
    name: 'Max Pooling 1D (Pool size: 2)',
    layerType: 'pool',
    inputShape: '(Batch, 8, 64)',
    outputShape: '(Batch, 4, 64)',
    params: 0,
    purpose: 'Downsamples the feature channel dimension by a factor of 2.',
    details: 'Extracts maximum activations across 2-channel windows with stride 2.',
    whyUsed: 'Preserves the most salient anomaly activations while condensing feature representations.'
  },
  {
    id: 'layer-conv2',
    name: '1D Convolution Layer 2 (Conv1D)',
    layerType: 'conv',
    inputShape: '(Batch, 4, 64)',
    outputShape: '(Batch, 4, 128)',
    params: 24704,
    purpose: 'Synthesizes non-linear interactions characterizing physical failure boundaries.',
    details: '128 filters of kernel size 3 with ReLU activation and "same" padding.',
    whyUsed: 'Captures the distinct hyper-dimensional signatures of Overstrain Failure (wear x torque) and Heat Dissipation failure (delta T + low rpm).'
  },
  {
    id: 'layer-bn2',
    name: 'Batch Normalization 2',
    layerType: 'norm',
    inputShape: '(Batch, 4, 128)',
    outputShape: '(Batch, 4, 128)',
    params: 512,
    purpose: 'Stabilizes intermediate feature representations before deep pooling.',
    details: 'Maintains healthy gradient magnitudes during backpropagation through time.',
    whyUsed: 'Accelerates convergence speed and helps mitigate vanishing gradients in minority class error signals.'
  },
  {
    id: 'layer-gap',
    name: 'Global Average Pooling 1D',
    layerType: 'pool',
    inputShape: '(Batch, 4, 128)',
    outputShape: '(Batch, 128)',
    params: 0,
    purpose: 'Averages feature maps over the spatial axis to produce an invariant 128-D latent descriptor.',
    details: 'Collapses the spatial dimension into a 128-element embedding vector.',
    whyUsed: 'Greatly reduces total parameter count compared to a Flatten layer, lowering overfitting risk on rare failure events.'
  },
  {
    id: 'layer-dense1',
    name: 'Dense Fully-Connected Layer (64 units)',
    layerType: 'dense',
    inputShape: '(Batch, 128)',
    outputShape: '(Batch, 64)',
    params: 8256,
    purpose: 'Maps abstract sensor representations into decision manifolds for machine health.',
    details: '64 units with ReLU non-linear activation.',
    whyUsed: 'Provides high-capacity linear-separation mapping prior to class probability generation.'
  },
  {
    id: 'layer-dropout',
    name: 'Dropout Layer (rate: 0.35)',
    layerType: 'dropout',
    inputShape: '(Batch, 64)',
    outputShape: '(Batch, 64)',
    params: 0,
    purpose: 'Regularizes the network by zeroing 35% of neurons during each training mini-batch.',
    details: 'Active only during backpropagation; disabled during validation and test inference.',
    whyUsed: 'Prevents co-adaptation and forces distributed feature learning, critical for rare failure classes.'
  },
  {
    id: 'layer-softmax',
    name: 'Softmax Output Layer (6 Classes)',
    layerType: 'output',
    inputShape: '(Batch, 64)',
    outputShape: '(Batch, 6)',
    params: 390,
    purpose: 'Outputs normalized posterior probability distribution over the 6 machine condition classes.',
    details: 'Softmax activation: P(y=k|x) = exp(z_k) / sum(exp(z_j)). Classes: [No Failure, HDF, PWF, OSF, TWF, RNF].',
    whyUsed: 'Enables calibrated confidence scores and multi-class focal cross-entropy loss computation.'
  }
];

export const CNN_TRAINING_CONFIG = {
  optimizer: 'Adam (Adaptive Moment Estimation)',
  learningRate: '0.001 (with CosineAnnealing decay)',
  loss: 'Class-Weighted Categorical Cross-Entropy',
  batchSize: 128,
  maximumEpochs: 35,
  earlyStoppingPatience: 6,
  totalParameters: 34118,
  trainableParameters: 33606,
  nonTrainableParameters: 512,
  trainSplitSamples: 7000,
  valSplitSamples: 1000,
  testSplitSamples: 2000
};
