import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Port of Inovers v4's card choreography ───
// From v4's "What we make" (#services .feat) and "Selected work"
// (.case-card): cards enter with an ALTERNATING horizontal slide
// (even ←, odd →) plus a slight rotation, one per-card scroll trigger
// at top 92%, and toggleActions 'play none none reverse' so they glide
// back out when scrolled above. Optional icon spin-pop (scale 0→1 with
// rotation -180→0, back.out) for cards with a leading icon.
//
// opts: { x = 80, rotation = 0, icon = null, iconDelay = 0.15 }
//   x        — slide distance in px (alternates sign per card)
//   rotation — degrees of tilt, alternates sign (v4 uses 4 for feats)
//   icon     — selector for the icon element inside each card, if any
//   iconDelay— seconds before the icon pop starts (v4 uses 0.15)
export function applyCardReveal(scope, selector, opts = {}) {
  const { x = 80, rotation = 0, icon = null, iconDelay = 0.15 } = opts
  // Accept a DOM element OR a React ref (gsap.context unwraps refs, but
  // gsap.utils.toArray does not — pass through .current if present).
  const scopeEl = scope && scope.current ? scope.current : scope

  // Mobile (below 768px): the alternating horizontal slide is v4's
  // desktop choreography — on a phone, cards skating in from off-screen
  // edges feel heavy. Fall back to a clean fade-up (Mat's call 2026-08-11,
  // mobile pass). Desktop keeps the full slide.
  const mobile = window.matchMedia('(max-width: 767.98px)').matches
  const fromX = mobile ? 0 : x
  const fromRot = mobile ? 0 : rotation

  gsap.utils.toArray(selector, scopeEl || document).forEach((card, i) => {
    gsap.from(card, {
      x: i % 2 ? fromX : -fromX,
      y: mobile ? 26 : 0,
      rotation: i % 2 ? fromRot : -fromRot,
      opacity: 0,
      duration: mobile ? 0.6 : 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 92%',
        toggleActions: 'play none none reverse',
      },
    })

    if (icon) {
      const iconEl = card.querySelector(icon)
      if (iconEl) {
        gsap.from(iconEl, {
          scale: 0,
          rotation: -180,
          duration: 0.7,
          ease: 'back.out(1.8)',
          delay: iconDelay,
          scrollTrigger: { trigger: card, start: 'top 92%' },
        })
      }
    }
  })
}
