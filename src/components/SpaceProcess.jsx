import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROCESS } from '../lib/content'
import SplitHeading from './SplitHeading'
import Ufo2D from './Ufo2D'

gsap.registerPlugin(ScrollTrigger)

// ─── Flight Plan (Process) ───
// Desktop / iPad (≥768px): the horizontal 4-waypoint layout with the
// scroll-scrubbed UFO — unchanged.
// Mobile portrait (<768px): a vertical serpentine journey inside a tall
// phone-shaped frame — the saucer is scrubbed along an SVG S-curve by
// scroll, node-by-node, top to bottom.
//
// Breakpoint note: 768px means iPad portrait (768–834px wide) keeps the
// desktop layout, matching "keep the current design on Desktop/iPads".

// Mobile serpentine geometry (viewBox 300×700) — the path passes through
// the four node anchors exactly, so the numbered circles sit ON the curve:
//   N1 (40,150) upper-left · N2 (260,280) mid-right
//   N3 (40,430) lower-left · N4 (150,600) bottom-center
// The N3→N4 leg hugs the left rail until it is BELOW the step-4 text
// block, then dives right into the bottom-center node — the curve never
// slices through the "Launch & Grow" copy.
//
// HAND-TUNED S-curve (Mat's call 2026-08-11 — Catmull-Rom through the
// zigzag polyline still read as bent wire). Design grammar of a classic
// elegant S:
//  - VERTICAL tangents at N1/N2/N3 — the S passes each node flowing
//    straight down (the inflection signature), no diagonal slams.
//  - Each bulge is TWO joined Beziers (control tangents matched at the
//    joins) so the arcs are round domes, not tall parabolas.
//  - The left rail rides x=30 and the final dive starts below the
//    step-4 text (y > 550), hugging the frame edge like before.
// Node anchors unchanged — the numbered circles still sit exactly on
// the path at (40,150), (260,280), (40,430), (150,600).
const MOBILE_PATH_D =
  'M 40 40 C 40 95, 40 95, 40 150 C 40 205, 105 212, 170 228 C 215 240, 260 252, 260 280 C 260 310, 225 345, 170 370 C 120 395, 70 415, 40 430 C 33 455, 30 490, 30 525 C 30 550, 45 575, 75 590 C 105 598, 130 600, 150 600'
const MOBILE_VIEW_W = 300
const MOBILE_VIEW_H = 700

export default function SpaceProcess() {
  const rootRef = useRef(null)
  const pathRef = useRef(null) // desktop (horizontal flight)
  const ufoRef = useRef(null) // desktop (horizontal flight)
  const mobileFrameRef = useRef(null)
  const mobileSvgRef = useRef(null)
  const mobilePathRef = useRef(null)
  const mobileUfoRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Node reveal — simple fade-up stagger (decluttered vs the old
      // alternating fly-in). Covers both layouts. Each node also counts
      // its step number up (00 → 04) as it appears — Mat's call
      // 2026-08-11 ("number animation" in How we work, same as the
      // stats band).
      const countUpNum = (el) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const target = parseInt(el.textContent, 10) || 0
        const obj = { v: 0 }
        el.textContent = '00' // swap before the fade reveals it
        gsap.to(obj, {
          v: target,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v)).padStart(2, '0')
          },
        })
      }

      gsap.utils.toArray('.v2-process-item, .v2-process-item-m').forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'power3.out',
            onStart: () => {
              const num = item.querySelector('.v2-process-num')
              if (num) countUpNum(num)
            },
            scrollTrigger: { trigger: item, start: 'top 90%', once: true },
          }
        )
      })

      // ── Reduced motion ──
      // No scrubs anywhere. The mobile saucer is PARKED at the final
      // node (the journey reads as complete — path fully drawn, saucer
      // landed), and the desktop saucer stays hidden by its
      // motion-reduce:hidden class. This must run BEFORE the scrub
      // setup: the old early-return skipped it entirely and left the
      // mobile saucer stranded at the frame's origin.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const svg = mobileSvgRef.current
        const path = mobilePathRef.current
        const ufo = mobileUfoRef.current
        if (svg && path && ufo) {
          const total = path.getTotalLength()
          const pt = path.getPointAtLength(total)
          const box = svg.getBoundingClientRect()
          const sx = box.width / MOBILE_VIEW_W
          const sy = box.height / MOBILE_VIEW_H
          ufo.style.transform = `translate3d(${pt.x * sx}px, ${pt.y * sy}px, 0)`
        }
        return
      }

      const mm = gsap.matchMedia()

      // ── Desktop / iPad (≥768px) — horizontal route, unchanged ──
      mm.add('(min-width: 768px)', () => {
        const ufo = ufoRef.current
        const path = pathRef.current
        if (!ufo || !path) return
        const dist = path.offsetWidth * 0.84
        let lastProgress = 0
        gsap.fromTo(
          ufo,
          { x: 0, rotation: -12 },
          {
            x: dist,
            rotation: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: path,
              start: 'top 82%',
              end: 'bottom 62%',
              scrub: 1,
              onUpdate: (self) => {
                // flip the comet wake to trail the motion direction
                const dir = self.progress >= lastProgress ? 1 : -1
                lastProgress = self.progress
                const trail = ufo.querySelector('.ufo-path-trail')
                if (trail) trail.style.transform = dir === 1 ? '' : 'scaleX(-1)'
              },
            },
          }
        )
      })

      // ── Mobile portrait (<768px) — vertical serpentine ──
      mm.add('(max-width: 767.98px)', () => {
        const frame = mobileFrameRef.current
        const svg = mobileSvgRef.current
        const path = mobilePathRef.current
        const ufo = mobileUfoRef.current
        if (!frame || !svg || !path || !ufo) return

        const total = path.getTotalLength()

        // Drive the saucer along the curve. Position comes from
        // getPointAtLength in viewBox units scaled to the rendered frame.
        //
        // Rotation is NOT the raw path tangent — the serpentine's overall
        // travel is mostly vertical, so following the tangent literally
        // would spin the saucer up to ~90° through the steep stretches
        // (the disc silhouette turning edge-on, which reads as broken,
        // not "flying"). Instead the saucer keeps its proper flying
        // stance (disc level, dome up) and only banks gently left/right
        // off that stance based on which way the curve is sweeping —
        // the same small-tilt language the desktop route uses
        // (-12°→8°), clamped here to ±MAX_BANK so it never tips past a
        // believable bank angle.
        const MAX_BANK = 22
        const placeUfo = (progress) => {
          const clamped = Math.min(1, Math.max(0, progress))
          const pt = path.getPointAtLength(clamped * total)
          const box = svg.getBoundingClientRect()
          const sx = box.width / MOBILE_VIEW_W
          const sy = box.height / MOBILE_VIEW_H
          const x = pt.x * sx
          const y = pt.y * sy
          const pt2 = path.getPointAtLength(Math.min(1, clamped + 0.01) * total)
          const dx = pt2.x - pt.x
          const dy = pt2.y - pt.y
          // Angle of travel measured FROM "straight down" (the route's
          // dominant direction) rather than from "straight right" — 0°
          // here means "descending levelly", not "pointing down".
          const angleFromDown = (Math.atan2(dx, dy) * 180) / Math.PI
          const bank = Math.max(-MAX_BANK, Math.min(MAX_BANK, angleFromDown))
          ufo.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${bank}deg)`
        }

        gsap.to({}, {
          ease: 'none',
          scrollTrigger: {
            trigger: frame,
            start: 'top 80%',
            end: 'bottom 55%',
            scrub: 1,
            onUpdate: (self) => placeUfo(self.progress),
          },
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // Mobile node placement — positions match the path anchors in the
  // viewBox (percentages of the frame). Text sits beside each node,
  // alternating sides; the bottom node centers above the saucer's end.
  const MOBILE_NODES = [
    { circle: 'left-[13%] top-[21%]', text: 'left-[27%] top-[21%] w-[61%] text-left' },
    { circle: 'left-[87%] top-[40%]', text: 'left-[12%] top-[40%] w-[61%] text-left' },
    { circle: 'left-[13%] top-[61%]', text: 'left-[27%] top-[61%] w-[61%] text-left' },
    { circle: 'left-1/2 top-[86%]', text: 'left-1/2 top-[74%] w-[80%] -translate-x-1/2 text-center' },
  ]

  return (
    <section id="process" ref={rootRef} className="relative mx-auto max-w-6xl px-6 py-24 lg:px-10">
      <div className="mb-16 max-w-2xl">
        <p data-parallax="-0.1" className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ember-600">Process</p>
        <SplitHeading
          as="h2"
          text="Our flight plan"
          accent="flight"
          className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-star-100 sm:text-5xl"
        />
        <p className="mt-4 text-sm leading-relaxed text-star-400">
          Four waypoints, one takeoff — follow the saucer as it flies the route from first
          call to launch.
        </p>
      </div>

      {/* ── Desktop / iPad (≥768px): horizontal route — untouched ── */}
      <div className="hidden md:block">
        <div ref={pathRef} className="relative">
          {/* Flight path — horizontal */}
          <div className="flight-path-line absolute left-0 right-0 top-[26px] h-px" />

          {/* UFO — scrubbed along the path. Hidden for reduced motion. */}
          <div className="absolute left-0 top-[26px] z-10 motion-reduce:hidden" style={{ height: 0 }}>
            <div ref={ufoRef} className="relative inline-block -translate-x-1/2 -translate-y-1/2">
              <Ufo2D variant="path" size={72} />
            </div>
          </div>

          <div className="relative grid grid-cols-4 gap-6">
            {PROCESS.map((p) => (
              <div key={p.step} className="v2-process-item flex flex-col items-center gap-4 text-center">
                <span className="v2-process-num flight-node-num z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-ember-500/50 bg-space-900 text-sm font-semibold text-ember-600 dark:text-ember-300">
                  {p.step}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-star-100">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-star-400">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile portrait (<768px): vertical serpentine in a tall
             phone-shaped frame ── */}
      <div className="md:hidden">
        <div
          ref={mobileFrameRef}
          className="relative mx-auto w-full max-w-[360px] overflow-hidden rounded-[2.5rem] border border-star-300/25 bg-white/30 shadow-[0_20px_60px_rgba(17,17,17,0.08)] dark:bg-white/[0.03]"
          style={{ aspectRatio: `${MOBILE_VIEW_W} / ${MOBILE_VIEW_H}` }}
        >
          {/* The S-curve — ember gradient, flowing dashes */}
          <svg
            ref={mobileSvgRef}
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${MOBILE_VIEW_W} ${MOBILE_VIEW_H}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="fp-mobile-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(245,48,3,0.15)" />
                <stop offset="45%" stopColor="rgba(245,48,3,0.7)" />
                <stop offset="100%" stopColor="rgba(245,48,3,0.15)" />
              </linearGradient>
              <filter id="fp-mobile-blur" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.2" />
              </filter>
            </defs>

            {/* Depth pass — a soft blurred duplicate sitting slightly
                below-right of the real line, the classic elevated-tube
                shading trick: it reads as the route casting a shadow /
                glow rather than sitting flat on the card. */}
            <path
              d={MOBILE_PATH_D}
              fill="none"
              stroke="rgba(180,40,10,0.4)"
              strokeWidth="7"
              strokeLinecap="round"
              filter="url(#fp-mobile-blur)"
              transform="translate(1.5, 3)"
            />

            {/* the route itself — flowing dashes on top of the shadow pass */}
            <path
              ref={mobilePathRef}
              d={MOBILE_PATH_D}
              fill="none"
              stroke="url(#fp-mobile-grad)"
              strokeWidth="4"
              strokeLinecap="round"
              className="flight-path-dashes"
            />

            {/* Highlight pass — a thin bright stroke offset toward the
                light (up-left), giving the ribbon a rounded, lit-from-
                above edge instead of a flat 2D line. */}
            <path
              d={MOBILE_PATH_D}
              fill="none"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1.1"
              strokeLinecap="round"
              transform="translate(-1, -1.2)"
              opacity="0.7"
            />
          </svg>

          {/* the saucer — scrubbed along the curve (parked at the end
              node under reduced motion) */}
          <div
            ref={mobileUfoRef}
            className="absolute left-0 top-0 z-10"
            style={{ width: 0, height: 0 }}
          >
            <div className="relative inline-block -translate-x-1/2 -translate-y-1/2">
              <Ufo2D variant="path" size={64} />
            </div>
          </div>

          {/* waypoints — numbered nodes sitting on the curve, copy beside */}
          {PROCESS.map((p, i) => {
            const pos = MOBILE_NODES[i]
            return (
              <div key={p.step} className="v2-process-item-m pointer-events-none absolute inset-0 z-10">
                <span
                  className={`v2-process-num flight-node-num absolute z-10 flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ember-500/50 bg-space-900 text-sm font-semibold text-ember-600 dark:text-ember-300 ${pos.circle}`}
                >
                  {p.step}
                </span>
                <div className={`absolute -translate-y-1/2 ${pos.text}`}>
                  <h3 className="font-display text-base font-semibold tracking-tight text-star-100">{p.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-star-400">{p.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
