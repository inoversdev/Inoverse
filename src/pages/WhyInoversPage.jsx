import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ABOUT, STATS, WHY } from '../lib/content'
import PageHero from '../components/PageHero'
import CompareDeck from '../components/CompareDeck'
import MissionCTA from '../components/MissionCTA'

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
// removed the home Values tiles but kept the array). This is its home
// now. Flip cascade ported from v4's #values section. ───
function StandardsGrid() {
  const rootRef = useRef(null)

  useEffect(() => {
    // Reduced motion: cards rest in place — no flip cascade.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.standard-card').forEach((card, i) => {
        gsap.from(card, {
          rotationY: i % 2 ? -40 : 40,
          y: 60,
          opacity: 0,
          transformOrigin: i % 2 ? 'left center' : 'right center',
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 92%', once: true },
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative mx-auto max-w-7xl px-6 pb-20 lg:px-10" style={{ perspective: '1200px' }}>
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ember-500">{WHY.standards.eyebrow}</p>
      <h2 className="mb-10 font-display text-2xl font-semibold text-star-100 sm:text-3xl">
        {WHY.standards.heading}
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ABOUT.values.map((v) => (
          <div key={v.id} className="standard-card glass rounded-2xl p-6" style={{ transformStyle: 'preserve-3d' }}>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-ember-500/40 text-ember-500">
              {ICONS[v.icon]}
            </div>
            <h3 className="mb-2 text-base font-semibold text-star-100">{v.title}</h3>
            <p className="text-sm leading-relaxed text-star-400">{v.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ProofStrip() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-24 lg:px-10">
      <div className="glass grid grid-cols-2 gap-8 rounded-3xl px-8 py-10 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-3xl font-bold text-star-100 sm:text-4xl">
              {s.value}
              {s.suffix}
            </div>
            <div className="mt-1 text-xs text-star-400">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function WhyInoversPage() {
  return (
    <div>
      <PageHero eyebrow={WHY.eyebrow} heading={WHY.heading} accent={WHY.headingAccent} lede={WHY.lede} />
      <CompareDeck />
      <StandardsGrid />
      <ProofStrip />
      <MissionCTA
        heading={WHY.cta.heading}
        accent={WHY.cta.accent}
        sub={WHY.cta.sub}
        secondary={WHY.cta.secondary}
      />
    </div>
  )
}
