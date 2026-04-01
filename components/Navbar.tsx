"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemePicker from "./ThemePicker";

const NAV_LINKS = [
  {
    href: "/",
    label: "Home",
    match: (p: string) => p === "/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/subjects",
    label: "Subjects",
    match: (p: string) => p === "/subjects",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/university-mcqs",
    label: "University",
    match: (p: string) => p.startsWith("/university-mcqs"),
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    href: "/blog",
    label: "Blog",
    match: (p: string) => p.startsWith("/blog"),
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    href: "/about",
    label: "About",
    match: (p: string) => p === "/about",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const pathname = usePathname();

  const isQuizActive = pathname.startsWith("/quiz/play") || pathname.startsWith("/university-mcqs/play");

  return (
    <>
      {/* Top navbar */}
      <nav className="sticky top-0 z-50 h-16 bg-surface/95 backdrop-blur-sm border-b border-edge shadow-sm flex items-center px-4 sm:px-6 theme-transition">
        {/* Brand — during active quiz, intercept to show leave confirmation */}
        {isQuizActive ? (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("quiz-leave-request", { detail: { url: "/" } }))}
            className="flex items-center gap-2.5 no-underline group cursor-pointer"
          >
            <img
              src="/NSCTPrep-Logo.png"
              alt="NSCT Prep Logo"
              width={36}
              height={36}
              className="shrink-0 rounded-lg"
            />
            <div className="flex gap-0.5 flex-col leading-none">
              <span className="font-bold text-ink text-[17px] tracking-tight group-hover:text-primary transition-colors">
                NSCT Prep
              </span>
              <span className="text-[10px] font-medium text-muted tracking-wide hidden sm:block">
                TEST PREPARATION
              </span>
            </div>
          </button>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-2.5 no-underline group"
          >
            <img
              src="/NSCTPrep-Logo.png"
              alt="NSCT Prep Logo"
              width={36}
              height={36}
              className="shrink-0 rounded-lg"
            />
            <div className="flex gap-0.5 flex-col leading-none">
              <span className="font-bold text-ink text-[17px] tracking-tight group-hover:text-primary transition-colors">
                NSCT Prep
              </span>
              <span className="text-[10px] font-medium text-muted tracking-wide hidden sm:block">
                TEST PREPARATION
              </span>
            </div>
          </Link>
        )}

        {/* Desktop nav links — hidden during active quiz for focus */}
        {!isQuizActive && (
          <div className="hidden md:flex items-center gap-1 ml-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  link.match(pathname)
                    ? "text-primary bg-primary-light"
                    : "text-muted hover:text-ink hover:bg-page"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div className="flex-1" />

        {/* Quiz context indicator — shown only during active quiz */}
        {isQuizActive && (
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted mr-3">
            <span className="w-2 h-2 rounded-full bg-correct animate-pulse" />
            Quiz in progress
          </span>
        )}

        {/* Appearance control */}
        <ThemePicker />
      </nav>

      {/* Mobile bottom navigation — hidden during active quiz and on desktop */}
      {!isQuizActive && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface/95 backdrop-blur-sm border-t border-edge shadow-[0_-2px_8px_rgba(0,0,0,0.06)] theme-transition">
          <div className="flex items-center justify-around h-14 px-2">
            {NAV_LINKS.map((link) => {
              const isActive = link.match(pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors min-w-15 ${
                    isActive
                      ? "text-primary"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {link.icon}
                  <span className={`text-[10px] font-medium ${isActive ? "text-primary" : ""}`}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
