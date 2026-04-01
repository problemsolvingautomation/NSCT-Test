import type { NextRequest } from "next/server";
import { getMcqsRandom } from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const subjectId = params.get("subjectId") || undefined;
  const topicId = params.get("topicId") || undefined;
  const difficulty = params.get("difficulty") || undefined;
  const count = Math.min(parseInt(params.get("count") || "10") || 10, 50);

  try {
    const docs = await getMcqsRandom(subjectId, topicId, difficulty, count);

    const questions = docs.map((q) => ({
      id: q._id,
      subjectId: q.subjectId,
      topicId: q.topicId,
      text: q.text,
      options: q.options,
      difficulty: q.difficulty,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));

    return Response.json(
      { questions, meta: { total: questions.length, returned: questions.length } },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("GET /api/mcqs/random error:", err);
    return Response.json({ error: "Failed to fetch random MCQs" }, { status: 500 });
  }
}
