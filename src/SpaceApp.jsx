import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import SpaceScene from './three/SpaceScene'
import SmoothScroll from './components/SmoothScroll'
import SpaceNav from './components/SpaceNav'
import SpaceHero from './components/SpaceHero'
import SpaceMarquee from './components/SpaceMarquee'
import SpaceServices from './components/SpaceServices'
import SpaceAbout from './components/SpaceAbout'
import SpacePortfolio from './components/SpacePortfolio'
import SpaceProcess from './components/SpaceProcess'
import SpaceContact from './components/SpaceContact'
import SpaceFooter from './components/SpaceFooter'

gsap.registerPlugin(ScrollTrigger)

export default function SpaceApp() {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const lenis = useLenis()

  // Keep GSAP ScrollTrigger in lockstep with Lenis' virtual scroll —
  // this is what removes the delayed-feeling parallax/reveal animations.
  useEffect(() => {
    if (!lenis) return
    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)
    return () => lenis.off('scroll', onScroll)
  }, [lenis])

  useEffect(() => {
    if (!canvasRef.current) return
    const scene = new SpaceScene(canvasRef.current)
    sceneRef.current = scene

    // Drive the camera flight from overall page scroll (0..1)
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => scene.setProgress(self.progress),
    })

    // Drive the UFO greeting → departure from the hero's scroll-out (0..1)
    const heroSt = ScrollTrigger.create({
      trigger: '#top',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
      onUpdate: (self) => scene.setHeroProgress(self.progress),
    })

    // Refresh after fonts/images settle
    const t = setTimeout(() => ScrollTrigger.refresh(), 600)

    return () => {
      st.kill()
      heroSt.kill()
      clearTimeout(t)
      scene.dispose()
      sceneRef.current = null
    }
  }, [])

  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-space-950 text-star-100 grain-overlay">
        {/* Fixed universe */}
        <div ref={canvasRef} className="fixed inset-0 z-0" aria-hidden="true" />
        {/* Vignette so text stays readable over stars */}
        <div
          className="pointer-events-none fixed inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(5,4,4,0.55) 100%)',
          }}
          aria-hidden="true"
        />
        {/* Cinematic white edge lights — soft glow along the frame edges */}
        <div
          className="pointer-events-none fixed inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(ellipse 60% 35% at 50% 0%, rgba(255,240,225,0.07), transparent 70%), radial-gradient(ellipse 60% 35% at 50% 100%, rgba(255,240,225,0.05), transparent 70%), radial-gradient(ellipse 30% 55% at 0% 50%, rgba(255,235,220,0.05), transparent 70%), radial-gradient(ellipse 30% 55% at 100% 50%, rgba(255,235,220,0.05), transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Scrollable content above the canvas */}
        <div className="relative z-10">
          <SpaceNav />
          <main>
            <SpaceHero />
            <SpaceMarquee />
            <SpaceServices />
            <SpaceAbout />
            <SpacePortfolio />
            <SpaceProcess />
            <SpaceContact />
          </main>
          <SpaceFooter />
        </div>
      </div>
    </SmoothScroll>
  )
}
