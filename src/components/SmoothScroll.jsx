import { ReactLenis } from 'lenis/react'

/**
 * Apple-tier heavy smooth scroll — same recipe as Mat's portfolio.
 * lerp: 0.055 = heavy inertia (0.08 → 0.055 = more drag)
 * wheelMultiplier: 0.7 = more wheel effort required
 */
export default function SmoothScroll({ children }) {
  return (
    <ReactLenis
      root
      autoRaf
      options={{
        lerp: 0.055,
        smoothWheel: true,
        smoothTouch: true,
        wheelMultiplier: 0.7,
        touchMultiplier: 0.7,
      }}
    >
      {children}
    </ReactLenis>
  )
}
