import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import { ABOUT, BRAND, ORG_CHART } from '../lib/content'
import SplitHeading from './SplitHeading'

gsap.registerPlugin(ScrollTrigger)

const TILT = 62 // degrees the orbital plane is pitched toward the viewer

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

// Medallion anchor points per ring — leadership sits on the inner ember
// ring (top/bottom), teams on the outer main ring (top/right/bottom/left).
const TEAM_POS = [
  'left-1/2 top-[4%] sm:top-[6%] -translate-x-1/2 -translate-y-1/2',
  'left-[82%] sm:left-[80%] top-1/2 -translate-x-1/2 -translate-y-1/2',
  'left-1/2 bottom-[4%] sm:bottom-[6%] -translate-x-1/2 translate-y-1/2',
  'left-[18%] sm:left-[20%] top-1/2 -translate-x-1/2 -translate-y-1/2',
]
const LEAD_POS = [
  'left-1/2 top-[20%] sm:top-[24%] -translate-x-1/2 -translate-y-1/2',
  'left-1/2 bottom-[20%] sm:bottom-[24%] -translate-x-1/2 translate-y-1/2',
]

// Per-node depth (billboard space) — nodes float above/below the plane
const TEAM_DEPTHS = [-30, 26, -24, 30]
const LEAD_DEPTHS = [44, 38]

// Tiny specks drifting at different depths on the orbital plane
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

export default function SpaceAbout() {
  const rootRef = useRef(null)
  const sceneRef = useRef(null)
  const orbitRef = useRef(null)
  const lenis = useLenis()
  const [grabbing, setGrabbing] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.v2-about-copy').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          }
        )
      })

      // Orbital system: the disc settles into its tilt as it fades in,
      // rings breathe in, the core pops, medallions cascade into orbit.
      const orbitTrig = { trigger: '.v2-orbit', start: 'top 85%', once: true }
      gsap.fromTo(
        '.v2-orbit-scene',
        { opacity: 0, rotationX: 74, scale: 0.94 },
        {
          opacity: 1,
          rotationX: TILT,
          scale: 1,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: orbitTrig,
        }
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
          { opacity: 0, scale: 0.5, y: 16 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            delay: 0.15 + i * 0.12,
            ease: 'power3.out',
            scrollTrigger: orbitTrig,
          }
        )
      })

      // Value strip below the orbit
      gsap.utils.toArray('.v2-about-value').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          }
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // Drag-to-rotate — grab the orbital system and spin it. Horizontal drags
  // turn it around Y, vertical drags tilt the disc (clamped so it never
  // goes edge-on). On release the spin carries on with momentum, then a
  // slow idle drift keeps the system alive. Disabled for reduced motion.
  useEffect(() => {
    const el = orbitRef.current
    const scene = sceneRef.current
    if (!el || !scene) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const DEG_PER_PX = 0.28
    const X_MIN = 15
    const X_MAX = 85
    const clampX = (v) => Math.min(X_MAX, Math.max(X_MIN, v))

    // Billboards (core + glow + medallions) counter-rotate against the LIVE
    // scene rotation every frame, so they always face the camera while
    // dragging. Queried from the container: the core/glow live OUTSIDE the
    // rotating scene so they stay pinned to the center of the system.
    const billboards = Array.from(el.querySelectorAll('.v2-orbit-billboard'))

    let dragging = false
    let lastX = 0
    let lastY = 0
    let lastT = 0
    let velX = 0 // rotationX velocity (deg/s)
    let velY = 0 // rotationY velocity (deg/s)
    let rotX = TILT
    let rotY = 0
    let raf = 0
    let prevT = performance.now()

    const apply = () => {
      gsap.set(scene, { rotationX: rotX, rotationY: rotY })
      // Counter-rotate every billboard so icons/text keep facing the camera.
      // Skip any billboard GSAP is still animating (e.g. the core's pop) so
      // we never clobber a reveal in progress.
      billboards.forEach((b) => {
        if (gsap.getTweensOf(b).length === 0) {
          b.style.transform = `translateZ(${b.dataset.depth}px) rotateX(${-rotX}deg) rotateY(${-rotY}deg)`
        }
      })
    }

    // Per-frame: momentum decay → idle drift. Skipped while the reveal
    // tween owns the scene transform (getTweensOf > 0).
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
      // If grabbed mid-reveal, lock the scene to its final state
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

  const handleCta = (e) => {
    e.preventDefault()
    if (lenis) {
      lenis.scrollTo('#contact', {
        offset: 0,
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="about" ref={rootRef} className="relative mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Narrative */}
        <div className="lg:col-span-5">
          <p className="v2-about-copy mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ember-600">
            {ABOUT.eyebrow}
          </p>
          <SplitHeading
            as="h2"
            text={`${ABOUT.heading} ${ABOUT.headingHighlight}`}
            accent={ABOUT.headingHighlight}
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-star-100 sm:text-5xl"
          />
          {ABOUT.paragraphs.map((p) => (
            <p key={p} className="v2-about-copy mt-5 leading-relaxed text-star-400">
              {p}
            </p>
          ))}
          <div className="v2-about-copy mt-9 flex flex-wrap gap-4">
            <button
              onClick={handleCta}
              className="v2-btn v2-btn-primary v2-btn-lg group"
            >
              {ABOUT.cta}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:translate-x-0 motion-reduce:transition-none"
              >→</span>
            </button>
            <a
              href={BRAND.calendly}
              target="_blank"
              rel="noreferrer"
              className="v2-btn v2-btn-ghost v2-btn-lg"
            >
              {ABOUT.ctaSecondary}
            </a>
          </div>
        </div>

        {/* 3D orbital system — the organizational chart orbits the Inovers
            core on a tilted plane: leadership on the inner ring, teams on
            the outer ring; medallions stand upright at different depths. */}
        <div className="flex items-center lg:col-span-7">
          <div
            ref={orbitRef}
            className={`v2-orbit relative mx-auto aspect-square w-full max-w-[560px] select-none ${
              grabbing ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{ perspective: '1100px', touchAction: 'pan-y' }}
          >
            {/* Ambient ember atmosphere behind the whole system — wrapped
                so its -inset-12 spread stays clipped to the orbit box
                (prevents mobile horizontal overflow without flattening
                the preserve-3d scene, which is a sibling). */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
              <div
                className="absolute -inset-12 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(245,48,3,0.09), transparent 62%)',
                }}
              />
            </div>
            {/* The whole system gently bobs (preserve-3d keeps the
                perspective chain intact through the animation) */}
            <div className="animate-scene-bob absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
              {/* The tilted disc (GSAP owns its transform) */}
              <div
                ref={sceneRef}
                className="v2-orbit-scene absolute inset-0 will-change-transform"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Outer boundary ring — farthest plane */}
                <div
                  className="absolute inset-[4%] rounded-full border border-star-300/20"
                  style={{ transform: 'translateZ(-40px)' }}
                />
                {/* Main orbit path — slowly rotating satellite */}
                <div className="v2-orbit-ring animate-orbit-spin absolute inset-[16%] rounded-full border border-star-300/40 sm:inset-[22%]">
                  <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-300 shadow-[0_0_12px_rgba(245,48,3,0.95)]" />
                  <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-500/25 blur-[3px]" />
                </div>
                {/* Ember dashed ring — counter-rotating, slightly raised */}
                <div className="absolute inset-0" style={{ transform: 'translateZ(14px)' }}>
                  <div className="animate-orbit-spin-rev absolute inset-[24%] rounded-full border border-dashed border-ember-500/25 sm:inset-[30%]" />
                </div>
                {/* Inner ember ring — nearest plane */}
                <div
                  className="v2-orbit-ring absolute inset-[32%] rounded-full border border-ember-500/25 sm:inset-[38%]"
                  style={{ transform: 'translateZ(24px)' }}
                />

                {/* Organizational chart medallions — billboarded, floating
                    at varied depths. Teams (outer ring) first, leadership
                    (inner ring) second. The wrapper carries preserve-3d so
                    the billboard's rotateX keeps its depth instead of being
                    flattened onto the disc. */}
                {ORG_CHART.rings.map((ring, ri) => {
                  const isLeader = ri === 0
                  const pos = isLeader ? LEAD_POS : TEAM_POS
                  const depths = isLeader ? LEAD_DEPTHS : TEAM_DEPTHS
                  const medallion = isLeader ? 'h-14 w-14 sm:h-16 sm:w-16' : 'h-12 w-12 sm:h-14 sm:w-14'
                  return ring.roles.map((r, i) => (
                    <div
                      key={r.id}
                      className={`absolute ${pos[i]}`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* GSAP reveal target — a plain div with NO positioning,
                          so the cascade tween can't nullify the translate on
                          the anchor wrapper above (translate: none bug). */}
                      <div className="v2-orbit-node">
                        <div
                          className="v2-orbit-billboard"
                          data-depth={depths[i]}
                          style={{ transform: `translateZ(${depths[i]}px) rotateX(-${TILT}deg)` }}
                        >
                          <div
                            className="animate-float-node flex flex-col items-center gap-2"
                            style={{ animationDelay: `${(ri * 4 + i) * 1.3}s` }}
                            title={r.description}
                          >
                            <span className={`flex ${medallion} items-center justify-center rounded-full border border-ember-500/40 bg-space-900/90 text-ember-600 shadow-[0_0_25px_rgba(245,48,3,0.25),inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-2px_6px_rgba(0,0,0,0.35)] dark:text-ember-300`}>
                              {ICONS[r.icon] || ICONS.users}
                            </span>
                            <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.2em] text-star-300">
                              {r.title}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                })}

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

              {/* Core + glow — deliberately OUTSIDE the rotating disc so the
                  core stays pinned to the exact center of the system while
                  the rings and medallions orbit around it. It shares the
                  medallions' behaviour: billboarded per-frame by the drag
                  loop (always faces the camera) and floating on the same
                  float cycle — only its anchor differs: the middle.

                  IMPORTANT: the centering lives on THIS static wrapper.
                  GSAP's pop tween targets the billboard inside and nullifies
                  the CSS translate property (translate: none), which would
                  destroy Tailwind's -translate-x/y-1/2 centering — so the
                  anchor must never sit on a GSAP-touched element. */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  className="v2-orbit-core v2-orbit-billboard"
                  data-depth="54"
                  style={{ transform: `translateZ(54px) rotateX(-${TILT}deg)` }}
                >
                  <div className="animate-float-node relative">
                    {/* Glow hugging the orb — floats with it */}
                    <span
                      className="pointer-events-none absolute -inset-6 -z-10 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(245,48,3,0.30), transparent 65%)',
                      }}
                    />
                    <div className="animate-core-pulse relative flex h-24 w-24 flex-col items-center justify-center rounded-full bg-gradient-to-br from-ember-300 via-ember-500 to-ember-700 shadow-[0_0_50px_rgba(245,48,3,0.45)] sm:h-28 sm:w-28">
                      {/* Rim highlight for physical edge refraction */}
                      <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_6px_rgba(0,0,0,0.25)]" />
                      <img src="/logo.svg" alt="Inovers" className="h-8 w-8 sm:h-9 sm:w-9" />
                      <span className="mt-1 font-display text-[11px] tracking-wide text-space-950">
                        Inovers
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Value strip — full descriptions, clean editorial rows */}
      <div className="mt-20 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {ABOUT.values.map((v) => (
          <div key={v.id} className="v2-about-value border-t border-star-300/30 pt-6">
            <h3 className="font-display text-xl font-semibold tracking-tight text-star-100">{v.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-star-400">{v.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
