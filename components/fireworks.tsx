"use client"

import { useEffect, useState } from "react"

export interface Burst {
  id: number
  x: number
  y: number
  color: string
}

export function Fireworks({ burst, onDone }: { burst: Burst | null; onDone: (id: number) => void }) {
  const [active, setActive] = useState<Burst | null>(null)

  useEffect(() => {
    if (!burst) return
    setActive(burst)
    const tm = setTimeout(() => {
      setActive(null)
      onDone(burst.id)
    }, 750)
    return () => clearTimeout(tm)
  }, [burst, onDone])

  if (!active) return null

  const particles = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2
    const dist = 50 + Math.random() * 55
    return {
      fx: `${Math.cos(angle) * dist}px`,
      fy: `${Math.sin(angle) * dist}px`,
    }
  })

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute block h-2 w-2 rounded-full"
          style={
            {
              left: active.x,
              top: active.y,
              background: active.color,
              boxShadow: `0 0 8px ${active.color}`,
              "--fx": p.fx,
              "--fy": p.fy,
              animation: "firework-particle 0.72s ease-out forwards",
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
