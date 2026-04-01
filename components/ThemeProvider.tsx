"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_PALETTE, getPaletteById, applyPaletteStyles } from "@/lib/palettes";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  palette: string;
  toggleTheme: () => void;
  setPalette: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  palette: DEFAULT_PALETTE,
  toggleTheme: () => {},
  setPalette: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function applyColors(theme: Theme, paletteId: string) {
  const p = getPaletteById(paletteId);
  const colors = theme === "dark" ? p.dark : p.light;
  applyPaletteStyles(document.documentElement, colors);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [palette, setPaletteState] = useState(DEFAULT_PALETTE);

  // Sync state from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("nsct-theme") as Theme | null;
    const savedPalette = localStorage.getItem("nsct-palette") || DEFAULT_PALETTE;
    const t = savedTheme === "dark" ? "dark" : "light";
    setTheme(t);
    setPaletteState(savedPalette);
    // Inline styles are already applied by the flash-prevention script,
    // but re-apply to stay in sync
    applyColors(t, savedPalette);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("nsct-theme", next);
    document.documentElement.setAttribute("data-theme", next);
    // Re-apply palette colors for the new theme mode
    applyColors(next, palette);
  };

  const setPalette = (id: string) => {
    setPaletteState(id);
    if (id === DEFAULT_PALETTE) {
      localStorage.removeItem("nsct-palette");
    } else {
      localStorage.setItem("nsct-palette", id);
    }
    applyColors(theme, id);
  };

  return (
    <ThemeContext.Provider value={{ theme, palette, toggleTheme, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}
