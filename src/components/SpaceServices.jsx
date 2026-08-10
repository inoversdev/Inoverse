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

// ─── Media tile — screenshot slot ───
// With `src` set, renders the real screenshot (swap-in ready). With
// `src: null`, renders EMPTY browser/phone chrome — never fabricated
// product content. The layout is identical either way.
const MediaTile = ({ item }) => {
  if (item.src) {
    return (
      <div className="h-full w-full overflow-hidden rounded-lg border border-star-300/25">
        <img src={item.src} alt="" className="h-full w-full object-cover" loading="lazy" />
      </div>
    )
  }

  if (item.shape === 'phone') {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg border border-star-300/25 bg-white/60 dark:bg-white/5">
        <div className="h-3/5 w-2/5 overflow-hidden rounded-[0.6rem] border border-star-300/30 bg-white/80 dark:bg-space-900/70">
          <div className="mx-auto mt-1 h-0.5 w-3/5 rounded-full bg-star-100/15" />
          <div className="mx-auto mt-1.5 h-1 w-4/5 rounded-full bg-ember-500/15" />
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
      <div className="flex flex-1 items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-ember-500/25" />
      </div>
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
      <div key={i} className={`min-h-[10rem] lg:min-h-0 ${item.span || ''}`}>
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
    const ctx = gsap.context(() => {
      // Card entrance — v4 "What we make" choreography: alternating
      // slide + slight rotation, reversible per card; icon spin-pops.
      applyCardReveal(rootRef, '.v2-service-card', { x: 90, rotation: 4, icon: 'span.inline-flex' })

      // Media blocks — gentler rise.
      gsap.utils.toArray('.v2-service-media').forEach((block) => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 92%',
              once: true,
            },
          }
        )
      })

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
    }, rootRef)
    return () => ctx.revert()
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
              <span className="ember-text">{s.value}</span>
              <span className="text-ember-400">{s.suffix}</span>
            </p>
            <p className="mt-2 text-xs uppercase tracking-widest text-star-500">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
