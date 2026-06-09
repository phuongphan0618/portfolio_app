import type { CSSProperties } from "react"

/** A simple four-pointed star / sparkle shape. */
export function Sparkle({
  size = 24,
  color = "currentColor",
  className,
  style,
}: {
  size?: number
  color?: string
  className?: string
  style?: CSSProperties
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M12 0C12.6 6.2 17.8 11.4 24 12C17.8 12.6 12.6 17.8 12 24C11.4 17.8 6.2 12.6 0 12C6.2 11.4 11.4 6.2 12 0Z"
        fill={color}
      />
    </svg>
  )
}
