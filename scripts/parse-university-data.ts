/**
 * Parser: converts data/mcqs-from-uni/data.txt into structured JSON files.
 *
 * Usage:
 *   npx tsx scripts/parse-university-data.ts
 *
 * Outputs JSON files to data/mcqs-university/<subject>.json
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// ── Subject mapping ──

interface SubjectConfig {
  /** Regex to match the header line in data.txt */
  headerPattern: RegExp;
  /** Output subject ID */
  subjectId: string;
  /** Display name */
  name: string;
}

const SUBJECT_CONFIGS: SubjectConfig[] = [
  { headerPattern: /^COMPUTER NETWORKS AND CLOUD COMPUTING$/i, subjectId: "uni-cn-cloud", name: "Computer Networks & Cloud Computing" },
  { headerPattern: /^OPERATING SYS\w*$/i, subjectId: "uni-os", name: "Operating Systems" },
  { headerPattern: /^SOFTWARE ENGINEERING$/i, subjectId: "uni-se", name: "Software Engineering" },
  { headerPattern: /^MCQs on Software Design$/i, subjectId: "uni-se", name: "Software Engineering" }, // continuation
  { headerPattern: /^WEB DEVELOPMENT$/i, subjectId: "uni-webdev", name: "Web Development" },
  { headerPattern: /^AI \/ Machine Learning and Data Analytics$/i, subjectId: "uni-ai-ml", name: "AI / Machine Learning & Data Analytics" },
  { headerPattern: /^CYBER SECURITY$/i, subjectId: "uni-cyber", name: "Cyber Security" },
  { headerPattern: /^DATABASE$/i, subjectId: "uni-db", name: "Databases" },
  { headerPattern: /^PROBLEM SOLVING AND ANALYTICAL SKILLS$/i, subjectId: "uni-problem-solving", name: "Problem Solving & Analytical Skills" },
];

// ── Types ──

interface ParsedMcq {
  id: string;
  subjectId: string;
  topicId: string;
  difficulty: string;
  text: string;
  options: string[];
  correctAnswer: number; // 0-3, or -1 if unknown
  explanation: string;
  source: string;
}

// ── Helpers ──

function letterToIndex(letter: string): number {
  const map: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };
  return map[letter.toLowerCase()] ?? -1;
}

function detectSubject(line: string): SubjectConfig | null {
  const trimmed = line.trim();
  for (const cfg of SUBJECT_CONFIGS) {
    if (cfg.headerPattern.test(trimmed)) return cfg;
  }
  return null;
}

// ── Parsing ──

interface RawSection {
  config: SubjectConfig;
  lines: string[];
}

function splitIntoSections(allLines: string[]): RawSection[] {
  const sections: RawSection[] = [];
  let current: RawSection | null = null;

  for (const line of allLines) {
    const cfg = detectSubject(line);
    if (cfg) {
      // "MCQs on Software Design" is a continuation of SE, merge into existing
      if (cfg.subjectId === "uni-se" && current?.config.subjectId === "uni-se") {
        // just continue accumulating lines
        continue;
      }
      if (current) sections.push(current);
      current = { config: cfg, lines: [] };
      continue;
    }
    if (current) current.lines.push(line);
  }
  if (current) sections.push(current);

  // Merge sections with same subjectId (e.g., SE might have been split by a different header match)
  const merged = new Map<string, RawSection>();
  for (const sec of sections) {
    const existing = merged.get(sec.config.subjectId);
    if (existing) {
      existing.lines.push(...sec.lines);
    } else {
      merged.set(sec.config.subjectId, sec);
    }
  }

  return Array.from(merged.values());
}

/** Check if a line is a question number start (e.g., "1.", "Q1.", "Q 1.", "300.", "16. ") */
function parseQuestionNumber(line: string): number | null {
  const m = line.match(/^\s*(?:Q\s*)?(\d+)[.)]\s*/i);
  if (m) return parseInt(m[1], 10);
  return null;
}

/** Check if a line is an option (e.g., "A) ...", "a. ...", "A. ...") */
function parseOption(line: string): { letter: string; text: string } | null {
  const m = line.match(/^\s*([A-Da-d])[.)]\s*(.+)/);
  if (m) return { letter: m[1].toUpperCase(), text: m[2].trim() };
  return null;
}

/** Check if a line is an answer (e.g., "Answer: B", "ANSWER: b") */
function parseAnswerLine(line: string): string | null {
  const m = line.match(/^\s*(?:Answer|ANSWER)\s*:\s*([A-Da-d])/i);
  if (m) return m[1].toUpperCase();
  return null;
}

/** Check if a line is an answer key entry (e.g., "1. B", "31. D") in OS section */
function parseAnswerKeyEntry(line: string): { qNum: number; letter: string } | null {
  const m = line.match(/^\s*(\d+)\.\s*([A-Da-d])\s*$/i);
  if (m) return { qNum: parseInt(m[1], 10), letter: m[1] ? m[2].toUpperCase() : "" };
  return null;
}

interface QuestionAccum {
  num: number;
  textLines: string[];
  options: Map<string, string>; // A->text, B->text, etc.
  answer: string | null; // A/B/C/D or null
}

function parseSection(section: RawSection): ParsedMcq[] {
  const { config, lines } = section;
  const isOsSection = config.subjectId === "uni-os";

  // Phase 1: Extract questions
  const questions: QuestionAccum[] = [];
  let current: QuestionAccum | null = null;
  let inAnswerKey = false;
  const answerKeyMap = new Map<number, string>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Detect answer key section (OS section specific)
    if (trimmed === "Answer Key") {
      inAnswerKey = true;
      if (current) {
        questions.push(current);
        current = null;
      }
      continue;
    }

    if (inAnswerKey) {
      const akEntry = parseAnswerKeyEntry(trimmed);
      if (akEntry) {
        answerKeyMap.set(akEntry.qNum, akEntry.letter);
      }
      continue;
    }

    // Check for answer line
    const answerLetter = parseAnswerLine(trimmed);
    if (answerLetter && current) {
      current.answer = answerLetter;
      questions.push(current);
      current = null;
      continue;
    }

    // Check for option line
    const opt = parseOption(trimmed);
    if (opt && current) {
      current.options.set(opt.letter, opt.text);
      continue;
    }

    // Check for question start
    const qNum = parseQuestionNumber(trimmed);
    if (qNum !== null) {
      if (current) {
        questions.push(current);
      }
      // Extract text after the question number
      const textMatch = trimmed.match(/^\s*(?:Q\s*)?(\d+)[.)]\s*(.*)/i);
      const qText = textMatch ? textMatch[2].trim() : "";
      current = {
        num: qNum,
        textLines: qText ? [qText] : [],
        options: new Map(),
        answer: null,
      };
      continue;
    }

    // Continuation line (part of question text or blank)
    if (current && trimmed && !current.options.size) {
      // Part of question text (before options start)
      current.textLines.push(trimmed);
    }
  }

  // Don't forget last question
  if (current && !inAnswerKey) {
    questions.push(current);
  }

  // Phase 2: Apply answer key (for OS section)
  if (answerKeyMap.size > 0) {
    for (const q of questions) {
      if (!q.answer) {
        const key = answerKeyMap.get(q.num);
        if (key) q.answer = key;
      }
    }
  }

  // Phase 3: Convert to ParsedMcq, deduplicate
  const seen = new Set<string>();
  const results: ParsedMcq[] = [];
  let seqNum = 0;

  for (const q of questions) {
    // Must have question text
    const text = q.textLines.join(" ").trim();
    if (!text) continue;

    // Must have exactly 4 options (or at least some)
    const optA = q.options.get("A") ?? "";
    const optB = q.options.get("B") ?? "";
    const optC = q.options.get("C") ?? "";
    const optD = q.options.get("D") ?? "";

    // Skip if fewer than 4 options
    if (!optA || !optB || !optC || !optD) continue;

    // Deduplicate by question text
    const dedupeKey = text.toLowerCase().replace(/\s+/g, " ");
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    seqNum++;
    const correctAnswer = q.answer ? letterToIndex(q.answer) : -1;

    results.push({
      id: `${config.subjectId}-${String(seqNum).padStart(4, "0")}`,
      subjectId: config.subjectId,
      topicId: "general",
      difficulty: "unrated",
      text,
      options: [optA, optB, optC, optD],
      correctAnswer,
      explanation: "",
      source: "university",
    });
  }

  return results;
}

// ── Main ──

function main() {
  const dataPath = join(process.cwd(), "data", "mcqs-from-uni", "data.txt");
  const outputDir = join(process.cwd(), "data", "mcqs-university");

  console.log("Reading data file...");
  const raw = readFileSync(dataPath, "utf-8");
  const allLines = raw.split(/\r?\n/);
  console.log(`  Total lines: ${allLines.length}`);

  console.log("\nSplitting into sections...");
  const sections = splitIntoSections(allLines);
  for (const s of sections) {
    console.log(`  ${s.config.subjectId}: ${s.lines.length} lines`);
  }

  mkdirSync(outputDir, { recursive: true });

  console.log("\nParsing sections...");
  let grandTotal = 0;
  let totalWithAnswer = 0;
  let totalWithoutAnswer = 0;

  for (const section of sections) {
    const mcqs = parseSection(section);
    const withAnswer = mcqs.filter((m) => m.correctAnswer >= 0).length;
    const withoutAnswer = mcqs.filter((m) => m.correctAnswer < 0).length;

    console.log(`  ${section.config.subjectId}: ${mcqs.length} MCQs (${withAnswer} with answer, ${withoutAnswer} without)`);

    const outPath = join(outputDir, `${section.config.subjectId.replace("uni-", "")}.json`);
    writeFileSync(outPath, JSON.stringify(mcqs, null, 2), "utf-8");

    grandTotal += mcqs.length;
    totalWithAnswer += withAnswer;
    totalWithoutAnswer += withoutAnswer;
  }

  console.log("\n========== PARSE COMPLETE ==========");
  console.log(`  Subjects: ${sections.length}`);
  console.log(`  Total MCQs: ${grandTotal}`);
  console.log(`  With answer: ${totalWithAnswer}`);
  console.log(`  Without answer (practice only): ${totalWithoutAnswer}`);
  console.log(`  Output: ${outputDir}`);
  console.log("====================================\n");
}

main();
