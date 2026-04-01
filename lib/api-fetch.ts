/**
 * Fetch wrapper that injects the internal API key header.
 * Use this instead of raw `fetch()` for all `/api/*` calls from client components.
 *
 * On 429 (rate limited): dispatches a "rate-limited" custom event on `window`
 * with the Retry-After value, then throws so callers' catch blocks handle it.
 */
export async function apiFetch(input: string | URL | RequestInfo, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("x-api-key", process.env.NEXT_PUBLIC_API_SECRET ?? "");

  const response = await fetch(input, { ...init, headers });

  if (response.status === 429) {
    const retryAfter = Number(response.headers.get("Retry-After")) || 60;

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("rate-limited", { detail: { retryAfter } }),
      );
    }

    throw new Error("Rate limit exceeded");
  }

  return response;
}
