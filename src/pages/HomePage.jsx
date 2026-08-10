import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import SpaceHero from '../components/SpaceHero'
import AuroraBand from '../components/AuroraBand'
import SpaceServices from '../components/SpaceServices'
import SpaceAbout from '../components/SpaceAbout'
import SpacePortfolio from '../components/SpacePortfolio'
import SpaceProcess from '../components/SpaceProcess'
import WhyInoversSection from '../components/WhyInoversSection'
import TestimonialsSection from '../components/TestimonialsSection'
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
  }, [location.state, lenis])

  return (
    <main>
      <SpaceHero />
      <AuroraBand />
      <SpaceServices />
      <SpaceAbout />
      <SpacePortfolio />
      <SpaceProcess />
      <WhyInoversSection />
      <TestimonialsSection />
      <SpaceContact />
    </main>
  )
}
