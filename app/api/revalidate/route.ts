import { revalidateTag } from "next/cache";
import { clearCache } from "@/lib/cache";

export async function POST(request: Request) {
  try {
    const { tag, secret } = await request.json();

    if (secret !== process.env.REVALIDATE_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!tag || typeof tag !== "string") {
      return Response.json({ error: "tag is required" }, { status: 400 });
    }

    // Invalidate Next.js server cache (Next.js 16 requires a cache profile)
    revalidateTag(tag, "default");

    // Clear in-memory cache for matching prefix
    clearCache(tag);

    return Response.json({ revalidated: true, tag });
  } catch (err) {
    console.error("POST /api/revalidate error:", err);
    return Response.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
