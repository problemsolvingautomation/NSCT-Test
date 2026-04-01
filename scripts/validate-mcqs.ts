/**
 * Validate MCQ JSON files for schema, distribution, duplicates, and ID integrity.
 *
 * Usage:
 *   npx tsx scripts/validate-mcqs.ts
 *   npx tsx scripts/validate-mcqs.ts cn-cloud    # validate a single subject
 */

import { readFileSync } from "fs";
import { join } from "path";

// ── Subject/topic definitions (mirrors lib/mock-data.ts) ──

const subjectDefs: Record<string, { topics: string[]; expectedPerDifficulty: number }> = {
  "problem-solving": {
    topics: ["intro-ps","problem-analysis","logical-reasoning","algo-flow","data-repr","pattern-recog","math-reasoning","algo-thinking","critical-thinking","debugging-analysis","complexity-aware","ps-programming","data-driven-ps","creative-thinking","real-world-ps","comm-docs"],
    expectedPerDifficulty: 40,
  },
  "ai-ml": {
    topics: ["intro-ai","math-foundations","python-ai","data-preprocessing","eda","supervised","ensemble","unsupervised","model-eval","feature-eng","deep-learning","advanced-dl","nlp","computer-vision","big-data","mlops","ai-ethics"],
    expectedPerDifficulty: 40,
  },
  "cn-cloud": {
    topics: ["data-comm","computer-networks","data-link-layer","network-layer","transport-layer","application-layer","wireless-networks","cloud-computing","network-security","next-gen-networks"],
    expectedPerDifficulty: 40,
  },
  "dsa": {
    topics: ["foundations","linear-ds","non-linear-ds","searching","sorting","hashing","tree-algo","graph-algo","algo-design","advanced-ds","string-algo","complexity-opt"],
    expectedPerDifficulty: 40,
  },
  "os": {
    topics: ["intro-os","os-structures","process-mgmt","cpu-scheduling","thread-mgmt","concurrency-sync","deadlocks","memory-mgmt","file-systems","secondary-storage","io-systems","protection-security"],
    expectedPerDifficulty: 40,
  },
  "webdev": {
    topics: ["intro-web","web-arch","html","css","advanced-css","js-fundamentals","advanced-js","frontend-frameworks","backend-fundamentals","server-side","web-databases","web-security","web-perf","web-testing","deployment","web-apis","modern-web"],
    expectedPerDifficulty: 40,
  },
  "se": {
    topics: ["intro-se","process-models","agile","requirements","project-mgmt","software-design","software-arch","ui-design","implementation","testing","maintenance","qa","metrics","config-mgmt","risk-mgmt","security-eng"],
    expectedPerDifficulty: 40,
  },
  "programming": {
    topics: ["prog-fundamentals","data-types","operators","control-structures","functions","io-handling","strings","arrays-collections","oop","memory-mgmt","exception-handling","modules-packages","advanced-prog","concurrency-intro","debugging-testing","dev-practices"],
    expectedPerDifficulty: 40,
  },
  "db": {
    topics: ["intro-db","db-architecture","data-models","relational-concepts","relational-algebra","sql","advanced-sql","normalization","transactions","concurrency-ctrl","recovery","indexing","query-opt","db-security","distributed-db","nosql","data-warehousing"],
    expectedPerDifficulty: 40,
  },
  "cyber": {
    topics: ["intro-cyber","security-fundamentals","cryptography","network-sec","os-security","web-sec","malware-attacks","auth-access","secure-dev","wireless-mobile-sec","cloud-sec","digital-forensics","incident-response","security-monitoring","cyber-laws","emerging-trends"],
    expectedPerDifficulty: 40,
  },
};

const DIFFICULTIES = ["easy", "medium", "hard"] as const;

interface Question {
  id: string;
  subjectId: string;
  topicId: string;
  difficulty: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// ── Helpers ──

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

function similarity(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return 1;
  // Simple Jaccard on word sets
  const setA = new Set(na.split(" "));
  const setB = new Set(nb.split(" "));
  let intersection = 0;
  for (const w of setA) if (setB.has(w)) intersection++;
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// ── Main ──

function validate(subjectId: string) {
  const def = subjectDefs[subjectId];
  if (!def) {
    console.error(`Unknown subject: ${subjectId}`);
    return false;
  }

  const filePath = join(process.cwd(), "data", "mcqs", `${subjectId}.json`);
  let questions: Question[];
  try {
    questions = JSON.parse(readFileSync(filePath, "utf-8"));
  } catch (err) {
    console.error(`Failed to read ${filePath}:`, err);
    return false;
  }

  let errors = 0;
  const ids = new Set<string>();
  const textsByTopic = new Map<string, string[]>();

  // Per-question validation
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const loc = `[${i}] ${q.id || "NO_ID"}`;

    // Schema checks
    if (!q.id || typeof q.id !== "string") { console.error(`  ${loc}: missing/invalid id`); errors++; continue; }
    if (ids.has(q.id)) { console.error(`  ${loc}: DUPLICATE id`); errors++; }
    ids.add(q.id);

    if (q.subjectId !== subjectId) { console.error(`  ${loc}: subjectId "${q.subjectId}" != "${subjectId}"`); errors++; }
    if (!def.topics.includes(q.topicId)) { console.error(`  ${loc}: invalid topicId "${q.topicId}"`); errors++; }
    if (!DIFFICULTIES.includes(q.difficulty as any)) { console.error(`  ${loc}: invalid difficulty "${q.difficulty}"`); errors++; }
    if (!Array.isArray(q.options) || q.options.length !== 4) { console.error(`  ${loc}: options must be array of 4`); errors++; }
    else {
      const optSet = new Set(q.options.map(o => o.trim()));
      if (optSet.size < 4) { console.error(`  ${loc}: duplicate options detected`); errors++; }
      for (let j = 0; j < 4; j++) {
        if (!q.options[j] || typeof q.options[j] !== "string" || q.options[j].trim() === "") {
          console.error(`  ${loc}: empty option at index ${j}`); errors++;
        }
      }
    }
    if (typeof q.correctAnswer !== "number" || q.correctAnswer < 0 || q.correctAnswer > 3) {
      console.error(`  ${loc}: correctAnswer must be 0-3, got ${q.correctAnswer}`); errors++;
    }
    if (!q.text || typeof q.text !== "string") { console.error(`  ${loc}: missing text`); errors++; }
    if (!q.explanation || typeof q.explanation !== "string") { console.error(`  ${loc}: missing explanation`); errors++; }
    if (q.explanation && q.explanation.length < 15) { console.error(`  ${loc}: explanation too short (${q.explanation.length} chars)`); errors++; }

    // Collect texts for dedup
    if (!textsByTopic.has(q.topicId)) textsByTopic.set(q.topicId, []);
    textsByTopic.get(q.topicId)!.push(q.text);
  }

  // Distribution check
  const dist = new Map<string, Map<string, number>>();
  for (const q of questions) {
    if (!dist.has(q.topicId)) dist.set(q.topicId, new Map());
    const topicMap = dist.get(q.topicId)!;
    topicMap.set(q.difficulty, (topicMap.get(q.difficulty) || 0) + 1);
  }

  for (const topicId of def.topics) {
    const topicMap = dist.get(topicId);
    if (!topicMap) { console.error(`  Missing topic: ${topicId}`); errors++; continue; }
    for (const diff of DIFFICULTIES) {
      const count = topicMap.get(diff) || 0;
      if (count !== def.expectedPerDifficulty) {
        console.warn(`  WARN ${topicId}/${diff}: expected ${def.expectedPerDifficulty}, got ${count}`);
      }
    }
  }

  // Deduplication check (within same topic)
  for (const [topicId, texts] of textsByTopic) {
    for (let i = 0; i < texts.length; i++) {
      for (let j = i + 1; j < texts.length; j++) {
        const sim = similarity(texts[i], texts[j]);
        if (sim > 0.85) {
          console.warn(`  NEAR-DUPLICATE in ${topicId}: "${texts[i].slice(0, 60)}..." ↔ "${texts[j].slice(0, 60)}..." (${(sim * 100).toFixed(0)}%)`);
        }
      }
    }
  }

  console.log(`\n${subjectId}: ${questions.length} questions, ${errors} errors`);
  return errors === 0;
}

// ── CLI ──

const targetSubject = process.argv[2];
const subjectsToValidate = targetSubject ? [targetSubject] : Object.keys(subjectDefs);

let allPassed = true;
for (const subjectId of subjectsToValidate) {
  console.log(`\n========== Validating ${subjectId} ==========`);
  if (!validate(subjectId)) allPassed = false;
}

console.log(allPassed ? "\n✅ All validations passed!" : "\n❌ Some validations failed.");
process.exit(allPassed ? 0 : 1);
