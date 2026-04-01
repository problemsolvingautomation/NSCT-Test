"use client";

import { TOTAL_MCQ_COUNT } from "@/lib/mock-data";

const SYSTEM_PDFS = [
  { name: "AI / Machine Learning & Data Analytics", file: "ai-ml-nsct-prep.pdf", color: "#7C3AED", abbr: "AI", count: 1530 },
  { name: "Computer Networks & Cloud Computing", file: "cn-cloud-nsct-prep.pdf", color: "#2563EB", abbr: "CN", count: 900 },
  { name: "Cyber Security", file: "cyber-nsct-prep.pdf", color: "#EA580C", abbr: "SEC", count: 1440 },
  { name: "Data Structures & Algorithms", file: "dsa-nsct-prep.pdf", color: "#059669", abbr: "DSA", count: 1080 },
  { name: "Databases", file: "db-nsct-prep.pdf", color: "#D97706", abbr: "DB", count: 1530 },
  { name: "Operating Systems", file: "os-nsct-prep.pdf", color: "#DC2626", abbr: "OS", count: 1080 },
  { name: "Problem Solving & Analytical Skills", file: "problem-solving-nsct-prep.pdf", color: "#0D9488", abbr: "PS", count: 1440 },
  { name: "Programming (C++, Java, Python)", file: "programming-nsct-prep.pdf", color: "#4F46E5", abbr: "PRG", count: 1440 },
  { name: "Software Engineering", file: "se-nsct-prep.pdf", color: "#0891B2", abbr: "SE", count: 1440 },
  { name: "Web Development", file: "webdev-nsct-prep.pdf", color: "#EC4899", abbr: "WEB", count: 1530 },
];

export default function PdfDownloadSection() {
  return (
    <details className="mb-8 bg-surface border border-edge rounded-xl shadow-sm theme-transition group">
      <summary className="flex items-center gap-3 p-5 sm:p-6 cursor-pointer list-none select-none">
        <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-ink">Download MCQ PDFs with Answers</h2>
          <p className="text-xs text-muted">{TOTAL_MCQ_COUNT.toLocaleString()}+ MCQs across {SYSTEM_PDFS.length} subjects</p>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted group-open:rotate-180 transition-transform" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </summary>
      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SYSTEM_PDFS.map((pdf) => (
            <a
              key={pdf.file}
              href={`/custom-pdfs/${pdf.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border border-edge bg-page hover:border-primary/40 hover:bg-primary-light transition-all group/link"
            >
              <div
                className="w-9 h-9 rounded-md flex items-center justify-center text-white font-bold text-xs shrink-0"
                style={{ backgroundColor: pdf.color }}
                aria-hidden="true"
              >
                {pdf.abbr}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-ink group-hover/link:text-primary transition-colors block truncate">
                  {pdf.name}
                </span>
                <span className="text-xs text-muted">{pdf.count.toLocaleString()} MCQs</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted group-hover/link:text-primary shrink-0 transition-colors" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
          ))}
          {/* Combined PDF — full width */}
          <a
            href="/custom-pdfs/all-subjects-nsct-prep.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:col-span-2 flex items-center gap-3 p-3 rounded-lg border-2 border-primary/30 bg-primary-light hover:border-primary hover:bg-primary-light transition-all group/link"
          >
            <div
              className="w-9 h-9 rounded-md flex items-center justify-center text-white font-bold text-xs shrink-0"
              style={{ backgroundColor: "#0D9488" }}
              aria-hidden="true"
            >
              ALL
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-bold text-primary block truncate">
                All Subjects Combined
              </span>
              <span className="text-xs text-muted">{TOTAL_MCQ_COUNT.toLocaleString()} MCQs · {SYSTEM_PDFS.length} subjects in one PDF</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>
        </div>
      </div>
    </details>
  );
}
