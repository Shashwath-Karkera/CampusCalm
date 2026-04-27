import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [total, highRisk, avg] = await Promise.all([
    prisma.stressPrediction.count(),
    prisma.stressPrediction.count({ where: { predictedStress: "HIGH" } }),
    prisma.stressPrediction.aggregate({ _avg: { probabilityScore: true } }),
  ]);

  return NextResponse.json({
    totalPredictions: total,
    highRiskStudents: highRisk,
    averageRiskScore: avg._avg.probabilityScore ?? 0,
  });
}
