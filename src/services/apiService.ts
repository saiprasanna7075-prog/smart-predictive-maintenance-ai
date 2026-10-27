import { ModelBenchmark, ModelId, PredictionResult, TelemetryRecord, DerivedPhysicsFeatures } from '../types';
import { MODEL_BENCHMARKS } from '../data/modelMetrics';
import { evaluateFailureProbabilities, calculateDerivedPhysics } from '../utils/physicsEngine';

export interface ApiConfig {
  baseUrl: string;
  forceSimulated: boolean;
  timeoutMs: number;
}

const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: 'http://localhost:8000',
  forceSimulated: false,
  timeoutMs: 3000
};

class ApiService {
  private config: ApiConfig = { ...DEFAULT_CONFIG };
  private isBackendHealthy: boolean = false;
  private lastHealthCheck: number = 0;

  public setConfig(newConfig: Partial<ApiConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): ApiConfig {
    return { ...this.config };
  }

  public async checkHealth(): Promise<boolean> {
    if (this.config.forceSimulated) {
      this.isBackendHealthy = false;
      return false;
    }

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), this.config.timeoutMs);
      const res = await fetch(`${this.config.baseUrl}/health`, {
        signal: controller.signal
      });
      clearTimeout(id);
      this.isBackendHealthy = res.ok;
      this.lastHealthCheck = Date.now();
      return res.ok;
    } catch {
      this.isBackendHealthy = false;
      this.lastHealthCheck = Date.now();
      return false;
    }
  }

  public isConnected(): boolean {
    return this.isBackendHealthy && !this.config.forceSimulated;
  }

  /**
   * POST /predict
   * Run inference on industrial telemetry parameters
   */
  public async predict(
    telemetry: Partial<TelemetryRecord>,
    modelId: ModelId = 'xgboost'
  ): Promise<PredictionResult> {
    if (!this.config.forceSimulated) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);

        const response = await fetch(`${this.config.baseUrl}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            air_temp: telemetry.airTemp,
            process_temp: telemetry.processTemp,
            speed: telemetry.speed,
            torque: telemetry.torque,
            tool_wear: telemetry.toolWear,
            machine_type: telemetry.type || 'L',
            model_id: modelId
          }),
          signal: controller.signal
        });
        clearTimeout(timeout);

        if (response.ok) {
          const data = await response.json();
          this.isBackendHealthy = true;
          return {
            predictedClass: data.predicted_class,
            confidence: data.confidence,
            probabilities: data.probabilities,
            isHealthy: data.predicted_class === 'No Failure',
            healthScore: data.health_score ?? (data.predicted_class === 'No Failure' ? 95 : 20),
            modelId: (data.model_id as ModelId) || modelId,
            modelName: data.model_name || modelId.toUpperCase(),
            inferenceTimeMs: data.inference_time_ms || 12,
            isSimulated: false, // REAL MODEL PREDICTION FROM BACKEND
            timestamp: new Date().toISOString(),
            derivedPhysics: data.derived_physics || calculateDerivedPhysics(
              telemetry.airTemp || 300,
              telemetry.processTemp || 310,
              telemetry.speed || 1500,
              telemetry.torque || 40,
              telemetry.toolWear || 0,
              telemetry.type || 'L'
            ),
            maintenanceAdvice: data.maintenance_advice || 'Nominal maintenance interval scheduled.'
          };
        }
      } catch (err) {
        // Backend unavailable, fallback to physics evaluation engine
        this.isBackendHealthy = false;
      }
    }

    // High-fidelity fallback / simulated demo prediction based on deterministic physical boundaries
    return evaluateFailureProbabilities(telemetry, modelId);
  }

  /**
   * GET /models
   */
  public async getModels(): Promise<ModelBenchmark[]> {
    if (!this.config.forceSimulated) {
      try {
        const res = await fetch(`${this.config.baseUrl}/models`);
        if (res.ok) return await res.json();
      } catch {
        this.isBackendHealthy = false;
      }
    }
    return MODEL_BENCHMARKS;
  }
}

export const apiService = new ApiService();
