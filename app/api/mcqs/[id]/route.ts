import { getMcqById } from "@/lib/db/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const doc = await getMcqById(id);

    if (!doc) {
      return Response.json({ error: "MCQ not found" }, { status: 404 });
    }

    return Response.json({
      id: doc._id,
      subjectId: doc.subjectId,
      topicId: doc.topicId,
      text: doc.text,
      options: doc.options,
      difficulty: doc.difficulty,
      correctAnswer: doc.correctAnswer,
      explanation: doc.explanation,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  } catch (err) {
    console.error("GET /api/mcqs/[id] error:", err);
    return Response.json({ error: "Failed to fetch MCQ" }, { status: 500 });
  }
}
