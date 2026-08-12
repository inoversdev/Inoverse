import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Global [data-parallax="<speed>"] driver — tag any element anywhere in the
// tree and it drifts against scroll at that fraction of viewport height, no
// wrapper divs or per-component wiring needed. Positive speed drifts
// opposite to scroll (reads as "further back, slower"); negative drifts
// with scroll but faster than the page (reads as "peeling away first").
//
// CAPPED travel (Mat's call 2026-08-12): small UI labels (section
// eyebrows like "Our Work", "Process", "Contact") were scrubbing ±90px
// across their whole scroll range — reading as "the title never stops
// going up". Now every element's travel is capped:
//   - maxDistance = viewportHeight × speed (unchanged)
//   - cap = min(maxDistance, CAP) where CAP = 28px for labels ≤ 2 lines,
//     60px for taller elements (backgrounds/glows keep the full drift).
// The scrub range is also shortened (top 90% → bottom 10%) so the drift
// settles EARLY while the element is still on screen, instead of
// translating until it scrolls off.
// Re-runs on route change (pathname dep): pages swap their tagged elements
// when they mount/unmount, so the old triggers are killed and fresh ones
// are created against the new DOM. Everything below the shell belongs to a
// page, so every tagged element is gone after navigation — keeping stale
// triggers from piling up between routes.
export function useParallaxLayers(pathname) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const LABEL_CAP = 28 // small text labels: subtle nudge, settles fast
    const ELEMENT_CAP = 60 // taller blocks/glows: keep the drift, still capped

    const tweens = gsap.utils.toArray('[data-parallax]').map((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.15
      const isLabel = el.offsetHeight <= 48 // eyebrows are ~16-20px tall
      // Cap the ABSOLUTE travel and preserve direction: negative speeds
      // (eyebrows "peel away first") must also be capped — Math.min on a
      // negative value would return the full negative distance instead of
      // the cap, which is exactly how the old ±90px drift survived.
      const raw = window.innerHeight * speed
      const cap = isLabel ? LABEL_CAP : ELEMENT_CAP
      const distance = Math.sign(raw) * Math.min(Math.abs(raw), cap)
      return gsap.fromTo(
        el,
        { y: -distance },
        {
          y: distance,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            end: 'bottom 10%',
            scrub: 0.6,
          },
        }
      )
    })

    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill()
        t.kill()
      })
    }
  }, [pathname])
}
