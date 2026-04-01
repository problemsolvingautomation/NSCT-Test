/**
 * Seed script: migrates JSON data into MongoDB.
 *
 * Usage:
 *   npx tsx scripts/seed-mongodb.ts
 *
 * Requires MONGO_URI in .env.local or environment.
 */

import { MongoClient, type AnyBulkWriteOperation } from "mongodb";
import { readFileSync } from "fs";
import { join } from "path";

// ---------- Config ----------

const BATCH_SIZE = 500;
const DB_NAME = "nsct";

// Subject metadata (mirrors lib/mock-data.ts)
const subjects = [
  {
    _id: "problem-solving", name: "Problem Solving & Analytical Skills", abbr: "PS",
    color: "#0D9488", weightage: 20, mcqCount: 0, source: "system" as const,
    topics: [
      { id: "intro-ps", name: "Introduction to Problem Solving" },
      { id: "problem-analysis", name: "Problem Understanding & Analysis" },
      { id: "logical-reasoning", name: "Logical Reasoning Fundamentals" },
      { id: "algo-flow", name: "Algorithms & Flow Control" },
      { id: "data-repr", name: "Data Representation & Abstraction" },
      { id: "pattern-recog", name: "Pattern Recognition & Generalization" },
      { id: "math-reasoning", name: "Mathematical & Quantitative Reasoning" },
      { id: "algo-thinking", name: "Algorithmic Thinking" },
      { id: "critical-thinking", name: "Critical Thinking & Decision Making" },
      { id: "debugging-analysis", name: "Debugging & Error Analysis" },
      { id: "complexity-aware", name: "Complexity & Efficiency Awareness" },
      { id: "ps-programming", name: "Problem Solving Using Programming" },
      { id: "data-driven-ps", name: "Data-Driven Problem Solving" },
      { id: "creative-thinking", name: "Creative & Innovative Thinking" },
      { id: "real-world-ps", name: "Real-World Problem Solving" },
      { id: "comm-docs", name: "Communication & Documentation of Solutions" },
    ],
  },
  {
    _id: "ai-ml", name: "AI / Machine Learning & Data Analytics", abbr: "AI",
    color: "#7C3AED", weightage: 10, mcqCount: 0, source: "system" as const,
    topics: [
      { id: "intro-ai", name: "Introduction to AI, ML & Data Analytics" },
      { id: "math-foundations", name: "Mathematical Foundations" },
      { id: "python-ai", name: "Python for AI" },
      { id: "data-preprocessing", name: "Data Collection & Pre-processing" },
      { id: "eda", name: "Exploratory Data Analysis" },
      { id: "supervised", name: "Supervised Learning" },
      { id: "ensemble", name: "Ensemble Learning" },
      { id: "unsupervised", name: "Unsupervised Learning" },
      { id: "model-eval", name: "Model Evaluation & Validation" },
      { id: "feature-eng", name: "Feature Engineering" },
      { id: "deep-learning", name: "Deep Learning Fundamentals" },
      { id: "advanced-dl", name: "Advanced Deep Learning" },
      { id: "nlp", name: "NLP" },
      { id: "computer-vision", name: "Computer Vision" },
      { id: "big-data", name: "Big Data Analytics" },
      { id: "mlops", name: "Model Deployment & MLOps" },
      { id: "ai-ethics", name: "AI Ethics, Security & Privacy" },
    ],
  },
  {
    _id: "cn-cloud", name: "Computer Networks & Cloud Computing", abbr: "CN",
    color: "#2563EB", weightage: 10, mcqCount: 0, source: "system" as const,
    topics: [
      { id: "data-comm", name: "Data Communication" },
      { id: "computer-networks", name: "Computer Networks" },
      { id: "data-link-layer", name: "Data Link Layer" },
      { id: "network-layer", name: "Network Layer" },
      { id: "transport-layer", name: "Transport Layer" },
      { id: "application-layer", name: "Application Layer" },
      { id: "wireless-networks", name: "Wireless Networks" },
      { id: "cloud-computing", name: "Cloud Computing" },
      { id: "network-security", name: "Network Security (Network Perspective)" },
      { id: "next-gen-networks", name: "Next Generation Networks" },
    ],
  },
  {
    _id: "dsa", name: "Data Structures & Algorithms", abbr: "DSA",
    color: "#059669", weightage: 10, mcqCount: 0, source: "system" as const,
    topics: [
      { id: "foundations", name: "Foundations of DS & Algorithms" },
      { id: "linear-ds", name: "Linear Data Structures" },
      { id: "non-linear-ds", name: "Non-Linear Data Structures" },
      { id: "searching", name: "Searching Algorithms" },
      { id: "sorting", name: "Sorting Algorithms" },
      { id: "hashing", name: "Hashing" },
      { id: "tree-algo", name: "Tree Algorithms" },
      { id: "graph-algo", name: "Graph Algorithms" },
      { id: "algo-design", name: "Algorithm Design Techniques" },
      { id: "advanced-ds", name: "Advanced Data Structures" },
      { id: "string-algo", name: "String Algorithms" },
      { id: "complexity-opt", name: "Complexity & Optimization" },
    ],
  },
  {
    _id: "os", name: "Operating Systems", abbr: "OS",
    color: "#DC2626", weightage: 5, mcqCount: 0, source: "system" as const,
    topics: [
      { id: "intro-os", name: "Introduction to OS" },
      { id: "os-structures", name: "OS Structures" },
      { id: "process-mgmt", name: "Process Management" },
      { id: "cpu-scheduling", name: "CPU Scheduling" },
      { id: "thread-mgmt", name: "Thread Management" },
      { id: "concurrency-sync", name: "Concurrency & Synchronization" },
      { id: "deadlocks", name: "Deadlocks" },
      { id: "memory-mgmt", name: "Memory Management" },
      { id: "file-systems", name: "File Systems" },
      { id: "secondary-storage", name: "Secondary Storage" },
      { id: "io-systems", name: "I/O Systems" },
      { id: "protection-security", name: "Protection & Security" },
    ],
  },
  {
    _id: "webdev", name: "Web Development", abbr: "WEB",
    color: "#EC4899", weightage: 10, mcqCount: 0, source: "system" as const,
    topics: [
      { id: "intro-web", name: "Introduction to Web Development" },
      { id: "web-arch", name: "Web Architecture & Protocols" },
      { id: "html", name: "HTML Fundamentals" },
      { id: "css", name: "CSS Fundamentals" },
      { id: "advanced-css", name: "Advanced CSS & Responsive Design" },
      { id: "js-fundamentals", name: "JavaScript Fundamentals" },
      { id: "advanced-js", name: "Advanced JavaScript" },
      { id: "frontend-frameworks", name: "Frontend Frameworks & Libraries" },
      { id: "backend-fundamentals", name: "Backend Development Fundamentals" },
      { id: "server-side", name: "Server-Side Programming" },
      { id: "web-databases", name: "Databases for Web Applications" },
      { id: "web-security", name: "Web Security" },
      { id: "web-perf", name: "Web Performance & Optimization" },
      { id: "web-testing", name: "Web Testing & Debugging" },
      { id: "deployment", name: "Deployment & Hosting" },
      { id: "web-apis", name: "Web APIs & Integration" },
      { id: "modern-web", name: "Modern Web Practices" },
    ],
  },
  {
    _id: "se", name: "Software Engineering", abbr: "SE",
    color: "#0891B2", weightage: 10, mcqCount: 0, source: "system" as const,
    topics: [
      { id: "intro-se", name: "Introduction to Software Engineering" },
      { id: "process-models", name: "Software Process Models" },
      { id: "agile", name: "Agile Development" },
      { id: "requirements", name: "Requirements Engineering" },
      { id: "project-mgmt", name: "Project Management" },
      { id: "software-design", name: "Software Design" },
      { id: "software-arch", name: "Software Architecture" },
      { id: "ui-design", name: "UI Design" },
      { id: "implementation", name: "Implementation & Coding" },
      { id: "testing", name: "Software Testing" },
      { id: "maintenance", name: "Maintenance & Evolution" },
      { id: "qa", name: "Quality Assurance" },
      { id: "metrics", name: "Metrics & Measurement" },
      { id: "config-mgmt", name: "Configuration Management" },
      { id: "risk-mgmt", name: "Risk Management" },
      { id: "security-eng", name: "Security Engineering" },
    ],
  },
  {
    _id: "programming", name: "Programming", abbr: "PRG",
    color: "#4F46E5", weightage: 10, mcqCount: 0, source: "system" as const,
    topics: [
      { id: "prog-fundamentals", name: "Programming Fundamentals" },
      { id: "data-types", name: "Data Types & Variables" },
      { id: "operators", name: "Operators & Expressions" },
      { id: "control-structures", name: "Control Structures" },
      { id: "functions", name: "Functions / Methods" },
      { id: "io-handling", name: "Input / Output Handling" },
      { id: "strings", name: "Strings & Text Processing" },
      { id: "arrays-collections", name: "Arrays & Collections" },
      { id: "oop", name: "Object-Oriented Programming (OOP)" },
      { id: "memory-mgmt", name: "Memory Management Concepts" },
      { id: "exception-handling", name: "Exception & Error Handling" },
      { id: "modules-packages", name: "Modules, Packages & Libraries" },
      { id: "advanced-prog", name: "Advanced Programming Concepts" },
      { id: "concurrency-intro", name: "Concurrency & Parallelism (Intro)" },
      { id: "debugging-testing", name: "Debugging, Testing & Optimization" },
      { id: "dev-practices", name: "Software Development Practices" },
    ],
  },
  {
    _id: "db", name: "Databases", abbr: "DB",
    color: "#D97706", weightage: 10, mcqCount: 0, source: "system" as const,
    topics: [
      { id: "intro-db", name: "Introduction to Database Systems" },
      { id: "db-architecture", name: "Database Architecture" },
      { id: "data-models", name: "Data Models" },
      { id: "relational-concepts", name: "Relational Database Concepts" },
      { id: "relational-algebra", name: "Relational Algebra & Calculus" },
      { id: "sql", name: "SQL" },
      { id: "advanced-sql", name: "Advanced SQL" },
      { id: "normalization", name: "Database Design & Normalization" },
      { id: "transactions", name: "Transaction Management" },
      { id: "concurrency-ctrl", name: "Concurrency Control" },
      { id: "recovery", name: "Recovery Management" },
      { id: "indexing", name: "Indexing & File Organization" },
      { id: "query-opt", name: "Query Processing & Optimization" },
      { id: "db-security", name: "Database Security" },
      { id: "distributed-db", name: "Distributed Databases" },
      { id: "nosql", name: "NoSQL & Modern Databases" },
      { id: "data-warehousing", name: "Data Warehousing & Data Mining" },
    ],
  },
  {
    _id: "cyber", name: "Cyber Security", abbr: "SEC",
    color: "#EA580C", weightage: 5, mcqCount: 0, source: "system" as const,
    topics: [
      { id: "intro-cyber", name: "Introduction to Cyber Security" },
      { id: "security-fundamentals", name: "Security Fundamentals" },
      { id: "cryptography", name: "Cryptography" },
      { id: "network-sec", name: "Network Security" },
      { id: "os-security", name: "OS Security" },
      { id: "web-sec", name: "Web Security" },
      { id: "malware-attacks", name: "Malware & Attacks" },
      { id: "auth-access", name: "Authentication & Access Control" },
      { id: "secure-dev", name: "Secure Software Development" },
      { id: "wireless-mobile-sec", name: "Wireless & Mobile Security" },
      { id: "cloud-sec", name: "Cloud Security" },
      { id: "digital-forensics", name: "Digital Forensics" },
      { id: "incident-response", name: "Incident Response" },
      { id: "security-monitoring", name: "Security Monitoring" },
      { id: "cyber-laws", name: "Cyber Laws & Ethics" },
      { id: "emerging-trends", name: "Emerging Trends" },
    ],
  },
];

// JSON file names matching subject _ids
const mcqFiles = [
  "problem-solving", "ai-ml", "cn-cloud", "dsa", "os",
  "webdev", "se", "programming", "db", "cyber",
];

// ── University subjects ──

const universitySubjects = [
  { _id: "uni-cn-cloud", name: "Computer Networks & Cloud Computing", abbr: "CN", color: "#2563EB", weightage: 0, mcqCount: 0, source: "university" as const, topics: [{ id: "general", name: "General" }] },
  { _id: "uni-os", name: "Operating Systems", abbr: "OS", color: "#DC2626", weightage: 0, mcqCount: 0, source: "university" as const, topics: [{ id: "general", name: "General" }] },
  { _id: "uni-se", name: "Software Engineering", abbr: "SE", color: "#0891B2", weightage: 0, mcqCount: 0, source: "university" as const, topics: [{ id: "general", name: "General" }] },
  { _id: "uni-webdev", name: "Web Development", abbr: "WEB", color: "#EC4899", weightage: 0, mcqCount: 0, source: "university" as const, topics: [{ id: "general", name: "General" }] },
  { _id: "uni-ai-ml", name: "AI / Machine Learning & Data Analytics", abbr: "AI", color: "#7C3AED", weightage: 0, mcqCount: 0, source: "university" as const, topics: [{ id: "general", name: "General" }] },
  { _id: "uni-cyber", name: "Cyber Security", abbr: "SEC", color: "#EA580C", weightage: 0, mcqCount: 0, source: "university" as const, topics: [{ id: "general", name: "General" }] },
  { _id: "uni-db", name: "Databases", abbr: "DB", color: "#D97706", weightage: 0, mcqCount: 0, source: "university" as const, topics: [{ id: "general", name: "General" }] },
  { _id: "uni-problem-solving", name: "Problem Solving & Analytical Skills", abbr: "PS", color: "#0D9488", weightage: 0, mcqCount: 0, source: "university" as const, topics: [{ id: "general", name: "General" }] },
  { _id: "uni-programming", name: "Programming", abbr: "PROG", color: "#6366F1", weightage: 0, mcqCount: 0, source: "university" as const, topics: [{ id: "general", name: "General" }] },
];

const universityMcqFiles = [
  "cn-cloud", "os", "se", "webdev", "ai-ml", "cyber", "db", "problem-solving", "programming",
];

// ---------- Validation ----------

const VALID_DIFFICULTIES = new Set(["easy", "medium", "hard"]);

interface RawQuestion {
  id: string;
  subjectId: string;
  topicId: string;
  difficulty: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const subjectIds = new Set(subjects.map((s) => s._id));
const topicIdsBySubject = new Map<string, Set<string>>();
for (const s of subjects) {
  topicIdsBySubject.set(s._id, new Set(s.topics.map((t) => t.id)));
}

function validateQuestion(q: RawQuestion): string | null {
  if (!q.id || typeof q.id !== "string") return "missing or invalid id";
  if (!subjectIds.has(q.subjectId)) return `invalid subjectId: ${q.subjectId}`;
  const validTopics = topicIdsBySubject.get(q.subjectId);
  if (!validTopics?.has(q.topicId)) return `invalid topicId: ${q.topicId} for subject ${q.subjectId}`;
  if (!VALID_DIFFICULTIES.has(q.difficulty)) return `invalid difficulty: ${q.difficulty}`;
  if (!Array.isArray(q.options) || q.options.length !== 4) return "options must be array of 4";
  if (typeof q.correctAnswer !== "number" || q.correctAnswer < 0 || q.correctAnswer > 3) return "correctAnswer must be 0-3";
  if (!q.text || typeof q.text !== "string") return "missing text";
  if (!q.explanation || typeof q.explanation !== "string") return "missing explanation";
  return null;
}

// ---------- Main ----------

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    // Try loading from .env.local
    try {
      const envContent = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
      for (const line of envContent.split("\n")) {
        const match = line.match(/^(\w+)=(.+)$/);
        if (match) process.env[match[1]] = match[2].trim();
      }
    } catch {
      console.error("ERROR: MONGO_URI not set. Create .env.local with MONGO_URI=<your_connection_string>");
      process.exit(1);
    }
  }

  const mongoUri = process.env.MONGO_URI!;
  if (!mongoUri || mongoUri.includes("<username>")) {
    console.error("ERROR: MONGO_URI contains placeholder values. Update .env.local with your actual connection string.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(DB_NAME);

  // --- Step 0: Drop old data for a clean slate ---
  console.log("\n--- Dropping old collections ---");
  const mcqsCol = db.collection<{ _id: string }>("mcqs");
  const subjectsCol = db.collection<{ _id: string }>("subjects");
  await mcqsCol.drop().catch(() => { /* collection may not exist */ });
  await subjectsCol.drop().catch(() => { /* collection may not exist */ });
  console.log("Dropped 'mcqs' and 'subjects' collections");

  // --- Step 1: Upsert subjects (system + university) ---
  console.log("\n--- Seeding subjects ---");
  const allSubjects = [...subjects, ...universitySubjects];
  for (const s of allSubjects) {
    await subjectsCol.updateOne(
      { _id: s._id },
      { $set: s },
      { upsert: true }
    );
  }
  console.log(`Upserted ${allSubjects.length} subjects (${subjects.length} system + ${universitySubjects.length} university)`);

  // --- Step 2: Seed MCQs ---
  console.log("\n--- Seeding MCQs ---");
  let totalInserted = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const fileName of mcqFiles) {
    const filePath = join(process.cwd(), "data", "mcqs", `${fileName}.json`);
    let questions: RawQuestion[];

    try {
      questions = JSON.parse(readFileSync(filePath, "utf-8"));
    } catch (err) {
      console.error(`  Failed to read ${fileName}.json:`, err);
      totalErrors++;
      continue;
    }

    console.log(`  Processing ${fileName}.json (${questions.length} questions)...`);

    // Validate and prepare batch operations
    const ops: AnyBulkWriteOperation<{ _id: string }>[] = [];
    let fileSkipped = 0;

    for (const q of questions) {
      const error = validateQuestion(q);
      if (error) {
        console.warn(`    SKIP ${q.id}: ${error}`);
        fileSkipped++;
        continue;
      }

      ops.push({
        updateOne: {
          filter: { _id: q.id },
          update: {
            $set: {
              _id: q.id,
              subjectId: q.subjectId,
              topicId: q.topicId,
              difficulty: q.difficulty,
              text: q.text,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              source: "system",
            },
          },
          upsert: true,
        },
      });
    }

    // Execute in batches
    for (let i = 0; i < ops.length; i += BATCH_SIZE) {
      const batch = ops.slice(i, i + BATCH_SIZE);
      await mcqsCol.bulkWrite(batch, { ordered: false });
    }

    totalInserted += ops.length;
    totalSkipped += fileSkipped;
    console.log(`    ${ops.length} upserted, ${fileSkipped} skipped`);
  }

  // --- Step 2b: Seed University MCQs ---
  console.log("\n--- Seeding University MCQs ---");
  let uniInserted = 0;

  interface UniQuestion {
    id: string;
    subjectId: string;
    topicId: string;
    difficulty: string;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    source: string;
  }

  for (const fileName of universityMcqFiles) {
    const filePath = join(process.cwd(), "data", "mcqs-university", `${fileName}.json`);
    let questions: UniQuestion[];

    try {
      questions = JSON.parse(readFileSync(filePath, "utf-8"));
    } catch (err) {
      console.error(`  Failed to read university/${fileName}.json:`, err);
      continue;
    }

    console.log(`  Processing university/${fileName}.json (${questions.length} questions)...`);

    const ops: AnyBulkWriteOperation<{ _id: string }>[] = [];
    for (const q of questions) {
      if (!q.id || !q.text || !Array.isArray(q.options) || q.options.length !== 4) continue;

      ops.push({
        updateOne: {
          filter: { _id: q.id },
          update: {
            $set: {
              _id: q.id,
              subjectId: q.subjectId,
              topicId: q.topicId,
              difficulty: q.difficulty,
              text: q.text,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              source: "university",
            },
          },
          upsert: true,
        },
      });
    }

    for (let i = 0; i < ops.length; i += BATCH_SIZE) {
      const batch = ops.slice(i, i + BATCH_SIZE);
      await mcqsCol.bulkWrite(batch, { ordered: false });
    }

    uniInserted += ops.length;
    console.log(`    ${ops.length} upserted`);
  }

  totalInserted += uniInserted;

  // --- Step 3: Update mcqCount on subjects ---
  console.log("\n--- Updating subject mcqCounts ---");
  const counts = await mcqsCol
    .aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$subjectId", count: { $sum: 1 } } },
    ])
    .toArray();

  for (const { _id, count } of counts) {
    await subjectsCol.updateOne({ _id }, { $set: { mcqCount: count } });
    console.log(`  ${_id}: ${count} MCQs`);
  }

  // --- Step 4: Create indexes ---
  console.log("\n--- Creating indexes ---");

  // Compound index for filtering
  await mcqsCol.createIndex(
    { source: 1, subjectId: 1, topicId: 1, difficulty: 1 },
    { name: "idx_filter" }
  );
  console.log("  Created compound index: { source, subjectId, topicId, difficulty }");

  // Text index for search
  await mcqsCol.createIndex(
    { text: "text", explanation: "text" },
    { name: "idx_text_search" }
  );
  console.log("  Created text index: { text, explanation }");

  // --- Summary ---
  const totalDocs = await mcqsCol.countDocuments();
  console.log("\n========== SEED COMPLETE ==========");
  console.log(`  Subjects: ${allSubjects.length} (${subjects.length} system + ${universitySubjects.length} university)`);
  console.log(`  MCQs upserted: ${totalInserted} (${totalInserted - uniInserted} system + ${uniInserted} university)`);
  console.log(`  MCQs skipped: ${totalSkipped}`);
  console.log(`  Errors: ${totalErrors}`);
  console.log(`  Total MCQs in DB: ${totalDocs}`);
  console.log(`  Indexes: ${(await mcqsCol.listIndexes().toArray()).length}`);
  console.log("====================================\n");

  await client.close();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
