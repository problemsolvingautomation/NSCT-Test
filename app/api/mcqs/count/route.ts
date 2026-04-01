import type { NextRequest } from "next/server";
import { getMcqCount } from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const subjectId = params.get("subjectId") || undefined;
  const topicId = params.get("topicId") || undefined;
  const difficulty = params.get("difficulty") || undefined;

  try {
    const count = await getMcqCount(subjectId, topicId, difficulty);

    return Response.json({ count }, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  } catch (err) {
    console.error("GET /api/mcqs/count error:", err);
    return Response.json({ error: "Failed to fetch count" }, { status: 500 });
  }
}
