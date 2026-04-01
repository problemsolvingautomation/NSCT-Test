export interface PaletteColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  onPrimary: string;
}

export interface Palette {
  id: string;
  name: string;
  /** Swatch color shown in picker (light-mode primary) */
  swatch: string;
  light: PaletteColors;
  dark: PaletteColors;
}

export const palettes: Palette[] = [
  {
    id: "teal",
    name: "Teal",
    swatch: "#0D9488",
    light: { primary: "#0D9488", primaryHover: "#0F766E", primaryLight: "#CCFBF1", onPrimary: "#FFFFFF" },
    dark:  { primary: "#2DD4BF", primaryHover: "#5EEAD4", primaryLight: "#134E4A", onPrimary: "#042F2E" },
  },
  {
    id: "blue",
    name: "Blue",
    swatch: "#2563EB",
    light: { primary: "#2563EB", primaryHover: "#1D4ED8", primaryLight: "#DBEAFE", onPrimary: "#FFFFFF" },
    dark:  { primary: "#60A5FA", primaryHover: "#93C5FD", primaryLight: "#1E3A5F", onPrimary: "#172554" },
  },
  {
    id: "violet",
    name: "Violet",
    swatch: "#7C3AED",
    light: { primary: "#7C3AED", primaryHover: "#6D28D9", primaryLight: "#EDE9FE", onPrimary: "#FFFFFF" },
    dark:  { primary: "#A78BFA", primaryHover: "#C4B5FD", primaryLight: "#2E1065", onPrimary: "#1E0A4B" },
  },
  {
    id: "purple",
    name: "Purple",
    swatch: "#9333EA",
    light: { primary: "#9333EA", primaryHover: "#7E22CE", primaryLight: "#F3E8FF", onPrimary: "#FFFFFF" },
    dark:  { primary: "#C084FC", primaryHover: "#D8B4FE", primaryLight: "#3B0764", onPrimary: "#2E1065" },
  },
  {
    id: "rose",
    name: "Rose",
    swatch: "#E11D48",
    light: { primary: "#E11D48", primaryHover: "#BE123C", primaryLight: "#FFE4E6", onPrimary: "#FFFFFF" },
    dark:  { primary: "#FB7185", primaryHover: "#FDA4AF", primaryLight: "#4C0519", onPrimary: "#881337" },
  },
  {
    id: "orange",
    name: "Orange",
    swatch: "#EA580C",
    light: { primary: "#EA580C", primaryHover: "#C2410C", primaryLight: "#FFEDD5", onPrimary: "#FFFFFF" },
    dark:  { primary: "#FB923C", primaryHover: "#FDBA74", primaryLight: "#431407", onPrimary: "#7C2D12" },
  },
  {
    id: "amber",
    name: "Amber",
    swatch: "#D97706",
    light: { primary: "#D97706", primaryHover: "#B45309", primaryLight: "#FEF3C7", onPrimary: "#FFFFFF" },
    dark:  { primary: "#FBBF24", primaryHover: "#FCD34D", primaryLight: "#451A03", onPrimary: "#78350F" },
  },
  {
    id: "emerald",
    name: "Emerald",
    swatch: "#059669",
    light: { primary: "#059669", primaryHover: "#047857", primaryLight: "#D1FAE5", onPrimary: "#FFFFFF" },
    dark:  { primary: "#34D399", primaryHover: "#6EE7B7", primaryLight: "#064E3B", onPrimary: "#022C22" },
  },
  {
    id: "cyan",
    name: "Cyan",
    swatch: "#0891B2",
    light: { primary: "#0891B2", primaryHover: "#0E7490", primaryLight: "#CFFAFE", onPrimary: "#FFFFFF" },
    dark:  { primary: "#22D3EE", primaryHover: "#67E8F9", primaryLight: "#164E63", onPrimary: "#083344" },
  },
  {
    id: "slate",
    name: "Slate",
    swatch: "#475569",
    light: { primary: "#475569", primaryHover: "#334155", primaryLight: "#F1F5F9", onPrimary: "#FFFFFF" },
    dark:  { primary: "#94A3B8", primaryHover: "#CBD5E1", primaryLight: "#1E293B", onPrimary: "#0F172A" },
  },
  {
    id: "red",
    name: "Red",
    swatch: "#DC2626",
    light: { primary: "#DC2626", primaryHover: "#B91C1C", primaryLight: "#FEE2E2", onPrimary: "#FFFFFF" },
    dark:  { primary: "#F87171", primaryHover: "#FCA5A5", primaryLight: "#450A0A", onPrimary: "#7F1D1D" },
  },
  {
    id: "pink",
    name: "Pink",
    swatch: "#EC4899",
    light: { primary: "#EC4899", primaryHover: "#DB2777", primaryLight: "#FCE7F3", onPrimary: "#FFFFFF" },
    dark:  { primary: "#F472B6", primaryHover: "#F9A8D4", primaryLight: "#500724", onPrimary: "#831843" },
  },
  {
    id: "lime",
    name: "Lime",
    swatch: "#65A30D",
    light: { primary: "#65A30D", primaryHover: "#4D7C0F", primaryLight: "#ECFCCB", onPrimary: "#FFFFFF" },
    dark:  { primary: "#A3E635", primaryHover: "#BEF264", primaryLight: "#1A2E05", onPrimary: "#365314" },
  },
  {
    id: "green",
    name: "Green",
    swatch: "#16A34A",
    light: { primary: "#16A34A", primaryHover: "#15803D", primaryLight: "#DCFCE7", onPrimary: "#FFFFFF" },
    dark:  { primary: "#4ADE80", primaryHover: "#86EFAC", primaryLight: "#052E16", onPrimary: "#14532D" },
  },
  {
    id: "zinc",
    name: "Zinc",
    swatch: "#71717A",
    light: { primary: "#71717A", primaryHover: "#52525B", primaryLight: "#F4F4F5", onPrimary: "#FFFFFF" },
    dark:  { primary: "#A1A1AA", primaryHover: "#D4D4D8", primaryLight: "#27272A", onPrimary: "#18181B" },
  },
];

export const DEFAULT_PALETTE = "teal";

export function getPaletteById(id: string): Palette {
  return palettes.find((p) => p.id === id) ?? palettes[0];
}

/** Apply palette colors as inline styles on an element (always wins over CSS) */
export function applyPaletteStyles(el: HTMLElement, colors: PaletteColors) {
  el.style.setProperty("--clr-primary", colors.primary);
  el.style.setProperty("--clr-primary-hover", colors.primaryHover);
  el.style.setProperty("--clr-primary-light", colors.primaryLight);
  el.style.setProperty("--clr-on-primary", colors.onPrimary);
}
