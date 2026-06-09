"use client"

import { useEffect, useRef, useState } from "react"
import { ExternalLink, Github, X } from "lucide-react"
import { usePortfolio } from "@/lib/portfolio-context"
import { getPalette } from "@/lib/theme"
import { GlassCard, Chip } from "./glass-card"
import { Reveal } from "./reveal"
import { Sparkle } from "./sparkle"
import { Fireworks, type Burst } from "./fireworks"

export function Projects() {
  const { data, lang, t } = usePortfolio()
  const palette = getPalette(lang)
  const heading = palette.sectionHeading[3]
  const body = palette.sectionBody[3]

  const [openId, setOpenId] = useState<string | null>(null)
  const [burst, setBurst] = useState<Burst | null>(null)
  const burstId = useRef(0)
  const sectionRef = useRef<HTMLElement>(null)

  const projects = data.projects ?? []

  // Close the chat box when the projects section scrolls out of view.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setOpenId(null)
      },
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenId(null)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  if (projects.length === 0) return null

  const open = projects.find((p) => p.id === openId) ?? null

  const handleNode = (e: React.MouseEvent, id: string) => {
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    burstId.current += 1
    setBurst({
      id: burstId.current,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      color: palette.accent,
    })
    setOpenId((cur) => (cur === id ? null : id))
  }

  return (
    <section ref={sectionRef} id="projects" className="mx-auto w-full max-w-5xl px-4 pt-16 sm:px-6">
      <Reveal>
        <h2 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: heading }}>
          {lang === "vn" ? "Dự án" : "Projects"}
        </h2>
        <p className="mt-1 text-sm" style={{ color: body }}>
          {lang === "vn"
            ? "Chạm vào ngôi sao ở mỗi mốc để mở chi tiết."
            : "Tap the star on each milestone to open its details."}
        </p>
      </Reveal>

      <ol className="relative mt-8 space-y-7">
        {/* timeline spine */}
        <span
          className="absolute bottom-3 left-[14px] top-3 w-px"
          style={{ background: palette.cardBorder }}
          aria-hidden="true"
        />
        {projects.map((p, i) => {
          const isOpen = openId === p.id
          return (
            <Reveal key={p.id} delay={i * 0.06}>
              <li className="relative flex items-start gap-4 sm:gap-5">
                <button
                  type="button"
                  onClick={(e) => handleNode(e, p.id)}
                  aria-expanded={isOpen}
                  aria-label={`${t(p.title)} — ${lang === "vn" ? "xem chi tiết" : "view details"}`}
                  className="group relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-125"
                  style={{ background: palette.card, border: `1px solid ${palette.cardBorder}` }}
                >
                  <Sparkle
                    size={20}
                    color={isOpen ? palette.accent : palette.cardText}
                    className="transition-all duration-300 group-hover:animate-spin-slow"
                  />
                </button>

                <button
                  type="button"
                  onClick={(e) => handleNode(e, p.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <GlassCard
                    palette={palette}
                    className="p-5 transition-transform duration-300 hover:-translate-y-0.5"
                    style={isOpen ? { outline: `2px solid ${palette.accent}` } : undefined}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-semibold" style={{ color: palette.cardText }}>
                        {t(p.title)}
                      </h3>
                      {p.featured && (
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                          style={{ background: palette.accent, color: palette.onAccent }}
                        >
                          {lang === "vn" ? "Nổi bật" : "Featured"}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed" style={{ color: palette.cardMuted }}>
                      {t(p.description)}
                    </p>
                    {p.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.tags.map((tag) => (
                          <Chip key={tag} palette={palette}>
                            {tag}
                          </Chip>
                        ))}
                      </div>
                    )}
                    <span
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold"
                      style={{ color: palette.accent }}
                    >
                      {isOpen
                        ? lang === "vn"
                          ? "Đang mở chi tiết"
                          : "Details open"
                        : lang === "vn"
                          ? "Nhấn để xem chi tiết"
                          : "Click to view details"}
                    </span>
                  </GlassCard>
                </button>
              </li>
            </Reveal>
          )
        })}
      </ol>

      {/* chat-box detail panel */}
      {open && (
        <>
          {/* click-outside catcher */}
          <div className="fixed inset-0 z-40" onClick={() => setOpenId(null)} aria-hidden="true" />
          <aside
            role="dialog"
            aria-label={t(open.title)}
            className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:bottom-auto sm:right-5 sm:top-1/2 sm:w-[360px] sm:-translate-y-1/2"
            style={{ animation: "pop-in 0.32s ease-out both" }}
          >
            <GlassCard palette={palette} className="p-5" style={{ outline: `2px solid ${palette.accent}` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkle size={18} color={palette.accent} className="animate-spin-slow" />
                  <h3 className="font-display text-lg font-semibold" style={{ color: palette.cardText }}>
                    {t(open.title)}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenId(null)}
                  aria-label={lang === "vn" ? "Đóng" : "Close"}
                  className="rounded-full p-1 transition-transform hover:scale-110"
                  style={{ background: palette.chipBg, color: palette.cardText }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: palette.cardMuted }}>
                {t(open.detail) || t(open.description)}
              </p>
              {(open.github || open.demo) && (
                <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
                  {open.github && (
                    <a
                      href={open.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-80"
                      style={{ color: palette.accent }}
                    >
                      <Github className="h-4 w-4" /> GitHub
                    </a>
                  )}
                  {open.demo && (
                    <a
                      href={open.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-80"
                      style={{ color: palette.accent }}
                    >
                      <ExternalLink className="h-4 w-4" /> {lang === "vn" ? "Bản chạy thử" : "Live Demo"}
                    </a>
                  )}
                </div>
              )}
            </GlassCard>
          </aside>
        </>
      )}

      <Fireworks burst={burst} onDone={() => setBurst(null)} />
    </section>
  )
}
