"use client"

import type { CSSProperties, ReactNode } from "react"
import type { Palette } from "@/lib/theme"

export function GlassCard({
  palette,
  children,
  className,
  style,
}: {
  palette: Palette
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={`rounded-3xl backdrop-blur-md ${className ?? ""}`}
      style={{
        background: palette.card,
        border: `1px solid ${palette.cardBorder}`,
        color: palette.cardText,
        boxShadow: palette.isNight
          ? "0 18px 50px -20px rgba(0,0,0,0.6)"
          : "0 18px 50px -24px rgba(20,60,90,0.45)",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Chip({ palette, children }: { palette: Palette; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm"
      style={{ background: palette.chipBg, color: palette.chipText }}
    >
      {children}
    </span>
  )
}
