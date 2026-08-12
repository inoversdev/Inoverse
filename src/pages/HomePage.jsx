import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import SpaceHero from '../components/SpaceHero'
import CosmicThreads from '../components/CosmicThreads'
import SpaceServices from '../components/SpaceServices'
import TechStack from '../components/TechStack'
import SpacePricing from '../components/SpacePricing'
import SpacePortfolio from '../components/SpacePortfolio'
import SpaceProcess from '../components/SpaceProcess'
import WhyInoversSection from '../components/WhyInoversSection'
import TestimonialsSection from '../components/TestimonialsSection'
import SpaceAbout from '../components/SpaceAbout'
import SpaceContact from '../components/SpaceContact'

// ─── / — the full single-page section stack ───
// The shell (3D scene, smooth scroll, nav, footer) lives in the AppShell
// above the router, so navigating away and back never remounts the scene.
export default function HomePage() {
  const location = useLocation()
  const lenis = useLenis()

  // Cross-page anchor navigation: when the nav (or footer) hands us a
  // target via location.state, glide to that section once it's mounted.
  // The state is cleared immediately so the browser back button doesn't
  // replay the scroll.
  useEffect(() => {
    const target = location.state?.scrollTo
    if (!target) return
    window.history.replaceState({}, '')

    // Wait out SpaceApp's route-change refresh window first (rAF +
    // 120ms ScrollTrigger.refresh calls). Each refresh now re-measures
    // Lenis (SpaceApp's refresh→lenis.resize() bridge), which updates
    // Lenis's scroll limit to the NEW page's height — without that, a
    // glide to a section beyond the previous page's limit is clamped
    // (observed freeze at 5522 = old limit). 160ms > the last refresh
    // timer, so the glide below runs against a correct limit.
    const settle = setTimeout(startGlide, 160)

    function startGlide() {
      const ease = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      let attempts = 0
      const tryScroll = () => {
        if (document.getElementById(target)) {
          if (lenis) {
            lenis.scrollTo(`#${target}`, { offset: 0, duration: 1.4, easing: ease })
          } else {
            document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
          }
        } else if (attempts < 20) {
          attempts += 1
          setTimeout(tryScroll, 50)
        }
      }
      tryScroll()
    }

    return () => clearTimeout(settle)
  }, [location.state, lenis])

  return (
    <main>
      <SpaceHero />
      {/* Cosmic threads — the web-threads cloud page breaker (replaces
          the orange AuroraBand) */}
      <CosmicThreads />
      <SpaceServices />
      {/* The tech-stack band — fills the UFO gap between Services and Work */}
      <TechStack />
      <SpacePortfolio />
      <SpaceProcess />
      <WhyInoversSection />
      <TestimonialsSection />
      {/* The close-the-deal order (Mat's call 2026-08-11): proof
          (testimonials) → pricing → who you're talking to (crew) →
          contact. Pricing moved down from after Services. */}
      <SpacePricing />
      <SpaceAbout />
      <SpaceContact />
    </main>
  )
}
