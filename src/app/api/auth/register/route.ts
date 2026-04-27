import { NextResponse } from "next/server";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = registerSchema.parse(json);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: "STUDENT",
        student: {
          create: {
            age: data.age,
            gender: data.gender,
            yearOfStudy: data.yearOfStudy,
            department: data.department,
          },
        },
      },
    });

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    await setSessionCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid input", detail: String(error) }, { status: 400 });
  }
}
