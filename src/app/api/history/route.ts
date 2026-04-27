import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const student = await prisma.student.findUnique({ where: { userId: session.userId } });
  if (!student) return NextResponse.json([]);

  const data = await prisma.stressPrediction.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(data);
}
