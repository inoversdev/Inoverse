import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Global [data-parallax="<speed>"] driver — tag any element anywhere in the
// tree and it drifts against scroll at that fraction of viewport height, no
// wrapper divs or per-component wiring needed. Positive speed drifts
// opposite to scroll (reads as "further back, slower"); negative drifts
// with scroll but faster than the page (reads as "peeling away first").
// Re-runs on route change (pathname dep): pages swap their tagged elements
// when they mount/unmount, so the old triggers are killed and fresh ones
// are created against the new DOM. Everything below the shell belongs to a
// page, so every tagged element is gone after navigation — keeping stale
// triggers from piling up between routes.
export function useParallaxLayers(pathname) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const tweens = gsap.utils.toArray('[data-parallax]').map((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.15
      const distance = window.innerHeight * speed
      return gsap.fromTo(
        el,
        { y: -distance },
        {
          y: distance,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
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
