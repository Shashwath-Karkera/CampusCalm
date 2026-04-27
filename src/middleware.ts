import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const tokenName = "campuscalm_session";
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-not-for-prod");

async function validateToken(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { role?: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get(tokenName)?.value;

  if (path.startsWith("/dashboard")) {
    const payload = await validateToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
