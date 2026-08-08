import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Infinite marquee band between Hero and Services — ONE row.
// The loop is bulletproof: the track holds two identical halves and the
// tween scrolls exactly one MEASURED half-width (px), so the restart
// lands pixel-perfect on the seam — no CSS -50% rounding jump. Content
// is decorative: hidden from assistive tech.

// "Cosmic transmission" voice — capabilities as broadcast signals.
const WORDS = [
  'Custom Software',
  'Web Development',
  'Mobile Apps',
  'AI Integration',
  'Systems & Automation',
  '3-Day Launches',
]

// Each half is 2x the word list so the band always covers wide viewports.
const HALF_WORDS = [...WORDS, ...WORDS]

function Unit({ hidden }) {
  return (
    <div className="flex shrink-0 items-center gap-14 pr-14" aria-hidden={hidden || undefined}>
      {HALF_WORDS.map((w, i) => (
        <span key={i} className="flex items-center gap-14 whitespace-nowrap">
          <span className="font-display text-base font-semibold uppercase tracking-[0.28em] text-star-400/90 sm:text-lg">
            {w}
          </span>
          {/* ember star — the signal marker */}
          <span className="relative flex h-2 w-2 items-center justify-center">
            <span className="absolute h-2 w-2 animate-ping rounded-full bg-ember-500/40" />
            <span className="text-ember-500">✦</span>
          </span>
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
    <section className="relative overflow-hidden border-y border-star-300/15 bg-white/45 py-7 backdrop-blur-md dark:border-star-100/10 dark:bg-space-950/40">
      {/* hairline ember glows at the top/bottom edges */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember-500/40 to-transparent" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ember-500/25 to-transparent" />
      <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)]">
        <div ref={trackRef} className="flex will-change-transform">
          <Unit />
          <Unit hidden />
        </div>
      </div>
    </section>
  )
}
