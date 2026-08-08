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
          <linearGradient id="ufo-tail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(245,48,3,0)" />
            <stop offset="55%" stopColor="rgba(245,48,3,0.45)" />
            <stop offset="100%" stopColor="rgba(255,138,92,0.75)" />
          </linearGradient>
        </defs>

      {/* glow behind the saucer */}
      <ellipse cx="60" cy="32" rx="48" ry="24" fill="url(#ufo-glow)" className="ufo-glow" />

      {/* engine trail — comet tail + layered glow + spark particles.
          transit: static tail behind the saucer.
          path: direction-aware (--ufo-trail-dir flips it live with the
          scroll scrub so the wake always trails the motion). */}
      {variant !== 'static' && (
        <g className={`ufo-trail${variant === 'path' ? ' ufo-path-trail' : ''}`}>
          {/* long tapered comet tail */}
          <path d="M58 31 L-26 28 Q-38 34 -26 40 L58 39 Z" fill="url(#ufo-tail)" opacity="0.85" />
          {/* layered glow near the engine */}
          <ellipse cx="20" cy="35" rx="40" ry="12" fill="rgba(245,48,3,0.10)" />
          <ellipse cx="12" cy="35" rx="27" ry="8" fill="rgba(245,48,3,0.24)" />
          <ellipse cx="5" cy="35" rx="15" ry="5" fill="rgba(255,138,92,0.6)" />
          {/* trailing spark particles — drift back and fade */}
          <circle className="ufo-particle" cx="-8" cy="33" r="2.2" fill="#ffb27a" />
          <circle className="ufo-particle" cx="-18" cy="37" r="1.6" fill="#ff8a5c" style={{ animationDelay: '0.4s' }} />
          <circle className="ufo-particle" cx="-28" cy="30" r="1.3" fill="#ffd9c9" style={{ animationDelay: '0.9s' }} />
          <circle className="ufo-particle" cx="-36" cy="36" r="1" fill="#f53003" style={{ animationDelay: '1.4s' }} />
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
