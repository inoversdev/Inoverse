// ─── LightningBand — procedural cosmic-galaxy-lines page breaker ───
// Recreates Mat's reference art (a diagonal red nebula band shot through
// with white/cyan filament threads) as real SVG geometry instead of a
// static image (Mat's call 2026-08-10 — "make it as a part of the code",
// then "make it all straight line"). Every line is a plain straight
// segment — no midpoint displacement, no curve smoothing — drawn as four
// layers: a thick blurred red halo, several thin white/cyan straight
// lines fanning near the spine, a bright white core, and scattered
// sparks. The whole shape slowly regenerates (crossfaded, not a hard
// cut) so it reads as living rather than a fixed picture, and each line
// carries a slow travelling dash — light drifting along it.

import { useEffect, useRef, useState } from 'react'

const VB_W = 1000
const VB_H = 320
const SPINE = { x1: 30, y1: 55, x2: 970, y2: 265 }

function toPath(x1, y1, x2, y2) {
  return `M ${x1.toFixed(1)},${y1.toFixed(1)} L ${x2.toFixed(1)},${y2.toFixed(1)}`
}
function lerp(a, b, t) {
  return a + (b - a) * t
}

// One full generation: the spine (halo + core share it, dead straight),
// a handful of independent straight lines fanning near it, and a
// scatter of sparks along its length.
function generate() {
  const dx = SPINE.x2 - SPINE.x1
  const dy = SPINE.y2 - SPINE.y1
  const len = Math.hypot(dx, dy)
  const nx = -dy / len // unit perpendicular
  const ny = dx / len

  const threads = Array.from({ length: 5 }, (_, i) => {
    const off1 = (Math.random() - 0.5) * 56
    const off2 = (Math.random() - 0.5) * 56
    const x1 = SPINE.x1 + nx * off1
    const y1 = SPINE.y1 + ny * off1
    const x2 = SPINE.x2 + nx * off2
    const y2 = SPINE.y2 + ny * off2
    return {
      d: toPath(x1, y1, x2, y2),
      color: i % 2 === 0 ? '#eafff8' : '#4be3e0',
      delay: (i * 0.9).toFixed(2),
      duration: (11 + i * 2.2).toFixed(2),
    }
  })

  const sparks = Array.from({ length: 22 }, () => {
    const t = Math.random()
    const off = (Math.random() - 0.5) * 90
    return {
      x: lerp(SPINE.x1, SPINE.x2, t) + nx * off,
      y: lerp(SPINE.y1, SPINE.y2, t) + ny * off,
      r: 0.8 + Math.random() * 1.6,
      delay: (Math.random() * 5).toFixed(2),
      duration: (5 + Math.random() * 4).toFixed(2),
    }
  })

  return { spineD: toPath(SPINE.x1, SPINE.y1, SPINE.x2, SPINE.y2), threads, sparks }
}

export default function LightningBand() {
  const [data, setData] = useState(generate)
  const [visible, setVisible] = useState(true)
  const reduceRef = useRef(false)

  useEffect(() => {
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceRef.current) return

    // Regenerate the whole shape every ~16s: fade out, swap the geometry,
    // fade back in — slow enough to read as a galaxy drifting, not a
    // repeating loop you can catch.
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setData(generate())
        setVisible(true)
      }, 1400)
    }, 16000)
    return () => clearInterval(interval)
  }, [])

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="none"
      className="aurora-nebula absolute -top-16 left-[-6%] h-[calc(100%+8rem)] w-[112%]"
      aria-hidden="true"
    >
      <defs>
        <filter id="lb-halo" x="-60%" y="-200%" width="220%" height="500%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <filter id="lb-thread" x="-40%" y="-150%" width="180%" height="400%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
        <filter id="lb-core" x="-40%" y="-150%" width="180%" height="400%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>

      <g
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 1.4s ease-in-out',
        }}
      >
        {/* soft red glow band — the "cloud" the threads run through */}
        <path
          d={data.spineD}
          fill="none"
          stroke="#e3241f"
          strokeWidth="70"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
          filter="url(#lb-halo)"
        />
        <path
          d={data.spineD}
          fill="none"
          stroke="#ff5a3c"
          strokeWidth="30"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.4"
          filter="url(#lb-halo)"
        />

        {/* white/cyan filament threads, each with a travelling dash */}
        {data.threads.map((t, i) => (
          <path
            key={i}
            d={t.d}
            fill="none"
            stroke={t.color}
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.85"
            filter="url(#lb-thread)"
            className="lightning-thread"
            style={{ animationDuration: `${t.duration}s`, animationDelay: `${t.delay}s` }}
          />
        ))}

        {/* the bright white core, along the spine itself */}
        <path
          d={data.spineD}
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
          filter="url(#lb-core)"
          className="lightning-thread"
          style={{ animationDuration: '9s' }}
        />

        {/* fine sparks scattered along the band */}
        {data.sparks.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={i % 3 === 0 ? '#4be3e0' : '#ffe4d6'}
            filter="url(#lb-core)"
            className="lightning-spark"
            style={{ animationDelay: `${s.delay}s`, animationDuration: `${s.duration}s` }}
          />
        ))}
      </g>
    </svg>
  )
}
