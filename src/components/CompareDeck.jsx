import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { WHY } from '../lib/content'

gsap.registerPlugin(ScrollTrigger)

const Check = ({ className = '', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-4 w-4 shrink-0 ${className}`} {...props}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
)
const Cross = ({ className = '', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-4 w-4 shrink-0 ${className}`} {...props}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

// ─── Why Inovers — the two flight paths ───
// Inovers card (glass + ember) vs Typical agencies (flat, muted) —
// deliberately NOT a red/green traffic-light pair, that palette doesn't
// exist anywhere else on v2. Rows are index-matched so both columns
// answer each other claim-for-claim.
//
// Non-pinned scrub entrance: cards slide in from opposite sides as the
// deck scrolls through view. No document-height/pin games — the AppShell
// drives its 3D camera off a body-level scroll trigger and a pinned
// section would inject height after that trigger already measured.
//
// Renders a plain <div> — it's mounted inside WhyInoversSection's own
// <section>, not a page section on its own.
export default function CompareDeck() {
  const rootRef = useRef(null)

  useEffect(() => {
    // Reduced motion: cards rest in place — no scrub, no entrance.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Desktop / tablet landscape (≥1024): scrubbed side-entrance over
      // the deck's own scroll span — no pin, no document-height games.
      mm.add('(min-width: 1024px)', () => {
        gsap.fromTo(
          '.compare-card-us',
          { xPercent: -12, opacity: 0, rotate: -2 },
          {
            xPercent: 0,
            opacity: 1,
            rotate: 0,
            ease: 'power2.out',
            scrollTrigger: { trigger: rootRef.current, start: 'top 85%', end: 'top 40%', scrub: 0.6 },
          }
        )
        gsap.fromTo(
          '.compare-card-them',
          { xPercent: 12, opacity: 0, rotate: 2 },
          {
            xPercent: 0,
            opacity: 1,
            rotate: 0,
            ease: 'power2.out',
            scrollTrigger: { trigger: rootRef.current, start: 'top 85%', end: 'top 40%', scrub: 0.6 },
          }
        )
      })

      // Mobile (<1024): simple non-scrubbed entrance — one-time, once.
      mm.add('(max-width: 1023.98px)', () => {
        gsap.from('.compare-card-us', {
          x: -40,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 90%', once: true },
        })
        gsap.from('.compare-card-them', {
          x: 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 90%', once: true },
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="relative mb-16">
      <div className="grid gap-6 md:grid-cols-2">
        <div
          className="compare-card-us glass rounded-3xl p-8 transition-transform duration-300 [transform-style:preserve-3d] hover:[transform:rotateX(3deg)_rotateY(-3deg)] motion-reduce:hover:transform-none"
        >
          <h3 className="mb-6 flex items-center justify-center gap-2 text-xl font-semibold text-ember-500">
            <Check className="h-5 w-5" /> {WHY.compare.usLabel}
          </h3>
          <ul className="flex flex-col gap-4">
            {WHY.compare.rows.map((row, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-star-300">
                <Check className="mt-0.5 text-ember-500" />
                {row.us}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="compare-card-them rounded-3xl border border-dashed border-star-300/25 bg-white/40 p-8 transition-transform duration-300 [transform-style:preserve-3d] hover:[transform:rotateX(3deg)_rotateY(3deg)] motion-reduce:hover:transform-none dark:bg-white/5"
        >
          <h3 className="mb-6 flex items-center justify-center gap-2 text-xl font-semibold text-star-500">
            <Cross className="h-5 w-5" /> {WHY.compare.themLabel}
          </h3>
          <ul className="flex flex-col gap-4">
            {WHY.compare.rows.map((row, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-star-500">
                <Cross className="mt-0.5 text-star-500/60" />
                {row.them}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
