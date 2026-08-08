import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import { ABOUT, BRAND, ORG_CHART } from '../lib/content'
import SplitHeading from './SplitHeading'

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

export default function SpaceAbout() {
  const rootRef = useRef(null)
  const lenis = useLenis()

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

      // Orbital system: the disc settles in, rings breathe in, the core
      // pops, satellites cascade into orbit.
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
            <button onClick={handleCta} className="v2-btn v2-btn-primary v2-btn-lg group">
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

        {/* 3D orbital system — the organizational chart as orbiting
            satellites: teams on the outer ring, leadership on the inner
            ring, the Inovers core at the center. Pure CSS 3D motion. */}
        <div className="flex items-center lg:col-span-7">
          <div className="v2-orbit relative mx-auto aspect-square w-full max-w-[560px]" style={{ perspective: '1100px' }}>
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
                className="v2-orbit-scene absolute inset-0 will-change-transform"
                style={{ transform: `rotateX(${TILT}deg)`, transformStyle: 'preserve-3d' }}
              >
                {/* Outer boundary ring — thick 3D hoop on the farthest
                    plane (3 tube layers at different depths) */}
                <div
                  className="v2-orbit-ring absolute inset-[4%]"
                  style={{ transform: 'translateZ(-40px)', transformStyle: 'preserve-3d' }}
                >
                  <div className="absolute inset-0 rounded-full border border-star-300/15" style={{ transform: 'translateZ(-6px) scale(0.98)' }} />
                  <div className="absolute inset-0 rounded-full border border-star-300/30" style={{ transform: 'translateZ(0) scale(1)' }} />
                  <div className="absolute inset-0 rounded-full border border-star-300/20" style={{ transform: 'translateZ(6px) scale(1.02)' }} />
                </div>

                {/* Main orbit — teams ring, rotating; a 3D tube with
                    Saturn-style shading. Carries the team satellites with
                    counter-spun icons so they stay upright. */}
                <div className="v2-orbit-ring oc-ring-a absolute inset-[15%]" style={{ transformStyle: 'preserve-3d' }}>
                  {/* tube back */}
                  <div className="absolute inset-0 rounded-full border border-star-300/25" style={{ transform: 'translateZ(-7px) scale(0.993)' }} />
                  {/* tube mid */}
                  <div className="absolute inset-0 rounded-full border border-star-300/50" style={{ transform: 'translateZ(0)' }} />
                  {/* Saturn-style shaded band — gives the ring volume */}
                  <div className="ring-shade pointer-events-none absolute inset-0 rounded-full" style={{ transform: 'translateZ(0)' }} />
                  {/* tube front */}
                  <div className="absolute inset-0 rounded-full border border-star-300/35" style={{ transform: 'translateZ(7px) scale(1.007)' }} />
                  {ORG_CHART.rings[1].roles.map((r, i) => (
                    <div
                      key={r.id}
                      className="absolute left-1/2 top-1/2"
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
                    with a beacon dot; tube depth via 2 layers */}
                <div className="v2-orbit-ring oc-ring-b absolute inset-[33%]" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute inset-0 rounded-full border border-dashed border-ember-500/20" style={{ transform: 'translateZ(-4px) scale(0.997)' }} />
                  <div className="absolute inset-0 rounded-full border border-dashed border-ember-500/35" style={{ transform: 'translateZ(0)' }} />
                  <div className="absolute inset-0 rounded-full border border-dashed border-ember-500/25" style={{ transform: 'translateZ(4px) scale(1.003)' }} />
                  <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-500/80 shadow-[0_0_12px_rgba(245,48,3,0.9)]" />
                  {ORG_CHART.rings[0].roles.map((r, i) => (
                    <div
                      key={r.id}
                      className="absolute left-1/2 top-1/2"
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
                <div className="v2-orbit-core" style={{ transform: `translateZ(54px) rotateX(-${TILT}deg)` }}>
                  <div className="animate-float-node relative">
                    <span
                      className="pointer-events-none absolute -inset-6 -z-10 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(245,48,3,0.30), transparent 65%)',
                      }}
                    />
                    <div className="animate-core-pulse relative flex h-24 w-24 flex-col items-center justify-center rounded-full bg-gradient-to-br from-ember-300 via-ember-500 to-ember-700 shadow-[0_0_50px_rgba(245,48,3,0.45)] sm:h-28 sm:w-28">
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
