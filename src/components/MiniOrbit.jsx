// ─── MiniOrbit — compact orbital system between Hero and Services ───
// A mini version of the About orbit: the Inovers core at the center,
// capability satellites (Web · Software · Mobile · AI) slowly orbiting
// on a tilted disc. Pure CSS 3D — no canvas, no JS animation. Purely
// decorative: hidden from assistive tech.

const SATS = [
  {
    id: 'web',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4.5 w-4.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.7 2.6 4 5.7 4 9s-1.3 6.4-4 9c-2.7-2.6-4-5.7-4-9s1.3-6.4 4-9z" />
      </svg>
    ),
  },
  {
    id: 'software',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4.5 w-4.5">
        <path d="M8 6l-6 6 6 6M16 6l6 6-6 6" />
      </svg>
    ),
  },
  {
    id: 'mobile',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4.5 w-4.5">
        <rect x="7" y="2" width="10" height="20" rx="2.5" />
        <path d="M11 18h2" />
      </svg>
    ),
  },
  {
    id: 'ai',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4.5 w-4.5">
        <path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4L12 2z" />
      </svg>
    ),
  },
]

// Orbit radius of the main ring (px) — satellites ride on it
const RING_RADIUS = 72

export default function MiniOrbit() {
  return (
    <section className="relative overflow-hidden py-16" aria-hidden="true">
      {/* ember hairlines — top/bottom edges */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember-500/35 to-transparent" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ember-500/20 to-transparent" />

      <div className="relative mx-auto flex h-[220px] w-[220px] items-center justify-center" style={{ perspective: '900px' }}>
        {/* soft ember atmosphere */}
        <div
          className="pointer-events-none absolute -inset-8 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(245,48,3,0.10), transparent 62%)',
          }}
        />

        {/* tilted disc — rings + satellites live on this plane */}
        <div className="absolute inset-0" style={{ transform: 'rotateX(58deg)', transformStyle: 'preserve-3d' }}>
          {/* outer hairline ring — static */}
          <div className="absolute inset-[5%] rounded-full border border-star-300/20" />

          {/* main ring — rotating, carries the capability satellites */}
          <div className="mini-orbit-spin absolute inset-[13%] rounded-full border border-star-300/40">
            {SATS.map((s, i) => (
              <div
                key={s.id}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) translateX(${RING_RADIUS}px) rotateX(-58deg)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* inner counter-spin keeps the icon upright while orbiting */}
                <div className="mini-sat-inner flex h-10 w-10 items-center justify-center rounded-full border border-ember-500/40 bg-space-900/90 text-ember-600 shadow-[0_0_20px_rgba(245,48,3,0.22),inset_0_1px_0_rgba(255,255,255,0.18)] dark:text-ember-300">
                  {s.icon}
                </div>
              </div>
            ))}
          </div>

          {/* inner ember dashed ring — counter-rotating, with a pulsing dot */}
          <div className="mini-orbit-spin-rev absolute inset-[31%] rounded-full border border-dashed border-ember-500/30">
            <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-500/80" />
          </div>
        </div>

        {/* core — upright, floating above the disc */}
        <div className="animate-float-node relative">
          <span
            className="pointer-events-none absolute -inset-5 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(245,48,3,0.30), transparent 65%)' }}
          />
          <div className="animate-core-pulse relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-ember-300 via-ember-500 to-ember-700 shadow-[0_0_45px_rgba(245,48,3,0.45)]">
            <img src="/logo.svg" alt="" className="h-7 w-7" />
          </div>
        </div>
      </div>
    </section>
  )
}
