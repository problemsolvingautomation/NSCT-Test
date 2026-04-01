import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit, addRateLimitHeaders } from "@/lib/ratelimit";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Rate Limiting (runs before auth so abusive IPs are blocked early) ──
  const result = checkRateLimit(request);

  if (result.blocked) {
    return result.response;
  }

  // ── Revalidate bypass — it has its own secret-based auth ──
  if (pathname.startsWith("/api/revalidate")) {
    return addRateLimitHeaders(NextResponse.next(), result.limit, result.remaining, result.reset);
  }

  // ── API key validation — block direct access from outside the app ──
  const key = request.headers.get("x-api-key");
  const secret = process.env.API_SECRET;

  if (!secret || key !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return addRateLimitHeaders(NextResponse.next(), result.limit, result.remaining, result.reset);
}

export const config = {
  matcher: "/api/:path*",
};
