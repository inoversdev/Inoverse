// ─── OrbitSystem — the interactive orbital org chart ───
// Shared by /crew (OrbitalBand) and the home About section (SpaceAbout),
// so both places show LITERALLY the same system. Self-contained:
// scroll entrance (GSAP context scoped to its own root) + Day 2
// drag-to-rotate interactivity + the CSS 3D orbit markup.
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BRAND, ORG_CHART } from '../lib/content'

gsap.registerPlugin(ScrollTrigger)

const TILT = 55 // degrees the orbital plane is pitched toward the viewer

// Role icons for the organizational chart medallions
const ICONS = {
  crown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path d="M3 17l2.5-10 4.5 4.5L12 6l2 5.5L18.5 7 21 17H3z" />
      <path d="M5 20h14" />
    </svg>
  ),
  chip: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
      <path d="M9.5 9.5h5v5h-5z" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path d="M8 6l-6 6 6 6M16 6l6 6-6 6" />
    </svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.6 7.6" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path d="M12 3l7 3v5c0 4.6-3 8.6-7 10-4-1.4-7-5.4-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 3-5.5 6.5-5.5s6.5 1.9 6.5 5.5" />
      <circle cx="17.5" cy="9.5" r="2.5" />
      <path d="M17.5 14.5c2.4 0 4 1.6 4 3.5" />
    </svg>
  ),
}

// Tiny specks drifting on the orbital plane
const DUST = [
  { l: '9%', t: '30%', z: -30, s: 2, d: 0 },
  { l: '20%', t: '72%', z: 18, s: 2, d: 0.9 },
  { l: '37%', t: '10%', z: 46, s: 2, d: 1.7 },
  { l: '63%', t: '90%', z: -12, s: 2, d: 2.5 },
  { l: '79%', t: '22%', z: 38, s: 2, d: 3.3 },
  { l: '91%', t: '58%', z: -26, s: 2, d: 1.1 },
  { l: '48%', t: '40%', z: 60, s: 2, d: 2.1 },
  { l: '69%', t: '47%', z: -48, s: 2, d: 2.9 },
]

// Satellite placement: teams on the outer main ring (0/90/180/270°),
// leadership on the inner ember ring (0/180°). Angles distribute the
// medallions around the circle; the ring's own rotation carries them.
const TEAM_ANGLES = [0, 90, 180, 270]
const LEAD_ANGLES = [0, 180]

export default function OrbitSystem() {
  const rootRef = useRef(null)
  const orbitRef = useRef(null)
  const sceneRef = useRef(null)
  const [grabbing, setGrabbing] = useState(false)

  // Scroll entrance — the disc settles in, rings breathe in, the core
  // pops, satellites cascade into orbit. Scoped to rootRef.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const orbitTrig = { trigger: '.v2-orbit', start: 'top 82%', once: true }
      gsap.fromTo(
        '.v2-orbit-scene',
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out', scrollTrigger: orbitTrig }
      )
      gsap.fromTo(
        '.v2-orbit-ring',
        { opacity: 0 },
        { opacity: 1, duration: 1.4, ease: 'power2.out', scrollTrigger: orbitTrig }
      )
      gsap.fromTo(
        '.v2-orbit-core',
        { opacity: 0, scale: 0.4 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'back.out(1.7)',
          scrollTrigger: orbitTrig,
        }
      )
      gsap.utils.toArray('.v2-orbit-node').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.5 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            delay: 0.2 + i * 0.12,
            ease: 'power3.out',
            scrollTrigger: orbitTrig,
          }
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // ─── Drag-to-rotate — the Day 2 interactive orbit behaviour ───
  // Grab the system and spin it: horizontal drags turn it around Y,
  // vertical drags re-tilt the disc (clamped so it never goes edge-on).
  // On release the spin carries on with momentum, then a slow idle drift
  // keeps the system alive. Medallions + core billboard every frame so
  // they keep facing the camera while the scene rotates. Disabled for
  // reduced motion.
  useEffect(() => {
    const el = orbitRef.current
    const scene = sceneRef.current
    if (!el || !scene) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const DEG_PER_PX = 0.28
    const X_MIN = 15
    const X_MAX = 85
    const clampX = (v) => Math.min(X_MAX, Math.max(X_MIN, v))

    const billboards = Array.from(el.querySelectorAll('.v2-orbit-billboard'))

    let dragging = false
    let lastX = 0
    let lastY = 0
    let lastT = 0
    let velX = 0
    let velY = 0
    let rotX = TILT
    let rotY = 0
    let raf = 0
    let prevT = performance.now()

    const apply = () => {
      gsap.set(scene, { rotationX: rotX, rotationY: rotY })
      billboards.forEach((b) => {
        if (gsap.getTweensOf(b).length === 0) {
          b.style.transform = `${b.dataset.base} rotateX(${-rotX}deg) rotateY(${-rotY}deg)`
        }
      })
    }

    const loop = (now) => {
      const dt = Math.min((now - prevT) / 1000, 0.05)
      prevT = now
      if (!dragging && gsap.getTweensOf(scene).length === 0) {
        if (Math.abs(velY) > 0.5 || Math.abs(velX) > 0.5) {
          rotX = clampX(rotX + velX * dt)
          rotY += velY * dt
          const decay = Math.exp(-2.2 * dt)
          velX *= decay
          velY *= decay
        } else {
          velX = 0
          velY = 0
          rotY += 3 * dt // idle drift — slow turn showing the 3D
        }
        apply()
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onDown = (e) => {
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      lastT = performance.now()
      velX = 0
      velY = 0
      gsap.killTweensOf(scene)
      gsap.set(scene, { opacity: 1, scale: 1 })
      el.setPointerCapture?.(e.pointerId)
      setGrabbing(true)
    }

    const onMove = (e) => {
      if (!dragging) return
      const now = performance.now()
      const dt = Math.max((now - lastT) / 1000, 0.001)
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      lastT = now
      rotY += dx * DEG_PER_PX
      rotX = clampX(rotX - dy * DEG_PER_PX)
      velY = (dx * DEG_PER_PX) / dt
      velX = (-dy * DEG_PER_PX) / dt
      apply()
    }

    const onUp = (e) => {
      if (!dragging) return
      dragging = false
      try {
        el.releasePointerCapture?.(e.pointerId)
      } catch {
        /* pointer capture may already be gone */
      }
      setGrabbing(false)
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [])

  return (
    <div
      ref={orbitRef}
      className={`v2-orbit relative mx-auto aspect-square w-full max-w-[560px] select-none ${
        grabbing ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{ perspective: '1100px', touchAction: 'pan-y' }}
    >
      {/* Ambient ember atmosphere — clipped so it can't overflow on
          mobile (wrapper keeps preserve-3d siblings intact). */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        <div
          className="absolute -inset-12 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(245,48,3,0.09), transparent 62%)',
          }}
        />
      </div>

      {/* The whole system gently bobs */}
            <div className="animate-scene-bob absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
              {/* The tilted disc */}
              <div
                ref={sceneRef}
                className="v2-orbit-scene absolute inset-0 will-change-transform"
                style={{ transform: `rotateX(${TILT}deg)`, transformStyle: 'preserve-3d' }}
              >
                {/* Outer boundary ring — farthest plane */}
                <div
                  className="v2-orbit-ring absolute inset-[4%] rounded-full border border-star-300/25"
                  style={{ transform: 'translateZ(-40px)' }}
                />

                {/* Main orbit — teams ring, rotating; Saturn-style shading
                    gives it volume without extra lines. Carries the team
                    satellites with counter-spun icons so they stay upright. */}
                <div className="v2-orbit-ring oc-ring-a absolute inset-[15%]" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute inset-0 rounded-full border border-star-300/45" style={{ transform: 'translateZ(0)' }} />
                  <div className="ring-shade pointer-events-none absolute inset-0 rounded-full" style={{ transform: 'translateZ(0)' }} />
                  {ORG_CHART.rings[1].roles.map((r, i) => (
                    <div
                      key={r.id}
                      className="v2-orbit-billboard absolute left-1/2 top-1/2"
                      data-base={`rotate(${TEAM_ANGLES[i]}deg) translateX(var(--orbit-main)) rotate(${-TEAM_ANGLES[i]}deg)`}
                      style={{
                        transform: `rotate(${TEAM_ANGLES[i]}deg) translateX(var(--orbit-main)) rotate(${-TEAM_ANGLES[i]}deg) rotateX(-${TILT}deg)`,
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <div className="v2-orbit-node">
                        <div className="oc-spin-a flex flex-col items-center gap-2" title={r.description}>
                          <span
                            className="relative flex h-14 w-14 items-center justify-center rounded-full border border-ember-500/40 text-ember-100 shadow-[0_0_25px_rgba(245,48,3,0.25),inset_0_3px_4px_rgba(255,255,255,0.3),inset_0_-7px_11px_rgba(0,0,0,0.8)] sm:h-16 sm:w-16"
                            style={{
                              background:
                                'radial-gradient(circle at 30% 24%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 20%), radial-gradient(circle at 68% 78%, rgba(245,48,3,0.55) 0%, rgba(245,48,3,0) 45%), radial-gradient(circle at 34% 30%, #786858 0%, #2c221d 55%, #050403 100%)',
                            }}
                          >
                            {ICONS[r.icon] || ICONS.users}
                          </span>
                          <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.2em] text-star-300">
                            {r.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gyroscope ring — precesses in true 3D so the circles
                    visibly tumble (ellipse → circle → edge-on) */}
                <div
                  className="oc-gyro pointer-events-none absolute inset-[24%] rounded-full border border-ember-500/30"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-400 shadow-[0_0_10px_rgba(245,48,3,0.9)]" />
                </div>

                {/* Inner ember dashed ring — leadership, counter-rotating,
                    with a beacon dot */}
                <div className="v2-orbit-ring oc-ring-b absolute inset-[33%] rounded-full border border-dashed border-ember-500/35" style={{ transformStyle: 'preserve-3d' }}>
                  <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-500/80 shadow-[0_0_12px_rgba(245,48,3,0.9)]" />
                  {ORG_CHART.rings[0].roles.map((r, i) => (
                    <div
                      key={r.id}
                      className="v2-orbit-billboard absolute left-1/2 top-1/2"
                      data-base={`rotate(${LEAD_ANGLES[i]}deg) translateX(var(--orbit-inner)) rotate(${-LEAD_ANGLES[i]}deg)`}
                      style={{
                        transform: `rotate(${LEAD_ANGLES[i]}deg) translateX(var(--orbit-inner)) rotate(${-LEAD_ANGLES[i]}deg) rotateX(-${TILT}deg)`,
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <div className="v2-orbit-node">
                        <div className="oc-spin-b flex flex-col items-center gap-2" title={r.description}>
                          <span
                            className="relative flex h-12 w-12 items-center justify-center rounded-full border border-ember-500/45 text-ember-100 shadow-[0_0_22px_rgba(245,48,3,0.3),inset_0_3px_3px_rgba(255,255,255,0.3),inset_0_-6px_9px_rgba(0,0,0,0.8)] sm:h-14 sm:w-14"
                            style={{
                              background:
                                'radial-gradient(circle at 30% 24%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 20%), radial-gradient(circle at 68% 78%, rgba(245,48,3,0.55) 0%, rgba(245,48,3,0) 45%), radial-gradient(circle at 34% 30%, #786858 0%, #2c221d 55%, #050403 100%)',
                            }}
                          >
                            {ICONS[r.icon] || ICONS.users}
                          </span>
                          <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.2em] text-ember-600 dark:text-ember-300">
                            {r.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ambient dust at different depths */}
                {DUST.map((p, i) => (
                  <span
                    key={i}
                    className="animate-dust absolute rounded-full bg-star-100/60"
                    style={{
                      left: p.l,
                      top: p.t,
                      width: p.s,
                      height: p.s,
                      transform: `translateZ(${p.z}px)`,
                      animationDelay: `${p.d}s`,
                    }}
                  />
                ))}
              </div>

              {/* Core — pinned center, upright, floating */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="v2-orbit-core v2-orbit-billboard" data-base="translateZ(54px)" style={{ transform: `translateZ(54px) rotateX(-${TILT}deg)` }}>
                  <div className="animate-float-node relative">
                    <span
                      className="pointer-events-none absolute -inset-6 -z-10 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(245,48,3,0.30), transparent 65%)',
                      }}
                    />
                    <div className="animate-core-pulse relative flex h-24 w-24 flex-col items-center justify-center rounded-full bg-gradient-to-br from-ember-300 via-ember-500 to-ember-700 shadow-[0_0_50px_rgba(245,48,3,0.45)] sm:h-28 sm:w-28">
                      <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_6px_rgba(0,0,0,0.25)]" />
                      <img src="/logo.svg" alt={BRAND.name} className="h-8 w-8 sm:h-9 sm:w-9" />
                      <span className="mt-1 font-display text-[11px] tracking-wide text-space-950">
                        {ORG_CHART.core.title}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </div>
  )
}
