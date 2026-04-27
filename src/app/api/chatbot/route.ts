import { NextResponse } from "next/server";

const tips = [
  "Try the 50-10 study rule: 50 minutes focus, 10 minutes break.",
  "Avoid caffeine 6 hours before bedtime during exam week.",
  "Use short breathing exercises before difficult study sessions.",
  "Reach out early when stress signals persist for multiple days.",
];

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = String(body.message || "").toLowerCase();

  let reply = tips[Math.floor(Math.random() * tips.length)];
  if (input.includes("sleep")) reply = "Set a fixed sleep and wake time, and reduce screen brightness at night.";
  if (input.includes("exam")) reply = "Prioritize exam topics by weight and confidence level to reduce anxiety.";

  return NextResponse.json({ reply });
}
