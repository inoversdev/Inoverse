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

  // Mission card reveal on scroll.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.mission-card',
        { opacity: 0, y: 26, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="work" ref={rootRef} className="relative mx-auto max-w-7xl px-6 py-28 lg:px-10">
      {/* ── UFO delivery strip — the saucer flies in, hovers, beams a
             mission down to the pad, then banks away ── */}
      {/* overflow-x-clip + contain: the animated flight transform leaks
          scrollable overflow past overflow-hidden (Chrome compositing
          quirk) when the saucer exits the strip's right edge. NOTE: don't
          add overflow-hidden — its shorthand overrides overflow-x-clip. */}
      <div
        className="pointer-events-none relative -mx-6 mb-8 h-28 overflow-x-clip contain-paint sm:-mx-10"
        aria-hidden="true"
      >
        {/* the saucer — arc flight with a hover while beaming */}
        <div className="ufo-track absolute top-2 left-0">
          <div className="ufo-bob">
            <Ufo2D variant="transit" size={108} />
          </div>
        </div>

        {/* dashed approach route — dashes flow across the strip */}
        <div className="ufo-route absolute inset-x-0 bottom-12 h-[3px] opacity-60" />

        {/* twinkling stars on the strip */}
        <span className="animate-dust absolute left-[12%] top-3 h-1.5 w-1.5 rounded-full bg-star-100/70" style={{ animationDelay: '0.6s' }} />
        <span className="animate-dust absolute left-[30%] top-9 h-1 w-1 rounded-full bg-star-100/70" style={{ animationDelay: '1.4s' }} />
        <span className="animate-dust absolute left-[74%] top-4 h-1.5 w-1.5 rounded-full bg-star-100/70" style={{ animationDelay: '2.2s' }} />
        <span className="animate-dust absolute left-[89%] top-10 h-1 w-1 rounded-full bg-star-100/70" style={{ animationDelay: '0.9s' }} />
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
