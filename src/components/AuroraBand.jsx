// ─── AuroraBand — cosmic lightning page breaker (Hero → Services) ───
// Mat's reference art (a diagonal red nebula band shot through with
// white/cyan lightning filaments), recreated as real generated SVG
// geometry — LightningBand — instead of a static image (Mat's call
// 2026-08-10: "make it as a part of the code" + animate it). Masked to
// fade at both edges so it melts into the sections.
//
// Scroll-reactive depth: the whole band lags behind the page via
// data-parallax (drifts slower than scroll = reads as a layer further
// back), while LightningBand itself pans laterally with a scrubbed
// trigger as you pass it, on top of its own internal regeneration and
// dash-flow animation. It also extends above and below the band, so it
// visibly slides across the hero's bottom edge and the services' top
// edge — hero melts into services.

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LightningBand from './LightningBand'

gsap.registerPlugin(ScrollTrigger)

export default function AuroraBand() {
  const rootRef = useRef(null)

  // Lateral pan: as the band crosses the viewport, the artwork drifts
  // right→left (scrubbed to scroll) — a slow pan across the frame.
  // LightningBand's SVG is 12% wider than the band and the mask fade
  // lives at the band's own edges, so the pan never exposes a hard
  // boundary.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.aurora-nebula',
        { xPercent: -3 },
        {
          xPercent: 3,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.6,
          },
        }
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      data-parallax="0.18"
      className="aurora-band relative h-64 overflow-x-clip sm:h-96"
      aria-hidden="true"
    >
      <LightningBand />
    </section>
  )
}
