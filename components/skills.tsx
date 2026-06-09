"use client"

import { usePortfolio } from "@/lib/portfolio-context"
import { getPalette } from "@/lib/theme"
import { GlassCard, Chip } from "./glass-card"
import { Reveal } from "./reveal"

export function Skills() {
  const { data, lang, t } = usePortfolio()
  const palette = getPalette(lang)
  const heading = palette.sectionHeading[1]
  const body = palette.sectionBody[1]

  const groups = data.skills.filter((g) => g.items.length > 0)
  if (groups.length === 0) return null

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pt-16 sm:px-6">
      <Reveal>
        <h2 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: heading }}>
          {lang === "vn" ? "Kỹ năng" : "Skills"}
        </h2>
        <GlassCard palette={palette} className="mt-5 p-6 sm:p-8">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((g, i) => (
              <div key={i}>
                <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: body }}>
                  {t(g.label)}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <Chip key={item} palette={palette}>
                      {item}
                    </Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </Reveal>
    </section>
  )
}
