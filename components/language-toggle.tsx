"use client"

import { usePortfolio } from "@/lib/portfolio-context"
import { getPalette } from "@/lib/theme"
import type { Lang } from "@/lib/portfolio-types"

export function LanguageToggle() {
  const { lang, setLang } = usePortfolio()
  const palette = getPalette(lang)

  const options: { id: Lang; label: string }[] = [
    { id: "en", label: "EN" },
    { id: "vn", label: "VN" },
  ]

  return (
    <div
      className="fixed left-3 top-3 z-50 flex flex-col gap-2 rounded-full p-1.5 backdrop-blur-md sm:left-5 sm:top-5"
      style={{ background: palette.card, border: `1px solid ${palette.cardBorder}` }}
    >
      {options.map((o) => {
        const active = lang === o.id
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => setLang(o.id)}
            aria-pressed={active}
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-transform duration-200 hover:scale-110"
            style={{
              background: active ? palette.accent : "transparent",
              color: active ? palette.onAccent : palette.cardText,
              boxShadow: active ? "0 4px 14px rgba(0,0,0,0.25)" : "none",
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
