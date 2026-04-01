import type { NextRequest } from "next/server";
import { getMcqsRandom, getMcqsBrowse, getMcqsSequential } from "@/lib/db/queries";

function mapDoc(q: { _id: string; subjectId: string; topicId: string; text: string; options: string[]; difficulty: string; correctAnswer: number; explanation: string }) {
  return {
    id: q._id,
    subjectId: q.subjectId,
    topicId: q.topicId,
    text: q.text,
    options: q.options,
    difficulty: q.difficulty,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  };
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const mode = params.get("mode") || "quiz";
  const subjectId = params.get("subjectId") || undefined;
  const topicId = params.get("topicId") || undefined;
  const difficulty = params.get("difficulty") || undefined;

  try {
    if (mode === "quiz") {
      const count = Math.min(parseInt(params.get("count") || "10") || 10, 50);

      const docs = await getMcqsRandom(subjectId, topicId, difficulty, count);
      const questions = docs.map(mapDoc);

      return Response.json(
        { questions, meta: { total: questions.length, returned: questions.length } },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    if (mode === "sequential") {
      // Sequential mode — ordered by _id, for university MCQs
      const count = Math.min(parseInt(params.get("count") || "20") || 20, 50);
      const skip = Math.max(parseInt(params.get("skip") || "0") || 0, 0);

      if (!subjectId) {
        return Response.json({ error: "subjectId is required for sequential mode" }, { status: 400 });
      }

      const docs = await getMcqsSequential(subjectId, count, skip);
      const questions = docs.map(mapDoc);

      return Response.json(
        { questions, meta: { total: questions.length, returned: questions.length } },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    // Browse mode — paginated, cached
    const page = Math.max(parseInt(params.get("page") || "1") || 1, 1);
    const limit = Math.min(Math.max(parseInt(params.get("limit") || "20") || 20, 1), 50);
    const search = params.get("search") || undefined;

    const { questions: docs, total } = await getMcqsBrowse(
      subjectId, topicId, difficulty, search, page, limit
    );

    const questions = docs.map(mapDoc);

    return Response.json(
      {
        questions,
        meta: { total, returned: questions.length, page, limit, hasMore: page * limit < total },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
        },
      }
    );
  } catch (err) {
    console.error("GET /api/mcqs error:", err);
    return Response.json({ error: "Failed to fetch MCQs" }, { status: 500 });
  }
}
