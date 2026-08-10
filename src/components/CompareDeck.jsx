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
      <div className="grid items-start gap-6 md:grid-cols-2">
        {/* Us — the winner: ember-committed, elevated, glows. Outer div
            owns `perspective` and nothing else; the inner card owns the
            hover transform. Both on the same element (what this had
            before) gives rotateX/rotateY nowhere to project onto, so the
            "tilt" was nearly invisible — same split v4 uses
            (.compare-card / .compare-card-inner). */}
        <div className="compare-card-us [perspective:1400px]">
          <div
            className="relative rounded-3xl border border-ember-500/35 bg-gradient-to-b from-ember-500/[0.09] to-transparent p-8 shadow-[0_30px_70px_-25px_rgba(245,48,3,0.45)] transition-transform duration-500 ease-out [transform-style:preserve-3d] hover:[transform:rotateX(6deg)_rotateY(-8deg)_translateZ(20px)] motion-reduce:hover:transform-none md:scale-[1.03] md:p-9"
          >
            {/* ambient glow — same recipe as the orbit core, just quieter */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] blur-2xl"
              style={{ background: 'radial-gradient(circle, rgba(245,48,3,0.22), transparent 70%)' }}
            />
            <h3 className="mb-6 flex items-center justify-center gap-2.5 text-xl font-bold text-ember-600 dark:text-ember-300">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ember-500 text-white shadow-[0_0_16px_rgba(245,48,3,0.5)]">
                <Check className="h-4 w-4" />
              </span>
              {WHY.compare.usLabel}
            </h3>
            <ul className="flex flex-col gap-4">
              {WHY.compare.rows.map((row, i) => (
                <li
                  key={i}
                  className="group/row flex items-start gap-3 rounded-lg px-2 py-1 -mx-2 text-sm font-medium text-star-100 transition-all duration-200 ease-out hover:translate-x-1 hover:bg-ember-500/10"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember-500/15 text-ember-500 transition-transform duration-200 ease-out group-hover/row:scale-125 dark:text-ember-300">
                    <Check className="h-3 w-3" />
                  </span>
                  {row.us}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Them — muted, receded, flat: the visual contrast IS the argument. */}
        <div className="compare-card-them [perspective:1400px]">
          <div
            className="rounded-3xl border border-star-300/15 bg-star-800/[0.015] p-8 opacity-80 grayscale-[0.3] transition-transform duration-500 ease-out [transform-style:preserve-3d] hover:[transform:rotateX(6deg)_rotateY(8deg)_translateZ(20px)] hover:opacity-90 motion-reduce:hover:transform-none dark:bg-white/[0.02] md:scale-[0.97] md:p-9"
          >
            <h3 className="mb-6 flex items-center justify-center gap-2.5 text-xl font-semibold text-star-500">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-star-300/15 text-star-500">
                <Cross className="h-4 w-4" />
              </span>
              {WHY.compare.themLabel}
            </h3>
            <ul className="flex flex-col gap-4">
              {WHY.compare.rows.map((row, i) => (
                <li
                  key={i}
                  className="group/row flex items-start gap-3 rounded-lg px-2 py-1 -mx-2 text-sm text-star-500 transition-all duration-200 ease-out hover:translate-x-1 hover:bg-star-300/10"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-star-300/10 text-star-500/70 transition-transform duration-200 ease-out group-hover/row:scale-110">
                    <Cross className="h-3 w-3" />
                  </span>
                  {row.them}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
