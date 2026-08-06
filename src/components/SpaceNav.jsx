import { useEffect, useState } from 'react'
import { useLenis } from 'lenis/react'
import { BRAND, NAV_LINKS } from '../lib/content'

export default function SpaceNav() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lenis = useLenis()

  // Low-profile header: while the visitor is reading a body section, the
  // bar stays compact, and it tucks away entirely when scrolling down.
  // It returns on the first upward scroll — or whenever you're back near
  // the top (hero), where it lives at full presence.
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      if (y < 320) setHidden(false)
      else if (y > lastY + 3) setHidden(true)
      else if (y < lastY - 3) setHidden(false)
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (e, target) => {
    e.preventDefault()
    if (lenis) {
      lenis.scrollTo(`#${target}`, {
        offset: 0,
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
    } else {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ${
        scrolled ? 'glass v2-header-glass' : ''
      } ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 lg:px-10 ${
          scrolled ? 'py-2.5' : 'py-4'
        }`}
      >
        <a href="#" className="flex items-center gap-3" onClick={(e) => handleNav(e, 'top')}>
          <img
            src="/logo.svg"
            alt="Inovers"
            className={`transition-all duration-500 ${scrolled ? 'h-7 w-7' : 'h-9 w-9'}`}
          />
          <span className={`font-display tracking-tight text-star-100 transition-all duration-500 ${
            scrolled ? 'text-lg' : 'text-xl'
          }`}>
            Inovers<span className="ember-text">.</span>
          </span>
        </a>

        <nav className={`hidden items-center md:flex ${scrolled ? 'gap-6' : 'gap-8'} transition-all duration-500`}>
          {NAV_LINKS.map((l) => (
            <a
              key={l.target}
              href={`#${l.target}`}
              onClick={(e) => handleNav(e, l.target)}
              className="text-sm text-star-300 transition-colors hover:text-ember-300"
            >
              {l.label}
            </a>
          ))}
          <a
            href={BRAND.calendly}
            target="_blank"
            rel="noreferrer"
            className={`v2-btn v2-btn-primary ${
              scrolled ? 'v2-btn-sm' : ''
            }`}
          >
            Book Call
          </a>
        </nav>
      </div>
    </header>
  )
}
