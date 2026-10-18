/** The round Riverine emblem: tree, cross and river inside a ring. */
export function Emblem({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <img
      src="/logo-emblem.png"
      width={size}
      height={size}
      alt="Riverine Community Church"
      className={className}
      style={{ width: size, height: size }}
    />
  )
}

/** Full wordmark: RIVERINE with "Community Church" beneath. */
export function Wordmark({ width = 180, className }: { width?: number; className?: string }) {
  return (
    <img
      src="/logo-wordmark.png"
      width={width}
      height={Math.round((width * 278) / 944)}
      alt="Riverine Community Church"
      className={className}
    />
  )
}
