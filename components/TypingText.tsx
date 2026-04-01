"use client";

import { useState, useEffect, useCallback } from "react";

interface TypingTextProps {
  phrases: string[];
  /** Typing speed in ms per character */
  typeSpeed?: number;
  /** Deleting speed in ms per character */
  deleteSpeed?: number;
  /** Pause duration in ms after a phrase is fully typed */
  pauseDuration?: number;
  className?: string;
}

export default function TypingText({
  phrases,
  typeSpeed = 80,
  deleteSpeed = 40,
  pauseDuration = 2000,
  className = "",
}: TypingTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPhrase = phrases[phraseIndex];

  const tick = useCallback(() => {
    if (isDeleting) {
      setDisplayText((prev) => prev.slice(0, -1));
    } else {
      setDisplayText((prev) => currentPhrase.slice(0, prev.length + 1));
    }
  }, [isDeleting, currentPhrase]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText === currentPhrase) {
      // Finished typing — pause then start deleting
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && displayText === "") {
      // Finished deleting — move to next phrase
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    } else {
      timeout = setTimeout(tick, isDeleting ? deleteSpeed : typeSpeed);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentPhrase, phrases.length, tick, typeSpeed, deleteSpeed, pauseDuration]);

  return (
    <span className={className}>
      {displayText}
      <span className="inline-block w-0.5 h-[1em] bg-primary ml-0.5 align-middle animate-[blink_1s_step-end_infinite]" />
    </span>
  );
}
