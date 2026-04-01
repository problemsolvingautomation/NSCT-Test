import type { NextRequest } from "next/server";
import { getTopicsWithCounts } from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  const subjectId = request.nextUrl.searchParams.get("subjectId");

  if (!subjectId) {
    return Response.json({ error: "subjectId is required" }, { status: 400 });
  }

  try {
    const topics = await getTopicsWithCounts(subjectId);

    return Response.json({ topics }, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  } catch (err) {
    console.error("GET /api/topics error:", err);
    return Response.json({ error: "Failed to fetch topics" }, { status: 500 });
  }
}
