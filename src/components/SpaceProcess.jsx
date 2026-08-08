import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROCESS } from '../lib/content'

gsap.registerPlugin(ScrollTrigger)

export default function SpaceProcess() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.v2-process-item').forEach((item, i) => {
        const dir = i % 2 === 0 ? -40 : 40
        gsap.fromTo(
          item,
          { opacity: 0, x: dir },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
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
    <section id="process" ref={rootRef} className="relative mx-auto max-w-5xl px-6 py-28 lg:px-10">
      <div className="mb-16 max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ember-600">Process</p>
        <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-star-100 sm:text-5xl">
          Our flight <span className="ember-text font-light">plan</span>
        </h2>
      </div>

      <div className="relative">
        {/* Flight path line */}
        <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-ember-500/60 via-ember-500/20 to-transparent sm:left-1/2" />

        <div className="space-y-12">
          {PROCESS.map((p, i) => (
            <div
              key={p.step}
              className={`v2-process-item relative flex flex-col gap-4 sm:flex-row sm:items-center ${
                i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
              }`}
            >
              <div className="flex w-full items-center gap-5 sm:w-1/2">
                <span className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ember-500/50 bg-space-900 text-sm font-semibold text-ember-600 shadow-[0_0_25px_rgba(245,48,3,0.35)]">
                  {p.step}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-star-100">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-star-400">{p.description}</p>
                </div>
              </div>
              <div className="hidden sm:block sm:w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
