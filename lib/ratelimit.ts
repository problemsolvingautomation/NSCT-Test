import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── In-Memory Sliding Window Rate Limiter ───────────────────────
// No external service required. State persists across warm Vercel
// function invocations (resets on cold starts — acceptable trade-off
// for zero config and zero cost).
//
// How it works: each IP+route combo stores an array of timestamps.
// On each request, expired timestamps are pruned, then the count is
// checked against the limit.

interface RateLimitConfig {
  maxRequests: number; // max requests allowed in the window
  windowMs: number;    // window size in milliseconds
}

// ─── Per-Route Limits ────────────────────────────────────────────
// To change a limit: update maxRequests or windowMs below.
// windowMs examples: 60_000 = 1 min, 600_000 = 10 min, 3_600_000 = 1 hour

const ROUTE_LIMITS: Record<string, RateLimitConfig> = {
  "/api/mcqs/random": { maxRequests: 60, windowMs: 3_600_000 },   // 60 req / hour — heaviest endpoint
  "/api/mcqs/count":  { maxRequests: 120, windowMs: 3_600_000 },  // 120 req / hour
  "/api/mcqs":        { maxRequests: 60, windowMs: 3_600_000 },   // 60 req / hour — multi-mode queries
  "/api/subjects":    { maxRequests: 120, windowMs: 3_600_000 },  // 120 req / hour — lightweight
  "/api/topics":      { maxRequests: 120, windowMs: 3_600_000 },  // 120 req / hour — lightweight
  "/api/revalidate":  { maxRequests: 10, windowMs: 3_600_000 },   // 10 req / hour — admin only
};

const DEFAULT_LIMIT: RateLimitConfig = { maxRequests: 120, windowMs: 3_600_000 };

// ─── In-Memory Store ─────────────────────────────────────────────
// Key: "route:ip" → array of request timestamps (epoch ms).
// Entries are auto-cleaned on access; a periodic sweep prevents unbounded growth.

const store = new Map<string, number[]>();

const CLEANUP_INTERVAL = 600_000; // sweep every 10 minutes
let lastCleanup = Date.now();

function sweep() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, timestamps] of store) {
    // Remove entries where ALL timestamps have expired (use longest window: 1 hour)
    const fresh = timestamps.filter((t) => now - t < 3_600_000);
    if (fresh.length === 0) {
      store.delete(key);
    } else {
      store.set(key, fresh);
    }
  }
}

// ─── Route → Config Matcher ─────────────────────────────────────
// Order: check specific sub-paths before broader patterns.

function getConfig(pathname: string): RateLimitConfig {
  // Exact matches first
  if (ROUTE_LIMITS[pathname]) return ROUTE_LIMITS[pathname];
  // /api/mcqs/<id> — any sub-path not matched above
  if (pathname.startsWith("/api/mcqs/")) return ROUTE_LIMITS["/api/mcqs/count"]; // same limit as count (120/hr)
  return DEFAULT_LIMIT;
}

// ─── IP Extraction ───────────────────────────────────────────────
// On Vercel, x-forwarded-for contains the real client IP as the first value.

export function extractIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return (request as NextRequest & { ip?: string }).ip ?? "anonymous";
}

// ─── Rate Limit Header Helper ────────────────────────────────────

export function addRateLimitHeaders(
  response: NextResponse,
  limit: number,
  remaining: number,
  reset: number,
): NextResponse {
  response.headers.set("X-RateLimit-Limit", String(limit));
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  response.headers.set("X-RateLimit-Reset", String(reset));
  return response;
}

// ─── Main Rate Limit Check ───────────────────────────────────────

export function checkRateLimit(
  request: NextRequest,
): { blocked: true; response: NextResponse } | { blocked: false; limit: number; remaining: number; reset: number } {
  sweep();

  const pathname = request.nextUrl.pathname;
  const ip = extractIp(request);
  const config = getConfig(pathname);
  const key = `${pathname}:${ip}`;
  const now = Date.now();

  // Get existing timestamps and prune expired ones
  const timestamps = (store.get(key) ?? []).filter(
    (t) => now - t < config.windowMs,
  );

  const reset = timestamps.length > 0
    ? timestamps[0] + config.windowMs
    : now + config.windowMs;

  if (timestamps.length >= config.maxRequests) {
    const retryAfter = Math.ceil((reset - now) / 1000);
    const response = NextResponse.json(
      {
        success: false,
        message: "Too many requests. Please try again later.",
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(config.maxRequests),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(reset),
          "Retry-After": String(Math.max(retryAfter, 1)),
        },
      },
    );
    return { blocked: true, response };
  }

  // Record this request
  timestamps.push(now);
  store.set(key, timestamps);

  const remaining = config.maxRequests - timestamps.length;
  return { blocked: false, limit: config.maxRequests, remaining, reset };
}
