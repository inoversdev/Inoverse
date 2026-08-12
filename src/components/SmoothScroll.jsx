import { ReactLenis } from 'lenis/react'
import { getDeviceProfile } from '../hooks/useDeviceProfile'

/**
 * Apple-tier heavy smooth scroll — same recipe as Mat's portfolio.
 * lerp: 0.055 = heavy inertia (0.08 → 0.055 = more drag)
 * wheelMultiplier: 0.7 = more wheel effort required
 *
 * LOW-END DEGRADE (Mat's call 2026-08-12): weak devices and phones get
 * native touch scrolling (Lenis' smoothTouch fights the browser and
 * costs CPU on every touchmove) and a much lighter wheel lerp — the
 * site stays responsive instead of rubber-banding behind the finger.
 */
export default function SmoothScroll({ children }) {
  const profile = getDeviceProfile()
  const lowEnd = profile.lowEnd
  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window

  return (
    <ReactLenis
      root
      autoRaf
      options={{
        lerp: lowEnd ? 0.12 : 0.055,
        smoothWheel: true,
        smoothTouch: lowEnd ? false : true,
        wheelMultiplier: lowEnd ? 1 : 0.7,
        touchMultiplier: 0.7,
        // On low-end touch devices, Lenis is off entirely — the browser
        // handles touch natively (lightest possible path).
        ...(lowEnd && isTouch ? { syncTouch: false } : {}),
      }}
    >
      {children}
    </ReactLenis>
  )
}
