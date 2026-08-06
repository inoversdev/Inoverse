import { useEffect, useRef } from 'react'
import anime from 'animejs'
import { STATS } from '../lib/content'

export default function Stats() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const numbers = el.querySelectorAll('[data-count]')

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()

        numbers.forEach((num) => {
          const target = Number(num.dataset.count)
          const obj = { v: 0 }
          anime({
            targets: obj,
            v: target,
            duration: 1800,
            easing: 'easeOutExpo',
            update: () => {
              num.textContent = Math.round(obj.v).toString()
            },
          })
        })
      },
      { threshold: 0.4 }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-20 bg-warm-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-ink-200/70 rounded-3xl overflow-hidden border border-ink-200/70">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-warm-50 p-8 md:p-10 text-center group hover:bg-warm-100 transition-colors duration-500"
            >
              <div className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-none tracking-[-0.03em] text-ink-900 group-hover:text-ember-500 transition-colors duration-500">
                <span data-count={stat.value}>0</span>
                <span className="text-ember-500">{stat.suffix}</span>
              </div>
              <div className="mt-3 text-xs md:text-sm font-medium tracking-[0.08em] uppercase text-ink-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
