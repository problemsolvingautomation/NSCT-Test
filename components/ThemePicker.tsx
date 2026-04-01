"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { palettes } from "@/lib/palettes";

export default function ThemePicker() {
  const { palette, setPalette, theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  const currentPalette = palettes.find((p) => p.id === palette) ?? palettes[0];

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger — visible button with palette icon + color dot */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 bg-page border rounded-full px-3 py-2 text-sm font-medium text-ink cursor-pointer hover:border-primary theme-transition ${
          open ? "border-primary" : "border-edge"
        }`}
        aria-label="Customize appearance"
        aria-expanded={open}
        title="Customize appearance"
      >
        {/* Palette icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        {/* Current color dot */}
        <span
          className="w-4 h-4 rounded-full border border-edge"
          style={{ backgroundColor: currentPalette.swatch }}
        />
        <span className="hidden sm:inline">{currentPalette.name}</span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-surface border border-edge rounded-xl shadow-xl p-5 w-80 z-50 theme-transition">
          {/* Light / Dark toggle */}
          <div className="mb-4">
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">
              Mode
            </p>
            <div className="flex border border-edge rounded-lg overflow-hidden">
              <button
                onClick={() => { if (theme === "dark") toggleTheme(); }}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  theme === "light"
                    ? "bg-primary text-on-primary"
                    : "bg-surface text-muted hover:text-ink"
                }`}
              >
                Light
              </button>
              <button
                onClick={() => { if (theme === "light") toggleTheme(); }}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-primary text-on-primary"
                    : "bg-surface text-muted hover:text-ink"
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Color palette grid */}
          <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">
            Accent Color
          </p>
          <div className="grid grid-cols-5 gap-2">
            {palettes.map((p) => {
              const isActive = p.id === palette;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setPalette(p.id);
                  }}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary-light ring-2 ring-primary"
                      : "hover:bg-page"
                  }`}
                  aria-label={`${p.name} theme${isActive ? " (active)" : ""}`}
                >
                  <span className="relative">
                    <span
                      className="block w-9 h-9 rounded-full border-2 transition-all shadow-sm"
                      style={{
                        backgroundColor: p.swatch,
                        borderColor: isActive ? p.swatch : "var(--clr-edge)",
                      }}
                    />
                    {isActive && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="absolute inset-0 m-auto drop-shadow"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  <span className={`text-xs font-medium ${isActive ? "text-primary" : "text-muted"}`}>
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
