import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    success: true,
    message: `Notification queued for ${body.email ?? "student"}: ${body.text ?? "Take a short break and hydrate."}`,
  });
}
