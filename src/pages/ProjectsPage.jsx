import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { INDUSTRIES, PROJECTS, PROJECTS_PAGE } from '../lib/content'
import MissionCard from '../components/MissionCard'
import ProjectModal from '../components/ProjectModal'
import PageHero from '../components/PageHero'
import MissionCTA from '../components/MissionCTA'

gsap.registerPlugin(ScrollTrigger)

const PAGE_SIZE = 14

// ─── /projects — the full mission manifest ───
// All projects, industry filter chips (the taxonomy moved here from the
// home showcase), the 3-part filter animation (sliding chip indicator +
// FLIP height morph + card shrink-out), and a closing Book a Call band.
// Pagination (14/page) only appears when a filter exceeds one page —
// the current 14-project roster renders as a single page.
export default function ProjectsPage() {
  const rootRef = useRef(null)
  const gridRef = useRef(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeProject, setActiveProject] = useState(null)

  const filtered = useMemo(
    () =>
      activeFilter === 'All'
        ? PROJECTS
        : PROJECTS.filter((p) => p.industry === activeFilter),
    [activeFilter]
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
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
  }, [activeFilter, page])

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

  // Entrance reveal — fast one-shot fade-up with a light cascade wave
  // (delay by grid position). Mat's calls: 2026-08-10 no scrubbed
  // scale+blur (filter recompositing too heavy at 60 cards), 2026-08-11
  // faster + lighter after the filter swap felt heavy. Transform +
  // opacity only. Re-runs on filter changes: ctx.revert() kills the old
  // per-card triggers (no leak), fresh ones are created for the new grid.
  // The height morph re-measures after settling (450ms ≈ 0.4s morph).
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.mission-card').forEach((card, i) => {
        gsap.from(card, {
          y: 14,
          opacity: 0,
          duration: 0.4,
          delay: Math.min(i * 0.05, 0.35),
          ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 92%', once: true },
        })
      })
    }, rootRef)
    const t = setTimeout(() => ScrollTrigger.refresh(), 450)
    return () => {
      clearTimeout(t)
      ctx.revert()
    }
  }, [activeFilter, page])

  // (Filter-change replay is handled by the reveal effect above — it
  // re-runs on activeFilter, so the previous mount-time fromTo replay
  // was removed: it fought the reveal tweens for opacity and left
  // cards stuck at 0 after scrolling (the "invisible cards" bug).)

  // Filter clicks — INSTANT swap, no exit animation. The old 0.45s
  // shrink-out made the page feel dead (click → wait → nothing happens);
  // Mat's call 2026-08-11: "heavy and not responsive". Now the swap is
  // immediate and the transition IS the fast card cascade + height
  // morph. isTransitioning just guards rapid double-clicks (~400ms).
  const handleFilterChange = (cat) => {
    if (cat === activeFilter || isTransitioning) return
    setIsTransitioning(true)
    setActiveFilter(cat)
    setPage(1)
    window.setTimeout(() => setIsTransitioning(false), 400)
  }

  // Page clicks: same instant swap, then scroll the grid back into view
  // (a jump straight to page 3's cards with no scroll cue reads as
  // broken, especially coming from a Book a Call click further down).
  const handlePageChange = (next) => {
    if (next === page || next < 1 || next > pageCount || isTransitioning) return
    setIsTransitioning(true)
    setPage(next)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => setIsTransitioning(false), 400)
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

      <section ref={gridRef} className="relative mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        {/* ── Mission counter — same row as the filter buttons (Mat's
               preference). Chips live in their OWN horizontally-scrollable
               area; the counter pill is a SIBLING pinned right with
               shrink-0 + whitespace-nowrap — so however long the pill text
               gets, it never wraps the row and never drops below the chips.
               The indicator slides inside the chips' relative container
               (offsetLeft/offsetTop are measured against it), so it tracks
               the active chip even as the chips scroll. ── */}
        <div
          className="relative mb-10 flex items-center gap-2"
          role="group"
          aria-label="Filter projects by industry"
        >
          <div className="relative flex min-w-0 flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
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
          </div>
          <span className="ml-auto inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-star-300/25 bg-white px-3.5 py-1.5 text-xs font-medium text-star-400 shadow-[0_1px_2px_rgba(17,17,17,0.04)] dark:bg-[rgba(26,22,18,0.68)]">
            {filtered.length} of {PROJECTS.length} works
          </span>
        </div>

        {/* ── The grid — wrapper morphs its height between filter states
               instead of snapping (see the layout effect above) ── */}
        <div
          style={{
            height: wrapperHeight,
            overflow: 'hidden',
            transition: useHeightTransition ? 'height 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          }}
        >
          <div ref={contentInnerRef}>
            {paginated.length ? (
              <div key={`${activeFilter}-${page}`}>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {paginated.map((p) => (
                    <MissionCard key={p.id} project={p} onOpen={setActiveProject} />
                  ))}
                </div>
              </div>
            ) : (
              <div key={activeFilter} className="rounded-2xl border border-dashed border-star-300/25 p-10 text-center text-sm text-star-500">
                No works in this category yet.
              </div>
            )}
          </div>
        </div>

        {/* ── Pagination — 12 missions/page (Mat's call 2026-08-10: plain
               pagination over infinite scroll). Auto-hides when the
               filtered roster fits a single page. ── */}
        {pageCount > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Projects pagination">
            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="v2-btn v2-btn-ghost v2-btn-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => handlePageChange(n)}
                  aria-current={n === page ? 'page' : undefined}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ease-out ${
                    n === page
                      ? 'scale-105 bg-ember-500 text-white'
                      : 'text-star-400 hover:bg-white/40 dark:hover:bg-white/5'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pageCount}
              className="v2-btn v2-btn-ghost v2-btn-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </section>

      <MissionCTA
        heading={PROJECTS_PAGE.cta.heading}
        accent={PROJECTS_PAGE.cta.accent}
        sub={PROJECTS_PAGE.cta.sub}
        secondary={PROJECTS_PAGE.cta.secondary}
      />

      {/* Project details modal — the animated how-it-works view */}
      {activeProject && (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}
    </div>
  )
}
