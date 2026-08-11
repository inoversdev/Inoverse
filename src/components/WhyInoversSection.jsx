import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ABOUT, WHY } from '../lib/content'
import { applyCardReveal } from '../lib/cardReveal'
import SplitHeading from './SplitHeading'
import CompareDeck from './CompareDeck'

gsap.registerPlugin(ScrollTrigger)

const ICONS = {
  spark: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path d="M12 3l7 3v5c0 4.6-3 8.6-7 10-4-1.4-7-5.4-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 3-5.5 6.5-5.5s6.5 1.9 6.5 5.5" />
      <circle cx="17.5" cy="9.5" r="2.5" />
      <path d="M17.5 14.5c2.4 0 4 1.6 4 3.5" />
    </svg>
  ),
  trend: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  ),
}

// ─── Standards grid — ABOUT.values, previously orphaned data (Phase 1
// removed the home Values tiles but kept the array). Flip cascade
// ported from v4's #values section. ───
function StandardsGrid() {
  const rootRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      // Standards grid — v4 alternating slide + icon spin-pop.
      applyCardReveal(rootRef, '.standard-card', { x: 80, rotation: 0, icon: 'div.mb-4' })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="mb-16" style={{ perspective: '1200px' }}>
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ember-500">{WHY.standards.eyebrow}</p>
      <h3 className="mb-10 font-display text-2xl font-semibold text-star-100 sm:text-3xl">
        {WHY.standards.heading}
      </h3>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ABOUT.values.map((v) => (
          <div key={v.id} className="standard-card glass rounded-2xl p-6" style={{ transformStyle: 'preserve-3d' }}>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-ember-500/40 text-ember-500">
              {ICONS[v.icon]}
            </div>
            <h4 className="mb-2 text-base font-semibold text-star-100">{v.title}</h4>
            <p className="text-sm leading-relaxed text-star-400">{v.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Why Inovers — home section, sits right after Process ───
// Was a standalone /why-inovers route (Phase 2); merged onto the home
// scroll per Mat's call (2026-08-10) — one page, discoverable by
// scrolling like every other section, no separate route to keep in sync.
//
// Note: the old ProofStrip (STATS band) was REMOVED 2026-08-11 (Mat's
// call) — the same stats already close the Services section; repeating
// them here read as filler. The section now ends on the standards grid.
export default function WhyInoversSection() {
  return (
    <section id="why-inovers" className="relative mx-auto max-w-7xl overflow-x-clip px-6 py-24 lg:px-10">
      <div className="mb-14 max-w-xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ember-500">{WHY.eyebrow}</p>
        <SplitHeading
          as="h2"
          text={WHY.heading}
          accent={WHY.headingAccent}
          className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-star-100 sm:text-5xl"
        />
        <p className="mt-5 leading-relaxed text-star-400">{WHY.lede}</p>
      </div>
      <CompareDeck />
      <StandardsGrid />
    </section>
  )
}
