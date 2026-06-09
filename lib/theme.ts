import type { Lang } from "./portfolio-types"

export interface Palette {
  /** Full-page ombre background gradient. */
  background: string
  /** Warm/cool accent used for primary buttons & links. */
  accent: string
  accentHover: string
  /** Text color that sits on top of the accent. */
  onAccent: string
  /** Glass card background + border + its text/muted colors. */
  card: string
  cardBorder: string
  cardText: string
  cardMuted: string
  /** Unified (non-gradient) heading colors, one per scroll section.
   *  The color shifts as you move down the page. */
  sectionHeading: string[]
  /** Body text colors paired with each section. */
  sectionBody: string[]
  /** Soft chip/tag styling. */
  chipBg: string
  chipText: string
  isNight: boolean
}

const en: Palette = {
  // Night/sunset — purple dominant up top, melting into pink then red-orange.
  background:
    "linear-gradient(180deg,#160a2e 0%,#211046 18%,#33145a 36%,#561a63 54%,#8a256a 70%,#c2406a 84%,#e0562f 100%)",
  accent: "#ff7a59",
  accentHover: "#ff6a45",
  onAccent: "#2a0f12",
  card: "rgba(22,11,42,0.55)",
  cardBorder: "rgba(255,255,255,0.14)",
  cardText: "#fbe9df",
  cardMuted: "rgba(251,233,223,0.72)",
  sectionHeading: ["#ffd9a8", "#ff9e8a", "#ff8fb0", "#f0a6ff", "#cdb8ff"],
  sectionBody: [
    "rgba(255,230,205,0.86)",
    "rgba(255,205,195,0.86)",
    "rgba(255,200,220,0.86)",
    "rgba(238,205,255,0.86)",
    "rgba(214,205,255,0.86)",
  ],
  chipBg: "rgba(255,255,255,0.10)",
  chipText: "#fbe9df",
  isNight: true,
}

const vn: Palette = {
  // Day — sea blue & warm yellow dominant, green as the bridge between them.
  background:
    "linear-gradient(180deg,#1f9fe0 0%,#34b6df 20%,#46c3c0 38%,#5bc98f 52%,#8bd463 66%,#d6e24f 82%,#f6a93f 100%)",
  accent: "#f97316",
  accentHover: "#ea670c",
  onAccent: "#fff7ed",
  card: "rgba(255,255,255,0.55)",
  cardBorder: "rgba(255,255,255,0.8)",
  cardText: "#0c2c40",
  cardMuted: "rgba(12,44,64,0.72)",
  sectionHeading: ["#0b3a5c", "#0f5a52", "#286b22", "#7a5a0c", "#9a4a08"],
  sectionBody: [
    "rgba(11,58,92,0.85)",
    "rgba(15,80,72,0.85)",
    "rgba(34,80,30,0.85)",
    "rgba(96,72,12,0.85)",
    "rgba(120,58,10,0.85)",
  ],
  chipBg: "rgba(255,255,255,0.6)",
  chipText: "#0c2c40",
  isNight: false,
}

export function getPalette(lang: Lang): Palette {
  return lang === "vn" ? vn : en
}
