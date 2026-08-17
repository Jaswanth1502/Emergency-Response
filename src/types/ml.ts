export type MLArchitecture =
  | 'Multi-Modal CNN + XGBoost'
  | 'Bidirectional LSTM Regressor'
  | 'Random Forest Classifier'
  | 'Physics-Informed Neural Network (PINN)'
  | '1D-CNN + Strain SVM'
  | 'Temporal Graph Neural Network (GNN)'
  | 'CSRNet Density Regressor'
  | 'Multi-Objective Queuing Optimizer'
  | 'Risk-Weighted Dijkstra / A*'
  | 'Gaussian Puff Dispersion Model';

export interface FeatureImportance {
  feature: string;
  weight: number; // 0 to 1
  dataset: string;
  description: string;
}

export interface MLModelMeta {
  id: string;
  name: string;
  hazardDomain: string;
  datasetId: string;
  datasetName: string;
  architecture: MLArchitecture;
  accuracy: number; // e.g. 96.4 (%)
  f1Score: number; // e.g. 0.94
  aucRoc: number; // e.g. 0.982
  latencyMs: number; // e.g. 14ms
  epochsTrained: number;
  lastTrainedDate: string;
  lossHistory: number[];
  inputFeatures: string[];
  outputPrediction: string;
  featureImportances: FeatureImportance[];
}

export interface InferenceResult {
  modelId: string;
  timestamp: string;
  riskScore: number; // 0 to 100
  predictedCategory: string;
  confidence: number; // 0 to 100 (%)
  severityLevel: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  primaryFactor: string;
  causalityChain: string[];
  recommendedAction: string;
  metrics: Record<string, string | number>;
}

export interface TrainingProgress {
  modelId: string;
  isTraining: boolean;
  currentEpoch: number;
  totalEpochs: number;
  currentLoss: number;
  currentAccuracy: number;
  status: 'IDLE' | 'TRAINING' | 'COMPLETED' | 'FAILED';
}
