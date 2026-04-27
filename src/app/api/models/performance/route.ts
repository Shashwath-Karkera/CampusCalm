import { NextResponse } from "next/server";
import { loadModelMetrics } from "@/lib/student-dataset";

export async function GET() {
  const models = loadModelMetrics();

  return NextResponse.json({
    models: models.map((model) => ({ name: model.model, ...model })),
    bestModel: models[0]?.model ?? "Random Forest",
    reason: "Random Forest is the production prediction model because it captures non-linear relations across academic workload, sleep, screen time, support, and pressure features.",
  });
}
