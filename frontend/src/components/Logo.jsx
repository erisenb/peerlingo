import { useId } from 'react'

// Segmented circle: 2 curved vertical lines + 2 straight horizontal lines = 9 muted-color segments
export default function Logo({ height = 56 }) {
  const uid = useId().replace(/:/g, 'x')
  const clipId = `vp-c-${uid}`
  const s = height

  return (
    <svg width={s} height={s} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', flexShrink: 0 }}>
      <defs>
        <clipPath id={clipId}>
          <circle cx="50" cy="50" r="44" />
        </clipPath>
      </defs>

      {/* 9 colored segments — rectangular fills, clipped to circle, borders drawn on top */}
      <g clipPath={`url(#${clipId})`}>
        {/* Top row (y 0–33) */}
        <rect x="0"  y="0"  width="38" height="33" fill="#c4a8b0" />
        <rect x="38" y="0"  width="24" height="33" fill="#a8bcd4" />
        <rect x="62" y="0"  width="38" height="33" fill="#a8c4b0" />
        {/* Middle row (y 33–67) */}
        <rect x="0"  y="33" width="38" height="34" fill="#d4c8a0" />
        <rect x="38" y="33" width="24" height="34" fill="#c0b0d0" />
        <rect x="62" y="33" width="38" height="34" fill="#a0c4d0" />
        {/* Bottom row (y 67–100) */}
        <rect x="0"  y="67" width="38" height="33" fill="#d0b8a0" />
        <rect x="38" y="67" width="24" height="33" fill="#b0d0b8" />
        <rect x="62" y="67" width="38" height="33" fill="#d0a8a0" />

        {/* Horizontal dividers */}
        <line x1="0" y1="33" x2="100" y2="33" stroke="#222" strokeWidth="2" />
        <line x1="0" y1="67" x2="100" y2="67" stroke="#222" strokeWidth="2" />
        {/* Curved vertical dividers — left bows left, right bows right */}
        <path d="M 50 6 Q 23 50 50 94" fill="none" stroke="#222" strokeWidth="2" />
        <path d="M 50 6 Q 77 50 50 94" fill="none" stroke="#222" strokeWidth="2" />
      </g>

      {/* Outer circle border */}
      <circle cx="50" cy="50" r="44" fill="none" stroke="#222" strokeWidth="2.5" />
    </svg>
  )
}
