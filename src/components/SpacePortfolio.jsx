import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BRAND, PROJECTS } from '../lib/content'
import MissionCard from './MissionCard'
import SplitHeading from './SplitHeading'
import Ufo2D from './Ufo2D'

gsap.registerPlugin(ScrollTrigger)

export default function SpacePortfolio() {
  const rootRef = useRef(null)

  // Home is a clean showcase: exactly the 6 featured missions. The full
  // grid (all 20 + industry filters) lives on /projects.
  const featured = PROJECTS.filter((p) => p.featured)

  // Mission card reveal — Apple-style grow-into-place: each card scales
  // up (0.88 → 1) and fades in (0 → 1) as it scrolls from the viewport
  // bottom edge to 55% height, scrubbed to scroll so it reverses
  // buttery-smooth when scrolling back. No discrete triggers.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.mission-card').forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.88, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'top 55%',
              scrub: 0.5,
            },
          }
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="work" ref={rootRef} className="relative mx-auto max-w-7xl px-6 py-28 lg:px-10">
      {/* ── Delivery strip — the saucer's classic delivery run over the
             Martian dunes: flies in, hovers, beams a mission down, then
             banks away. 12s loop, synced with the beam/capsule timings
             inside Ufo2D (beam ~47-58%, capsule ~51-66%).
             overflow-x-clip + contain: the animated flight transform
             leaks scrollable overflow past overflow-hidden (Chrome
             compositing quirk) when the saucer exits the strip's right
             edge. NOTE: don't add overflow-hidden — its shorthand
             overrides overflow-x-clip. ── */}
      <div
        className="pointer-events-none relative -mx-6 mb-8 h-36 overflow-x-clip contain-paint sm:-mx-10 sm:h-64"
        aria-hidden="true"
      >
        {/* Martian ground — layered dunes at the horizon */}
        <svg className="absolute inset-x-0 bottom-0 h-[30%] w-full" viewBox="0 0 400 100" preserveAspectRatio="none">
          <path
            d="M0 100 L0 58 Q 90 40 180 56 T 400 52 L400 100 Z"
            className="fill-ember-500/10 dark:fill-ember-700/40"
          />
          <path
            d="M0 100 L0 72 Q 110 56 230 70 T 400 66 L400 100 Z"
            className="fill-ember-500/20 dark:fill-ember-600/50"
          />
        </svg>

        {/* the saucer — the classic delivery run, flying low over the
            dunes. The wrapper spans the full strip (w-full) so the
            %-based flight keyframes move the saucer across the strip,
            not across its own width. Flight line is responsive: mobile
            shrinks the saucer (scale .7) and flies at 34% so the
            entry/exit dips never clip the horizon; desktop flies at
            46%. The .ufo-tilt wrapper carries the banking rotation
            around the saucer's own center (rotate on the full-width
            track would tilt the whole flight line diagonally). */}
        <div className="ufo-track absolute top-[34%] left-0 w-full sm:top-[46%]">
          <div className="ufo-tilt">
            <div className="max-sm:scale-[0.7]">
              <div className="ufo-bob">
                <Ufo2D variant="transit" size={88} />
              </div>
            </div>
          </div>
        </div>

        {/* Portals — the saucer emerges from the left portal, delivers,
            then dives into the right portal. Each portal only APPEARS
            while the saucer is passing through it (fades in/out on the
            12s cycle), never static. Centers sit at 4% / 96% of the
            strip — the exact spots the saucer's run starts and ends.
            Vertical: desktop portals sit at 55% (the 46% flight line +
            half the saucer body lands there); mobile portals sit at 45%
            (the 34% flight line scaled by 0.7). */}
        <div className="ufo-portal ufo-portal-left absolute left-[calc(4%-32px)] top-[calc(45%-32px)] h-16 w-16 sm:left-[calc(4%-48px)] sm:top-[calc(55%-48px)] sm:h-24 sm:w-24">
          <span className="ufo-portal-core" />
          <span className="ufo-portal-ring" />
          <span className="ufo-portal-ring ufo-portal-ring-2" />
        </div>
        <div className="ufo-portal ufo-portal-right absolute right-[calc(4%-32px)] top-[calc(45%-32px)] h-16 w-16 sm:right-[calc(4%-48px)] sm:top-[calc(55%-48px)] sm:h-24 sm:w-24">
          <span className="ufo-portal-core" />
          <span className="ufo-portal-ring" />
          <span className="ufo-portal-ring ufo-portal-ring-2" />
        </div>

        {/* twinkling stars in the sky */}
        <span className="animate-dust absolute left-[12%] top-3 h-1.5 w-1.5 rounded-full bg-star-100/70" style={{ animationDelay: '0.6s' }} />
        <span className="animate-dust absolute left-[30%] top-9 h-1 w-1 rounded-full bg-star-100/70" style={{ animationDelay: '1.4s' }} />
        <span className="animate-dust absolute left-[74%] top-4 h-1.5 w-1.5 rounded-full bg-star-100/70" style={{ animationDelay: '2.2s' }} />
      </div>

      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p data-parallax="-0.1" className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ember-500">Our Work</p>
          <SplitHeading
            as="h2"
            text="Missions launched"
            accent="launched"
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-star-100 sm:text-5xl"
          />
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-star-400">
            Every mission is a delivered project — from restaurant systems to hotel platforms.
            Here's a taste of the fleet; the full manifest lives on its own page.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="rounded-full border border-star-300/25 bg-white/40 px-4 py-1.5 text-xs font-medium text-star-400 backdrop-blur-sm dark:bg-white/5">
            {PROJECTS.length} missions
          </span>
        </div>
      </div>

      {/* ── The six featured missions — 3×2 desktop / 2 col tablet / 1 col
             mobile. No filters here; filtering lives on /projects. ── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((p) => (
          <MissionCard key={p.id} project={p} />
        ))}
      </div>

      {/* ── View More → /projects + the section's primary CTA ── */}
      <div className="mt-14 flex flex-col items-center gap-6">
        <Link
          to="/projects"
          className="group inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-star-400 transition-colors hover:text-ember-500"
        >
          <span className="transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true">∨</span>
          View more missions
          <span className="transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true">∨</span>
        </Link>
        <a
          href={BRAND.calendly}
          target="_blank"
          rel="noreferrer"
          className="v2-btn v2-btn-primary group"
        >
          Book a Call
          <span
            aria-hidden="true"
            className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:translate-x-0 motion-reduce:transition-none"
          >→</span>
        </a>
      </div>
    </section>
  )
}
