import { useEffect, useState } from 'react'
import { useLenis } from 'lenis/react'
import { BRAND, NAV_LINKS } from '../lib/content'
import { useTheme } from '../theme'

export default function SpaceNav() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lenis = useLenis()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

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
          <span className={`font-display font-semibold tracking-tight text-star-100 transition-all duration-500 ${
            scrolled ? 'text-lg' : 'text-xl'
          }`}>
            Inovers<span className="ember-text">.</span>
          </span>
        </a>

        <div className="flex items-center gap-3">
          <nav className={`hidden items-center md:flex ${scrolled ? 'gap-6' : 'gap-8'} transition-all duration-500`}>
            {NAV_LINKS.map((l) => (
              <a
                key={l.target}
                href={`#${l.target}`}
                onClick={(e) => handleNav(e, l.target)}
                className="text-sm text-star-300 transition-colors hover:text-ember-500"
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

          {/* Theme toggle — light (white, default) ↔ dark (space classic) */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 hover:scale-95 active:scale-90 ${
              scrolled ? 'border-star-300/40' : 'border-star-300/30'
            } text-star-400 hover:border-ember-500/60 hover:text-ember-500`}
          >
            {isDark ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4.5" />
                <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
