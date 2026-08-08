import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SERVICES, STATS } from '../lib/content'

gsap.registerPlugin(ScrollTrigger)

const ICONS = {
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
      <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13 4l-2 16" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
      <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" />
    </svg>
  ),
}

export default function SpaceServices() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.v2-service-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
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

  return (
    <section id="services" ref={rootRef} className="relative mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <div className="mb-16 max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ember-500">Services</p>
        <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-star-100 sm:text-5xl">
          What we <span className="ember-text font-light">build</span>
        </h2>
        <p className="mt-5 text-star-400">
          From a landing page in three days to full-scale systems — engineered to launch fast and scale further.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {SERVICES.map((s) => (
          <div
            key={s.id}
            className="v2-service-card glass group rounded-2xl p-8 transition-all duration-500 hover:border-ember-500/40 hover:shadow-[0_0_50px_rgba(245,48,3,0.12)]"
          >
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-ember-500/30 bg-ember-500/10 text-ember-600 transition-colors group-hover:text-ember-500">
              {ICONS[s.icon] || ICONS.code}
            </div>
            <h3 className="font-display text-2xl font-semibold tracking-tight text-star-100">{s.title}</h3>
            <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-ember-600">{s.promise}</p>
            <p className="mt-4 text-sm leading-relaxed text-star-400">{s.description}</p>
            <ul className="mt-6 space-y-2.5 border-t border-star-300/20 pt-6">
              {s.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-star-300">
                  <span className="text-ember-500">✦</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Stats band */}
      <div className="mt-20 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-6 text-center">
            <p className="font-display text-3xl font-bold tracking-[-0.03em] text-star-100">
              <span className="ember-text">{s.value}</span>
              <span className="text-ember-400">{s.suffix}</span>
            </p>
            <p className="mt-2 text-xs uppercase tracking-widest text-star-500">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
