// ─── Ufo2D — lightweight 2D animated saucer ───
// Pure SVG + CSS motion (no canvas, no Three). Variants:
//   'transit'  — flies horizontally across the section (Portfolio)
//   'path'     — static pose that a scroll scrub moves along (Process)
// Theme-aware: uses ember + star tokens via CSS classes.

export default function Ufo2D({ variant = 'transit', className = '', size = 96 }) {
  return (
    <div className={`ufo2d ${className}`} style={{ width: size, height: size * 0.52 }} aria-hidden="true">
      {/* engine trail */}
      <svg viewBox="0 0 120 60" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="ufo-deck" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff8a5c" />
            <stop offset="45%" stopColor="#f53003" />
            <stop offset="100%" stopColor="#c02402" />
          </linearGradient>
          <linearGradient id="ufo-dome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.25)" />
          </linearGradient>
          <radialGradient id="ufo-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(245,48,3,0.55)" />
            <stop offset="100%" stopColor="rgba(245,48,3,0)" />
          </radialGradient>
        </defs>

      {/* glow behind the saucer */}
      <ellipse cx="60" cy="32" rx="48" ry="24" fill="url(#ufo-glow)" className="ufo-glow" />

      {/* engine trail — layered teardrop glow, only while flying */}
      {variant === 'transit' && (
        <g className="ufo-trail">
          <ellipse cx="16" cy="34" rx="34" ry="10" fill="rgba(245,48,3,0.12)" />
          <ellipse cx="10" cy="34" rx="24" ry="8" fill="rgba(245,48,3,0.28)" />
          <ellipse cx="4" cy="34" rx="14" ry="5" fill="rgba(255,138,92,0.6)" />
        </g>
      )}

      {/* underbelly */}
      <ellipse cx="60" cy="38" rx="34" ry="10" fill="#1f1f1f" opacity="0.85" />

      {/* saucer deck */}
      <path d="M22 32 Q60 48 98 32 Q98 42 60 48 Q22 42 22 32 Z" fill="url(#ufo-deck)" />
      <ellipse cx="60" cy="32" rx="38" ry="8.5" fill="url(#ufo-deck)" />
      {/* deck top highlight — bright leading edge */}
      <path d="M24 30.5 Q60 37 96 30.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" fill="none" opacity="0.7" />

      {/* glass dome */}
      <ellipse cx="60" cy="22" rx="15" ry="11" fill="url(#ufo-dome)" stroke="rgba(255,255,255,0.75)" strokeWidth="1.1" />
      <ellipse cx="56" cy="18" rx="4.5" ry="3" fill="rgba(255,255,255,0.9)" />
      {/* faint cockpit glow inside the dome */}
      <ellipse cx="60" cy="24" rx="7" ry="4" fill="rgba(255,178,122,0.25)" />

      {/* rim lights — brighter, with a glow halo */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const angle = Math.PI + (i / 6) * Math.PI // bottom half of the rim
        const x = 60 + Math.cos(angle) * 37
        const y = 34 + Math.sin(angle) * 6
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="3" fill="rgba(255,178,122,0.25)" className="ufo-rimlight" />
            <circle cx={x} cy={y} r="1.6" fill="#ffd9c9" className="ufo-rimlight" />
          </g>
        )
      })}

        {/* delivery beam + falling capsule — only for the 'deliver' moment */}
        {variant === 'transit' && (
          <g className="ufo-beam-group">
            <path
              d="M52 42 L34 82 L86 82 L68 42 Z"
              fill="url(#ufo-glow)"
              className="ufo-beam"
            />
            <circle cx="60" cy="70" r="3.5" fill="#f53003" className="ufo-capsule" />
          </g>
        )}
      </svg>
    </div>
  )
}
