import type { NextRequest } from "next/server";
import { getSubjects } from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  try {
    const source = (request.nextUrl.searchParams.get("source") || "system") as "system" | "university";
    const docs = await getSubjects(source);

    const subjects = docs.map((s) => ({
      id: s._id,
      name: s.name,
      abbr: s.abbr,
      color: s.color,
      weightage: s.weightage,
      mcqCount: s.mcqCount,
      topics: s.topics,
    }));

    return Response.json({ subjects }, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  } catch (err) {
    console.error("GET /api/subjects error:", err);
    return Response.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}
