import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SERVICES, STATS } from '../lib/content'
import SplitHeading from './SplitHeading'

gsap.registerPlugin(ScrollTrigger)

const ICONS = {
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
      <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13 4l-2 16" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
      <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" />
    </svg>
  ),
  mobile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </svg>
  ),
  bot: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
      <rect x="4" y="8" width="16" height="11" rx="3" />
      <path d="M12 4v4M8.5 13h.01M15.5 13h.01M9 16.5h6" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
      <path d="M3 21h18M6 17v-6M11 17V7M16 17v-9" />
    </svg>
  ),
  rocket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
      <path d="M12 3c3 2.5 5 6.5 5 11l-5 6-5-6c0-4.5 2-8.5 5-11z" />
      <circle cx="12" cy="10" r="2" />
      <path d="M7.5 14.5L4 18M16.5 14.5L20 18" />
    </svg>
  ),
}

// ─── Placeholder media frames ───
// Generic visuals per tile until real screenshots land (open item #2 in
// the plan). Each frame reads as the deliverable type: a browser window
// for websites, a row of phone screens for apps, a flow diagram for
// systems. Big tiles get the large frames.
const MediaVisual = ({ type, size }) => {
  const big = size === 'xl' || size === 'lg'
  const phoneH = big ? ['h-28', 'h-36', 'h-24'] : ['h-16', 'h-20', 'h-14']
  const phoneW = big ? 'w-16 sm:w-20' : 'w-11 sm:w-14'

  if (type === 'browser') {
    return (
      <div className={`w-full overflow-hidden rounded-xl border border-star-300/30 bg-white/70 shadow-xl dark:bg-space-900/70 ${big ? 'max-w-xs' : 'max-w-[11rem]'}`}>
        <div className="flex items-center gap-1.5 border-b border-star-300/20 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-ember-400/80" />
          <span className="h-2 w-2 rounded-full bg-ember-400/45" />
          <span className="h-2 w-2 rounded-full bg-ember-400/25" />
        </div>
        <div className="space-y-2 p-4">
          <div className="h-2 w-3/4 rounded-full bg-star-100/10" />
          <div className="h-2 w-1/2 rounded-full bg-star-100/10" />
          <div className="mt-3 h-16 rounded-lg bg-ember-500/10" />
        </div>
      </div>
    )
  }

  if (type === 'phones') {
    return (
      <div className="flex items-end justify-center gap-3">
        {phoneH.map((h, i) => (
          <div
            key={i}
            className={`${phoneW} ${h} overflow-hidden rounded-[1.1rem] border border-star-300/30 bg-white/70 shadow-lg dark:bg-space-900/70`}
          >
            <div className="mx-auto mt-1.5 h-1 w-6 rounded-full bg-star-100/15" />
            <div className="mx-auto mt-2 space-y-1.5">
              <div className="h-1.5 w-8 rounded-full bg-ember-500/25" />
              <div className="h-1 w-6 rounded-full bg-star-100/10" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'flow') {
    return (
      <div className="flex items-center gap-2">
        <span className="h-9 w-9 rounded-lg border border-star-300/30 bg-white/50 dark:bg-white/5" />
        <span className="text-ember-400" aria-hidden="true">→</span>
        <span className="h-9 w-9 rounded-lg border border-star-300/30 bg-white/50 dark:bg-white/5" />
        <span className="text-ember-400" aria-hidden="true">→</span>
        <span className="h-9 w-9 rounded-lg border border-ember-500/40 bg-ember-500/10" />
      </div>
    )
  }

  return null
}

// Tile slot sizing — data-driven so extra services drop in without a
// JSX rewrite. 'xl' = the tall anchor tile (7 cols × 2 rows); 'lg' =
// standard tile beside/below an anchor (5 cols); 'sm' = compact cluster
// tile (3 cols). The grid handles N tiles of any mix.
const SIZE_CLS = {
  xl: 'md:col-span-6 md:row-span-2 lg:col-span-7 lg:row-span-2 min-h-[24rem]',
  lg: 'md:col-span-3 lg:col-span-5 min-h-[16rem]',
  sm: 'md:col-span-2 lg:col-span-3 min-h-[14rem]',
}

export default function SpaceServices() {
  const rootRef = useRef(null)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Tile entrance — V4's AnimatedContent recipe (distance + scale
      // together reads heavier/more premium than a plain fade-up).
      gsap.utils.toArray('.v2-service-card').forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 70, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              once: true,
            },
          }
        )
      })

      // Stat cards — V4's ScrollStack recipe: each one scales down and
      // drifts up slightly as it scrolls past center toward the top of the
      // viewport, so the whole band feels like it's peeling away rather
      // than sitting static once revealed.
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
      <div className="mb-16 max-w-2xl">
        <p data-parallax="-0.1" className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ember-500">Services</p>
        <SplitHeading
          as="h2"
          text="What we build"
          accent="build"
          className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-star-100 sm:text-5xl"
        />
        <p className="mt-5 text-star-400">
          From a landing page in three days to full-scale systems — engineered to launch fast and scale further.
        </p>
      </div>

      {/* ── Bento mosaic — Instagram-style grid: visual-led, minimal text
             per tile, tight gutters. Title + one-line tagline sit at the
             bottom; the full bullet lists ride a hover/tap overlay. ── */}
      <div className="grid grid-cols-1 gap-4 auto-rows-[minmax(14rem,auto)] md:grid-cols-6 lg:grid-cols-12 lg:gap-5">
        {SERVICES.map((s) => {
          const expanded = expandedId === s.id
          return (
            <div
              key={s.id}
              onClick={() => setExpandedId(expanded ? null : s.id)}
              className={`v2-service-card group relative flex flex-col overflow-hidden rounded-2xl border border-star-300/20 bg-white/40 p-7 transition-all duration-500 hover:border-ember-500/40 hover:shadow-[0_0_50px_rgba(245,48,3,0.12)] dark:bg-white/[0.04] ${SIZE_CLS[s.size] || SIZE_CLS.sm}`}
            >
              {/* media visual — the deliverable frame */}
              <div className="pointer-events-none relative z-0 flex flex-1 items-center justify-center pb-8">
                <MediaVisual type={s.media} size={s.size} />
              </div>

              {/* title row — always visible */}
              <div className="relative z-10 flex items-start gap-4">
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ember-500/30 bg-ember-500/10 text-ember-600 transition-colors group-hover:text-ember-500">
                  {ICONS[s.icon] || ICONS.code}
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-star-100">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-star-400">{s.tagline}</p>
                </div>
              </div>

              {/* bullets overlay — slides up on hover (desktop), toggles on
                  tap (touch) */}
              <div
                aria-hidden={!expanded}
                className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-full p-7 pt-14 transition-transform duration-500 ease-out group-hover:translate-y-0 ${
                  expanded ? '!translate-y-0' : ''
                }`}
                style={{
                  background:
                    'linear-gradient(to top, var(--space-950) 32%, rgba(0,0,0,0) 100%)',
                }}
              >
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ember-500">
                  What's inside
                </p>
                <ul className="space-y-2">
                  {s.bullets.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-star-300">
                      <span className="text-ember-500">✦</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
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
