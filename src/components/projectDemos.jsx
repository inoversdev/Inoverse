// ─── Project demos — animated "how it works" showcases for the modal ───
// Mat's call 2026-08-11: clicking a mission opens a full-view modal
// with an AGGRESSIVE animation showing how the product works.
//
// DeliveryDemo (Dory Delivery — the flagship): a 7s loop that runs
// LOW-FIDELITY first (wireframe map, route draws, a plain dot rides
// it, status ticks) then flips to HIGH-FIDELITY (colored map, the
// rider with a glow trail races the route on a faster rhythm, the
// destination pin pops, statuses tick to Delivered, progress bar
// fills). The low-fi → hi-fi arc literally shows the system working.
//
// SystemDemo (everything else): nodes light up in sequence like an
// automation pipeline, statuses tick, a bar fills. Same energy, less
// map.

const ROUTE = 'M 18 84 C 18 84, 30 26, 96 26 S 220 26, 240 60 S 252 118, 282 118'

function StatusTicker({ items, delay = 3.4 }) {
  return (
    <div className="pointer-events-none absolute left-3 top-3 z-20">
      {items.map((s, i) => (
        <div
          key={s}
          className="demo-status rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold text-space-900 shadow-sm backdrop-blur-sm dark:bg-space-950/85 dark:text-star-100"
          style={{ animationDelay: `${delay + i * 0.7}s` }}
        >
          {s}
        </div>
      ))}
    </div>
  )
}

export function DeliveryDemo() {
  return (
    <div className="relative h-60 w-full overflow-hidden rounded-2xl bg-star-100/5 sm:h-72">
      {/* ── LOW-FIDELITY layer — wireframe map, plain dot rides the route ── */}
      <div className="demo-lowfi absolute inset-0">
        {/* wireframe streets */}
        <svg viewBox="0 0 300 140" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {[30, 60, 90, 120].map((y) => (
            <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
          ))}
          {[50, 100, 150, 200, 250].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="140" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
          ))}
          {/* route */}
          <path d={ROUTE} fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 4" />
          {/* nodes */}
          <rect x="10" y="74" width="16" height="20" rx="2" fill="currentColor" fillOpacity="0.25" />
          <rect x="274" y="108" width="16" height="20" rx="2" fill="currentColor" fillOpacity="0.25" />
          <circle cx="18" cy="84" r="3" fill="currentColor" fillOpacity="0.4" />
          <circle cx="282" cy="118" r="3" fill="currentColor" fillOpacity="0.4" />
        </svg>
        {/* plain dot riding the route */}
        <span className="demo-rider absolute left-0 top-0 z-10 h-2.5 w-2.5 rounded-full bg-star-400 shadow-[0_0_10px_rgba(120,120,140,0.6)]" />
        <StatusTicker items={['Order placed', 'Rider assigned', 'On the way']} delay={0.3} />
        <span className="absolute bottom-2 left-3 text-[9px] font-semibold uppercase tracking-widest text-star-500">
          Low fidelity — wireframe
        </span>
      </div>

      {/* ── HIGH-FIDELITY layer — colored map, glowing rider races ── */}
      <div className="demo-hifi absolute inset-0">
        <svg viewBox="0 0 300 140" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="demo-map-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(245,48,3,0.12)" />
              <stop offset="50%" stopColor="rgba(245,48,3,0.04)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0.1)" />
            </linearGradient>
            <linearGradient id="demo-route" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(245,48,3,0.9)" />
              <stop offset="100%" stopColor="rgba(245,48,3,0.5)" />
            </linearGradient>
          </defs>
          <rect width="300" height="140" fill="url(#demo-map-bg)" />
          {/* streets */}
          {[30, 60, 90, 120].map((y) => (
            <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" />
          ))}
          {[50, 100, 150, 200, 250].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="140" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" />
          ))}
          {/* route with glow */}
          <path d={ROUTE} fill="none" stroke="url(#demo-route)" strokeWidth="3" strokeLinecap="round" />
          <path d={ROUTE} fill="none" stroke="rgba(245,48,3,0.35)" strokeWidth="7" strokeLinecap="round" />
          {/* origin + destination */}
          <rect x="8" y="72" width="20" height="24" rx="3" fill="rgba(245,48,3,0.9)" />
          <rect x="272" y="106" width="20" height="24" rx="3" fill="rgba(245,48,3,0.9)" />
          <circle cx="18" cy="84" r="4" fill="#fff" />
          {/* destination pin (pops when the rider arrives) */}
          <g className="demo-pin" style={{ transformOrigin: '282px 118px' }}>
            <circle cx="282" cy="118" r="8" fill="rgba(245,48,3,0.25)" />
            <circle cx="282" cy="118" r="4" fill="rgba(245,48,3,0.9)" />
          </g>
        </svg>
        {/* the rider — glowing, racing the route */}
        <span className="demo-rider-fast absolute left-0 top-0 z-10">
          <span className="block h-3.5 w-3.5 rounded-full bg-ember-500 shadow-[0_0_14px_rgba(245,48,3,0.9)] ring-2 ring-white/60" />
        </span>
        {/* progress bar */}
        <div className="absolute bottom-2 left-3 right-3 h-1 overflow-hidden rounded-full bg-star-100/10">
          <div className="demo-bar h-full w-full rounded-full bg-gradient-to-r from-ember-600 to-amber-400" />
        </div>
        <StatusTicker items={['Preparing', 'Picked up', 'Out for delivery', 'Delivered ✓']} delay={3.2} />
        <span className="absolute right-3 top-2 text-[9px] font-semibold uppercase tracking-widest text-ember-500">
          High fidelity — live
        </span>
      </div>
    </div>
  )
}

export function SystemDemo() {
  const steps = ['Connect', 'Process', 'Validate', 'Ship']
  return (
    <div className="relative h-60 w-full overflow-hidden rounded-2xl bg-star-100/5 sm:h-72">
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6">
        {/* pipeline nodes */}
        <div className="flex w-full items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div
                className="demo-node flex flex-1 flex-col items-center gap-1 rounded-xl border border-ember-500/30 bg-ember-500/10 py-3"
                style={{ animationDelay: `${i * 1.2}s` }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-ember-600 dark:text-ember-300">
                  {i + 1}
                </span>
                <span className="text-xs font-semibold text-star-300">{s}</span>
              </div>
              {i < steps.length - 1 && (
                <span className="shrink-0 text-sm text-ember-500" style={{ animationDelay: `${i * 1.2}s` }}>→</span>
              )}
            </div>
          ))}
        </div>
        {/* status ticks */}
        <StatusTicker items={['Syncing', 'Processing', 'Almost done', 'Complete ✓']} delay={0.4} />
        {/* progress bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-star-100/10">
          <div className="demo-bar h-full w-full rounded-full bg-gradient-to-r from-ember-600 to-amber-400" style={{ animationDuration: '4.5s' }} />
        </div>
      </div>
    </div>
  )
}

// Pick the demo by project category — delivery gets the flagship map
// demo, everything else gets the system flow.
export default function ProjectDemo({ project }) {
  const cat = `${project.category || ''} ${project.industry || ''}`.toLowerCase()
  if (cat.includes('delivery') || cat.includes('logistic')) {
    return <DeliveryDemo />
  }
  return <SystemDemo />
}
