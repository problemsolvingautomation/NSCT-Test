import { cacheLife, cacheTag } from "next/cache";
import { getDb } from "./mongodb";
import { getCached, setCache } from "../cache";

// ---------- Types ----------

export interface SubjectDoc {
  _id: string;
  name: string;
  abbr: string;
  color: string;
  weightage: number;
  mcqCount: number;
  topics: { id: string; name: string }[];
  source: "system" | "university";
}

export interface McqDoc {
  _id: string;
  subjectId: string;
  topicId: string;
  difficulty: "easy" | "medium" | "hard" | "unrated";
  text: string;
  options: string[];
  correctAnswer: number; // 0-3, or -1 if unknown (practice only)
  explanation: string;
  source: "system" | "university";
}

// ---------- Subjects (cached aggressively) ----------

export async function getSubjects(
  source: "system" | "university" = "system"
): Promise<SubjectDoc[]> {
  "use cache";
  cacheLife("max");
  cacheTag("subjects", `subjects-${source}`);

  // Check in-memory cache first
  const cacheKey = `subjects-${source}`;
  const cached = getCached<SubjectDoc[]>(cacheKey);
  if (cached) return cached;

  const db = await getDb();
  // For "system", also match documents without a source field (backward compat)
  const filter = source === "system"
    ? { $or: [{ source: "system" as const }, { source: { $exists: false as const } }] }
    : { source };
  const subjects = await db
    .collection<SubjectDoc>("subjects")
    .find(filter as Record<string, unknown>)
    .sort({ name: 1 })
    .toArray();

  setCache(cacheKey, subjects, 3_600_000); // 1 hour in-memory
  return subjects;
}

export async function getSubjectById(
  id: string
): Promise<SubjectDoc | null> {
  // Determine source from ID prefix
  const source = id.startsWith("uni-") ? "university" : "system";
  const subjects = await getSubjects(source);
  return subjects.find((s) => s._id === id) ?? null;
}

// ---------- Topics with question counts ----------

export async function getTopicsWithCounts(
  subjectId: string
): Promise<{ id: string; name: string; questionCount: number }[]> {
  "use cache";
  cacheLife("days");
  cacheTag("topics", `topics-${subjectId}`);

  const db = await getDb();

  // Get subject for topic names
  const subject = await db
    .collection<SubjectDoc>("subjects")
    .findOne({ _id: subjectId });

  if (!subject) return [];

  // Aggregate question counts per topic
  const counts = await db
    .collection<McqDoc>("mcqs")
    .aggregate<{ _id: string; count: number }>([
      { $match: { subjectId } },
      { $group: { _id: "$topicId", count: { $sum: 1 } } },
    ])
    .toArray();

  const countMap = new Map(counts.map((c) => [c._id, c.count]));

  return subject.topics.map((t) => ({
    id: t.id,
    name: t.name,
    questionCount: countMap.get(t.id) ?? 0,
  }));
}

// ---------- MCQs: Quiz mode (random, never cached) ----------

export async function getMcqsRandom(
  subjectId?: string,
  topicId?: string,
  difficulty?: string,
  count: number = 10
): Promise<McqDoc[]> {
  const db = await getDb();

  const match: Record<string, unknown> = {};
  if (subjectId) match.subjectId = subjectId;
  if (topicId && topicId !== "all") match.topicId = topicId;
  if (difficulty && difficulty !== "all") match.difficulty = difficulty;

  const pipeline: Record<string, unknown>[] = [];
  if (Object.keys(match).length > 0) pipeline.push({ $match: match });
  pipeline.push({ $sample: { size: Math.min(count, 50) } });

  return db.collection<McqDoc>("mcqs").aggregate<McqDoc>(pipeline).toArray();
}

// ---------- MCQs: Browse mode (paginated, cached) ----------

export async function getMcqsBrowse(
  subjectId?: string,
  topicId?: string,
  difficulty?: string,
  search?: string,
  page: number = 1,
  limit: number = 20
): Promise<{ questions: McqDoc[]; total: number }> {
  "use cache";
  cacheLife("hours");
  cacheTag("mcqs", subjectId ? `mcqs-${subjectId}` : "mcqs-all");

  const db = await getDb();
  const col = db.collection<McqDoc>("mcqs");

  const filter: Record<string, unknown> = {};
  if (subjectId) filter.subjectId = subjectId;
  if (topicId && topicId !== "all") filter.topicId = topicId;
  if (difficulty && difficulty !== "all") filter.difficulty = difficulty;
  if (search) filter.$text = { $search: search };

  const safeLimit = Math.min(Math.max(limit, 1), 50);
  const skip = (Math.max(page, 1) - 1) * safeLimit;

  const [questions, total] = await Promise.all([
    col.find(filter).skip(skip).limit(safeLimit).toArray(),
    col.countDocuments(filter),
  ]);

  return { questions, total };
}

// ---------- MCQ count ----------

export async function getMcqCount(
  subjectId?: string,
  topicId?: string,
  difficulty?: string
): Promise<number> {
  "use cache";
  cacheLife("days");
  cacheTag("mcq-count", subjectId ? `mcq-count-${subjectId}` : "mcq-count-all");

  const db = await getDb();
  const filter: Record<string, unknown> = {};
  if (subjectId) filter.subjectId = subjectId;
  if (topicId && topicId !== "all") filter.topicId = topicId;
  if (difficulty && difficulty !== "all") filter.difficulty = difficulty;

  return db.collection<McqDoc>("mcqs").countDocuments(filter);
}

// ---------- MCQs: Sequential mode (ordered by _id) ----------

export async function getMcqsSequential(
  subjectId: string,
  count: number = 20,
  skip: number = 0
): Promise<McqDoc[]> {
  const db = await getDb();
  return db
    .collection<McqDoc>("mcqs")
    .find({ subjectId })
    .sort({ _id: 1 })
    .skip(skip)
    .limit(Math.min(count, 50))
    .toArray();
}

// ---------- Single MCQ ----------

export async function getMcqById(id: string): Promise<McqDoc | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("mcqs", `mcq-${id}`);

  const db = await getDb();
  return db.collection<McqDoc>("mcqs").findOne({ _id: id });
}
