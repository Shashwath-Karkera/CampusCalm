import { NextResponse } from "next/server";

const moods: { date: string; mood: string }[] = [];

export async function POST(request: Request) {
  const body = await request.json();
  moods.push({ date: new Date().toISOString(), mood: body.mood ?? "neutral" });
  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json(moods.slice(-30));
}
