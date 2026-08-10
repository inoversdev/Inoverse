import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TESTIMONIALS_META } from '../lib/content'

gsap.registerPlugin(ScrollTrigger)

const Star = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...props}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

// ─── Count-up rating badge — v4's "4.9 across 50+ projects" idea. ───
// Renders NOTHING until TESTIMONIALS_META.average has a real source
// behind it (content honesty, plan §6.2). Null → null, no badge.
export default function RatingBadge() {
  const valRef = useRef(null)
  const rootRef = useRef(null)
  const average = TESTIMONIALS_META.average
  const count = TESTIMONIALS_META.count

  useEffect(() => {
    if (average == null) return
    const el = valRef.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = average.toFixed(1)
      return
    }

    const ctx = gsap.context(() => {
      const counter = { val: 0 }
      gsap.to(counter, {
        val: average,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = counter.val.toFixed(1)
        },
        scrollTrigger: { trigger: rootRef.current, start: 'top 90%', once: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [average])

  if (average == null) return null

  return (
    <div
      ref={rootRef}
      className="glass mx-auto -mt-2 mb-10 flex max-w-md flex-wrap items-center justify-center gap-4 rounded-2xl px-7 py-4 sm:justify-start"
    >
      <div ref={valRef} className="font-display text-3xl font-bold tracking-tight text-star-100">
        0.0
      </div>
      <div>
        <div className="flex gap-0.5 text-ember-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} />
          ))}
        </div>
        <p className="text-xs leading-relaxed text-star-400">
          <span className="font-semibold text-star-300">Average client rating</span>
          <br />
          Across {count}+ projects delivered
        </p>
      </div>
    </div>
  )
}
