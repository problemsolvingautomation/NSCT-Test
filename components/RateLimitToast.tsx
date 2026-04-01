"use client";

import { useEffect, useState, useCallback } from "react";

export default function RateLimitToast() {
  const [visible, setVisible] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  const dismiss = useCallback(() => {
    setDismissing(true);
    setTimeout(() => {
      setVisible(false);
      setDismissing(false);
    }, 300);
  }, []);

  useEffect(() => {
    function handleRateLimited(e: Event) {
      const retryAfter = (e as CustomEvent).detail?.retryAfter ?? 60;
      setTotalSeconds(retryAfter);
      setSecondsLeft(retryAfter);
      setDismissing(false);
      setVisible(true);
    }

    window.addEventListener("rate-limited", handleRateLimited);
    return () => window.removeEventListener("rate-limited", handleRateLimited);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!visible || dismissing || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          dismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible, dismissing, secondsLeft, dismiss]);

  if (!visible) return null;

  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-100 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 ${dismissing ? "animate-[toast-out_0.3s_ease-in_forwards]" : "animate-[toast-in_0.4s_ease-out]"}`}
    >
      <div className="overflow-hidden rounded-xl border border-edge bg-surface shadow-lg shadow-black/10">
        {/* Left accent border */}
        <div className="flex border-l-4 border-incorrect p-4">
          {/* Shield icon */}
          <div className="mr-3 shrink-0 mt-0.5">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-incorrect"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink">Slow down</p>
            <p className="mt-1 text-sm text-muted">
              You&apos;re sending requests too quickly.
              {secondsLeft > 0 && (
                <span className="font-medium text-ink">
                  {" "}Try again in {secondsLeft}s
                </span>
              )}
            </p>
          </div>

          {/* Dismiss button */}
          <button
            onClick={dismiss}
            className="ml-2 shrink-0 rounded-lg p-1 text-muted transition-colors hover:bg-page hover:text-ink"
            aria-label="Dismiss"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-page">
          <div
            className="h-full bg-incorrect transition-all duration-1000 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
