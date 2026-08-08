import { useEffect, useRef } from 'react'
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
import ProjectsPage from './pages/ProjectsPage'
import WhyInoversPage from './pages/WhyInoversPage'
import TestimonialsPage from './pages/TestimonialsPage'
import { useParallaxLayers } from './hooks/useParallaxLayers'
import { useTheme } from './theme'

gsap.registerPlugin(ScrollTrigger)

// ─── AppShell — everything that must SURVIVE navigation ───
// The 3D universe, Lenis smooth scroll, nav, footer, and the route
// outlet. Routes render into <main> below; page sections mount/unmount
// but the shell (and the scene) never rebuilds on route change.
export default function SpaceApp() {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const lenis = useLenis()
  const { theme } = useTheme()
  const location = useLocation()
  const isDark = theme === 'dark'
  const prevTheme = useRef(theme)

  // Site-wide scroll-depth layer — see hooks/useParallaxLayers.js. Any
  // element anywhere below with a data-parallax attribute opts in.
  // Re-runs on route change: pages swap their [data-parallax] elements,
  // so the old triggers must be killed and fresh ones created (the hook
  // cleans up its own tweens before re-running).
  useParallaxLayers(location.pathname)

  // Keep GSAP ScrollTrigger in lockstep with Lenis' virtual scroll —
  // this is what removes the delayed-feeling parallax/reveal animations.
  useEffect(() => {
    if (!lenis) return
    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)
    return () => lenis.off('scroll', onScroll)
  }, [lenis])

  // (Re)build the 3D universe for the active theme — full re-skin on
  // toggle. Keyed on theme ONLY, never on route: navigating between
  // pages must not remount the scene or replay the entrance warp.
  // The entrance warp plays only on first load; theme toggles rebuild
  // quietly.
  useEffect(() => {
    if (!canvasRef.current) return
    const skipEntrance = prevTheme.current !== theme
    prevTheme.current = theme
    const scene = new SpaceScene(canvasRef.current, theme, skipEntrance)
    sceneRef.current = scene

    // Drive the camera flight from overall page scroll (0..1). Bound to
    // document.body, so it stays valid on every route — each page has a
    // different height, and the route-change effect refreshes it.
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => scene.setProgress(self.progress),
    })

    // Refresh after fonts/images settle
    const t = setTimeout(() => ScrollTrigger.refresh(), 600)

    return () => {
      st.kill()
      clearTimeout(t)
      scene.dispose()
      sceneRef.current = null
    }
  }, [theme])

  // Hero scroll sequence (#top) — exists only on the home page. Created
  // when the route actually renders a hero, killed when it leaves, and
  // rebuilt on theme toggle (the scene is re-skinned). Never throws on
  // sub-pages: if there's no #top element, there's simply no trigger.
  useEffect(() => {
    if (location.pathname !== '/') return
    if (!sceneRef.current) return
    if (!document.querySelector('#top')) return

    const heroSt = ScrollTrigger.create({
      trigger: '#top',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
      onUpdate: (self) => sceneRef.current?.setHeroProgress(self.progress),
    })

    return () => heroSt.kill()
  }, [theme, location.pathname])

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
        {/* Vignette — light: soft neutral depth; dark: original cinematic frame */}
        <div
          className="pointer-events-none fixed inset-0 z-[1]"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at center, transparent 40%, rgba(5,4,4,0.55) 100%)'
              : 'radial-gradient(ellipse at center, transparent 55%, rgba(17,17,17,0.045) 100%)',
          }}
          aria-hidden="true"
        />
        {/* Edge ambience — light: gentle ember; dark: original warm edge lights */}
        <div
          className="pointer-events-none fixed inset-0 z-[1]"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 60% 35% at 50% 0%, rgba(255,240,225,0.07), transparent 70%), radial-gradient(ellipse 60% 35% at 50% 100%, rgba(255,240,225,0.05), transparent 70%), radial-gradient(ellipse 30% 55% at 0% 50%, rgba(255,240,225,0.05), transparent 70%), radial-gradient(ellipse 30% 55% at 100% 50%, rgba(255,240,225,0.05), transparent 70%)'
              : 'radial-gradient(ellipse 60% 35% at 50% 0%, rgba(245,48,3,0.05), transparent 70%), radial-gradient(ellipse 60% 35% at 50% 100%, rgba(245,48,3,0.03), transparent 70%), radial-gradient(ellipse 30% 55% at 0% 50%, rgba(245,48,3,0.03), transparent 70%), radial-gradient(ellipse 30% 55% at 100% 50%, rgba(245,48,3,0.03), transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Scrollable content above the canvas */}
        <div className="relative z-10">
          <SpaceNav />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/why-inovers" element={<WhyInoversPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
          </Routes>
          <SpaceFooter />
        </div>
      </div>
    </SmoothScroll>
  )
}
