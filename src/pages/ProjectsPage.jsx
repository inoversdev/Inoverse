import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { INDUSTRIES, PROJECTS, PROJECTS_PAGE } from '../lib/content'
import MissionCard from '../components/MissionCard'
import PageHero from '../components/PageHero'
import MissionCTA from '../components/MissionCTA'

gsap.registerPlugin(ScrollTrigger)

// ─── /projects — the full mission manifest ───
// All projects, industry filter chips (the taxonomy moved here from the
// home showcase), the 3-part filter animation (sliding chip indicator +
// FLIP height morph + card shrink-out), and a closing Book a Call band.
export default function ProjectsPage() {
  const rootRef = useRef(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const [isTransitioning, setIsTransitioning] = useState(false)

  const filtered = useMemo(
    () =>
      activeFilter === 'All'
        ? PROJECTS
        : PROJECTS.filter((p) => p.industry === activeFilter),
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

  // Resize: the wrapper's height is pinned to a measured pixel value
  // (see above), so a viewport-width change that reflows the grid to a
  // different column count — e.g. lg:grid-cols-3 → sm:grid-cols-2 on
  // resize, more rows, more height — leaves the wrapper's `overflow:
  // hidden` clipping the new rows until the next filter click. Snap it
  // to the new measured height immediately, no transition.
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

  // Entrance reveal — scale-in with blur: each card grows 0.9→1 and
  // sharpens (blur 8px→0) as it scrolls from the viewport bottom edge
  // to 55% height, scrubbed to scroll (reverses buttery-smooth).
  // Re-runs on filter changes: ctx.revert() kills the old per-card
  // triggers (no leak), fresh ones are created for the remounted grid.
  // The height morph re-measures after settling (750ms ≈ 0.7s morph).
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.mission-card').forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.9, opacity: 0, filter: 'blur(8px)' },
          {
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
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
    const t = setTimeout(() => ScrollTrigger.refresh(), 750)
    return () => {
      clearTimeout(t)
      ctx.revert()
    }
  }, [activeFilter])

  // (Filter-change replay is handled by the reveal effect above — it
  // re-runs on activeFilter, so the previous mount-time fromTo replay
  // was removed: it fought the reveal tweens for opacity and left
  // cards stuck at 0 after scrolling (the "invisible cards" bug).)

  // Filter clicks shrink the OUTGOING cards first, then swap.
  const handleFilterChange = (cat) => {
    if (cat === activeFilter || isTransitioning) return
    setIsTransitioning(true)
    gsap.to('.mission-card', {
      opacity: 0,
      y: -28,
      scale: 0.82,
      rotateZ: -2,
      duration: 0.38,
      stagger: 0.025,
      ease: 'power2.in',
      overwrite: 'auto',
      onComplete: () => {
        setActiveFilter(cat)
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

  return (
    <div ref={rootRef}>
      <PageHero
        eyebrow={PROJECTS_PAGE.eyebrow}
        heading={PROJECTS_PAGE.heading}
        accent={PROJECTS_PAGE.headingAccent}
        lede={PROJECTS_PAGE.lede}
      />

      <section className="relative mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        {/* ── Mission counter — same row as the filter buttons (Mat's
               preference). Chips + pill share one wrap row; the pill
               ml-auto's right and drops to its own line only when the
               chips genuinely fill the width (tablet). ── */}
        <div
          className="relative mb-10 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter projects by industry"
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
          {['All', ...INDUSTRIES].map((cat) => (
            <button
              key={cat}
              ref={(el) => {
                chipRefs.current[cat] = el
              }}
              type="button"
              onClick={() => handleFilterChange(cat)}
              className={`mission-chip relative z-10 ${activeFilter === cat ? 'mission-chip-active' : ''}`}
              aria-pressed={activeFilter === cat}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto inline-flex items-center rounded-full border border-star-300/25 bg-white/40 px-3.5 py-1.5 text-xs font-medium text-star-400 backdrop-blur-sm dark:bg-white/5">
            {filtered.length} of {PROJECTS.length} missions
            {activeFilter !== 'All' ? ` · ${activeFilter}` : ''}
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
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((p) => (
                    <MissionCard key={p.id} project={p} />
                  ))}
                </div>
              </div>
            ) : (
              <div key={activeFilter} className="rounded-2xl border border-dashed border-star-300/25 p-10 text-center text-sm text-star-500">
                No missions in this category yet.
              </div>
            )}
          </div>
        </div>
      </section>

      <MissionCTA
        heading={PROJECTS_PAGE.cta.heading}
        accent={PROJECTS_PAGE.cta.accent}
        sub={PROJECTS_PAGE.cta.sub}
        secondary={PROJECTS_PAGE.cta.secondary}
      />
    </div>
  )
}
