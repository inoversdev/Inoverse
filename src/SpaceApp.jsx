import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import SpaceScene from './three/SpaceScene'
import SmoothScroll from './components/SmoothScroll'
import SpaceNav from './components/SpaceNav'
import SpaceFooter from './components/SpaceFooter'
import CursorAura from './components/effects/CursorAura'
import HomePage from './pages/HomePage'
import { useParallaxLayers } from './hooks/useParallaxLayers'
import { useDeviceProfile } from './hooks/useDeviceProfile'
import { useTheme } from './theme'

// Home ("/") is where almost every visit starts, so it stays eager — no
// benefit to lazy-loading the default route, only a waterfall delay.
// /projects and /crew are secondary: split into their own chunks so a
// home visit never downloads their code (Mat's call 2026-08-10 —
// "optimize the website").
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const CrewPage = lazy(() => import('./pages/CrewPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

gsap.registerPlugin(ScrollTrigger)

// ─── AppShell — everything that must SURVIVE navigation ───
// The 3D universe, Lenis smooth scroll, nav, footer, and the route
// outlet. Routes render into <main> below; page sections mount/unmount
// but the shell (and the scene) never rebuilds on route change.
export default function SpaceApp() {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const [sceneReady, setSceneReady] = useState(false)
  const lenis = useLenis()
  const { theme } = useTheme()
  const location = useLocation()
  const isDark = theme === 'dark'
  const prevTheme = useRef(theme)

  // Detect low-end devices once — flips the `low-end` class on <html>
  // so CSS drops the expensive blurs/glows, and the 3D scene reads the
  // same profile to cut stars/shooting-stars/motes.
  const profile = useDeviceProfile()

  // Site-wide scroll-depth layer — see hooks/useParallaxLayers.js. Any
  // element anywhere below with a data-parallax attribute opts in.
  // Re-runs on route change: pages swap their [data-parallax] elements,
  // so the old triggers must be killed and fresh ones created (the hook
  // cleans up its own tweens before re-running).
  useParallaxLayers(location.pathname)

  // Keep GSAP ScrollTrigger in lockstep with Lenis' virtual scroll —
  // this is what removes the delayed-feeling parallax/reveal animations.
  // ALSO: re-measure Lenis whenever ScrollTrigger refreshes. Lenis root
  // mode only recalculates its scroll limit on resize/load, and route
  // changes don't fire either — without this, a cross-page anchor glide
  // to a section beyond the PREVIOUS page's limit gets silently clamped
  // (observed: /projects → #contact froze at 5522 = 6340 − 818, the
  // projects-page limit). ScrollTrigger.refresh() runs on every route
  // change (below), so the limit is always fresh before a glide starts.
  useEffect(() => {
    if (!lenis) return
    const onScroll = () => ScrollTrigger.update()
    const onRefresh = () => lenis.resize()
    lenis.on('scroll', onScroll)
    ScrollTrigger.addEventListener('refresh', onRefresh)
    return () => {
      lenis.off('scroll', onScroll)
      ScrollTrigger.removeEventListener('refresh', onRefresh)
    }
  }, [lenis])

  // Lenis root mode measures its scroll limit ONCE and only re-measures
  // on window resize / ScrollTrigger refresh. The page GROWS after that
  // (fonts swapping in, lazy content, future assets), leaving the limit
  // stale — which CLAMPS scrolling mid-page and caps every scrub
  // animation whose range extends past the stale limit. Observed by Mat
  // 2026-08-11: the Flight Plan saucer stuck at the Build node — the
  // page only scrolled to 75% (7349/9799). Fix: a ResizeObserver on the
  // app root re-syncs the Lenis limit whenever the page height changes
  // (rAF-batched). NOTE: only lenis.resize() here — ScrollTrigger.refresh()
  // inside this loop fought Lenis's virtual scroll and snapped the page
  // to the top. Triggers get their own refresh on fonts-ready below.
  useEffect(() => {
    if (!lenis) return
    let raf = 0
    const sync = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => lenis.resize())
    }
    const ro = new ResizeObserver(sync)
    const root = document.getElementById('root')
    if (root) ro.observe(root)
    // One full re-measure once fonts settle — the biggest late growth
    // source, and the safest moment for a ScrollTrigger.refresh too.
    document.fonts?.ready?.then(() => {
      lenis.resize()
      ScrollTrigger.refresh()
    }).catch(() => {})
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [lenis])

  // (Re)build the 3D universe for the active theme — full re-skin on
  // toggle. Keyed on theme ONLY, never on route: navigating between
  // pages must not remount the scene or replay the entrance warp.
  // The entrance warp plays only on first load; theme toggles rebuild
  // quietly.
  //
  // First load is DEFERRED 120ms (Mat's call 2026-08-11 — "I feel
  // heaviness"): constructing the WebGL scene is the single heaviest
  // startup task (compile shaders, build 2200 stars, textures), and
  // nothing in the hero needs it before the text paints. The browser
  // parses/renders the content first, then the universe boots behind it
  // (the mount shows the page's own bg for those 120ms). Theme rebuilds
  // (skipEntrance) boot immediately so the toggle stays snappy.
  useEffect(() => {
    if (!canvasRef.current) return
    const skipEntrance = prevTheme.current !== theme
    prevTheme.current = theme
    let cancelled = false
    let bootTimer = 0
    let scene = null
    let st = null
    let refreshT = 0

    const boot = () => {
      if (cancelled || !canvasRef.current) return
      scene = new SpaceScene(canvasRef.current, theme, skipEntrance)
      sceneRef.current = scene
      setSceneReady(true)

      // Drive the camera flight from overall page scroll (0..1). Bound to
      // document.body, so it stays valid on every route — each page has a
      // different height, and the route-change effect refreshes it.
      st = ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => scene.setProgress(self.progress),
      })

      // Refresh after fonts/images settle
      refreshT = setTimeout(() => ScrollTrigger.refresh(), 600)
    }

    if (skipEntrance) boot()
    else bootTimer = window.setTimeout(boot, 120)

    return () => {
      cancelled = true
      clearTimeout(bootTimer)
      clearTimeout(refreshT)
      if (st) st.kill()
      if (scene) {
        scene.dispose()
        sceneRef.current = null
      }
    }
  }, [theme])

  // Hero scroll sequence (#top) — exists only on the home page. Created
  // when the route actually renders a hero, killed when it leaves, and
  // rebuilt on theme toggle (the scene is re-skinned). Never throws on
  // sub-pages: if there's no #top element, there's simply no trigger.
  useEffect(() => {
    if (location.pathname !== '/') return
    if (!sceneReady || !sceneRef.current) return
    if (!document.querySelector('#top')) return

    const heroSt = ScrollTrigger.create({
      trigger: '#top',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
      onUpdate: (self) => sceneRef.current?.setHeroProgress(self.progress),
    })

    return () => heroSt.kill()
  }, [theme, location.pathname, sceneReady])

  // Route change: snap to the top immediately (no animated glide), then
  // let GSAP re-measure — page heights differ wildly between home and a
  // short sub-page, and the body-level progress trigger + section
  // triggers are all miscalibrated until refresh() runs against the new
  // layout. Double refresh: once after paint, once after fonts settle.
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)

    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })
    const t = setTimeout(() => ScrollTrigger.refresh(), 120)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
  }, [location.pathname, lenis])

  return (
    <SmoothScroll>
      <div className="relative min-h-screen overflow-x-clip bg-space-950 text-star-100 grain-overlay">
        {/* Fixed universe */}
        <div ref={canvasRef} className="fixed inset-0 z-0" aria-hidden="true" />
        {/* Cursor-trailing ember glow — the ship's running lights */}
        <CursorAura />
        {/* Vignette — light: barely-there depth on the paper tone; dark: original cinematic frame */}
        <div
          className="pointer-events-none fixed inset-0 z-[1]"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at center, transparent 40%, rgba(5,4,4,0.55) 100%)'
              : 'radial-gradient(ellipse at center, transparent 60%, rgba(21,20,18,0.025) 100%)',
          }}
          aria-hidden="true"
        />
        {/* Edge ambience — light: none (calm paper); dark: original warm edge lights */}
        <div
          className="pointer-events-none fixed inset-0 z-[1]"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 60% 35% at 50% 0%, rgba(255,240,225,0.07), transparent 70%), radial-gradient(ellipse 60% 35% at 50% 100%, rgba(255,240,225,0.05), transparent 70%), radial-gradient(ellipse 30% 55% at 0% 50%, rgba(255,240,225,0.05), transparent 70%), radial-gradient(ellipse 30% 55% at 100% 50%, rgba(255,240,225,0.05), transparent 70%)'
              : 'none',
          }}
          aria-hidden="true"
        />

        {/* Scrollable content above the canvas */}
        <div className="relative z-10">
          <SpaceNav />
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/crew" element={<CrewPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <SpaceFooter />
        </div>
      </div>
    </SmoothScroll>
  )
}
