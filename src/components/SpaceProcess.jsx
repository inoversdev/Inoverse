import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROCESS } from '../lib/content'
import SplitHeading from './SplitHeading'
import Ufo2D from './Ufo2D'

gsap.registerPlugin(ScrollTrigger)

export default function SpaceProcess() {
  const rootRef = useRef(null)
  const pathRef = useRef(null)
  const ufoRef = useRef(null) // desktop (horizontal flight)
  const ufoRefM = useRef(null) // mobile (vertical flight)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Node reveal — simple fade-up stagger (decluttered vs the old
      // alternating fly-in).
      gsap.utils.toArray('.v2-process-item').forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 90%', once: true },
          }
        )
      })

      // UFO takeoff — scrubbed by scroll along the flight path.
      // Desktop: flies left → right along the horizontal line.
      // Mobile: climbs bottom → top along the vertical line.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const mm = gsap.matchMedia()
      mm.add('(min-width: 640px)', () => {
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
      mm.add('(max-width: 639px)', () => {
        const ufo = ufoRefM.current
        const path = pathRef.current
        if (!ufo || !path) return
        const dist = path.offsetHeight - 52
        let lastProgress = 0
        gsap.fromTo(
          ufo,
          { y: dist, rotation: -10 },
          {
            y: 0,
            rotation: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: path,
              start: 'top 82%',
              end: 'bottom 62%',
              scrub: 1,
              onUpdate: (self) => {
                // mobile: wake points down while climbing, up while descending
                const dir = self.progress >= lastProgress ? 1 : -1
                lastProgress = self.progress
                const trail = ufo.querySelector('.ufo-path-trail')
                if (trail) trail.style.transform = `rotate(${dir === 1 ? -90 : 90}deg)`
              },
            },
          }
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="process" ref={rootRef} className="relative mx-auto max-w-6xl px-6 py-28 lg:px-10">
      <div className="mb-16 max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ember-600">Process</p>
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

      <div ref={pathRef} className="relative">
        {/* Flight path — horizontal on desktop, vertical on mobile */}
        <div className="flight-path-line absolute left-0 right-0 top-[26px] hidden h-px sm:block" />
        <div className="flight-path-line absolute bottom-0 left-[26px] top-0 w-px sm:hidden" />

        {/* UFO — scrubbed along the path. Hidden for reduced motion. */}
        <div className="absolute left-0 top-[26px] z-10 hidden motion-reduce:hidden sm:block" style={{ height: 0 }}>
          <div ref={ufoRef} className="relative inline-block -translate-x-1/2 -translate-y-1/2">
            <Ufo2D variant="path" size={72} />
          </div>
        </div>
        <div className="absolute left-[26px] top-0 z-10 motion-reduce:hidden sm:hidden" style={{ width: 0 }}>
          <div ref={ufoRefM} className="relative inline-block -translate-x-1/2 -translate-y-1/2">
            <Ufo2D variant="path" size={72} />
          </div>
        </div>

        <div className="relative grid gap-10 sm:grid-cols-4 sm:gap-6">
          {PROCESS.map((p) => (
            <div key={p.step} className="v2-process-item flex flex-col gap-4 sm:items-center sm:text-center">
              <span className="flight-node-num z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-ember-500/50 bg-space-900 text-sm font-semibold text-ember-600 dark:text-ember-300">
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
    </section>
  )
}
