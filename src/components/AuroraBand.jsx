// ─── AuroraBand — V4-style aurora transition between Hero and Services ───
// Layered blurred gradient blobs + one skewed sweep ribbon, drifting
// slowly. CSS-only (V4's WebGL shader look, zero GPU cost) so the fixed
// 3D space scene stays visible through it. Purely decorative.

const BLOBS = [
  {
    color: 'rgba(245,48,3,0.55)', // ember
    left: '18%',
    top: '18%',
    w: 520,
    drift: 'aurora-drift-a',
    dur: 17,
    delay: 0,
  },
  {
    color: 'rgba(255,138,92,0.5)', // peach
    left: '58%',
    top: '10%',
    w: 440,
    drift: 'aurora-drift-b',
    dur: 23,
    delay: 2,
  },
  {
    color: 'rgba(255,217,201,0.55)', // warm white
    left: '34%',
    top: '52%',
    w: 380,
    drift: 'aurora-drift-c',
    dur: 19,
    delay: 5,
  },
]

export default function AuroraBand() {
  return (
    <section className="aurora-band relative overflow-hidden overflow-x-clip py-16" aria-hidden="true">
      {/* ember hairlines — top/bottom edges */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember-500/35 to-transparent" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ember-500/20 to-transparent" />

      {/* aurora blobs — breathing + drifting, stronger in dark mode */}
      {BLOBS.map((b, i) => (
        <span
          key={i}
          className="aurora-blob opacity-30 dark:opacity-45"
          style={{
            left: b.left,
            top: b.top,
            width: b.w,
            height: b.w,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 65%)`,
            animation: `${b.drift} ${b.dur}s ease-in-out ${b.delay}s infinite alternate, aurora-breathe ${b.dur * 0.6}s ease-in-out ${b.delay}s infinite`,
          }}
        />
      ))}

      {/* aurora sweep ribbon — one wide band crossing slowly */}
      <span
        className="aurora-sweep opacity-25 dark:opacity-35"
        style={{
          width: '180%',
          height: 160,
          top: '18%',
          background:
            'linear-gradient(100deg, transparent 8%, rgba(245,48,3,0.28) 30%, rgba(255,138,92,0.22) 46%, rgba(255,217,201,0.18) 60%, transparent 82%)',
        }}
      />
    </section>
  )
}
