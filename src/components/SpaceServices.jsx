import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SERVICES, STATS, servicesHeading, servicesSubtitle } from '../lib/content'
import { applyCardReveal } from '../lib/cardReveal'
import SplitHeading from './SplitHeading'

gsap.registerPlugin(ScrollTrigger)

const ICONS = {
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13 4l-2 16" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" />
    </svg>
  ),
}

// ─── Squiggle underline accent (from the mockup) ───
const Squiggle = ({ className = '' }) => (
  <svg viewBox="0 0 120 8" fill="none" className={className} aria-hidden="true">
    <path
      d="M2 5 Q 12 1 22 5 T 42 5 T 62 5 T 82 5 T 102 5 T 118 5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
)

// ─── Wireframe atoms — the vocabulary every "kind" below composes from.
// Deliberately abstract (bars, dots, blocks): illustrative UI shapes, not
// a claim that this is a real screenshot. Same honesty rule as the
// browser/phone chrome itself, just with actual content instead of one
// centered dot (Mat's call 2026-08-10 — "put a visualized image there"). */
const Line = ({ w = 'w-full', h = 'h-1.5', tone = 'bg-star-100/12' }) => (
  <span className={`block rounded-full ${w} ${h} ${tone}`} />
)
const Block = ({ className = '', tone = 'bg-star-100/8' }) => (
  <span className={`block rounded-md ${tone} ${className}`} />
)
const Pill = ({ w = 'w-10', tone = 'bg-ember-500/20' }) => (
  <span className={`block h-3 rounded-full ${w} ${tone}`} />
)
const Dot = ({ tone = 'bg-ember-500/40' }) => (
  <span className={`block h-2 w-2 shrink-0 rounded-full ${tone}`} />
)

// ─── Kind renderers — one per media.items[].kind. Fill the content area
// inside the browser/phone chrome with a themed wireframe: Website leans
// on layout blocks (hero/gallery/forms), Software on app/code chrome,
// Systems on data (charts/tables/pipelines) — the visual vocabulary
// matches what each service actually builds. ───
const KINDS = {
  hero: () => (
    <div className="flex h-full flex-col gap-2.5 p-3">
      <div className="flex items-center gap-2">
        <Line w="w-10" tone="bg-star-100/15" />
        <Line w="w-8" tone="bg-star-100/10" />
        <Line w="w-8" tone="bg-star-100/10" />
        <Pill w="w-12" />
      </div>
      <Block className="min-h-0 flex-1 bg-gradient-to-br from-ember-500/15 via-star-100/8 to-transparent" />
      <div className="space-y-1.5">
        <Line w="w-2/3" h="h-2" tone="bg-star-100/18" />
        <Line w="w-1/3" tone="bg-star-100/10" />
      </div>
      <Pill w="w-16" />
    </div>
  ),
  gallery: () => (
    <div className="grid h-full grid-cols-2 gap-1.5 p-2.5">
      <Block tone="bg-ember-500/10" />
      <Block tone="bg-star-100/8" />
      <Block tone="bg-star-100/8" />
      <Block tone="bg-ember-500/10" />
    </div>
  ),
  form: () => (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
      <Line w="w-4/5" />
      <Line w="w-4/5" />
      <Line w="w-3/5" />
      <Pill w="w-14" />
    </div>
  ),
  list: () => (
    <div className="flex h-full flex-col justify-center gap-3 p-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-2 border-b border-star-300/10 pb-2 last:border-0">
          <Dot tone="bg-star-100/15" />
          <div className="flex-1 space-y-1">
            <Line w="w-3/4" />
            <Line w="w-1/2" tone="bg-star-100/8" />
          </div>
        </div>
      ))}
    </div>
  ),
  cards: () => (
    <div className="grid h-full grid-cols-2 gap-1.5 p-2.5">
      {[0, 1].map((i) => (
        <div key={i} className="flex flex-col justify-end gap-1.5 rounded-md bg-star-100/6 p-2">
          <Line w="w-full" tone="bg-star-100/12" />
          <Line w="w-2/3" tone="bg-ember-500/20" />
        </div>
      ))}
    </div>
  ),
  footer: () => (
    <div className="grid h-full grid-cols-3 gap-3 p-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-1.5">
          <Line w="w-4/5" tone="bg-star-100/15" />
          <Line w="w-3/5" tone="bg-star-100/8" />
          <Line w="w-2/3" tone="bg-star-100/8" />
        </div>
      ))}
    </div>
  ),
  'app-home': () => (
    <div className="flex h-full flex-col gap-2 p-2.5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-2 rounded-lg bg-star-100/6 p-2">
          <Dot tone="bg-ember-500/30" />
          <div className="flex-1 space-y-1">
            <Line w="w-3/4" />
            <Line w="w-1/2" tone="bg-star-100/8" />
          </div>
        </div>
      ))}
      <div className="mt-auto flex justify-center gap-3 pt-1">
        {[0, 1, 2, 3].map((i) => (
          <Dot key={i} tone={i === 0 ? 'bg-ember-500/50' : 'bg-star-100/12'} />
        ))}
      </div>
    </div>
  ),
  'app-list': () => (
    <div className="flex h-full flex-col justify-center gap-2.5 p-2.5">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <Dot tone="bg-star-100/12" />
          <Line w="w-3/4" />
          <Dot tone="bg-ember-500/25" />
        </div>
      ))}
    </div>
  ),
  'app-chat': () => (
    <div className="flex h-full flex-col justify-center gap-2 p-3">
      <Block className="h-5 w-2/3 self-start bg-star-100/8" />
      <Block className="h-5 w-1/2 self-end bg-ember-500/20" />
      <Block className="h-5 w-3/5 self-start bg-star-100/8" />
    </div>
  ),
  dashboard: () => (
    <div className="flex h-full gap-2 p-2.5">
      <div className="flex w-4 flex-col items-center gap-2 pt-1">
        {[0, 1, 2].map((i) => (
          <Dot key={i} tone={i === 0 ? 'bg-ember-500/40' : 'bg-star-100/12'} />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex gap-1.5">
          <Block className="h-6 flex-1 bg-ember-500/12" />
          <Block className="h-6 flex-1 bg-star-100/8" />
        </div>
        <div className="flex flex-1 items-end gap-1">
          {[40, 65, 30, 80, 55].map((h, i) => (
            <span key={i} className="flex-1 rounded-t-sm bg-ember-500/25" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  ),
  code: () => (
    <div className="flex h-full flex-col justify-center gap-1.5 p-3 font-mono">
      {[
        ['w-1/4', 'bg-ember-500/25', ''],
        ['w-2/3', 'bg-star-100/10', 'ml-3'],
        ['w-1/2', 'bg-star-100/10', 'ml-3'],
        ['w-1/3', 'bg-ember-500/20', 'ml-3'],
        ['w-1/5', 'bg-star-100/10', ''],
      ].map(([w, tone, indent], i) => (
        <Line key={i} w={`${w} ${indent}`} h="h-1.5" tone={tone} />
      ))}
    </div>
  ),
  kanban: () => (
    <div className="grid h-full grid-cols-3 gap-2 p-2.5">
      {[2, 1, 3].map((n, col) => (
        <div key={col} className="space-y-1.5">
          <Line w="w-3/4" tone="bg-star-100/15" />
          {Array.from({ length: n }).map((_, i) => (
            <Block key={i} className="h-5 bg-star-100/6" />
          ))}
        </div>
      ))}
    </div>
  ),
  'dashboard-big': () => (
    <div className="flex h-full flex-col gap-2.5 p-3">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex-1 space-y-1 rounded-md bg-star-100/6 p-2">
            <Line w="w-1/2" h="h-2" tone="bg-ember-500/25" />
            <Line w="w-3/4" tone="bg-star-100/10" />
          </div>
        ))}
      </div>
      <div className="flex flex-1 items-end gap-1.5">
        {[35, 60, 45, 80, 50, 70, 40].map((h, i) => (
          <span key={i} className="flex-1 rounded-t-sm bg-ember-500/25" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  ),
  flow: () => (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex w-full items-center gap-2">
          <Block className="h-6 w-6 shrink-0 bg-ember-500/20" />
          <Line w="flex-1" tone="bg-star-100/10" />
          {i < 2 && <span className="text-star-100/20">↓</span>}
        </div>
      ))}
    </div>
  ),
  table: () => (
    <div className="flex h-full flex-col gap-2 p-2.5">
      <div className="flex gap-2">
        <Line w="w-1/3" tone="bg-star-100/15" />
        <Line w="w-1/3" tone="bg-star-100/15" />
        <Line w="w-1/3" tone="bg-star-100/15" />
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex gap-2 border-t border-star-300/10 pt-2">
          <Line w="w-1/3" tone="bg-star-100/8" />
          <Line w="w-1/3" tone="bg-ember-500/15" />
          <Line w="w-1/3" tone="bg-star-100/8" />
        </div>
      ))}
    </div>
  ),
  metrics: () => (
    <div className="flex h-full items-center gap-3 p-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex-1 space-y-1.5">
          <Line w="w-1/2" h="h-2.5" tone="bg-ember-500/25" />
          <Line w="w-3/4" tone="bg-star-100/10" />
        </div>
      ))}
    </div>
  ),
  pipeline: () => (
    <div className="flex h-full items-center gap-2 p-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex flex-1 items-center gap-2">
          <div className="flex-1 rounded-full bg-star-100/8 px-2 py-2 text-center">
            <Line w="w-2/3 mx-auto" tone="bg-star-100/15" />
          </div>
          {i < 3 && <span className="shrink-0 text-star-100/20">→</span>}
        </div>
      ))}
    </div>
  ),
  integrations: () => (
    <div className="grid h-full grid-cols-6 items-center gap-2 p-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Block key={i} className={`aspect-square ${i % 2 === 0 ? 'bg-ember-500/15' : 'bg-star-100/8'}`} />
      ))}
    </div>
  ),
}

// ─── Media tile — screenshot slot ───
// With `src` set, renders the real screenshot (swap-in ready). With
// `src: null`, renders browser/phone chrome filled with an abstract
// wireframe illustration keyed by `item.kind` — never a fabricated
// screenshot, just a themed shape (Mat's call 2026-08-10).
const MediaTile = ({ item }) => {
  if (item.src) {
    return (
      <div className="h-full w-full overflow-hidden rounded-lg border border-star-300/25">
        <img src={item.src} alt="" className="h-full w-full object-cover" loading="lazy" />
      </div>
    )
  }

  const content = KINDS[item.kind]?.() ?? (
    <div className="flex h-full items-center justify-center">
      <div className="h-2 w-2 rounded-full bg-ember-500/25" />
    </div>
  )

  if (item.shape === 'phone') {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg border border-star-300/25 bg-white/60 dark:bg-white/5">
        <div className="flex h-4/5 w-3/5 flex-col overflow-hidden rounded-[0.9rem] border border-star-300/30 bg-white/80 dark:bg-space-900/70">
          <div className="mx-auto mt-1.5 h-0.5 w-1/3 rounded-full bg-star-100/15" />
          <div className="min-h-0 flex-1">{content}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-star-300/25 bg-white/60 dark:bg-white/5">
      <div className="flex items-center gap-1 border-b border-star-300/20 px-2 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-ember-400/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-ember-400/40" />
        <span className="h-1.5 w-1.5 rounded-full bg-ember-400/20" />
        <span className="ml-2 h-1 w-16 rounded-full bg-star-100/10" />
      </div>
      <div className="min-h-0 flex-1">{content}</div>
    </div>
  )
}

// ─── Media block — span-driven bento mosaic ───
// The grid + per-tile span hints come from content.js, so the screenshot
// tiles form a true asymmetric bento (2×2 + tall column for websites, a
// big hero tile + wide strips for software/systems). Spans only apply at
// lg; mobile stacks tiles full-width.
const MediaBlock = ({ media }) => (
  <div className={`grid h-full grid-cols-1 gap-3 min-h-[22rem] sm:min-h-[28rem] ${media.grid}`}>
    {media.items.map((item, i) => (
      <div key={i} className={`bento-tile relative min-h-[10rem] lg:min-h-0 ${item.span || ''}`}>
        <MediaTile item={item} />
      </div>
    ))}
  </div>
)

// ─── Text card — icon badge, title, promise, squiggle underline,
// description, and the original feature bullets ───
const TextCard = ({ s }) => (
  <div className="v2-service-card glass relative flex h-full flex-col rounded-2xl p-7 sm:p-9">
    <div className="mb-5 flex items-center justify-between">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-ember-500/30 bg-ember-500/10 text-ember-600">
        {ICONS[s.icon] || ICONS.code}
      </span>
      <span className="font-display text-3xl font-bold tracking-[-0.03em] text-star-300/60">
        {s.index}
      </span>
    </div>
    <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-star-100 sm:text-[1.7rem]">
      {s.title}
    </h3>
    <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-ember-600 dark:text-ember-300">
      {s.promise}
    </p>
    <Squiggle className="mt-4 h-2 w-24 text-ember-500" />
    <p className="mt-4 text-sm leading-relaxed text-star-400">{s.description}</p>
    <ul className="mt-6 space-y-2.5 border-t border-star-300/20 pt-6">
      {s.features.map((f) => (
        <li key={f} className="flex items-center gap-2.5 text-sm text-star-300">
          <span className="text-ember-500">✦</span>
          {f}
        </li>
      ))}
    </ul>
  </div>
)

// Mobile stack order — literal classes (Tailwind can't see template
// literals, so the pair sequence is written out): text-first per pair,
// reset at lg where the desktop masonry uses DOM order.
const MOBILE_ORDER = [
  { text: 'order-1 lg:order-none', media: 'order-2 lg:order-none' },
  { text: 'order-3 lg:order-none', media: 'order-4 lg:order-none' },
  { text: 'order-5 lg:order-none', media: 'order-6 lg:order-none' },
]

export default function SpaceServices() {
  const rootRef = useRef(null)

  useEffect(() => {
    const tickers = [] // gsap.ticker callbacks — removed on teardown
    const ctx = gsap.context(() => {
      // Card entrance — v4 "What we make" choreography: alternating
      // slide + slight rotation, reversible per card; icon spin-pops.
      applyCardReveal(rootRef, '.v2-service-card', { x: 90, rotation: 4, icon: 'span.inline-flex' })
      // Media blocks — per-tile bento entrance: each tile cascades up
      // (big rise + un-scale + alternating tilt) in DOM order when its
      // block enters the viewport. Mat's call 2026-08-11 — entrance
      // animation PER bento, and the amplitudes got turned UP after he
      // called the first pass "barely noticeable". Transform + opacity
      // only (Mat's perf rule — no filters).
      gsap.utils.toArray('.v2-service-media').forEach((block) => {
        const tiles = block.querySelectorAll('.bento-tile')
        if (!tiles.length) return
        gsap.fromTo(
          tiles,
          { opacity: 0, y: 90, scale: 0.88, rotation: (i) => (i % 2 ? 3 : -3) },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 1.0,
            ease: 'back.out(1.5)',
            stagger: 0.1,
            scrollTrigger: {
              trigger: block,
              start: 'top 85%',
              once: true,
            },
          }
        )
      })

      // Bento interactivity — simple 3D tilt toward the cursor + a glow
      // that follows it (desktop pointers only; touch has no hover).
      // SMOOTH-FOLLOW lerp (Mat's call 2026-08-11): the tile chases the
      // cursor's target rotation with a frame-rate-corrected lag instead
      // of tweening to it on every move — the ease lives in BOTH
      // directions (in = glides after the cursor, out = glides back),
      // which is what kills the twitchy snap. Scale pops via short
      // enter/leave tweens (kept off the tick so it never fights the
      // entrance's scale tween). Glow vars are set per move.
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      if (fine && !reduce) {
        gsap.utils.toArray('.bento-tile').forEach((tile) => {
          // current values (eased) vs target values (from the pointer)
          const st = { rx: 0, ry: 0, lift: 0, tx: 0, ty: 0, tl: 0 }
          tile.addEventListener('pointerenter', () => {
            gsap.to(tile, { scale: 1.04, duration: 0.4, ease: 'power2.out' })
          })
          tile.addEventListener('pointermove', (e) => {
            const r = tile.getBoundingClientRect()
            const px = (e.clientX - r.left) / r.width - 0.5
            const py = (e.clientY - r.top) / r.height - 0.5
            tile.style.setProperty('--mx', `${e.clientX - r.left}px`)
            tile.style.setProperty('--my', `${e.clientY - r.top}px`)
            st.tx = px * 22
            st.ty = -py * 16
            st.tl = 1
          })
          tile.addEventListener('pointerleave', () => {
            st.tx = 0
            st.ty = 0
            st.tl = 0
            gsap.to(tile, { scale: 1, duration: 0.6, ease: 'power2.out' })
          })
          // Per-frame follow: current eases toward target. deltaRatio()
          // normalizes the lag to frame rate so 30fps and 120fps feel
          // the same. y only writes while a lift is active — otherwise
          // the tick would stomp the entrance's rise tween.
          const tick = () => {
            const k = 1 - Math.pow(0.9, gsap.ticker.deltaRatio())
            st.rx += (st.tx - st.rx) * k
            st.ry += (st.ty - st.ry) * k
            st.lift += (st.tl - st.lift) * k
            const vars = { rotateX: st.rx, rotateY: st.ry, transformPerspective: 800 }
            if (st.lift > 0.01 || st.tl > 0.01) vars.y = -12 * st.lift
            gsap.set(tile, vars)
          }
          gsap.ticker.add(tick)
          tickers.push(tick)
        })
      }

      // Stat cards — ScrollStack recipe: scale down + drift up as they
      // scroll past center, so the band peels away rather than sitting
      // static once revealed.
      gsap.utils.toArray('.v2-stat-card').forEach((card) => {
        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: 'center center',
            end: 'center top',
            scrub: 1,
            onUpdate: (self) => {
              const p = self.progress
              gsap.set(card, { scale: 1 - 0.12 * p, y: -20 * p, opacity: 1 - 0.25 * p })
            },
          },
        })
      })

      // Stat numbers — count-up when the band enters: 0 → target with a
      // per-card cascade delay, power2 ease. Mat's call 2026-08-11
      // ("text animations like they're being count"). Reduced motion
      // skips the tween — the static value is already in the markup.
      // (`reduce` comes from the tilt block above.)
      if (!reduce) {
        gsap.utils.toArray('.v2-stat-num').forEach((numEl, i) => {
          const target = parseFloat(numEl.textContent)
          ScrollTrigger.create({
            trigger: numEl.closest('.v2-stat-card'),
            start: 'top 88%',
            once: true,
            onEnter: () => {
              const obj = { v: 0 }
              numEl.textContent = '0' // avoid the "shows target, then jumps to 0" flash
              gsap.to(obj, {
                v: target,
                duration: 1.6,
                ease: 'power2.out',
                delay: i * 0.12, // cascade across the band
                onUpdate: () => {
                  numEl.textContent = Math.round(obj.v)
                },
              })
            },
          })
        })
      }
    }, rootRef)
    return () => {
      tickers.forEach((t) => gsap.ticker.remove(t))
      ctx.revert()
    }
  }, [])

  return (
    <section id="services" ref={rootRef} className="relative mx-auto max-w-7xl px-6 py-28 lg:px-10">
      {/* ── Header — kicker with squiggle flourishes, headline, subtitle,
             centered (copy from the mockup, ember accents) ── */}
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <div className="mb-4 flex items-center justify-center gap-4">
          <Squiggle className="h-2 w-16 -scale-x-100 text-ember-500/60" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember-500">
            What we build
          </p>
          <Squiggle className="h-2 w-16 text-ember-500/60" />
        </div>
        <SplitHeading
          as="h2"
          text={servicesHeading}
          accent="drive results"
          className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-star-100 sm:text-5xl"
        />
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-star-400">{servicesSubtitle}</p>
      </div>

      {/* ── Zigzag masonry ──
             Even rows: text card left / media block right.
             Odd rows:  media block left / text card right.
             Rows stay aligned (no vertical tuck) so the alternating
             sides read cleanly without cluttering the neighbors.
             Mobile stacks text → media per pair. ── */}
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        {SERVICES.map((s, i) => {
          const even = i % 2 === 0
          const order = MOBILE_ORDER[i] || { text: 'lg:order-none', media: 'lg:order-none' }
          const text = (
            <div className={`${even ? 'lg:col-span-5' : 'lg:col-span-6'} ${order.text}`}>
              <TextCard s={s} />
            </div>
          )
          const media = (
            <div
              className={`v2-service-media ${even ? 'lg:col-span-7' : 'lg:col-span-6'} ${order.media}`}
            >
              <MediaBlock media={s.media} />
            </div>
          )
          return (
            <div key={s.id} className="contents">
              {even ? text : media}
              {even ? media : text}
            </div>
          )
        })}
      </div>

      {/* Stats band */}
      <div className="mt-20 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="v2-stat-card glass rounded-2xl p-6 text-center">
            <p className="font-display text-3xl font-bold tracking-[-0.03em] text-star-100">
              <span className="v2-stat-num ember-text">{s.value}</span>
              <span className="text-ember-400">{s.suffix}</span>
            </p>
            <p className="mt-2 text-xs uppercase tracking-widest text-star-500">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
