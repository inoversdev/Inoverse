import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BRAND, PROJECTS } from '../lib/content'
import MissionCard from './MissionCard'
import SplitHeading from './SplitHeading'
import Ufo2D from './Ufo2D'
import WispyCloud from './WispyCloud'

gsap.registerPlugin(ScrollTrigger)

// Live value of the reduced-motion preference, so the section can swap
// between the marquee (motion) and the static grid (no motion).
function useReducedMotion() {
  const [reduce, setReduce] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduce(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduce
}

// ─── Mission marquee row — fixed-width cards on one track, duplicated
// twice by the caller for the seamless -50% loop (same grammar as the
// testimonial marquee). ───
function MissionMarqueeRow({ items }) {
  return (
    <div className="flex gap-5 pr-5">
      {items.map((p) => (
        <div key={p.id} className="w-[300px] shrink-0 sm:w-[360px]">
          <MissionCard project={p} />
        </div>
      ))}
    </div>
  )
}

// A thinner, sparser cloud than AuroraBand's — this is the "ground" the
// saucer dives into to drop a mission, not a full backdrop. Ember-toned to
// match the section's accent (dune fills used the same tokens before).
const DELIVERY_CLOUD_CURTAINS = [
  { color: [245, 48, 3], amp: 14, freq: 0.02, speed: 1.0, phase: 0, height: 0.55, alpha: 0.22, line: false },
  { color: [255, 138, 92], amp: 10, freq: 0.026, speed: -1.2, phase: 2.0, height: 0.4, alpha: 0.16, line: false },
  { color: [192, 36, 2], amp: 9, freq: 0.017, speed: 0.7, phase: 3.4, height: 0.28, alpha: 0.14, line: false },
]

export default function SpacePortfolio() {
  const rootRef = useRef(null)
  const reduce = useReducedMotion()

  // Home is a clean showcase: exactly the 6 featured missions. The full
  // grid (all 20 + industry filters) lives on /projects.
  const featured = PROJECTS.filter((p) => p.featured)

  // Mission card reveal — simple one-shot fade-up (Mat's call 2026-08-10:
  // the scrubbed scale+blur was too heavy to render — filter: blur on
  // every card recomposites constantly while scrolling). Now: transform +
  // opacity only, fires once per card, no scrub, no reverse, no filter.
  // Marquee mode (normal motion): skipped entirely — the cards live in a
  // constantly moving track, per-card reveals would fight it.
  useEffect(() => {
    if (!reduce) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.mission-card').forEach((card) => {
        gsap.from(card, {
          y: 28,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 90%', once: true },
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [reduce])

  return (
    <section id="work" ref={rootRef} className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10">
      {/* ── Delivery strip — the saucer flies a simple in/out arc, dips
             into a sparse ember cloud to drop a mission, then banks away.
             12s loop, synced with the beam/capsule timings inside Ufo2D
             (beam ~46-60%, capsule ~46-66%).
             overflow-x-clip + contain: the animated flight transform
             leaks scrollable overflow past overflow-hidden (Chrome
             compositing quirk) when the saucer exits the strip's right
             edge. NOTE: don't add overflow-hidden — its shorthand
             overrides overflow-x-clip. ── */}
      <div
        className="pointer-events-none relative -mx-6 mb-8 h-36 overflow-x-clip contain-paint sm:-mx-10 sm:h-64"
        aria-hidden="true"
      >
        {/* delivery cloud — low-density, so the saucer dipping into it
            reads as "delivering into the cloud" rather than landing on
            solid ground. The strip runs full-bleed (-mx-6/-mx-10), so
            the ember cloud used to hard-stop at the viewport edges —
            the mask feathers both sides in smoothly (Mat's call
            2026-08-10). */}
        <WispyCloud
          curtains={DELIVERY_CLOUD_CURTAINS}
          canvasClassName="absolute inset-x-0 bottom-0 h-[65%] w-full"
          style={{
            filter: 'blur(6px)',
            maskImage:
              'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        />

        {/* the saucer — simple arc: emerges from the left portal, dips
            down into the cloud to drop the mission, rises and dives into
            the right portal. The wrapper spans the full strip (w-full) so
            the %-based flight keyframes move the saucer across the strip,
            not across its own width. Flight line is responsive: mobile
            shrinks the saucer (scale .7) and flies at 34% so the
            entry/exit dips never clip the frame; desktop flies at 46%.
            The .ufo-tilt wrapper carries the banking rotation around the
            saucer's own center (rotate on the full-width track would tilt
            the whole flight line diagonally). */}
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

      {/* ── The six featured missions — INFINITE MARQUEE, two mirrored
             rows (top flows left, bottom flows right), same pattern as
             the testimonials feed (Mat's call 2026-08-11: "adopt the
             infinite marquee animation, keep the v2 design"). Each row
             is two identical copies on one track (-50% CSS loop, 26s).
             Cards are NOT clickable anymore — pure showcase. Reduced
             motion falls back to the static grid. ── */}
      {reduce ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <MissionCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="marquee-mask overflow-hidden">
            <div className="marquee-track flex w-max">
              <MissionMarqueeRow items={featured.slice(0, 3)} />
              <MissionMarqueeRow items={featured.slice(0, 3)} />
            </div>
          </div>
          <div className="marquee-mask overflow-hidden">
            <div className="marquee-track marquee-track-reverse flex w-max">
              <MissionMarqueeRow items={featured.slice(3, 6)} />
              <MissionMarqueeRow items={featured.slice(3, 6)} />
            </div>
          </div>
        </div>
      )}

      {/* ── View More → /projects + the section's primary CTA. Was a bare
             uppercase-tracked text link (star-400, blended into the page,
             Mat found it easy to miss) — now a real ember-bordered pill
             with the actual remaining count, so it reads as a promise
             ("there's more here") instead of a footnote. ── */}
      {/* ── View More → /projects + the section's primary CTA. One
             left-aligned row, the same layout contract as the About
             section's button pair (Mat's call 2026-08-10). ── */}
      <div className="mt-14 flex flex-wrap items-center gap-4">
        <Link
          to="/projects"
          className="group inline-flex items-center gap-2.5 rounded-full border border-ember-500/35 bg-ember-500/[0.06] px-6 py-3 text-sm font-semibold text-ember-600 backdrop-blur-sm transition-all duration-300 hover:border-ember-500 hover:bg-ember-500/[0.12] hover:shadow-[0_10px_30px_-12px_rgba(245,48,3,0.45)] dark:text-ember-300"
        >
          View {PROJECTS.length - featured.length} more missions
          <span
            aria-hidden="true"
            className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:translate-x-0 motion-reduce:transition-none"
          >→</span>
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
