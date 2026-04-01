/**
 * Generate white-labeled MCQ PDFs from the custom (system) dataset.
 *
 * Usage:
 *   npx tsx scripts/generate-custom-pdfs.ts              # all subjects
 *   npx tsx scripts/generate-custom-pdfs.ts cyber         # single subject
 */

import PDFDocument from "pdfkit";
import { readFileSync, readdirSync, mkdirSync, existsSync, createWriteStream } from "fs";
import { join, basename } from "path";

// ---------- Config ----------

const DATA_DIR = join(__dirname, "..", "data", "mcqs");
const OUT_DIR = join(__dirname, "..", "public", "custom-pdfs");
const LOGO_PATH = join(__dirname, "..", "public", "NSCTPrep-Logo.png");

const BRAND = {
  name: "NSCT Prep",
  tagline: "Free MCQ Practice for NSCT Test Preparation",
  website: "nsctprep.dev",
  developer: "Developed by Muhammad Abdullah Awais",
  attribution: "This dataset is created and compiled by Muhammad Abdullah Awais",
};

const COLORS = {
  primary: "#0D9488",
  primaryDark: "#0F766E",
  border: "#E2E8F0",
  textDark: "#1E293B",
  textMuted: "#64748B",
  bgLight: "#F8FAFC",
  white: "#FFFFFF",
};

const SUBJECT_NAMES: Record<string, string> = {
  "ai-ml": "AI / Machine Learning & Data Analytics",
  "cn-cloud": "Computer Networks & Cloud Computing",
  "cyber": "Cyber Security",
  "db": "Databases",
  "dsa": "Data Structures & Algorithms",
  "os": "Operating Systems",
  "problem-solving": "Problem Solving & Analytical Skills",
  "programming": "Programming (C++, Java, Python)",
  "se": "Software Engineering",
  "webdev": "Web Development",
};

const OPTION_LETTERS = ["A", "B", "C", "D"];
const DIFFICULTY_ORDER = ["easy", "medium", "hard"] as const;
const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

// ---------- Types ----------

interface MCQ {
  id: string;
  subjectId: string;
  topicId: string;
  difficulty: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// ---------- Helpers ----------

function groupByDifficulty(mcqs: MCQ[]): { difficulty: string; label: string; mcqs: MCQ[] }[] {
  return DIFFICULTY_ORDER
    .map((d) => ({
      difficulty: d,
      label: DIFFICULTY_LABELS[d],
      mcqs: mcqs.filter((q) => q.difficulty === d),
    }))
    .filter((g) => g.mcqs.length > 0);
}

// ---------- PDF Generation ----------

function generatePdf(mcqs: MCQ[], subjectName: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 55, bottom: 45, left: 45, right: 45 },
      bufferPages: true,
      info: {
        Title: `${subjectName} — ${BRAND.name}`,
        Author: "Muhammad Abdullah Awais",
        Subject: subjectName,
        Creator: BRAND.name,
      },
    });

    const stream = createWriteStream(outputPath);
    doc.pipe(stream);

    const LEFT = doc.page.margins.left;
    const RIGHT = doc.page.width - doc.page.margins.right;
    const pageWidth = RIGHT - LEFT;
    const pH = doc.page.height;
    const contentTop = 75;

    function ensureSpace(needed: number) {
      const bottom = doc.page.height - doc.page.margins.bottom;
      if (doc.y + needed > bottom) {
        doc.addPage();
        doc.y = contentTop;
      }
    }

    // ========== TITLE PAGE ==========
    const pW = doc.page.width;

    // --- Top accent bar ---
    doc.rect(0, 0, pW, 6).fill(COLORS.primary);
    doc.rect(0, 6, pW, 1).fill(COLORS.border);

    // --- Collection label ---
    doc.y = 70;
    doc.fontSize(9).font("Helvetica").fillColor(COLORS.textMuted)
      .text("SYSTEM MCQs COLLECTION", { align: "center", characterSpacing: 3 });

    // --- Logo ---
    const logoSize = 90;
    const logoX = (pW - logoSize) / 2;
    doc.image(LOGO_PATH, logoX, 105, { width: logoSize, height: logoSize });

    // --- Brand name ---
    doc.y = 210;
    doc.fontSize(32).font("Helvetica-Bold").fillColor(COLORS.primary)
      .text(BRAND.name, { align: "center" });

    // --- Tagline ---
    doc.moveDown(0.2);
    doc.fontSize(11).font("Helvetica").fillColor(COLORS.textMuted)
      .text(BRAND.tagline, { align: "center" });

    // --- Decorative divider ---
    doc.moveDown(2);
    const divY = doc.y;
    const cx = pW / 2;
    doc.strokeColor(COLORS.primary).lineWidth(1.5);
    doc.moveTo(cx - 60, divY).lineTo(cx - 8, divY).stroke();
    doc.moveTo(cx + 8, divY).lineTo(cx + 60, divY).stroke();
    doc.save();
    doc.translate(cx, divY);
    doc.rotate(45);
    doc.rect(-4, -4, 8, 8).strokeColor(COLORS.primary).lineWidth(1.5).stroke();
    doc.restore();

    // --- Subject name ---
    doc.moveDown(2);
    doc.fontSize(24).font("Helvetica-Bold").fillColor(COLORS.textDark)
      .text(subjectName, { align: "center" });

    // --- MCQ count pill ---
    doc.moveDown(1);
    const pillText = `${mcqs.length} Multiple Choice Questions`;
    doc.fontSize(12).font("Helvetica");
    const pillWidth = doc.widthOfString(pillText) + 40;
    const pillX = (pW - pillWidth) / 2;
    const pillY = doc.y;
    doc.roundedRect(pillX, pillY, pillWidth, 28, 14).fill(COLORS.bgLight);
    doc.roundedRect(pillX, pillY, pillWidth, 28, 14)
      .strokeColor(COLORS.border).lineWidth(1).stroke();
    doc.fillColor(COLORS.textMuted)
      .text(pillText, pillX, pillY + 8, { width: pillWidth, align: "center" });

    // --- Bottom section ---
    const bottomSepY = pH - 130;
    doc.strokeColor(COLORS.border).lineWidth(0.5)
      .moveTo(LEFT + 60, bottomSepY).lineTo(RIGHT - 60, bottomSepY).stroke();

    // Website
    doc.fontSize(11).font("Helvetica-Bold").fillColor(COLORS.primary);
    doc.text(BRAND.website, LEFT, bottomSepY + 20, {
      width: pageWidth, align: "center",
      link: "https://nsctprep.dev", underline: true,
    });

    // Attribution
    doc.moveDown(0.5);
    doc.fontSize(9).font("Helvetica").fillColor(COLORS.textMuted)
      .text(BRAND.attribution, { align: "center" });

    // Year
    doc.moveDown(0.3);
    doc.fontSize(8).font("Helvetica").fillColor(COLORS.textMuted)
      .text(`© ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.`, { align: "center" });

    // --- Bottom accent bar ---
    doc.rect(0, pH - 7, pW, 1).fill(COLORS.border);
    doc.rect(0, pH - 6, pW, 6).fill(COLORS.primary);

    // ========== MCQ PAGES ==========
    const groups = groupByDifficulty(mcqs);
    let globalQ = 0;

    for (const group of groups) {
      doc.addPage();
      doc.y = contentTop;

      // Difficulty section header
      doc.fontSize(16).font("Helvetica-Bold").fillColor(COLORS.primary)
        .text(`${group.label} Questions`, { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(9).font("Helvetica").fillColor(COLORS.textMuted)
        .text(`${group.mcqs.length} questions`, { align: "center" });
      doc.moveDown(1);

      for (let i = 0; i < group.mcqs.length; i++) {
        const mcq = group.mcqs[i];
        globalQ++;

        ensureSpace(95);

        const boxTop = doc.y;

        // Question number + text
        doc.fontSize(10).font("Helvetica-Bold").fillColor(COLORS.textDark)
          .text(`Q${globalQ}. ${mcq.text}`, LEFT + 10, doc.y + 6, {
            width: pageWidth - 20,
            lineGap: 1,
          });
        doc.moveDown(0.15);

        // Options
        for (let j = 0; j < mcq.options.length; j++) {
          doc.fontSize(9.5).font("Helvetica").fillColor(COLORS.textDark)
            .text(`    ${OPTION_LETTERS[j]}.  ${mcq.options[j]}`, LEFT + 10, undefined, {
              width: pageWidth - 20,
              lineGap: 0.5,
            });
        }

        // Correct answer
        doc.moveDown(0.15);
        const ansLetter = OPTION_LETTERS[mcq.correctAnswer] ?? "?";
        doc.fontSize(9).font("Helvetica-Bold").fillColor(COLORS.textDark)
          .text(`    Answer: ${ansLetter}`, LEFT + 10, undefined, {
            width: pageWidth - 20,
          });

        const boxBottom = doc.y + 5;

        // Light border around the question block
        doc.roundedRect(LEFT + 2, boxTop, pageWidth - 4, boxBottom - boxTop, 3)
          .strokeColor(COLORS.border).lineWidth(0.75).stroke();

        doc.y = boxBottom + 4;
      }
    }

    // ========== ADD HEADERS, FOOTERS & PAGE BORDERS ==========
    const totalPages = doc.bufferedPageRange().count;

    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);

      // --- Cover page border ---
      if (i === 0) {
        const borderMargin = 30;
        doc.rect(borderMargin, borderMargin, doc.page.width - borderMargin * 2, pH - borderMargin * 2)
          .strokeColor(COLORS.border).lineWidth(1).stroke();
      }

      // --- Header (skip on title page) ---
      if (i > 0) {
        const hLogoSize = 28;
        const hLogoY = 11;
        const hTextX = LEFT + hLogoSize + 8;
        const hCenterY = hLogoY + hLogoSize / 2;
        doc.image(LOGO_PATH, LEFT, hLogoY, { width: hLogoSize, height: hLogoSize });
        doc.fontSize(10).font("Helvetica-Bold").fillColor(COLORS.textDark);
        doc.text(BRAND.name, hTextX, hCenterY - 10, { lineBreak: false });
        doc.fontSize(6.5).font("Helvetica").fillColor(COLORS.textMuted);
        doc.text("TEST PREPARATION", hTextX, hCenterY + 2, { lineBreak: false, characterSpacing: 1 });
        doc.fontSize(8).font("Helvetica").fillColor(COLORS.textMuted);
        doc.text(subjectName, LEFT, hCenterY - 3, { width: pageWidth, align: "right", lineBreak: false });
        doc.strokeColor(COLORS.border).lineWidth(0.75)
          .moveTo(LEFT, hLogoY + hLogoSize + 5).lineTo(RIGHT, hLogoY + hLogoSize + 5).stroke();
      }

      // --- Footer (skip cover page) ---
      if (i > 0) {
        const contentPages = totalPages - 1;
        const fLineY = pH - 35;
        const fTextY = pH - 28;

        doc.strokeColor(COLORS.border).lineWidth(0.75)
          .moveTo(LEFT, fLineY).lineTo(RIGHT, fLineY).stroke();

        doc.font("Helvetica").fontSize(7);
        doc.fillColor(COLORS.textMuted);
        doc.text(BRAND.developer, LEFT, fTextY, { lineBreak: false });

        doc.fillColor(COLORS.primary);
        const wsWidth = doc.widthOfString(BRAND.website);
        const wsX = LEFT + (pageWidth - wsWidth) / 2;
        doc.text(BRAND.website, wsX, fTextY, { lineBreak: false });
        doc.link(wsX, fTextY - 2, wsWidth, 12, "https://nsctprep.dev");

        const pgText = `Page ${i} of ${contentPages}`;
        const pgWidth = doc.widthOfString(pgText);
        doc.fillColor(COLORS.textMuted);
        doc.text(pgText, RIGHT - pgWidth, fTextY, { lineBreak: false });
      }
    }

    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

// ---------- Combined PDF Generation ----------

function generateCombinedPdf(
  subjects: { mcqs: MCQ[]; subjectName: string }[],
  outputPath: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const totalMcqs = subjects.reduce((sum, s) => sum + s.mcqs.length, 0);

    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 55, bottom: 45, left: 45, right: 45 },
      bufferPages: true,
      info: {
        Title: `All System MCQs — ${BRAND.name}`,
        Author: "Muhammad Abdullah Awais",
        Subject: "All Subjects Combined",
        Creator: BRAND.name,
      },
    });

    const stream = createWriteStream(outputPath);
    doc.pipe(stream);

    const LEFT = doc.page.margins.left;
    const RIGHT = doc.page.width - doc.page.margins.right;
    const pageWidth = RIGHT - LEFT;
    const pH = doc.page.height;
    const pW = doc.page.width;
    const contentTop = 75;

    function ensureSpace(needed: number) {
      const bottom = doc.page.height - doc.page.margins.bottom;
      if (doc.y + needed > bottom) {
        doc.addPage();
        doc.y = contentTop;
      }
    }

    // ========== MAIN COVER PAGE ==========
    doc.rect(0, 0, pW, 6).fill(COLORS.primary);
    doc.rect(0, 6, pW, 1).fill(COLORS.border);

    doc.y = 70;
    doc.fontSize(9).font("Helvetica").fillColor(COLORS.textMuted)
      .text("COMPLETE SYSTEM MCQs COLLECTION", { align: "center", characterSpacing: 3 });

    const logoSize = 90;
    const logoX = (pW - logoSize) / 2;
    doc.image(LOGO_PATH, logoX, 105, { width: logoSize, height: logoSize });

    doc.y = 210;
    doc.fontSize(32).font("Helvetica-Bold").fillColor(COLORS.primary)
      .text(BRAND.name, { align: "center" });

    doc.moveDown(0.2);
    doc.fontSize(11).font("Helvetica").fillColor(COLORS.textMuted)
      .text(BRAND.tagline, { align: "center" });

    // Decorative divider
    doc.moveDown(2);
    const divY = doc.y;
    const cx = pW / 2;
    doc.strokeColor(COLORS.primary).lineWidth(1.5);
    doc.moveTo(cx - 60, divY).lineTo(cx - 8, divY).stroke();
    doc.moveTo(cx + 8, divY).lineTo(cx + 60, divY).stroke();
    doc.save();
    doc.translate(cx, divY);
    doc.rotate(45);
    doc.rect(-4, -4, 8, 8).strokeColor(COLORS.primary).lineWidth(1.5).stroke();
    doc.restore();

    doc.moveDown(2);
    doc.fontSize(24).font("Helvetica-Bold").fillColor(COLORS.textDark)
      .text("All Subjects", { align: "center" });

    // MCQ count pill
    doc.moveDown(1);
    const pillText = `${totalMcqs.toLocaleString()} Multiple Choice Questions · ${subjects.length} Subjects`;
    doc.fontSize(12).font("Helvetica");
    const pillWidth = doc.widthOfString(pillText) + 40;
    const pillX = (pW - pillWidth) / 2;
    const pillY = doc.y;
    doc.roundedRect(pillX, pillY, pillWidth, 28, 14).fill(COLORS.bgLight);
    doc.roundedRect(pillX, pillY, pillWidth, 28, 14)
      .strokeColor(COLORS.border).lineWidth(1).stroke();
    doc.fillColor(COLORS.textMuted)
      .text(pillText, pillX, pillY + 8, { width: pillWidth, align: "center" });

    // Table of contents
    doc.moveDown(2.5);
    doc.fontSize(11).font("Helvetica-Bold").fillColor(COLORS.textDark)
      .text("Subjects Included:", LEFT, doc.y, { width: pageWidth, align: "center" });
    doc.moveDown(1);

    const tableWidth = 360;
    const tableX = (pW - tableWidth) / 2;
    const colName = tableWidth - 80;
    const colCount = 80;

    // Table header
    const headerY = doc.y;
    doc.rect(tableX, headerY, tableWidth, 20).fill(COLORS.primary);
    doc.fontSize(8.5).font("Helvetica-Bold").fillColor(COLORS.white)
      .text("#", tableX + 8, headerY + 5, { width: 20, lineBreak: false })
      .text("Subject", tableX + 28, headerY + 5, { width: colName - 28, lineBreak: false })
      .text("MCQs", tableX + colName, headerY + 5, { width: colCount - 12, align: "right", lineBreak: false });
    doc.y = headerY + 20;

    // Table rows
    for (let si = 0; si < subjects.length; si++) {
      const s = subjects[si];
      const rowY = doc.y;
      const isEven = si % 2 === 0;

      if (isEven) {
        doc.rect(tableX, rowY, tableWidth, 18).fill(COLORS.bgLight);
      }

      doc.fontSize(9).font("Helvetica").fillColor(COLORS.textMuted)
        .text(`${si + 1}`, tableX + 8, rowY + 4, { width: 20, lineBreak: false });
      doc.font("Helvetica-Bold").fillColor(COLORS.textDark)
        .text(s.subjectName, tableX + 28, rowY + 4, { width: colName - 28, lineBreak: false });
      doc.font("Helvetica").fillColor(COLORS.textMuted)
        .text(`${s.mcqs.length.toLocaleString()}`, tableX + colName, rowY + 4, { width: colCount - 12, align: "right", lineBreak: false });

      doc.y = rowY + 18;
    }

    // Table border
    const tableBottom = doc.y;
    doc.roundedRect(tableX, headerY, tableWidth, tableBottom - headerY, 2)
      .strokeColor(COLORS.border).lineWidth(0.75).stroke();

    // Bottom section
    const bottomSepY = pH - 130;
    doc.strokeColor(COLORS.border).lineWidth(0.5)
      .moveTo(LEFT + 60, bottomSepY).lineTo(RIGHT - 60, bottomSepY).stroke();

    doc.fontSize(11).font("Helvetica-Bold").fillColor(COLORS.primary);
    doc.text(BRAND.website, LEFT, bottomSepY + 20, {
      width: pageWidth, align: "center",
      link: "https://nsctprep.dev", underline: true,
    });
    doc.moveDown(0.5);
    doc.fontSize(9).font("Helvetica").fillColor(COLORS.textMuted)
      .text(BRAND.attribution, { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(8).font("Helvetica").fillColor(COLORS.textMuted)
      .text(`© ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.`, { align: "center" });

    doc.rect(0, pH - 7, pW, 1).fill(COLORS.border);
    doc.rect(0, pH - 6, pW, 6).fill(COLORS.primary);

    // Cover page border
    const borderMargin = 30;
    doc.rect(borderMargin, borderMargin, pW - borderMargin * 2, pH - borderMargin * 2)
      .strokeColor(COLORS.border).lineWidth(1).stroke();

    // ========== EACH SUBJECT ==========
    for (const { mcqs, subjectName } of subjects) {
      // Subject separator page
      doc.addPage();
      doc.rect(0, 0, pW, 6).fill(COLORS.primary);
      doc.rect(0, 6, pW, 1).fill(COLORS.border);

      const sepStartY = (pH - 120) / 2;
      doc.fontSize(10).font("Helvetica").fillColor(COLORS.textMuted);
      doc.text("SUBJECT", LEFT, sepStartY, { width: pageWidth, align: "center", characterSpacing: 3 });
      doc.moveDown(1);
      doc.fontSize(26).font("Helvetica-Bold").fillColor(COLORS.primary)
        .text(subjectName, { align: "center" });
      doc.moveDown(0.8);
      doc.fontSize(13).font("Helvetica").fillColor(COLORS.textMuted)
        .text(`${mcqs.length.toLocaleString()} Multiple Choice Questions`, { align: "center" });

      doc.rect(0, pH - 7, pW, 1).fill(COLORS.border);
      doc.rect(0, pH - 6, pW, 6).fill(COLORS.primary);

      // MCQ pages grouped by difficulty
      const groups = groupByDifficulty(mcqs);
      let globalQ = 0;

      for (const group of groups) {
        doc.addPage();
        doc.y = contentTop;

        // Difficulty section header
        doc.fontSize(16).font("Helvetica-Bold").fillColor(COLORS.primary)
          .text(`${subjectName} — ${group.label}`, { align: "center" });
        doc.moveDown(0.3);
        doc.fontSize(9).font("Helvetica").fillColor(COLORS.textMuted)
          .text(`${group.mcqs.length} questions`, { align: "center" });
        doc.moveDown(1);

        for (let i = 0; i < group.mcqs.length; i++) {
          const mcq = group.mcqs[i];
          globalQ++;

          ensureSpace(95);

          const boxTop = doc.y;

          doc.fontSize(10).font("Helvetica-Bold").fillColor(COLORS.textDark)
            .text(`Q${globalQ}. ${mcq.text}`, LEFT + 10, doc.y + 6, {
              width: pageWidth - 20,
              lineGap: 1,
            });
          doc.moveDown(0.15);

          for (let j = 0; j < mcq.options.length; j++) {
            doc.fontSize(9.5).font("Helvetica").fillColor(COLORS.textDark)
              .text(`    ${OPTION_LETTERS[j]}.  ${mcq.options[j]}`, LEFT + 10, undefined, {
                width: pageWidth - 20,
                lineGap: 0.5,
              });
          }

          doc.moveDown(0.15);
          const ansLetter = OPTION_LETTERS[mcq.correctAnswer] ?? "?";
          doc.fontSize(9).font("Helvetica-Bold").fillColor(COLORS.textDark)
            .text(`    Answer: ${ansLetter}`, LEFT + 10, undefined, {
              width: pageWidth - 20,
            });

          const boxBottom = doc.y + 5;
          doc.roundedRect(LEFT + 2, boxTop, pageWidth - 4, boxBottom - boxTop, 3)
            .strokeColor(COLORS.border).lineWidth(0.75).stroke();

          doc.y = boxBottom + 4;
        }
      }
    }

    // ========== HEADERS & FOOTERS ==========
    const totalPages = doc.bufferedPageRange().count;
    const contentPages = totalPages - 1;

    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);

      if (i > 0) {
        // Header
        const hLogoSize = 28;
        const hLogoY = 11;
        const hTextX = LEFT + hLogoSize + 8;
        const hCenterY = hLogoY + hLogoSize / 2;
        doc.image(LOGO_PATH, LEFT, hLogoY, { width: hLogoSize, height: hLogoSize });
        doc.fontSize(10).font("Helvetica-Bold").fillColor(COLORS.textDark);
        doc.text(BRAND.name, hTextX, hCenterY - 10, { lineBreak: false });
        doc.fontSize(6.5).font("Helvetica").fillColor(COLORS.textMuted);
        doc.text("TEST PREPARATION", hTextX, hCenterY + 2, { lineBreak: false, characterSpacing: 1 });
        doc.fontSize(8).font("Helvetica").fillColor(COLORS.textMuted);
        doc.text("All Subjects", LEFT, hCenterY - 3, { width: pageWidth, align: "right", lineBreak: false });
        doc.strokeColor(COLORS.border).lineWidth(0.75)
          .moveTo(LEFT, hLogoY + hLogoSize + 5).lineTo(RIGHT, hLogoY + hLogoSize + 5).stroke();

        // Footer
        const fLineY = pH - 35;
        const fTextY = pH - 28;

        doc.strokeColor(COLORS.border).lineWidth(0.75)
          .moveTo(LEFT, fLineY).lineTo(RIGHT, fLineY).stroke();

        doc.font("Helvetica").fontSize(7);
        doc.fillColor(COLORS.textMuted);
        doc.text(BRAND.developer, LEFT, fTextY, { lineBreak: false });

        doc.fillColor(COLORS.primary);
        const wsWidth = doc.widthOfString(BRAND.website);
        const wsX = LEFT + (pageWidth - wsWidth) / 2;
        doc.text(BRAND.website, wsX, fTextY, { lineBreak: false });
        doc.link(wsX, fTextY - 2, wsWidth, 12, "https://nsctprep.dev");

        const pgText = `Page ${i} of ${contentPages}`;
        const pgWidth = doc.widthOfString(pgText);
        doc.fillColor(COLORS.textMuted);
        doc.text(pgText, RIGHT - pgWidth, fTextY, { lineBreak: false });
      }
    }

    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

// ---------- Main ----------

async function main() {
  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
  }

  const targetSlug = process.argv[2] || null;

  const files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));

  const toProcess = targetSlug
    ? files.filter((f) => basename(f, ".json") === targetSlug)
    : files;

  if (toProcess.length === 0) {
    console.error(`No matching file found for "${targetSlug}"`);
    process.exit(1);
  }

  console.log(`Generating ${toProcess.length} PDF(s)...\n`);

  let totalMcqs = 0;

  for (const file of toProcess) {
    const slug = basename(file, ".json");
    const subjectName = SUBJECT_NAMES[slug] || slug;
    const filePath = join(DATA_DIR, file);
    const outputPath = join(OUT_DIR, `${slug}-nsct-prep.pdf`);

    const mcqs: MCQ[] = JSON.parse(readFileSync(filePath, "utf8"));
    totalMcqs += mcqs.length;

    console.log(`  ${slug}-nsct-prep.pdf (${mcqs.length} MCQs)...`);
    await generatePdf(mcqs, subjectName, outputPath);
    console.log(`    ✓ ${outputPath}`);
  }

  // Generate combined PDF — only when generating all
  if (!targetSlug) {
    const allMcqs: { mcqs: MCQ[]; subjectName: string }[] = [];
    for (const file of files) {
      const slug = basename(file, ".json");
      const subjectName = SUBJECT_NAMES[slug] || slug;
      const mcqs: MCQ[] = JSON.parse(readFileSync(join(DATA_DIR, file), "utf8"));
      allMcqs.push({ mcqs, subjectName });
    }
    const combinedPath = join(OUT_DIR, "all-subjects-nsct-prep.pdf");
    console.log(`\n  all-subjects.pdf (${totalMcqs.toLocaleString()} MCQs, ${allMcqs.length} subjects)...`);
    await generateCombinedPdf(allMcqs, combinedPath);
    console.log(`    ✓ ${combinedPath}`);
  }

  console.log(`\n========== DONE ==========`);
  console.log(`  PDFs: ${toProcess.length}${!targetSlug ? " + 1 combined" : ""}`);
  console.log(`  MCQs: ${totalMcqs.toLocaleString()}`);
  console.log(`==========================\n`);
}

main().catch((err) => {
  console.error("PDF generation failed:", err);
  process.exit(1);
});
