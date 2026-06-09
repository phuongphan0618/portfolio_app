"use client"

import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { usePortfolio } from "@/lib/portfolio-context"
import { getPalette } from "@/lib/theme"
import { resolveImageUrl } from "@/lib/image-link"
import { GlassCard } from "./glass-card"
import { Reveal } from "./reveal"

export function Hero() {
  const { data, lang, t } = usePortfolio()
  const palette = getPalette(lang)
  const heading = palette.sectionHeading[0]
  const body = palette.sectionBody[0]
  const img = resolveImageUrl(data.imageUrl)

  const initials =
    data.name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })

  const socials = [
    data.github && { href: data.github, label: "GitHub", Icon: Github },
    data.linkedin && { href: data.linkedin, label: "LinkedIn", Icon: Linkedin },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof Github }[]

  const contacts = [
    data.location.en && { Icon: MapPin, text: t(data.location), href: undefined },
    data.email && { Icon: Mail, text: data.email, href: `mailto:${data.email}` },
    data.phone && { Icon: Phone, text: data.phone, href: `tel:${data.phone}` },
  ].filter(Boolean) as { Icon: typeof Mail; text: string; href?: string }[]

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pt-24 sm:px-6">
      <div className="grid items-start gap-6 md:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <h1
            className="font-display text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl"
            style={{ color: heading }}
          >
            {data.name}
          </h1>
          <p className="mt-2 text-lg font-medium" style={{ color: body }}>
            {t(data.role)}
          </p>

          <GlassCard palette={palette} className="mt-5 p-6">
            <p className="text-pretty leading-relaxed" style={{ color: palette.cardText }}>
              {t(data.bio)}
            </p>

            {contacts.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {contacts.map(({ Icon, text, href }, i) => {
                  const inner = (
                    <span className="inline-flex items-center gap-2" style={{ color: palette.cardMuted }}>
                      <Icon className="h-4 w-4" style={{ color: palette.accent }} />
                      {text}
                    </span>
                  )
                  return href ? (
                    <a key={i} href={href} className="transition-opacity hover:opacity-80">
                      {inner}
                    </a>
                  ) : (
                    <span key={i}>{inner}</span>
                  )
                })}
              </div>
            )}

            {socials.length > 0 && (
              <div className="mt-5 flex gap-3">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110"
                    style={{ background: palette.chipBg, color: palette.cardText }}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollTo("projects")}
                className="rounded-full px-6 py-2.5 text-sm font-semibold transition-transform hover:scale-105"
                style={{ background: palette.accent, color: palette.onAccent }}
              >
                {lang === "vn" ? "Xem dự án" : "View My Work"}
              </button>
              <button
                type="button"
                onClick={() => scrollTo("contact")}
                className="rounded-full px-6 py-2.5 text-sm font-semibold transition-transform hover:scale-105"
                style={{
                  background: "transparent",
                  color: palette.cardText,
                  border: `1px solid ${palette.cardBorder}`,
                }}
              >
                {lang === "vn" ? "Liên hệ" : "Get in touch"}
              </button>
            </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.12} className="flex justify-center md:justify-end">
          <div className="animate-float-bob">
            <div
              className="relative h-52 w-52 overflow-hidden rounded-[2rem] sm:h-60 sm:w-60"
              style={{ border: `2px solid ${palette.cardBorder}`, background: palette.card }}
            >
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img || "/placeholder.svg"}
                  alt={data.name}
                  crossOrigin="anonymous"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center font-display text-6xl font-semibold"
                  style={{ color: palette.accent }}
                >
                  {initials}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
