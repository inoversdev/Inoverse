import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Infinite marquee band between Hero and Services — ONE row.
// The loop is bulletproof: the track holds two identical halves and the
// tween scrolls exactly one MEASURED half-width (px), so the restart
// lands pixel-perfect on the seam — no CSS -50% rounding jump. Content
// is decorative: hidden from assistive tech.

const WORDS = [
  'Websites in 3 days',
  'Mobile Apps',
  'AI Integration',
  'Custom Software',
  'Systems & Automation',
]

// Each half is 2x the word list so the band always covers wide viewports.
const HALF_WORDS = [...WORDS, ...WORDS]

function Unit({ hidden }) {
  return (
    <div className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={hidden || undefined}>
      {HALF_WORDS.map((w, i) => (
        <span key={i} className="flex items-center gap-12 whitespace-nowrap">
          <span className="font-display text-2xl font-bold tracking-tight text-star-400/80 sm:text-3xl">
            {w}
          </span>
          <span className="text-ember-500">✦</span>
        </span>
      ))}
    </div>
  )
}

export default function SpaceMarquee() {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let tween = null
    const start = () => {
      const half = track.firstElementChild
      if (!half) return
      const distance = half.getBoundingClientRect().width // exact, no rounding
      if (!(distance > 0)) return
      tween = gsap.to(track, {
        x: -distance,
        duration: 26,
        ease: 'none',
        repeat: -1,
      })
    }
    start()

    // Re-measure on resize so the seam stays exact
    let ro
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        if (tween) tween.kill()
        tween = null
        start()
      })
      ro.observe(track)
    }

    // Pause on hover, resume on leave
    const onEnter = () => tween?.timeScale(0)
    const onLeave = () => tween?.timeScale(1)
    track.addEventListener('mouseenter', onEnter)
    track.addEventListener('mouseleave', onLeave)

    return () => {
      if (tween) tween.kill()
      ro?.disconnect()
      track.removeEventListener('mouseenter', onEnter)
      track.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <section className="relative overflow-hidden border-y border-star-300/20 bg-white/50 py-6 backdrop-blur-sm dark:bg-space-950/40">
      <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div ref={trackRef} className="flex will-change-transform">
          <Unit />
          <Unit hidden />
        </div>
      </div>
    </section>
  )
}
