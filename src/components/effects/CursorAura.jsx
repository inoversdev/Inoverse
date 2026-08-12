import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { getDeviceProfile } from '../../hooks/useDeviceProfile'

// A soft ember glow that trails the cursor with lag — the ship's running
// lights reading the room, not a spotlight. Desktop pointer-only; fades in
// only after the first real mouse movement so it never sits pinned at
// (0,0) before the visitor moves, and is fully inert under
// prefers-reduced-motion. DISABLED on low-end devices (per-frame blur
// + a 440px soft-glow layer is exactly the paint cost they don't need).
export default function CursorAura() {
  const ref = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (getDeviceProfile().lowEnd) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const xTo = gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3.out' })

    const onMove = (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
      setActive(true)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[2] h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-1000 motion-reduce:hidden ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background:
          'radial-gradient(circle, rgba(245,48,3,0.09) 0%, rgba(245,48,3,0.035) 45%, transparent 72%)',
        filter: 'blur(20px)',
      }}
    />
  )
}
