// ─── SpaceDivider — star-field transition between Hero and Services ───
// Replaces the old capability marquee: no content, no scrolling words.
// Just a field of twinkling star specks (theme-aware) crossed by a thin
// ember hairline and one quiet "signal" star at the center. The fixed
// 3D space scene behind already provides the atmosphere.

// Deterministic speck field — stable positions across renders.
const SPECKS = [
  { l: '6%', t: '30%', s: 2, d: 0.2, dur: 3.4 },
  { l: '12%', t: '64%', s: 1.5, d: 1.1, dur: 4.2 },
  { l: '19%', t: '38%', s: 2.5, d: 0.6, dur: 3.1 },
  { l: '26%', t: '72%', s: 1.5, d: 1.8, dur: 5 },
  { l: '33%', t: '26%', s: 2, d: 0.9, dur: 3.8 },
  { l: '41%', t: '58%', s: 1.5, d: 2.2, dur: 4.6 },
  { l: '49%', t: '34%', s: 2, d: 1.4, dur: 3.5 },
  { l: '57%', t: '66%', s: 2.5, d: 0.4, dur: 4.1 },
  { l: '64%', t: '28%', s: 1.5, d: 2.6, dur: 3.2 },
  { l: '71%', t: '60%', s: 2, d: 1.7, dur: 4.8 },
  { l: '78%', t: '36%', s: 1.5, d: 0.8, dur: 3.7 },
  { l: '85%', t: '68%', s: 2.5, d: 2, dur: 4.3 },
  { l: '92%', t: '32%', s: 2, d: 1.2, dur: 3.3 },
  { l: '97%', t: '56%', s: 1.5, d: 0.3, dur: 4.5 },
]

export default function SpaceDivider() {
  return (
    <section className="relative overflow-hidden py-12" aria-hidden="true">
      {/* ember hairlines — the divider's only hard lines */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember-500/35 to-transparent" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ember-500/20 to-transparent" />

      {/* twinkling star field — ink specks in light, white in dark */}
      {SPECKS.map((s, i) => (
        <span
          key={i}
          className="animate-dust absolute rounded-full bg-star-100/70"
          style={{
            left: s.l,
            top: s.t,
            width: s.s,
            height: s.s,
            animationDelay: `${s.d}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}

      {/* one quiet signal star at the center */}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-ember-500/25" />
        <span className="text-base text-ember-500">✦</span>
      </span>
    </section>
  )
}
