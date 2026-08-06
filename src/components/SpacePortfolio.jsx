import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROJECTS } from '../lib/content'

gsap.registerPlugin(ScrollTrigger)

const EXTERNAL = 'https://dorydelivery.com/'
const LINKED = [
  { id: 'dory', url: 'https://dorydelivery.com/' },
  { id: 'dmap', url: 'https://dmap.inovers.dev/' },
  { id: 'whatahotel', url: 'https://www.whatahotel.com/' },
  { id: 'agenxure', url: 'https://www.agenxure.com/' },
]

// "V" formation â€” wide at the top, converging to the point card at the
// bottom. Each row is a pair of cards (except the last), and each row's
// container shrinks toward the center so the cards visually form a V.
const ROW_PLAN = [[0, 1], [2, 3], [4, 5], [6]]
const ROW_WIDTHS = ['md:w-full', 'md:w-[90%]', 'md:w-[74%]', 'md:w-[48%]']

export default function SpacePortfolio() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.v2-project-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: (i % 3) * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              once: true,
            },
          }
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const hrefFor = (p) => p.url || EXTERNAL

  return (
    <section id="work" ref={rootRef} className="relative mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-ember-300">Our Work</p>
          <h2 className="font-display text-4xl font-light leading-tight text-star-100 sm:text-5xl">
            Missions <span className="ember-text italic">launched</span>
          </h2>
        </div>
        <a
          href={EXTERNAL}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-star-400 transition-colors hover:text-ember-300"
        >
          View flagship project â†’
        </a>
      </div>

      {/* Project cards in a "V" â€” wide rows at the top that converge
          toward a single point card at the bottom. Stacked on mobile. */}
      <div className="flex flex-col items-center gap-6">
        {ROW_PLAN.map((row, ri) => (
          <div
            key={ri}
            className={`flex w-full flex-col gap-6 md:flex-row md:justify-center ${ROW_WIDTHS[ri]}`}
          >
            {row.map((pi) => {
              const p = PROJECTS[pi]
              const hasLink = LINKED.some((l) => l.id === p.id)
              return (
                <a
                  key={p.id}
                  href={hasLink ? hrefFor(p) : undefined}
                  target={hasLink ? '_blank' : undefined}
                  rel={hasLink ? 'noreferrer' : undefined}
                  className={`v2-project-card group glass min-w-0 flex-1 rounded-2xl p-7 transition-all duration-500 hover:border-ember-500/40 hover:shadow-[0_0_50px_rgba(245,48,3,0.12)] ${
                    hasLink ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-widest text-star-400">
                      {p.category}
                    </span>
                    {hasLink ? (
                      <span className="text-star-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ember-300">
                        â†—
                      </span>
                    ) : (
                      <span className="text-star-700">â—†</span>
                    )}
                  </div>
                  <h3 className="font-display text-2xl text-star-100 transition-colors group-hover:text-ember-100">
                    {p.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-star-400">{p.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-white/5 px-2.5 py-1 text-[11px] font-medium text-star-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </a>
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}
