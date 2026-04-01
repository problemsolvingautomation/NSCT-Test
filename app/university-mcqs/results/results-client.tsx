"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ResultsSkeleton } from "@/components/skeletons";
import Footer from "@/components/Footer";

interface QuestionResult {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  userAnswer: number | null;
}

interface QuizResults {
  subjectId?: string;
  subject: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  practiceOnlyCount?: number;
  timeTaken: number;
  questions: QuestionResult[];
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function ScoreRing({ percentage }: { percentage: number }) {
  const circumference = 2 * Math.PI * 70;
  const offset = circumference * (1 - percentage / 100);
  return (
    <div className="relative w-44 h-44 mx-auto" role="img" aria-label={`Score: ${Math.round(percentage)}%`}>
      <svg width="176" height="176" viewBox="0 0 176 176" className="-rotate-90">
        <circle cx="88" cy="88" r="70" fill="none" stroke="var(--clr-edge)" strokeWidth="10" />
        <circle cx="88" cy="88" r="70" fill="none" stroke="var(--clr-primary)" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="score-ring-animated" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-primary">{Math.round(percentage)}%</span>
        <span className="text-sm text-muted font-medium">Score</span>
      </div>
    </div>
  );
}

export default function UniResultsClient() {
  const router = useRouter();
  const [results, setResults] = useState<QuizResults | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("nsct-quiz-results");
    if (data) {
      setResults(JSON.parse(data));
    } else {
      router.push("/university-mcqs");
    }
  }, [router]);

  if (!results) return <ResultsSkeleton />;

  // Scorable questions exclude practice-only (correctAnswer === -1)
  const scorableCount = results.totalQuestions - (results.practiceOnlyCount ?? 0);
  const percentage = scorableCount > 0
    ? (results.correctCount / scorableCount) * 100
    : 0;

  const motivationMessage =
    percentage >= 80
      ? "Excellent work! You know this subject well."
      : percentage >= 50
        ? "Good effort! Review the questions you missed."
        : "Keep practicing! Focus on the concepts you found challenging.";

  const letters = ["A", "B", "C", "D"];

  return (
    <>
      <div className="flex gap-6 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        <main className="flex-1 min-w-0 max-w-3xl mx-auto">
          {/* Score Summary */}
          <div className="bg-surface border border-edge rounded-xl shadow-sm p-6 sm:p-8 text-center mb-8 theme-transition">
            <h1 className="text-2xl font-bold text-ink mb-5">Practice Results</h1>
            <ScoreRing percentage={percentage} />

            <p className="mt-5 text-base sm:text-lg font-medium text-primary">{motivationMessage}</p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-muted">
              <span className="px-2.5 py-1 bg-page border border-edge rounded-full">{results.subject}</span>
              <span className="px-2.5 py-1 bg-page border border-edge rounded-full">University MCQs</span>
              <span className="px-2.5 py-1 bg-page border border-edge rounded-full font-mono">{formatTime(results.timeTaken)}</span>
            </div>

            {/* Stat cards */}
            <div className={`grid gap-3 mt-6 ${(results.practiceOnlyCount ?? 0) > 0 ? "grid-cols-4" : "grid-cols-3"}`}>
              <div className="border-[1.5px] border-correct bg-correct-light rounded-[10px] p-4">
                <div className="text-2xl sm:text-3xl font-bold text-correct">{results.correctCount}</div>
                <div className="text-sm font-medium text-correct/80 mt-1">Correct</div>
              </div>
              <div className="border-[1.5px] border-incorrect bg-incorrect-light rounded-[10px] p-4">
                <div className="text-2xl sm:text-3xl font-bold text-incorrect">{results.incorrectCount}</div>
                <div className="text-sm font-medium text-incorrect/80 mt-1">Incorrect</div>
              </div>
              <div className="border-[1.5px] border-edge bg-page rounded-[10px] p-4">
                <div className="text-2xl sm:text-3xl font-bold text-muted">{results.skippedCount}</div>
                <div className="text-sm font-medium text-muted mt-1">Skipped</div>
              </div>
              {(results.practiceOnlyCount ?? 0) > 0 && (
                <div className="border-[1.5px] border-warning bg-warning-light rounded-[10px] p-4">
                  <div className="text-2xl sm:text-3xl font-bold text-warning">{results.practiceOnlyCount}</div>
                  <div className="text-sm font-medium text-warning/80 mt-1">Practice</div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link
                href={results.subjectId ? `/university-mcqs?preselect=${results.subjectId}` : "/university-mcqs"}
                className="flex-1 py-3 bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary-hover transition-colors active:scale-[0.98] text-center"
              >
                Try Again
              </Link>
              <Link
                href="/university-mcqs"
                className="flex-1 py-3 border-[1.5px] border-edge text-muted font-semibold rounded-lg hover:border-muted hover:text-ink transition-colors active:scale-[0.98] text-center"
              >
                Choose Another Subject
              </Link>
            </div>
          </div>

          {/* Answer Review */}
          <section aria-labelledby="answer-review-heading" className="mb-8">
            <h2 id="answer-review-heading" className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
              Answer Review
              <span className="text-xs font-medium text-muted bg-edge px-2 py-0.5 rounded-full">{results.totalQuestions} questions</span>
            </h2>

            <div className="space-y-4">
              {results.questions.map((q, i) => {
                const isPracticeOnly = q.correctAnswer === -1;
                const isCorrect = !isPracticeOnly && q.userAnswer === q.correctAnswer;
                const isSkipped = q.userAnswer === null;

                return (
                  <div
                    key={q.id}
                    className={`bg-surface border rounded-xl p-5 theme-transition ${
                      isPracticeOnly
                        ? "border-warning/40"
                        : isSkipped
                          ? "border-edge"
                          : isCorrect
                            ? "border-correct/40"
                            : "border-incorrect/40"
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isPracticeOnly
                            ? "bg-warning text-white"
                            : isSkipped
                              ? "bg-edge text-muted"
                              : isCorrect
                                ? "bg-correct text-white"
                                : "bg-incorrect text-white"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-medium text-ink leading-relaxed">{q.text}</p>
                        <span className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isPracticeOnly
                            ? "bg-warning-light text-warning"
                            : isSkipped
                              ? "bg-edge text-muted"
                              : isCorrect
                                ? "bg-correct-light text-correct"
                                : "bg-incorrect-light text-incorrect"
                        }`}>
                          {isPracticeOnly ? "Practice Only" : isSkipped ? "Skipped" : isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 ml-10">
                      {q.options.map((opt, j) => {
                        const isThisCorrect = !isPracticeOnly && j === q.correctAnswer;
                        const isUserChoice = j === q.userAnswer;
                        const isWrongChoice = isUserChoice && !isCorrect && !isPracticeOnly;

                        let optClass = "text-sm py-2 px-3 rounded-lg flex items-center gap-2 ";
                        if (isThisCorrect) {
                          optClass += "bg-correct-light text-correct font-medium";
                        } else if (isWrongChoice) {
                          optClass += "bg-incorrect-light text-incorrect";
                        } else if (isPracticeOnly && isUserChoice) {
                          optClass += "bg-primary-light text-primary font-medium";
                        } else {
                          optClass += "text-muted";
                        }

                        return (
                          <div key={j} className={optClass}>
                            <span className="font-semibold shrink-0">{letters[j]}.</span>
                            <span className={isWrongChoice ? "line-through opacity-70" : ""}>{opt}</span>
                            {isThisCorrect && (
                              <span className="ml-auto flex items-center gap-1 text-correct">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                                <span className="text-xs font-semibold">Correct</span>
                              </span>
                            )}
                            {isWrongChoice && (
                              <span className="ml-auto flex items-center gap-1 text-incorrect">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                <span className="text-xs font-semibold">Your pick</span>
                              </span>
                            )}
                            {isUserChoice && isCorrect && !isPracticeOnly && (
                              <span className="ml-auto flex items-center gap-1 text-correct">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                                <span className="text-xs font-semibold">Your pick</span>
                              </span>
                            )}
                            {isPracticeOnly && isUserChoice && (
                              <span className="ml-auto text-xs font-semibold text-primary">Your pick</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {isPracticeOnly && (
                      <div className="mt-3 ml-10 p-3 bg-warning-light border border-warning/20 rounded-lg">
                        <p className="text-xs text-warning font-medium">No verified correct answer available for this question.</p>
                      </div>
                    )}
                    {q.explanation && (
                      <div className="mt-3 ml-10 bg-primary-light border-l-4 border-primary rounded-r-lg p-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Explanation</p>
                        <p className="text-sm leading-relaxed text-ink">{q.explanation}</p>
                      </div>
                    )}
                    {!q.explanation && !isPracticeOnly && (
                      <div className="mt-3 ml-10 p-3 bg-page border border-edge rounded-lg">
                        <p className="text-sm text-muted italic">No explanation available.</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
