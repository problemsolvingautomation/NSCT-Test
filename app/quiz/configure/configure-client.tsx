"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Subject, Topic } from "@/lib/mock-data";
import { ConfigureSkeleton } from "@/components/skeletons";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import { apiFetch } from "@/lib/api-fetch";

const DIFFICULTIES = [
  { id: "easy", label: "Easy", desc: "Fundamentals & basics", color: "text-correct", bg: "bg-correct-light", border: "border-correct" },
  { id: "medium", label: "Medium", desc: "Application & analysis", color: "text-warning", bg: "bg-warning-light", border: "border-warning" },
  { id: "hard", label: "Hard", desc: "Advanced & tricky", color: "text-incorrect", bg: "bg-incorrect-light", border: "border-incorrect" },
] as const;

const PRESETS = [
  { count: 10, label: "Quick", desc: "~5 min", comingSoon: false },
  { count: 20, label: "Standard", desc: "~10 min", comingSoon: false },
  { count: 30, label: "Thorough", desc: "~15 min", comingSoon: false },
  { count: 50, label: "Full Practice", desc: "~25 min", comingSoon: true },
];

function formatConfigTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m} min`;
  return `${m}m ${s}s`;
}

function ConfigureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subjectId = searchParams.get("subject") || "";

  const [subject, setSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(10);
  const [topicSearch, setTopicSearch] = useState("");
  const [reviewMode, setReviewMode] = useState<"instant" | "end">("end");
  const [timerMode, setTimerMode] = useState<"per-question" | "total" | "unlimited">("unlimited");

  // Fetch subject and topics from API
  useEffect(() => {
    if (!subjectId) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await apiFetch("/api/subjects");
        const { subjects } = await res.json();
        if (cancelled) return;

        const found = subjects?.find((s: Subject) => s.id === subjectId);
        if (found) {
          setSubject(found);
          setTopics(found.topics || []);
        }
      } catch {
        // subjects fetch failed
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [subjectId]);

  const filteredTopics = useMemo(() => {
    if (!topicSearch.trim()) return topics;
    const q = topicSearch.toLowerCase();
    return topics.filter((t) => t.name.toLowerCase().includes(q));
  }, [topics, topicSearch]);

  if (loading) {
    return <ConfigureSkeleton />;
  }

  if (!subject) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <h2 className="text-xl font-semibold text-ink mb-2">Subject not found</h2>
        <p className="text-muted mb-6">The selected subject does not exist.</p>
        <Link href="/" className="px-6 py-3 bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary-hover transition-colors">
          Go Home
        </Link>
      </div>
    );
  }

  const handleStart = () => {
    const params = new URLSearchParams({
      subject: subjectId,
      topic: selectedTopic,
      difficulty,
      count: String(questionCount),
      review: reviewMode,
      timer: timerMode,
    });
    router.push(`/quiz/play?${params.toString()}`);
  };

  const selectedTopicName = selectedTopic === "all"
    ? "All Topics"
    : topics.find((t) => t.id === selectedTopic)?.name || "All Topics";

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
            <span className="text-sm font-medium text-ink">{subject.name}</span>
          </nav>

          {/* Subject header */}
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
              style={{ backgroundColor: subject.color }}
              aria-hidden="true"
            >
              {subject.abbr}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink">{subject.name}</h1>
              <p className="text-sm text-muted">
                {subject.mcqCount.toLocaleString()} questions &middot; {topics.length} topics
              </p>
            </div>
          </div>

          {/* ===== STEP 1: Topic ===== */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center shrink-0">1</span>
              <h2 className="text-sm font-semibold text-ink">Choose a Topic</h2>
            </div>

            {/* Search — only show when there are many topics */}
            {topics.length > 6 && (
              <div className="relative mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={topicSearch}
                  onChange={(e) => setTopicSearch(e.target.value)}
                  className="w-full bg-surface border border-edge rounded-lg pl-9 pr-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            )}

            {/* Topic cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* All Topics card */}
              <button
                onClick={() => { setSelectedTopic("all"); setTopicSearch(""); }}
                className={`relative p-3.5 rounded-xl border-[1.5px] text-left transition-all active:scale-[0.97] ${
                  selectedTopic === "all"
                    ? "bg-primary-light border-primary"
                    : "bg-surface border-edge hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={selectedTopic === "all" ? "text-primary" : "text-muted"} aria-hidden="true">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                  </svg>
                  <span className={`text-sm font-semibold truncate ${selectedTopic === "all" ? "text-primary" : "text-ink"}`}>All Topics</span>
                </div>
                <p className="text-[11px] text-muted">{topics.length} topics</p>
                {selectedTopic === "all" && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary-light flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </button>

              {filteredTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => { setSelectedTopic(topic.id); setTopicSearch(""); }}
                  className={`relative p-3.5 rounded-xl border-[1.5px] text-left transition-all active:scale-[0.97] ${
                    selectedTopic === topic.id
                      ? "bg-primary-light border-primary"
                      : "bg-surface border-edge hover:border-primary/30"
                  }`}
                >
                  <span className={`text-sm font-semibold line-clamp-2 ${selectedTopic === topic.id ? "text-primary" : "text-ink"}`}>
                    {topic.name}
                  </span>
                  {selectedTopic === topic.id && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary-light flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {filteredTopics.length === 0 && topicSearch && (
              <p className="text-sm text-muted text-center py-4">No topics match your search</p>
            )}
          </div>

          {/* ===== STEP 2: Difficulty ===== */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center shrink-0">2</span>
              <h2 className="text-sm font-semibold text-ink">Set Difficulty</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`relative p-4 rounded-xl border-[1.5px] text-center transition-all active:scale-[0.97] ${
                    difficulty === d.id
                      ? `${d.bg} ${d.border}`
                      : "bg-surface border-edge hover:border-primary/30"
                  }`}
                >
                  <div className={`text-sm font-semibold ${difficulty === d.id ? d.color : "text-ink"}`}>
                    {d.label}
                  </div>
                  <div className="text-[11px] text-muted mt-0.5">{d.desc}</div>
                  {difficulty === d.id && (
                    <div className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center ${d.bg}`}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={d.color} aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ===== STEP 3: Count ===== */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center shrink-0">3</span>
              <h2 className="text-sm font-semibold text-ink">How Many Questions?</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESETS.map((p) => (
                <button
                  key={p.count}
                  onClick={() => { if (!p.comingSoon) setQuestionCount(p.count); }}
                  disabled={p.comingSoon}
                  className={`relative p-4 rounded-xl border-[1.5px] text-center transition-all ${
                    p.comingSoon
                      ? "bg-surface border-edge opacity-60 cursor-not-allowed"
                      : questionCount === p.count
                        ? "bg-primary-light border-primary active:scale-[0.97]"
                        : "bg-surface border-edge hover:border-primary/30 active:scale-[0.97]"
                  }`}
                >
                  {p.comingSoon && (
                    <span className="absolute top-1.5 right-1.5 text-[9px] font-bold uppercase tracking-wider text-warning bg-warning-light px-1.5 py-0.5 rounded-full">
                      Soon
                    </span>
                  )}
                  <div className={`text-2xl font-bold ${p.comingSoon ? "text-muted" : questionCount === p.count ? "text-primary" : "text-ink"}`}>
                    {p.count}
                  </div>
                  <div className={`text-xs font-medium mt-0.5 ${p.comingSoon ? "text-muted" : questionCount === p.count ? "text-primary" : "text-muted"}`}>
                    {p.label}
                  </div>
                  <div className="text-[11px] text-muted">{p.comingSoon ? "Coming soon" : p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ===== STEP 4: Answer Review Mode ===== */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center shrink-0">4</span>
              <h2 className="text-sm font-semibold text-ink">When to See Answers?</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setReviewMode("instant")}
                className={`relative p-4 rounded-xl border-[1.5px] text-left transition-all active:scale-[0.97] ${
                  reviewMode === "instant"
                    ? "bg-primary-light border-primary"
                    : "bg-surface border-edge hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={reviewMode === "instant" ? "text-primary" : "text-muted"} aria-hidden="true">
                    <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  <span className={`text-sm font-semibold ${reviewMode === "instant" ? "text-primary" : "text-ink"}`}>
                    After Each Question
                  </span>
                </div>
                <p className="text-[11px] text-muted">See the correct answer and explanation right away</p>
                {reviewMode === "instant" && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary-light flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </button>
              <button
                onClick={() => setReviewMode("end")}
                className={`relative p-4 rounded-xl border-[1.5px] text-left transition-all active:scale-[0.97] ${
                  reviewMode === "end"
                    ? "bg-primary-light border-primary"
                    : "bg-surface border-edge hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={reviewMode === "end" ? "text-primary" : "text-muted"} aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                  <span className={`text-sm font-semibold ${reviewMode === "end" ? "text-primary" : "text-ink"}`}>
                    At the End
                  </span>
                </div>
                <p className="text-[11px] text-muted">Review all answers together after submitting the quiz</p>
                {reviewMode === "end" && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary-light flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* ===== STEP 5: Time Mode ===== */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center shrink-0">5</span>
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
                  desc: `${formatConfigTime(questionCount * 20)} for ${questionCount} questions — no auto-skip`,
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
                  onClick={() => setTimerMode(opt.id)}
                  className={`relative p-4 rounded-xl border-[1.5px] text-left transition-all active:scale-[0.97] ${
                    timerMode === opt.id
                      ? "bg-primary-light border-primary"
                      : "bg-surface border-edge hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={timerMode === opt.id ? "text-primary" : "text-muted"} aria-hidden="true">
                      {opt.icon}
                    </svg>
                    <span className={`text-sm font-semibold ${timerMode === opt.id ? "text-primary" : "text-ink"}`}>
                      {opt.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted">{opt.desc}</p>
                  {timerMode === opt.id && (
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

          {/* ===== Start Button ===== */}
          <div className="bg-surface border border-edge rounded-xl shadow-sm p-5 theme-transition">
            {/* Summary */}
            <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
              <span className="px-2.5 py-1 bg-page border border-edge rounded-full text-muted">{subject.name}</span>
              <span className="px-2.5 py-1 bg-page border border-edge rounded-full text-muted">{selectedTopicName}</span>
              <span className="px-2.5 py-1 bg-page border border-edge rounded-full text-muted capitalize">{difficulty}</span>
              <span className="px-2.5 py-1 bg-page border border-edge rounded-full text-muted">{questionCount} questions</span>
              <span className="px-2.5 py-1 bg-page border border-edge rounded-full text-muted">{reviewMode === "instant" ? "Instant feedback" : "Review at end"}</span>
              <span className="px-2.5 py-1 bg-page border border-edge rounded-full text-muted">{
                timerMode === "per-question" ? "20s per question"
                  : timerMode === "total" ? `${formatConfigTime(questionCount * 20)} total`
                  : "Unlimited time"
              }</span>
            </div>
            <button
              onClick={handleStart}
              className="w-full py-3.5 bg-primary text-on-primary font-semibold text-lg rounded-lg hover:bg-primary-hover transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Start Quiz
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          {/* Bottom ad — mobile only (desktop uses sidebar) */}
          <div className="mt-8 lg:hidden">
            <AdBanner size="banner" />
          </div>
        </main>

        {/* Sidebar */}
        <aside className="hidden lg:block w-75 shrink-0">
          <div className="sticky top-20 space-y-6">
            <AdBanner size="sidebar" />
          </div>
        </aside>
      </div>
      <Footer />
    </>
  );
}

export default function ConfigureClient() {
  return (
    <Suspense fallback={<ConfigureSkeleton />}>
      <ConfigureContent />
    </Suspense>
  );
}
