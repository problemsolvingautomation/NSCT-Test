"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Question } from "@/lib/mock-data";
import { PlaySkeleton } from "@/components/skeletons";
import AdBanner from "@/components/AdBanner";
import { apiFetch } from "@/lib/api-fetch";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const subjectId = searchParams.get("subject") || "";
  const topicId = searchParams.get("topic") || "all";
  const difficulty = searchParams.get("difficulty") || "medium";
  const count = parseInt(searchParams.get("count") || "10");
  const reviewMode = searchParams.get("review") || "end"; // "instant" or "end"
  const timerMode = searchParams.get("timer") || "unlimited"; // "per-question" | "total" | "unlimited"
  const SECONDS_PER_QUESTION = 20;

  const [subjectName, setSubjectName] = useState("");
  const [topicName, setTopicName] = useState("All Topics");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // selections: question index → chosen option index (no correctness stored during quiz)
  const [selections, setSelections] = useState<Record<number, number>>({});
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingLeaveUrl, setPendingLeaveUrl] = useState<string | null>(null);
  // For instant review mode: tracks which questions have been revealed (answer locked)
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  // Per-question countdown for per-question mode
  const [questionTimeLeft, setQuestionTimeLeft] = useState(SECONDS_PER_QUESTION);
  // Total quiz countdown for total mode (initialized after questions load)
  const [quizTimeLeft, setQuizTimeLeft] = useState(0);
  const leavingRef = useRef(false);

  // Warn on tab close / refresh
  useEffect(() => {
    if (!loaded) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [loaded]);

  // Intercept browser back button
  useEffect(() => {
    if (!loaded) return;

    // Push a guard entry so pressing back pops it instead of leaving
    window.history.pushState({ quizGuard: true }, "");

    const handlePop = () => {
      // Skip if we're already navigating away via confirmLeave
      if (leavingRef.current) return;
      // User pressed back — show leave modal instead of navigating away
      setShowLeaveModal(true);
      setPendingLeaveUrl(null); // null = go back
      // Re-push guard so next back press is also caught
      window.history.pushState({ quizGuard: true }, "");
    };

    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [loaded]);

  // Listen for leave requests from Navbar logo click
  useEffect(() => {
    if (!loaded) return;
    const handler = (e: Event) => {
      const url = (e as CustomEvent).detail?.url || "/";
      setShowLeaveModal(true);
      setPendingLeaveUrl(url);
    };
    window.addEventListener("quiz-leave-request", handler);
    return () => window.removeEventListener("quiz-leave-request", handler);
  }, [loaded]);

  const confirmLeave = useCallback(() => {
    leavingRef.current = true;
    // Remove the beforeunload listener by marking as unloaded
    setLoaded(false);
    if (pendingLeaveUrl) {
      router.push(pendingLeaveUrl);
    } else {
      // Pop the history guard entry first, then go back to the real previous page
      window.history.go(-2);
    }
  }, [pendingLeaveUrl, router]);

  // Load questions from API — reset all quiz state when params change
  useEffect(() => {
    setCurrentIndex(0);
    setSelections({});
    setElapsedTime(0);
    setLoaded(false);
    setShowSubmitModal(false);
    setShowLeaveModal(false);
    setPendingLeaveUrl(null);
    setRevealed({});
    setQuestionTimeLeft(SECONDS_PER_QUESTION);

    if (!subjectId) {
      router.push("/");
      return;
    }
    let cancelled = false;

    (async () => {
      try {
        // Fetch subject info and questions in parallel
        const [subjectsRes, mcqsRes] = await Promise.all([
          apiFetch("/api/subjects"),
          apiFetch(`/api/mcqs?mode=quiz&subjectId=${subjectId}&topicId=${topicId}&difficulty=${difficulty}&count=${count}`),
        ]);

        if (cancelled) return;

        const { subjects } = await subjectsRes.json();
        const subject = subjects?.find((s: { id: string }) => s.id === subjectId);
        if (subject) {
          setSubjectName(subject.name);
          const topic = subject.topics?.find((t: { id: string }) => t.id === topicId);
          if (topic) setTopicName(topic.name);
        }

        const { questions: qs } = await mcqsRes.json();
        if (cancelled) return;

        if (!qs || qs.length === 0) {
          router.push("/");
          return;
        }
        setQuestions(qs);
        setQuizTimeLeft(qs.length * SECONDS_PER_QUESTION);
        setLoaded(true);
      } catch {
        if (!cancelled) router.push("/");
      }
    })();

    return () => { cancelled = true; };
  }, [subjectId, topicId, difficulty, count, router]);

  // Timer
  useEffect(() => {
    if (!loaded || showSubmitModal || showLeaveModal) return;
    const timer = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [loaded, showSubmitModal, showLeaveModal]);

  // Reset per-question countdown when question changes
  useEffect(() => {
    if (timerMode !== "per-question") return;
    setQuestionTimeLeft(SECONDS_PER_QUESTION);
  }, [currentIndex, timerMode]);

  // Per-question countdown timer
  useEffect(() => {
    if (timerMode !== "per-question" || !loaded || showSubmitModal || showLeaveModal) return;
    // In instant mode, pause countdown once the answer is revealed
    if (reviewMode === "instant" && revealed[currentIndex]) return;

    if (questionTimeLeft <= 0) {
      // Time's up — reset countdown first to prevent double-skip race condition
      setQuestionTimeLeft(SECONDS_PER_QUESTION);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setShowSubmitModal(true);
      }
      return;
    }

    const timer = setInterval(() => setQuestionTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timerMode, loaded, showSubmitModal, showLeaveModal, questionTimeLeft, currentIndex, questions.length, reviewMode, revealed]);

  // Total quiz countdown timer
  useEffect(() => {
    if (timerMode !== "total" || !loaded || showSubmitModal || showLeaveModal) return;

    if (quizTimeLeft <= 0) {
      // Total time expired — auto-submit
      setShowSubmitModal(true);
      return;
    }

    const timer = setInterval(() => setQuizTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timerMode, loaded, showSubmitModal, showLeaveModal, quizTimeLeft]);

  const question = questions[currentIndex];
  const selectedOption = selections[currentIndex] ?? null;
  const answeredCount = Object.keys(selections).length;
  const unansweredCount = questions.length - answeredCount;
  const allAnswered = answeredCount === questions.length;

  // === HANDLERS ===

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      // In instant mode, lock the answer once revealed
      if (reviewMode === "instant" && revealed[currentIndex]) return;
      setSelections((prev) => ({ ...prev, [currentIndex]: optionIndex }));
      // In instant mode, immediately reveal the correct answer
      if (reviewMode === "instant") {
        setRevealed((prev) => ({ ...prev, [currentIndex]: true }));
      }
    },
    [currentIndex, reviewMode, revealed]
  );

  const navigateTo = useCallback((idx: number) => {
    setCurrentIndex(idx);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex >= questions.length - 1) return;
    setCurrentIndex((i) => i + 1);
  }, [currentIndex, questions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex <= 0) return;
    setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  const handleSubmit = useCallback(() => {
    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    questions.forEach((q, i) => {
      const sel = selections[i];
      if (sel === undefined) {
        skippedCount++;
      } else if (sel === q.correctAnswer) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const results = {
      subjectId,
      subject: subjectName,
      topic: topicName,
      difficulty,
      totalQuestions: questions.length,
      correctCount,
      incorrectCount,
      skippedCount,
      timeTaken: elapsedTime,
      questions: questions.map((q, i) => ({
        id: q.id,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        userAnswer: selections[i] ?? null,
      })),
    };

    sessionStorage.setItem("nsct-quiz-results", JSON.stringify(results));
    router.push("/quiz/results");
  }, [selections, questions, subjectName, subjectId, topicName, difficulty, elapsedTime, router]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!loaded || questions.length === 0 || showSubmitModal || showLeaveModal) return;

    const handleKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      const key = e.key.toLowerCase();

      if (["a", "b", "c", "d"].includes(key)) {
        e.preventDefault();
        const idx = key.charCodeAt(0) - 97;
        if (idx < questions[currentIndex].options.length) {
          handleSelectOption(idx);
        }
      } else if (key === "enter") {
        e.preventDefault();
        // Enter advances to next question, or submits/opens modal on last question
        if (currentIndex < questions.length - 1) {
          handleNext();
        } else if (reviewMode === "instant" && revealed[currentIndex]) {
          handleSubmit();
        } else if (reviewMode !== "instant") {
          setShowSubmitModal(true);
        }
      } else if (key === "arrowright") {
        handleNext();
      } else if (key === "arrowleft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [loaded, questions, currentIndex, showSubmitModal, showLeaveModal, handleSelectOption, handleNext, handlePrev, handleSubmit, reviewMode, revealed]);

  // === RENDER ===

  if (!loaded || !question) {
    return <PlaySkeleton />;
  }

  const progress = ((answeredCount) / questions.length) * 100;
  const letters = ["A", "B", "C", "D"];

  // Instant mode running score
  const revealedCount = Object.keys(revealed).length;
  const instantCorrect = reviewMode === "instant"
    ? Object.entries(revealed).filter(([i]) => selections[Number(i)] === questions[Number(i)]?.correctAnswer).length
    : 0;
  const instantIncorrect = revealedCount - instantCorrect;
  const allRevealed = reviewMode === "instant" && revealedCount === questions.length;

  return (
    <>
      <div className="flex gap-6 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6">
        <main className="flex-1 min-w-0 max-w-3xl mx-auto">
          {/* Progress bar — tracks answered questions, not current position */}
          <div className="mb-5">
            <div className="flex justify-between items-center text-sm text-muted mb-2">
              <button
                onClick={() => { setShowLeaveModal(true); setPendingLeaveUrl(null); }}
                className="flex items-center gap-1.5 font-medium text-muted hover:text-ink transition-colors group"
                aria-label="Exit quiz"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                {subjectName} &mdash; {topicName}
              </button>
              <span className="tabular-nums">
                {answeredCount} of {questions.length} answered
              </span>
            </div>
            <div className="w-full h-1.5 bg-edge rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={answeredCount}
                aria-valuemin={0}
                aria-valuemax={questions.length}
                aria-label={`${answeredCount} of ${questions.length} questions answered`}
              />
            </div>
          </div>

          {/* Question counter + Timer */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-ink tabular-nums">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-3">
              {timerMode === "per-question" && (
                <span
                  className={`text-sm font-mono font-semibold tabular-nums flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                    questionTimeLeft <= 5
                      ? "text-incorrect bg-incorrect-light border-incorrect/30 animate-pulse"
                      : questionTimeLeft <= 10
                        ? "text-warning bg-warning-light border-warning/30"
                        : "text-primary bg-primary-light border-primary/20"
                  }`}
                  aria-label={`${questionTimeLeft} seconds remaining for this question`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  {questionTimeLeft}s
                </span>
              )}
              {timerMode === "total" && (
                <span
                  className={`text-sm font-mono font-semibold tabular-nums flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                    quizTimeLeft <= 30
                      ? "text-incorrect bg-incorrect-light border-incorrect/30 animate-pulse"
                      : quizTimeLeft <= 60
                        ? "text-warning bg-warning-light border-warning/30"
                        : "text-primary bg-primary-light border-primary/20"
                  }`}
                  aria-label={`${formatTime(quizTimeLeft)} remaining for the quiz`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  {formatTime(quizTimeLeft)}
                </span>
              )}
              <span className="text-sm text-muted font-mono tabular-nums" aria-label={`Elapsed time: ${formatTime(elapsedTime)}`}>
                {formatTime(elapsedTime)}
              </span>
            </div>
          </div>

          {/* Question card — NO feedback, just selection */}
          <div
            key={question.id}
            className="bg-surface border border-edge rounded-xl shadow-sm p-5 sm:p-6 mb-5 animate-slide-in theme-transition"
          >
            <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              Question {currentIndex + 1}
            </div>
            <p className="text-lg sm:text-xl font-medium leading-relaxed text-ink mb-6">
              {question.text}
            </p>

            {/* Options */}
            <div className="space-y-3" role="radiogroup" aria-label="Answer options">
              {question.options.map((option, i) => {
                const isSelected = selectedOption === i;
                const isRevealed = reviewMode === "instant" && revealed[currentIndex];
                const isCorrect = i === question.correctAnswer;
                const isWrong = isRevealed && isSelected && !isCorrect;

                let optionClasses: string;
                let circleClasses: string;
                let icon: React.ReactNode = null;

                if (isRevealed && isCorrect) {
                  // Correct answer — always highlighted green when revealed
                  optionClasses = "border-correct bg-correct-light";
                  circleClasses = "border-correct bg-correct text-white";
                  icon = (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-correct shrink-0" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  );
                } else if (isWrong) {
                  // User's wrong selection — highlighted red
                  optionClasses = "border-incorrect bg-incorrect-light";
                  circleClasses = "border-incorrect bg-incorrect text-white";
                  icon = (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-incorrect shrink-0" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  );
                } else if (isSelected) {
                  optionClasses = "border-primary bg-primary-light";
                  circleClasses = "border-primary bg-primary text-on-primary";
                  icon = (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  );
                } else {
                  optionClasses = isRevealed
                    ? "border-edge bg-surface opacity-60"
                    : "border-edge bg-surface hover:border-primary/50";
                  circleClasses = "border-edge text-muted";
                }

                return (
                  <button
                    key={i}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`Option ${letters[i]}: ${option}`}
                    onClick={() => handleSelectOption(i)}
                    disabled={isRevealed}
                    className={`w-full flex items-center gap-3.5 p-4 border-[1.5px] rounded-[10px] transition-all text-left ${
                      isRevealed ? "cursor-default" : "cursor-pointer active:scale-[0.99]"
                    } ${optionClasses}`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-[1.5px] shrink-0 transition-all ${circleClasses}`}
                      aria-hidden="true"
                    >
                      {letters[i]}
                    </span>
                    <span className="flex-1 text-[15px] sm:text-base">{option}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* Instant mode: show explanation after revealing */}
            {reviewMode === "instant" && revealed[currentIndex] && question.explanation && (
              <div className="mt-4 p-4 bg-page border border-edge rounded-lg">
                <div className="flex items-center gap-2 mb-1.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span className="text-sm font-semibold text-ink">Explanation</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">{question.explanation}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 border border-edge text-muted font-medium rounded-lg hover:border-muted hover:text-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]"
              aria-label="Previous question"
            >
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Prev
              </span>
            </button>

            <div className="flex-1" />

            {/* Next or Submit depending on position and mode */}
            {currentIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary-hover transition-colors active:scale-[0.97] flex items-center gap-1.5"
              >
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ) : reviewMode === "instant" ? (
              <button
                onClick={handleSubmit}
                disabled={!revealed[currentIndex]}
                className={`px-5 py-2.5 font-semibold rounded-lg transition-colors active:scale-[0.97] flex items-center gap-1.5 ${
                  revealed[currentIndex]
                    ? "bg-primary text-on-primary hover:bg-primary-hover"
                    : "bg-primary/40 text-on-primary cursor-not-allowed"
                }`}
              >
                See Results
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary-hover transition-colors active:scale-[0.97] flex items-center gap-1.5"
              >
                Submit Quiz
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Question dots — shows answered (filled) vs unanswered (outline), current (ring) */}
          <div className="flex flex-wrap gap-2 justify-center" role="tablist" aria-label="Question navigator">
            {questions.map((q, i) => {
              const isCurrent = i === currentIndex;
              const hasAnswer = selections[i] !== undefined;
              const isRevealedDot = reviewMode === "instant" && revealed[i];
              const isCorrectDot = isRevealedDot && selections[i] === q.correctAnswer;
              let dotClasses = "h-3 rounded-full transition-all hover:opacity-80 ";

              if (isCurrent) {
                dotClasses += isRevealedDot
                  ? `w-7 ${isCorrectDot ? "bg-correct" : "bg-incorrect"}`
                  : "w-7 bg-primary";
              } else if (isRevealedDot) {
                dotClasses += isCorrectDot ? "w-3 bg-correct/60" : "w-3 bg-incorrect/60";
              } else if (hasAnswer) {
                dotClasses += "w-3 bg-primary/60";
              } else {
                dotClasses += "w-3 bg-edge";
              }

              return (
                <button
                  key={i}
                  role="tab"
                  aria-selected={isCurrent}
                  aria-label={`Question ${i + 1}${hasAnswer ? " (answered)" : " (unanswered)"}`}
                  className={dotClasses}
                  onClick={() => navigateTo(i)}
                />
              );
            })}
          </div>

          {/* Keyboard hints */}
          <div className="hidden sm:flex items-center justify-center gap-4 text-xs text-muted mt-4 py-2 border-t border-edge">
            <span>
              <kbd className="px-1.5 py-0.5 bg-edge rounded text-[11px] font-mono">A</kbd>
              <kbd className="px-1.5 py-0.5 bg-edge rounded text-[11px] font-mono ml-0.5">B</kbd>
              <kbd className="px-1.5 py-0.5 bg-edge rounded text-[11px] font-mono ml-0.5">C</kbd>
              <kbd className="px-1.5 py-0.5 bg-edge rounded text-[11px] font-mono ml-0.5">D</kbd>
              {" "}Select
            </span>
            <span className="text-edge">|</span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-edge rounded text-[11px] font-mono">Enter</kbd> Next
            </span>
            <span className="text-edge">|</span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-edge rounded text-[11px] font-mono">&larr;</kbd>
              <kbd className="px-1.5 py-0.5 bg-edge rounded text-[11px] font-mono ml-0.5">&rarr;</kbd>
              {" "}Navigate
            </span>
          </div>

          {/* Mobile Ad */}
          <div className="lg:hidden mt-8">
            <AdBanner size="banner" />
          </div>
        </main>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-75 shrink-0">
          <div className="sticky top-20 space-y-6">
            {/* Quiz status */}
            <div className="bg-surface border border-edge rounded-xl p-4 shadow-sm theme-transition">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
                Quiz Progress
              </h4>
              <div className="space-y-2.5 text-sm">
                {reviewMode === "instant" ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted">Correct</span>
                      <span className="font-medium text-correct tabular-nums">{instantCorrect}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Incorrect</span>
                      <span className="font-medium text-incorrect tabular-nums">{instantIncorrect}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Remaining</span>
                      <span className="font-medium text-ink tabular-nums">{questions.length - revealedCount}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted">Answered</span>
                      <span className="font-medium text-primary tabular-nums">{answeredCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Unanswered</span>
                      <span className="font-medium text-ink tabular-nums">{unansweredCount}</span>
                    </div>
                  </>
                )}
                {/* Mini progress bar */}
                <div className="w-full h-1.5 bg-edge rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {timerMode === "per-question" && (
                  <div className="pt-1.5 border-t border-edge flex justify-between">
                    <span className="text-muted">Question Timer</span>
                    <span className={`font-mono font-semibold tabular-nums ${
                      questionTimeLeft <= 5 ? "text-incorrect" : questionTimeLeft <= 10 ? "text-warning" : "text-primary"
                    }`}>
                      {questionTimeLeft}s
                    </span>
                  </div>
                )}
                {timerMode === "total" && (
                  <div className="pt-1.5 border-t border-edge flex justify-between">
                    <span className="text-muted">Time Left</span>
                    <span className={`font-mono font-semibold tabular-nums ${
                      quizTimeLeft <= 30 ? "text-incorrect" : quizTimeLeft <= 60 ? "text-warning" : "text-primary"
                    }`}>
                      {formatTime(quizTimeLeft)}
                    </span>
                  </div>
                )}
                <div className={`${timerMode !== "unlimited" ? "" : "pt-1.5 border-t border-edge "}flex justify-between`}>
                  <span className="text-muted">Total Time</span>
                  <span className="font-mono text-ink tabular-nums">{formatTime(elapsedTime)}</span>
                </div>
              </div>

              {/* Submit / See Results button */}
              {reviewMode === "instant" ? (
                <button
                  onClick={handleSubmit}
                  disabled={!allRevealed}
                  className={`w-full mt-4 py-2.5 font-semibold rounded-lg transition-colors active:scale-[0.98] text-sm ${
                    allRevealed
                      ? "bg-primary text-on-primary hover:bg-primary-hover"
                      : "border border-edge text-muted cursor-not-allowed opacity-60"
                  }`}
                >
                  {allRevealed ? "See Results" : `${questions.length - revealedCount} left`}
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className={`w-full mt-4 py-2.5 font-semibold rounded-lg transition-colors active:scale-[0.98] text-sm ${
                    allAnswered
                      ? "bg-primary text-on-primary hover:bg-primary-hover"
                      : "border border-edge text-muted hover:border-muted hover:text-ink"
                  }`}
                >
                  {allAnswered ? "Submit Quiz" : `Submit (${unansweredCount} left)`}
                </button>
              )}
            </div>
            <AdBanner size="sidebar" />
          </div>
        </aside>
      </div>

      {/* Submit Confirmation Modal */}
      {/* Leave Quiz Confirmation Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setShowLeaveModal(false)}
            aria-hidden="true"
          />
          <div className="relative bg-surface border border-edge rounded-xl shadow-xl p-6 sm:p-8 max-w-md w-full theme-transition" role="dialog" aria-modal="true" aria-labelledby="leave-modal-title">
            <h2 id="leave-modal-title" className="text-xl font-bold text-ink mb-2">
              Leave Quiz?
            </h2>

            <div className="mb-5">
              <div className="flex items-center gap-2 text-warning bg-warning-light border border-warning/30 rounded-lg px-4 py-3 mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span className="text-sm font-medium">
                  Your progress will be lost
                </span>
              </div>
              <p className="text-sm text-muted">
                You have answered {answeredCount} of {questions.length} questions. If you leave now, your progress will not be saved.
              </p>
            </div>

            {/* Progress summary */}
            <div className="flex gap-4 mb-6 text-center">
              <div className="flex-1 bg-primary-light border border-primary/20 rounded-lg py-3">
                <div className="text-lg font-bold text-primary">{answeredCount}</div>
                <div className="text-xs text-muted">Answered</div>
              </div>
              <div className="flex-1 bg-page border border-edge rounded-lg py-3">
                <div className="text-lg font-bold text-muted">{unansweredCount}</div>
                <div className="text-xs text-muted">Remaining</div>
              </div>
              <div className="flex-1 bg-page border border-edge rounded-lg py-3">
                <div className="text-lg font-bold text-ink font-mono">{formatTime(elapsedTime)}</div>
                <div className="text-xs text-muted">Time</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 py-3 bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary-hover transition-colors active:scale-[0.98]"
              >
                Continue Quiz
              </button>
              <button
                onClick={confirmLeave}
                className="flex-1 py-3 border border-edge text-muted font-semibold rounded-lg hover:border-incorrect hover:text-incorrect transition-colors active:scale-[0.98]"
              >
                Leave Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setShowSubmitModal(false)}
            aria-hidden="true"
          />
          {/* Modal */}
          <div className="relative bg-surface border border-edge rounded-xl shadow-xl p-6 sm:p-8 max-w-md w-full theme-transition" role="dialog" aria-modal="true" aria-labelledby="submit-modal-title">
            <h2 id="submit-modal-title" className="text-xl font-bold text-ink mb-2">
              Submit Quiz?
            </h2>

            {unansweredCount > 0 ? (
              <div className="mb-5">
                <div className="flex items-center gap-2 text-warning bg-warning-light border border-warning/30 rounded-lg px-4 py-3 mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span className="text-sm font-medium">
                    {unansweredCount} question{unansweredCount > 1 ? "s" : ""} unanswered
                  </span>
                </div>
                <p className="text-sm text-muted">
                  Unanswered questions will be marked as skipped. You can go back and answer them, or submit now.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted mb-5">
                You have answered all {questions.length} questions. Ready to see your results?
              </p>
            )}

            {/* Progress summary */}
            <div className="flex gap-4 mb-6 text-center">
              <div className="flex-1 bg-primary-light border border-primary/20 rounded-lg py-3">
                <div className="text-lg font-bold text-primary">{answeredCount}</div>
                <div className="text-xs text-muted">Answered</div>
              </div>
              <div className="flex-1 bg-page border border-edge rounded-lg py-3">
                <div className="text-lg font-bold text-muted">{unansweredCount}</div>
                <div className="text-xs text-muted">Skipped</div>
              </div>
              <div className="flex-1 bg-page border border-edge rounded-lg py-3">
                <div className="text-lg font-bold text-ink font-mono">{formatTime(elapsedTime)}</div>
                <div className="text-xs text-muted">Time</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 border border-edge text-muted font-semibold rounded-lg hover:border-muted hover:text-ink transition-colors active:scale-[0.98]"
              >
                Go Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary-hover transition-colors active:scale-[0.98]"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function PlayClient() {
  return (
    <Suspense fallback={<PlaySkeleton />}>
      <QuizContent />
    </Suspense>
  );
}
