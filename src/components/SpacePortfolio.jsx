import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { INDUSTRIES, PROJECTS } from '../lib/content'
import SplitHeading from './SplitHeading'
import Ufo2D from './Ufo2D'

gsap.registerPlugin(ScrollTrigger)

const EXTERNAL = 'https://dorydelivery.com/'
const LINKED = [
  { id: 'dory', url: 'https://dorydelivery.com/' },
  { id: 'dmap', url: 'https://dmap.inovers.dev/' },
  { id: 'whatahotel', url: 'https://www.whatahotel.com/' },
  { id: 'agenxure', url: 'https://www.agenxure.com/' },
]

export default function SpacePortfolio() {
  const rootRef = useRef(null)
  const gridRef = useRef(null)
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = useMemo(
    () =>
      activeFilter === 'All'
        ? PROJECTS
        : PROJECTS.filter((p) => p.industry === activeFilter),
    [activeFilter]
  )

  // Mission card reveal on scroll + filter-change animation.
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
            trigger: gridRef.current,
            start: 'top 88%',
            once: true,
          },
        }
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // Replay the stagger whenever the filter changes (keyed remount of the
  // grid is handled by React — we just re-run the entrance tween).
  useEffect(() => {
    if (!gridRef.current) return
    gsap.fromTo(
      '.mission-card',
      { opacity: 0, y: 22, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        stagger: 0.04,
        ease: 'power3.out',
        overwrite: 'auto',
      }
    )
  }, [activeFilter])

  const hrefFor = (p) => p.url || EXTERNAL

  return (
    <section id="work" ref={rootRef} className="relative mx-auto max-w-7xl px-6 py-28 lg:px-10">
      {/* ── UFO delivery strip — the saucer delivers missions ── */}
      <div
        className="pointer-events-none relative -mx-6 mb-6 h-24 overflow-hidden sm:-mx-10"
        aria-hidden="true"
      >
        <div className="ufo-track absolute top-2 left-0">
          <div className="ufo-bob">
            <Ufo2D variant="transit" size={104} />
          </div>
        </div>
        {/* faint flight trail on the strip */}
        <div className="absolute inset-x-0 top-14 h-px bg-gradient-to-r from-transparent via-ember-500/20 to-transparent" />
      </div>

      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ember-500">Our Work</p>
          <SplitHeading
            as="h2"
            text="Missions launched"
            accent="launched"
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-star-100 sm:text-5xl"
          />
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-star-400">
            Every mission is a delivered project — from restaurant systems to hotel platforms.
            Filter by industry to find the work that fits your business.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="rounded-full border border-star-300/25 bg-white/40 px-4 py-1.5 text-xs font-medium text-star-400 backdrop-blur-sm dark:bg-white/5">
            {filtered.length} mission{filtered.length === 1 ? '' : 's'}
            {activeFilter !== 'All' ? ` · ${activeFilter}` : ''}
          </span>
          <a
            href={EXTERNAL}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-star-400 transition-colors hover:text-ember-500"
          >
            View flagship project →
          </a>
        </div>
      </div>

      {/* ── Industry filter — business-owner friendly categories ── */}
      <div className="mb-10 flex flex-wrap gap-2.5" role="group" aria-label="Filter projects by industry">
        {['All', ...INDUSTRIES].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveFilter(cat)}
            className={`mission-chip ${activeFilter === cat ? 'mission-chip-active' : ''}`}
            aria-pressed={activeFilter === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Mission grid — uniform patches, scales to 20+ without clutter ── */}
      <div key={activeFilter} ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const hasLink = LINKED.some((l) => l.id === p.id)
          return (
            <a
              key={p.id}
              href={hasLink ? hrefFor(p) : undefined}
              target={hasLink ? '_blank' : undefined}
              rel={hasLink ? 'noreferrer' : undefined}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
                e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
              }}
              className={`mission-card group glass min-w-0 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-ember-500/40 hover:shadow-[0_0_50px_rgba(245,48,3,0.12)] ${
                hasLink ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-ember-500/25 bg-ember-500/5 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-ember-600 dark:text-ember-300">
                  {p.industry}
                </span>
                <span className="flex items-center gap-2">
                  {p.demo && (
                    <span className="rounded-full bg-star-100/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-star-500">
                      new
                    </span>
                  )}
                  {hasLink ? (
                    <span className="text-star-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ember-500">
                      ↗
                    </span>
                  ) : (
                    <span className="text-star-500">◆</span>
                  )}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-star-100 transition-colors group-hover:text-ember-600">
                {p.name}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-star-400">{p.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-star-100/5 px-2.5 py-1 text-[11px] font-medium text-star-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
