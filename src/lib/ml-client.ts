import axios from "axios";
import { env } from "@/lib/env";
import type { ModelPredictionResponse, PredictionPayload } from "@/lib/types";

export async function predictStress(payload: PredictionPayload): Promise<ModelPredictionResponse> {
  try {
    const response = await axios.post(`${env.PYTHON_ML_URL}/predict`, payload, {
      timeout: 8000,
    });
    return response.data as ModelPredictionResponse;
  } catch {
    const riskScore =
      payload.examPressure * 0.22 +
      payload.financialPressure * 0.16 +
      payload.screenTime * 0.08 +
      payload.backlogCount * 0.08 +
      payload.studyHours * 0.07 -
      payload.sleepHours * 0.12 -
      payload.socialSupport * 0.09 -
      payload.physicalActivity * 0.06;

    const normalized = Math.min(Math.max((riskScore + 2) / 8, 0.05), 0.98);
    const predictedStress = normalized > 0.67 ? "HIGH" : normalized > 0.38 ? "MEDIUM" : "LOW";

    return {
      predictedStress,
      probabilityScore: normalized,
      scoreBreakdown: [
        { label: "Academic Pressure", value: payload.examPressure / 10 },
        { label: "Lifestyle Balance", value: 1 - payload.screenTime / 18 },
        { label: "Sleep Quality", value: payload.sleepHours / 10 },
        { label: "Social Support", value: payload.socialSupport / 10 },
      ],
      recommendations: [
        "Follow a consistent sleep schedule and target 7-8 hours.",
        "Use focused study sprints with short breaks.",
        "Reduce late-night screen exposure.",
        "Reach out to mentors or campus counseling when pressure rises.",
      ],
    };
  }
}
