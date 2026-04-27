import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { predictStress } from "@/lib/ml-client";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { predictionSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = checkRateLimit(session.userId, 30, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const json = await request.json();
    const payload = predictionSchema.parse(json);

    const prediction = await predictStress(payload);
    const student = await prisma.student.findUnique({ where: { userId: session.userId } });

    if (student) {
      await prisma.stressPrediction.create({
        data: {
          studentId: student.id,
          studyHours: payload.studyHours,
          sleepHours: payload.sleepHours,
          screenTime: payload.screenTime,
          attendance: payload.attendance,
          assignmentsPerWeek: payload.assignmentsPerWeek,
          examPressure: payload.examPressure,
          financialPressure: payload.financialPressure,
          socialSupport: payload.socialSupport,
          physicalActivity: payload.physicalActivity,
          backlogCount: payload.backlogCount,
          predictedStress: prediction.predictedStress,
          probabilityScore: prediction.probabilityScore,
        },
      });
    }

    return NextResponse.json(prediction);
  } catch (error) {
    return NextResponse.json({ error: "Invalid payload", detail: String(error) }, { status: 400 });
  }
}
