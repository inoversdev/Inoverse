import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BRAND, PROJECTS } from '../lib/content'
import SplitHeading from './SplitHeading'
import Ufo2D from './Ufo2D'
import WispyCloud from './WispyCloud'
import ProjectModal from './ProjectModal'

// Live value of the reduced-motion preference — swap between the marquee
// (motion) and the static grid (no motion), same pattern as testimonials.
// NOTE: low-end devices keep the marquee too — it already pauses
// offscreen via IntersectionObserver and has no will-change, so the
// static-grid swap bought nothing and killed the signature motion.
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

// ─── Marquee project card — bigger, richer than the old wordmark tile.
// Carries the real project identity: index, name, industry pill, one-line
// description, tech tags. Glass surface (solid white / tinted glass),
// lifts + ember border on hover, opens the same ProjectModal as /projects. ───
function ProjectMarqueeCard({ project, index, onOpen }) {
  const p = project
  return (
    <button
      type="button"
      onClick={() => onOpen?.(p)}
      className="group glass relative flex h-full min-h-[19rem] w-[400px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl p-8 text-left transition-all duration-500 hover:-translate-y-1 hover:border-ember-500/40 hover:shadow-[0_24px_48px_-20px_rgba(17,17,17,0.16)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember-400 sm:w-[480px] sm:p-9"
    >
      {/* Giant ghost index — the project's fleet number */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-5 select-none font-display text-8xl font-bold leading-none tracking-[-0.04em] text-star-100/[0.05] transition-colors duration-500 group-hover:text-ember-500/10 sm:text-9xl"
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="relative mb-5 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-ember-500/25 bg-ember-500/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-widest text-ember-600 dark:text-ember-300">
          {p.industry}
        </span>
        <span className="flex items-center gap-2">
          {p.demo && (
            <span className="rounded-full bg-star-100/5 px-2.5 py-1 text-[11px] uppercase tracking-wider text-star-500">
              concept
            </span>
          )}
          <span className="text-star-500">◆</span>
        </span>
      </div>

      <h3 className="relative font-display text-3xl font-semibold tracking-tight text-star-100 transition-colors group-hover:text-ember-600 sm:text-4xl">
        {p.name}
      </h3>
      <p className="relative mt-3 text-[15px] leading-relaxed text-star-400 sm:text-base">{p.description}</p>

      <div className="relative mt-auto flex flex-wrap gap-2.5 pt-6">
        {p.tags.slice(0, 3).map((t) => (
          <span
            key={t}
            className="rounded-md bg-star-100/5 px-3 py-1.5 text-xs font-medium text-star-300"
          >
            {t}
          </span>
        ))}
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-ember-600 transition-transform duration-300 group-hover:translate-x-0.5 dark:text-ember-300">
          View details →
        </span>
      </div>
    </button>
  )
}

// ─── One copy of the marquee row. The trailing padding (not a flex gap on
// the track) makes the -50% loop seamless: each half is exactly row + gap
// wide, so translating the track by half its own width lands the second
// copy exactly where the first one started. ───
function ProjectRow({ projects, onOpen, offset = 0 }) {
  return (
    <div className="flex shrink-0 gap-5 pr-5 sm:gap-6 sm:pr-6">
      {projects.map((p, i) => (
        <ProjectMarqueeCard
          key={`${p.id}-${offset}`}
          project={p}
          index={i}
          onOpen={onOpen}
        />
      ))}
    </div>
  )
}

// ─── Infinite marquee — the fleet, in TWO mirrored rows. Top flows left,
// bottom flows right (reuses the testimonials marquee CSS — same seamless
// -50% translate loop, same edge mask). No hover pause. PAUSES OFFSCREEN:
// CSS marquees keep costing paint even when scrolled out of view — an
// IntersectionObserver stops them until they're near the viewport again. ───
function ProjectMarquee({ projects, onOpen }) {
  const trackARef = useRef(null)
  const trackBRef = useRef(null)
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        const state = entry.isIntersecting ? 'running' : 'paused'
        if (trackARef.current) trackARef.current.style.animationPlayState = state
        if (trackBRef.current) trackBRef.current.style.animationPlayState = state
      },
      { rootMargin: '120px' }
    )
    if (trackARef.current) io.observe(trackARef.current)
    return () => io.disconnect()
  }, [])
  return (
    <div className="flex flex-col gap-6">
      <div className="marquee-mask overflow-hidden">
        <div ref={trackARef} className="project-marquee-track flex w-max">
          <ProjectRow projects={projects} onOpen={onOpen} offset="a" />
          <ProjectRow projects={projects} onOpen={onOpen} offset="b" />
        </div>
      </div>
      <div className="marquee-mask overflow-hidden">
        <div ref={trackBRef} className="project-marquee-track project-marquee-track-reverse flex w-max">
          <ProjectRow projects={projects} onOpen={onOpen} offset="c" />
          <ProjectRow projects={projects} onOpen={onOpen} offset="d" />
        </div>
      </div>
    </div>
  )
}

// ─── Static grid — used under prefers-reduced-motion: same cards, no
// scroll. A clean 3-column wrap (2 on tablet, 1 on mobile). ───
function ProjectGrid({ projects, onOpen }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p, i) => (
        <ProjectMarqueeCard key={p.id} project={p} index={i} onOpen={onOpen} />
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
  const reduce = useReducedMotion()
  const [activeProject, setActiveProject] = useState(null)

  // The marquee fleet: the featured missions first, then demo projects —
  // richer than the old 12-wordmark wall, all clickable to the modal.
  const featured = PROJECTS.filter((p) => p.featured)
  const demo = PROJECTS.filter((p) => p.demo && !p.featured)
  const marqueeProjects = [...featured, ...demo].slice(0, 12)

  return (
    <section id="work" className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10">
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

        <div className="ufo-track absolute top-[34%] left-0 w-full sm:top-[46%]">
          <div className="ufo-tilt">
            <div className="max-sm:scale-[0.7]">
              <div className="ufo-bob">
                <Ufo2D variant="transit" size={88} />
              </div>
            </div>
          </div>
        </div>

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
            className="font-display text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.03em] text-star-100 sm:text-6xl"
          />
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-star-400">
            Every mission is a delivered project — from restaurant systems to hotel platforms.
            Here's a taste of the fleet; the full manifest lives on its own page.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="rounded-full border border-star-300/25 bg-white px-4 py-1.5 text-xs font-medium text-star-400 shadow-[0_1px_2px_rgba(17,17,17,0.04)] dark:bg-[rgba(26,22,18,0.68)]">
            {PROJECTS.length} missions
          </span>
        </div>
      </div>

      {/* ── The showcase — infinite project marquee (Mat's call
             2026-08-12): two mirrored rows of bigger project cards —
             real name, industry, description, tags — flowing forever.
             Reduced motion swaps to a static grid. Cards open the same
             full-view ProjectModal as /projects. ── */}
      {reduce ? (
        <ProjectGrid projects={marqueeProjects} onOpen={setActiveProject} />
      ) : (
        <ProjectMarquee projects={marqueeProjects} onOpen={setActiveProject} />
      )}

      <div className="mt-14 flex flex-wrap items-center gap-4">
        <Link
          to="/projects"
          className="group inline-flex items-center gap-2.5 rounded-full border border-ember-500/35 bg-white px-6 py-3 text-sm font-semibold text-ember-600 shadow-[0_1px_2px_rgba(17,17,17,0.04)] transition-all duration-300 hover:border-ember-500 hover:bg-ember-500/[0.06] hover:shadow-[0_10px_30px_-12px_rgba(245,48,3,0.45)] dark:bg-transparent dark:text-ember-300"
        >
          View all missions
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

      {activeProject && (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}
    </section>
  )
}
