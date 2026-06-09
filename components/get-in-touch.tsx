"use client"

import { Send } from "lucide-react"
import { usePortfolio } from "@/lib/portfolio-context"
import { getPalette } from "@/lib/theme"
import { GlassCard } from "./glass-card"
import { Reveal } from "./reveal"
import { Sparkle } from "./sparkle"

export function GetInTouch() {
  const { data, lang, t } = usePortfolio()
  const palette = getPalette(lang)
  const heading = palette.sectionHeading[4]

  return (
    <section id="contact" className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <Reveal>
        <GlassCard palette={palette} className="relative overflow-hidden p-8 text-center sm:p-12">
          <Sparkle
            size={28}
            color={palette.accent}
            className="animate-float-bob absolute left-6 top-6 opacity-70"
          />
          <Sparkle
            size={20}
            color={palette.accent}
            className="animate-spin-slow absolute bottom-6 right-8 opacity-60"
          />
          <h2 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: heading }}>
            {lang === "vn" ? "Cùng kết nối nhé" : "Let's get in touch"}
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed"
            style={{ color: palette.cardMuted }}
          >
            {t(data.getInTouch)}
          </p>
          {data.email && (
            <a
              href={`mailto:${data.email}`}
              className="mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-transform hover:scale-105"
              style={{ background: palette.accent, color: palette.onAccent }}
            >
              <Send className="h-4 w-4" />
              {lang === "vn" ? "Gửi lời chào" : "Say hello"}
            </a>
          )}
        </GlassCard>
        <p className="mt-8 text-center text-xs" style={{ color: palette.sectionBody[4] }}>
          {`© ${new Date().getFullYear()} ${data.name}`}
        </p>
      </Reveal>
    </section>
  )
}
