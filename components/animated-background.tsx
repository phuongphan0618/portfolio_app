"use client"

import { useMemo } from "react"
import { usePortfolio } from "@/lib/portfolio-context"
import { getPalette } from "@/lib/theme"
import { Sparkle } from "./sparkle"

function seeded(n: number) {
  // deterministic pseudo-random so SSR/CSR match.
  // Math.sin can differ in its last digits between Node and the browser,
  // so we round to a fixed precision to keep server/client output identical.
  const x = Math.sin(n * 999.13) * 10000
  return Math.round((x - Math.floor(x)) * 1e4) / 1e4
}

function NightSky() {
  const stars = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => ({
        top: seeded(i + 1) * 100,
        left: seeded(i + 50) * 100,
        size: 6 + seeded(i + 9) * 16,
        delay: seeded(i + 3) * 5,
        dur: 2.4 + seeded(i + 7) * 3,
      })),
    [],
  )
  const shooters = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        top: 4 + seeded(i + 21) * 36,
        left: 8 + seeded(i + 31) * 60,
        delay: i * 4.5 + seeded(i + 13) * 3,
        dur: 2.4 + seeded(i + 5) * 1.6,
      })),
    [],
  )

  return (
    <>
      {/* moon glow */}
      <div
        className="absolute right-[12%] top-[6%] h-40 w-40 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 35%, #fff6e6 0%, #ffd9a0 45%, rgba(255,217,160,0) 72%)",
          filter: "blur(2px)",
        }}
      />
      {stars.map((s, i) => (
        <Sparkle
          key={i}
          size={s.size}
          color="#fff3da"
          className="absolute"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      {shooters.map((s, i) => (
        <div
          key={`sh-${i}`}
          className="absolute h-px w-24"
          style={
            {
              top: `${s.top}%`,
              left: `${s.left}%`,
              background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, #fff 90%)",
              borderRadius: "9999px",
              "--angle": "32deg",
              "--dx": "46vw",
              "--dy": "30vh",
              animation: `shoot ${s.dur}s ease-in ${s.delay}s infinite`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  )
}

function Cloud({ style, scale = 1 }: { style?: React.CSSProperties; scale?: number }) {
  return (
    <div className="absolute" style={style}>
      <div style={{ transform: `scale(${scale})` }}>
        <div className="relative h-12 w-44">
          <div className="absolute bottom-0 h-10 w-44 rounded-full bg-white/85" />
          <div className="absolute bottom-2 left-6 h-16 w-16 rounded-full bg-white/85" />
          <div className="absolute bottom-3 left-20 h-20 w-20 rounded-full bg-white/90" />
          <div className="absolute bottom-2 left-28 h-14 w-14 rounded-full bg-white/85" />
        </div>
      </div>
    </div>
  )
}

function DaySky() {
  const clouds = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        top: 6 + seeded(i + 41) * 60,
        scale: 0.6 + seeded(i + 17) * 0.9,
        delay: -seeded(i + 23) * 40,
        dur: 38 + seeded(i + 11) * 40,
      })),
    [],
  )
  return (
    <>
      {/* orange sun */}
      <div
        className="animate-spin-slow absolute right-[12%] top-[7%]"
        style={{ animationDuration: "60s" }}
      >
        <div
          className="h-28 w-28 rounded-full"
          style={{
            background: "radial-gradient(circle at 40% 38%, #ffd166 0%, #fb923c 60%, #f97316 100%)",
            animation: "sun-pulse 5s ease-in-out infinite",
          }}
        />
      </div>
      {clouds.map((c, i) => (
        <div
          key={i}
          className="absolute left-0"
          style={{
            top: `${c.top}%`,
            animation: `drift ${c.dur}s linear ${c.delay}s infinite`,
          }}
        >
          <Cloud scale={c.scale} />
        </div>
      ))}
    </>
  )
}

export function AnimatedBackground() {
  const { lang } = usePortfolio()
  const palette = getPalette(lang)

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-[background] duration-700"
      style={{ background: palette.background }}
    >
      {palette.isNight ? <NightSky /> : <DaySky />}
    </div>
  )
}
