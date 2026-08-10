import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CREW, CREW_PAGE, DEPARTMENTS } from '../lib/content'
import CrewCard from '../components/CrewCard'
import OrbitalBand from '../components/OrbitalBand'
import PageHero from '../components/PageHero'
import MissionCTA from '../components/MissionCTA'

gsap.registerPlugin(ScrollTrigger)

// ─── /crew — the people flying the missions ───
// Architecturally a twin of /projects: PageHero → filterable card grid →
// MissionCTA, plus the orbital org chart relocated out of the home About
// section as the page's opening visual.
//
// The filter mechanics below (sliding chip indicator + FLIP height morph +
// shrink-out-then-swap + entrance stagger) are deliberately DUPLICATED from
// ProjectsPage rather than extracted into a shared hook. Plan §4 left that
// as a judgment call; /projects had its card entrance retuned as recently
// as f19f892, so coupling the two pages through one hook would put an
// actively-tuned page at risk for no user-visible gain. If a third filter
// grid ever appears, extract then — with three call sites the shape is
// actually known.
//
// One thing that is NOT shared: the card class. /projects animates
// '.mission-card' through bare (unscoped) gsap selectors, so this page uses
// '.crew-card' — a shared class name would make each page's filter tween
// reach into the other's DOM.
export default function CrewPage() {
  const rootRef = useRef(null)
  const [activeFilter, setActiveFilter] = useState(CREW_PAGE.allLabel)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const filtered = useMemo(
    () =>
      activeFilter === CREW_PAGE.allLabel
        ? CREW
        : CREW.filter((m) => m.department === activeFilter),
    [activeFilter]
  )

  // ── Smooth height morph on filter change (FLIP-style) ──
  const contentInnerRef = useRef(null)
  const [wrapperHeight, setWrapperHeight] = useState('auto')
  const [useHeightTransition, setUseHeightTransition] = useState(false)
  const prevHeightRef = useRef(0)
  const firstMountRef = useRef(true)

  useLayoutEffect(() => {
    const inner = contentInnerRef.current
    if (!inner) return
    const newHeight = inner.scrollHeight

    if (firstMountRef.current) {
      firstMountRef.current = false
      prevHeightRef.current = newHeight
      setWrapperHeight(newHeight)
      return
    }

    const oldHeight = prevHeightRef.current || newHeight
    if (newHeight === oldHeight) return

    setUseHeightTransition(false)
    setWrapperHeight(oldHeight)

    requestAnimationFrame(() => {
      setUseHeightTransition(true)
      setWrapperHeight(newHeight)
      prevHeightRef.current = newHeight
    })
  }, [activeFilter])

  // Resize: the wrapper's height is pinned to a measured pixel value (see
  // above), so a viewport-width change that reflows the grid to a different
  // column count leaves `overflow: hidden` clipping the new rows until the
  // next filter click. Snap to the new measured height immediately.
  useEffect(() => {
    const remeasure = () => {
      const inner = contentInnerRef.current
      if (!inner) return
      const newHeight = inner.scrollHeight
      setUseHeightTransition(false)
      setWrapperHeight(newHeight)
      prevHeightRef.current = newHeight
    }
    window.addEventListener('resize', remeasure)
    return () => window.removeEventListener('resize', remeasure)
  }, [])

  // Entrance reveal — each card grows into place (0.88 → 1) and fades in as
  // it scrolls from the viewport bottom edge to 55% height, scrubbed to
  // scroll. Inside a gsap.context bound to rootRef, so every ScrollTrigger
  // it creates is reverted when the route unmounts.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.crew-card').forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.88, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'top 55%',
              scrub: 0.5,
            },
          }
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // Replay the entrance whenever the filter changes. useLayoutEffect so the
  // "from" state is set before the browser paints. Scoped to rootRef — no
  // ScrollTriggers created here, so nothing to clean up beyond the tween.
  useLayoutEffect(() => {
    if (!rootRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo(
      gsap.utils.toArray('.crew-card', rootRef.current),
      { opacity: 0, scale: 0.94 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.04,
        ease: 'power2.out',
        overwrite: 'auto',
      }
    )
  }, [activeFilter])

  // Filter clicks shrink the OUTGOING cards first, then swap.
  const handleFilterChange = (dept) => {
    if (dept === activeFilter || isTransitioning) return
    setIsTransitioning(true)
    gsap.to(gsap.utils.toArray('.crew-card', rootRef.current), {
      opacity: 0,
      y: -28,
      scale: 0.82,
      rotateZ: -2,
      duration: 0.38,
      stagger: 0.025,
      ease: 'power2.in',
      overwrite: 'auto',
      onComplete: () => {
        setActiveFilter(dept)
        setIsTransitioning(false)
      },
    })
  }

  // ── Sliding active-filter indicator ──
  const chipRefs = useRef({})
  const [indicator, setIndicator] = useState({ x: 0, y: 0, width: 0, height: 0, ready: false })

  useLayoutEffect(() => {
    const measure = () => {
      const chip = chipRefs.current[activeFilter]
      if (!chip) return
      setIndicator({
        x: chip.offsetLeft,
        y: chip.offsetTop,
        width: chip.offsetWidth,
        height: chip.offsetHeight,
        ready: true,
      })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [activeFilter])

  // Content honesty: while ANY entry is still a placeholder the whole set
  // is announced as a sample. One banner for the grid rather than a badge
  // stamped on all ten identical cards. Flipping every `demo` to false in
  // content.js is what takes it down (see CREW in lib/content).
  const isDemo = CREW.some((m) => m.demo)

  return (
    <div ref={rootRef}>
      <PageHero
        eyebrow={CREW_PAGE.eyebrow}
        heading={CREW_PAGE.heading}
        accent={CREW_PAGE.headingAccent}
        lede={CREW_PAGE.lede}
      />

      <OrbitalBand />

      <section className="relative mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        {isDemo ? (
          <p className="glass mb-6 w-fit rounded-full px-5 py-2 text-xs font-medium text-ember-500">
            {CREW_PAGE.demoRibbon}
          </p>
        ) : null}

        {/* ── Department chips + headcount pill, one wrap row (same layout
               contract as the /projects filter bar) ── */}
        <div
          className="relative mb-10 flex flex-wrap items-center gap-2"
          role="group"
          aria-label={CREW_PAGE.filterLabel}
        >
          <span
            aria-hidden="true"
            className="mission-chip-indicator"
            style={{
              transform: `translate3d(${indicator.x}px, ${indicator.y}px, 0)`,
              width: indicator.width,
              height: indicator.height,
              opacity: indicator.ready ? 1 : 0,
            }}
          />
          {[CREW_PAGE.allLabel, ...DEPARTMENTS].map((dept) => (
            <button
              key={dept}
              ref={(el) => {
                chipRefs.current[dept] = el
              }}
              type="button"
              onClick={() => handleFilterChange(dept)}
              className={`mission-chip relative z-10 ${activeFilter === dept ? 'mission-chip-active' : ''}`}
              aria-pressed={activeFilter === dept}
            >
              {dept}
            </button>
          ))}
          <span className="ml-auto inline-flex items-center rounded-full border border-star-300/25 bg-white/40 px-3.5 py-1.5 text-xs font-medium text-star-400 backdrop-blur-sm dark:bg-white/5">
            {filtered.length} of {CREW.length} {CREW_PAGE.counterNoun}
            {activeFilter !== CREW_PAGE.allLabel ? ` · ${activeFilter}` : ''}
          </span>
        </div>

        {/* ── The grid — wrapper morphs its height between filter states
               instead of snapping (see the layout effect above) ── */}
        <div
          style={{
            height: wrapperHeight,
            overflow: 'hidden',
            transition: useHeightTransition ? 'height 0.7s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          }}
        >
          <div ref={contentInnerRef}>
            {filtered.length ? (
              <div key={activeFilter}>
                {/* Compact profile cards, centered wrap — the
                    dorydelivery.com/about layout (Mat's call 2026-08-10) */}
                <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
                  {filtered.map((m) => (
                    <CrewCard key={m.id} member={m} />
                  ))}
                </div>
              </div>
            ) : (
              <div
                key={activeFilter}
                className="rounded-2xl border border-dashed border-star-300/25 p-10 text-center text-sm text-star-500"
              >
                {CREW_PAGE.emptyState}
              </div>
            )}
          </div>
        </div>
      </section>

      <MissionCTA
        heading={CREW_PAGE.cta.heading}
        accent={CREW_PAGE.cta.accent}
        sub={CREW_PAGE.cta.sub}
        secondary={CREW_PAGE.cta.secondary}
      />
    </div>
  )
}
