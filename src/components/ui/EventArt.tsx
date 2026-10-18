/** Lakeside illustration used as the event hero. */
export function EventArt({ height, width = 358 }: { height: number; width?: number }) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="block"
    >
      <rect width={width} height={height} fill="#2c4241" />
      <circle cx="250" cy={height * 0.47} r="30" fill="#c3dcd9" opacity="0.45" />
      <path d={`M0 ${height * 0.55} C50 ${height * 0.41} 110 ${height * 0.44} 170 ${height * 0.5} C230 ${height * 0.57} 290 ${height * 0.4} ${width} ${height * 0.45} V${height} H0Z`} fill="#1f2e2d" />
      <path d={`M0 ${height * 0.67} H${width} V${height} H0Z`} fill="#3f5454" />
      <path
        d={`M200 ${height * 0.73} H300 M220 ${height * 0.81} H280 M60 ${height * 0.79} H150 M100 ${height * 0.9} H230`}
        stroke="#c3dcd9"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
      <rect x="300" y={height * 0.37} width="4" height={height * 0.29} fill="#142020" />
      <circle cx="302" cy={height * 0.35} r="16" fill="#142020" />
      <circle cx="292" cy={height * 0.41} r="10" fill="#142020" />
      <circle cx="313" cy={height * 0.41} r="10" fill="#142020" />
    </svg>
  )
}
