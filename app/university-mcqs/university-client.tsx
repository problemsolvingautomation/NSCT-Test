"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Subject } from "@/lib/mock-data";
import { UNI_MCQ_COUNT } from "@/lib/mock-data";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import { apiFetch } from "@/lib/api-fetch";

const SET_SIZE = 30;

function formatConfigTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m} min`;
  return `${m}m ${s}s`;
}


export default function UniversityClient() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedSet, setSelectedSet] = useState<number>(-1); // index of set (0-based)
  const [timer, setTimer] = useState<"unlimited" | "per-question" | "total">("unlimited");
  const [review, setReview] = useState<"instant" | "end">("instant");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/api/subjects?source=university");
        const { subjects: data } = await res.json();
        if (data) setSubjects(data);
      } catch {
        // fetch failed
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selected = subjects.find((s) => s.id === selectedSubject);

  // Generate sets for the selected subject
  const sets = useMemo(() => {
    if (!selected) return [];
    const total = selected.mcqCount;
    const result: { index: number; start: number; end: number; label: string }[] = [];
    for (let i = 0; i * SET_SIZE < total; i++) {
      const start = i * SET_SIZE + 1;
      const end = Math.min((i + 1) * SET_SIZE, total);
      result.push({ index: i, start, end, label: `MCQs ${start}–${end}` });
    }
    return result;
  }, [selected]);

  // Reset set selection when subject changes
  useEffect(() => {
    setSelectedSet(-1);
  }, [selectedSubject]);

  const selectedSetData = sets[selectedSet];

  const handleStart = () => {
    if (!selectedSubject || !selectedSetData) return;
    const params = new URLSearchParams({
      subject: selectedSubject,
      skip: String(selectedSetData.start - 1),
      count: String(selectedSetData.end - selectedSetData.start + 1),
      timer,
      review,
    });
    router.push(`/university-mcqs/play?${params.toString()}`);
  };

  return (
    <>
      <div className="flex gap-6 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        <main className="flex-1 min-w-0 max-w-3xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6">
            <Link href="/" className="text-muted hover:text-primary transition-colors" aria-label="Back to home">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Link>
            <Link href="/" className="text-sm text-muted hover:text-primary transition-colors">Home</Link>
            <span className="text-sm text-muted" aria-hidden="true">/</span>
            <span className="text-sm font-medium text-ink">University MCQs</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-2">
              MCQs Shared by Our University
            </h1>
            <p className="text-muted">
              Practice in sets of {SET_SIZE} questions. Select a subject, pick a set, and start solving.
            </p>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-surface border border-edge rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* ===== Download MCQ PDFs (with Answers & Explanations) ===== */}
              <details className="mb-6 bg-surface border border-edge rounded-xl shadow-sm theme-transition group">
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
                    <p className="text-xs text-muted">Formatted PDFs with verified answers</p>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted group-open:rotate-180 transition-transform" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { name: "AI / Machine Learning & Data Analytics", file: "ai-ml.pdf", color: "#7C3AED", abbr: "AI", count: 300 },
                      { name: "Computer Networks & Cloud Computing", file: "cn-cloud.pdf", color: "#2563EB", abbr: "CN", count: 337 },
                      { name: "Cyber Security", file: "cyber.pdf", color: "#EA580C", abbr: "SEC", count: 55 },
                      { name: "Databases", file: "db.pdf", color: "#D97706", abbr: "DB", count: 300 },
                      { name: "Operating Systems", file: "os.pdf", color: "#DC2626", abbr: "OS", count: 300 },
                      { name: "Problem Solving & Analytical Skills", file: "problem-solving.pdf", color: "#0D9488", abbr: "PS", count: 300 },
                      { name: "Programming (C++, Java, Python)", file: "programming.pdf", color: "#6366F1", abbr: "PRG", count: 299 },
                      { name: "Software Engineering", file: "se.pdf", color: "#0891B2", abbr: "SE", count: 300 },
                      { name: "Web Development", file: "webdev.pdf", color: "#EC4899", abbr: "WEB", count: 327 },
                    ].map((pdf) => (
                      <a
                        key={pdf.file}
                        href={`/pdfs/${pdf.file}`}
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
                          <span className="text-xs text-muted">{pdf.count} MCQs</span>
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
                      href="/pdfs/all-subjects.pdf"
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
                        <span className="text-xs text-muted">2,518 MCQs · 9 subjects in one PDF</span>
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

              {/* ===== STEP 1: Select Subject ===== */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center shrink-0">1</span>
                  <h2 className="text-sm font-semibold text-ink">Select Subject</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {subjects.map((subj) => (
                    <button
                      key={subj.id}
                      onClick={() => setSelectedSubject(subj.id)}
                      className={`relative flex items-center gap-3.5 p-4 rounded-xl border-[1.5px] text-left transition-all active:scale-[0.97] ${selectedSubject === subj.id
                          ? "bg-primary-light border-primary"
                          : "bg-surface border-edge hover:border-primary/30"
                        }`}
                    >
                      <div
                        className="w-11 h-11 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ backgroundColor: subj.color }}
                        aria-hidden="true"
                      >
                        {subj.abbr}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold truncate ${selectedSubject === subj.id ? "text-primary" : "text-ink"}`}>
                          {subj.name}
                        </div>
                        <div className="text-xs text-muted">
                          {subj.mcqCount} questions &middot; {Math.ceil(subj.mcqCount / SET_SIZE)} sets
                        </div>
                      </div>
                      {selectedSubject === subj.id && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* ===== STEP 2: Select MCQ Set ===== */}
              <div className={`mb-6 ${!selectedSubject ? "opacity-40 pointer-events-none" : ""}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${selectedSubject ? "bg-primary text-on-primary" : "bg-edge text-muted"}`}>2</span>
                  <h2 className="text-sm font-semibold text-ink">Select MCQ Set</h2>
                </div>
                {selectedSubject && selected ? (
                  <>
                    <p className="text-xs text-muted mb-3">
                      {selected.mcqCount} questions divided into {sets.length} sets of up to {SET_SIZE}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto scrollbar-thin pr-1">
                      {sets.map((set) => {
                        const qCount = set.end - set.start + 1;
                        return (
                          <button
                            key={set.index}
                            onClick={() => setSelectedSet(set.index)}
                            className={`relative p-3.5 rounded-xl border-[1.5px] text-left transition-all active:scale-[0.97] ${selectedSet === set.index
                                ? "bg-primary-light border-primary"
                                : "bg-surface border-edge hover:border-primary/30"
                              }`}
                          >
                            <div className={`text-sm font-semibold ${selectedSet === set.index ? "text-primary" : "text-ink"}`}>
                              {set.label}
                            </div>
                            <div className="text-[11px] text-muted mt-0.5">{qCount} questions</div>
                            {selectedSet === set.index && (
                              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary-light flex items-center justify-center">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-muted">Select a subject first</p>
                )}
              </div>

              {/* ===== STEP 3: Timer ===== */}
              <div className={`mb-8 ${selectedSet < 0 ? "opacity-40 pointer-events-none" : ""}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${selectedSet >= 0 ? "bg-primary text-on-primary" : "bg-edge text-muted"}`}>3</span>
                  <h2 className="text-sm font-semibold text-ink">Time Limit</h2>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    {
                      id: "per-question" as const,
                      label: "Per Question",
                      desc: "20s each — auto-skips when time runs out",
                      icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
                    },
                    {
                      id: "total" as const,
                      label: "Total Time",
                      desc: selectedSetData ? `${formatConfigTime((selectedSetData.end - selectedSetData.start + 1) * 20)} for ${selectedSetData.end - selectedSetData.start + 1} questions — no auto-skip` : "Select a set first",
                      icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12" /><line x1="16" y1="16" x2="12" y2="12" /></>,
                    },
                    {
                      id: "unlimited" as const,
                      label: "Unlimited",
                      desc: "No pressure — take your time",
                      icon: <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />,
                    },
                  ]).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setTimer(opt.id)}
                      className={`relative p-4 rounded-xl border-[1.5px] text-left transition-all active:scale-[0.97] ${timer === opt.id
                          ? "bg-primary-light border-primary"
                          : "bg-surface border-edge hover:border-primary/30"
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={timer === opt.id ? "text-primary" : "text-muted"} aria-hidden="true">
                          {opt.icon}
                        </svg>
                        <span className={`text-sm font-semibold ${timer === opt.id ? "text-primary" : "text-ink"}`}>
                          {opt.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted">{opt.desc}</p>
                      {timer === opt.id && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary-light flex items-center justify-center">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* ===== STEP 4: Answer Mode ===== */}
              <div className={`mb-8 ${selectedSet < 0 ? "opacity-40 pointer-events-none" : ""}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${selectedSet >= 0 ? "bg-primary text-on-primary" : "bg-edge text-muted"}`}>4</span>
                  <h2 className="text-sm font-semibold text-ink">When to See Answers?</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setReview("instant")}
                    className={`relative p-4 rounded-xl border-[1.5px] text-left transition-all active:scale-[0.97] ${review === "instant"
                        ? "bg-primary-light border-primary"
                        : "bg-surface border-edge hover:border-primary/30"
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={review === "instant" ? "text-primary" : "text-muted"} aria-hidden="true">
                        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                      <span className={`text-sm font-semibold ${review === "instant" ? "text-primary" : "text-ink"}`}>
                        After Each Question
                      </span>
                    </div>
                    <p className="text-[11px] text-muted">See the correct answer and explanation right away</p>
                    {review === "instant" && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary-light flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => setReview("end")}
                    className={`relative p-4 rounded-xl border-[1.5px] text-left transition-all active:scale-[0.97] ${review === "end"
                        ? "bg-primary-light border-primary"
                        : "bg-surface border-edge hover:border-primary/30"
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={review === "end" ? "text-primary" : "text-muted"} aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
                      </svg>
                      <span className={`text-sm font-semibold ${review === "end" ? "text-primary" : "text-ink"}`}>
                        At the End
                      </span>
                    </div>
                    <p className="text-[11px] text-muted">Review all answers together after submitting</p>
                    {review === "end" && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary-light flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* ===== Start Button (Summary Card) ===== */}
              <div className="bg-surface border border-edge rounded-xl shadow-sm p-5 theme-transition">
                {selectedSetData && selected ? (
                  <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
                    <span className="px-2.5 py-1 bg-page border border-edge rounded-full text-muted">{selected.name}</span>
                    <span className="px-2.5 py-1 bg-page border border-edge rounded-full text-muted">{selectedSetData.label}</span>
                    <span className="px-2.5 py-1 bg-page border border-edge rounded-full text-muted">{selectedSetData.end - selectedSetData.start + 1} questions</span>
                    <span className="px-2.5 py-1 bg-page border border-edge rounded-full text-muted">{review === "instant" ? "Instant feedback" : "Review at end"}</span>
                    <span className="px-2.5 py-1 bg-page border border-edge rounded-full text-muted">{
                      timer === "per-question" ? "20s per question"
                        : timer === "total" ? `${formatConfigTime((selectedSetData!.end - selectedSetData!.start + 1) * 20)} total`
                          : "Unlimited time"
                    }</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted mb-4">Select a subject and MCQ set to begin</p>
                )}
                <button
                  onClick={handleStart}
                  disabled={selectedSet < 0 || !selectedSubject}
                  className="w-full py-3.5 bg-primary text-on-primary font-semibold text-lg rounded-lg hover:bg-primary-hover transition-colors active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Start Practice
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>


              {/* Bottom ad — mobile only */}
              <div className="mt-6 lg:hidden">
                <AdBanner size="banner" />
              </div>
            </>
          )}
        </main>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-75 shrink-0">
          <div className="sticky top-20 space-y-6">
            {/* Quick Stats */}
            <div className="bg-surface border border-edge rounded-xl p-5 shadow-sm theme-transition">
              <h3 className="font-semibold text-ink text-sm mb-3">Quick Stats</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">University MCQs</span>
                  <span className="font-medium text-ink">{UNI_MCQ_COUNT.toLocaleString()}+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Subjects</span>
                  <span className="font-medium text-ink">{subjects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Per Set</span>
                  <span className="font-medium text-ink">{SET_SIZE} questions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Source</span>
                  <span className="font-medium text-primary text-xs flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                    University
                  </span>
                </div>
              </div>
            </div>

            <AdBanner size="sidebar" />
          </div>
        </aside>
      </div>
      <Footer />
    </>
  );
}
