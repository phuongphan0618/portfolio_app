"use client"

import { usePortfolio } from "@/lib/portfolio-context"
import { getPalette } from "@/lib/theme"
import { GlassCard } from "./glass-card"
import { Reveal } from "./reveal"
import { Sparkle } from "./sparkle"

export function Education() {
  const { data, lang, t } = usePortfolio()
  const palette = getPalette(lang)
  const heading = palette.sectionHeading[2]
  const body = palette.sectionBody[2]

  const edu = data.education
  const hasEdu = Boolean(edu?.school?.en || edu?.school?.vn)
  const certs = data.certificates ?? []

  if (!hasEdu && certs.length === 0) return null

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pt-16 sm:px-6">
      <Reveal>
        <GlassCard palette={palette} className="p-6 sm:p-10">
          <div className="grid gap-10 md:grid-cols-2">
            {hasEdu && (
              <div>
                <h2 className="font-display text-2xl font-semibold" style={{ color: heading }}>
                  {edu.heading?.en || edu.heading?.vn ? t(edu.heading) : lang === "vn" ? "Học vấn" : "Education"}
                </h2>
                <div className="mt-5 space-y-1">
                  <p className="text-lg font-semibold" style={{ color: palette.cardText }}>
                    {t(edu.school)}
                  </p>
                  {(edu.degree?.en || edu.degree?.vn) && (
                    <p style={{ color: body }}>{t(edu.degree)}</p>
                  )}
                  {edu.period && <p className="text-sm" style={{ color: palette.cardMuted }}>{edu.period}</p>}
                  {edu.gpa && (
                    <p className="text-sm font-medium" style={{ color: palette.accent }}>
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>
              </div>
            )}

            {certs.length > 0 && (
              <div className={hasEdu ? "md:border-l md:pl-10" : ""} style={{ borderColor: palette.cardBorder }}>
                <h2 className="font-display text-2xl font-semibold" style={{ color: heading }}>
                  {lang === "vn" ? "Chứng chỉ" : "Certificates"}
                </h2>
                <ol className="mt-5 space-y-6">
                  {certs.map((c) => (
                    <li key={c.id} className="relative pl-8">
                      <Sparkle
                        size={18}
                        color={palette.accent}
                        className="absolute left-0 top-0.5 animate-spin-slow"
                      />
                      <p className="font-semibold leading-tight" style={{ color: palette.cardText }}>
                        {t(c.title)}
                      </p>
                      <p className="text-sm" style={{ color: body }}>
                        {(c.issuer?.en || c.issuer?.vn) && t(c.issuer)}
                        {c.date && (c.issuer?.en || c.issuer?.vn) ? " · " : ""}
                        {c.date}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </GlassCard>
      </Reveal>
    </section>
  )
}
