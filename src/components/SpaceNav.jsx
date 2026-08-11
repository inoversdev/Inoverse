import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { BRAND, FOOTER_LINKS, NAV_LINKS } from '../lib/content'
import { useTheme } from '../theme'

// ─── Top navigation — typed NAV_LINKS renderer ───
// kind:'anchor' → home-section scroll (or navigate home with a scrollTo
// handoff when on another route); kind:'route' → react-router <Link> with
// an ember active state on the matching pathname.
// Desktop links appear at lg+; below lg a full-screen glass drawer takes
// over (the bar was at its ceiling with five links + Book Call + toggle).
export default function SpaceNav() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const burgerRef = useRef(null)
  const lenis = useLenis()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

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

  const scrollToTarget = (target) => {
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

  const handleNav = (e, target) => {
    e.preventDefault()
    if (isHome) {
      scrollToTarget(target)
    } else {
      // Section links are home-page anchors. Navigate home with a
      // scrollTo handoff — HomePage glides to the section once mounted.
      navigate('/', { state: { scrollTo: target } })
    }
  }

  // ── Mobile drawer ──
  // Lenis owns the scroll; CSS overflow can't hold it, so stop/start it.
  // The drawer is PORTALED to document.body (Mat's bug 2026-08-11):
  // it used to live inside the header, whose `translate-y-0/-full`
  // (CSS `translate`) makes the header the containing block for fixed
  // descendants — so the "full-screen" drawer actually measured only
  // the header's ~72px box, the backdrop covered just the top strip,
  // and the menu text spilled out below it like clutter. Portaling it
  // to body gives fixed inset-0 the viewport it deserves.
  //
  // Motion (2026-08-11, Mat: "the animations are missing"): the drawer
  // now animates in/out — backdrop fade, panel rise, staggered link
  // cascade (CSS keyframes in index.css). Closing plays the exit first
  // (closing state + timeout) before unmounting. Reduced motion: instant.
  const [closing, setClosing] = useState(false)

  const closeDrawer = () => {
    if (closing) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    lenis?.start()
    if (reduce) {
      setOpen(false)
      burgerRef.current?.focus()
      return
    }
    setClosing(true)
    window.setTimeout(() => {
      setOpen(false)
      setClosing(false)
      burgerRef.current?.focus()
    }, 260) // matches .drawer-panel-out / .drawer-backdrop-out
  }
  const toggleDrawer = () => {
    if (open) {
      closeDrawer()
      return
    }
    setClosing(false)
    setOpen(true)
    setHidden(false) // the close button must stay reachable while open
    lenis?.stop()
  }

  // Escape closes the drawer.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeDrawer()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Route change (drawer link selected) → close + restore scroll.
  useEffect(() => {
    if (open) {
      setOpen(false)
      lenis?.start()
      burgerRef.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const linkCls = (active) =>
    `relative text-sm transition-colors hover:text-ember-500 ${
      active ? 'text-ember-500' : 'text-star-300'
    }`

  const renderLink = (l) => {
    if (l.kind === 'route') {
      const active = location.pathname === l.to
      return (
        <Link
          key={l.to}
          to={l.to}
          className={`${linkCls(active)} ${active ? 'after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-ember-500' : ''}`}
        >
          {l.label}
        </Link>
      )
    }
    return (
      <a
        key={l.target}
        href={`#${l.target}`}
        onClick={(e) => handleNav(e, l.target)}
        className={linkCls(false)}
      >
        {l.label}
      </a>
    )
  }

  const renderDrawerLink = (l, i) => {
    const cls =
      'drawer-link block py-3 text-2xl font-medium tracking-tight transition-colors hover:text-ember-500'
    const style = { animationDelay: `${90 + i * 45}ms` }
    if (l.kind === 'route') {
      const active = location.pathname === l.to
      return (
        <Link key={l.to} to={l.to} style={style} className={`${cls} ${active ? 'text-ember-500' : 'text-star-200'}`}>
          {l.label}
        </Link>
      )
    }
    return (
      <a
        key={l.target}
        href={`#${l.target}`}
        style={style}
        onClick={(e) => {
          handleNav(e, l.target)
          closeDrawer()
        }}
        className={`${cls} text-star-200`}
      >
        {l.label}
      </a>
    )
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
        <a
          href="#"
          className="flex items-center gap-3"
          onClick={(e) => {
            e.preventDefault()
            if (isHome) scrollToTarget('top')
            else navigate('/', { state: { scrollTo: 'top' } })
          }}
        >
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
          <nav className={`hidden items-center lg:flex ${scrolled ? 'gap-6' : 'gap-8'} transition-all duration-500`}>
            {NAV_LINKS.map((l) => renderLink(l))}
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

          {/* Mobile hamburger — below lg the drawer is the only nav */}
          <button
            ref={burgerRef}
            onClick={toggleDrawer}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-star-300/30 text-star-400 transition-all duration-500 hover:border-ember-500/60 hover:text-ember-500 active:scale-90 lg:hidden"
          >
            {open ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer — full-screen glass panel, PORTALED to body (see
          the toggle comment above — the header's translate breaks fixed
          positioning). Header stays above it (z-50 > z-40) so the
          hamburger turns into a close button. Full FOOTER_LINKS set
          (About + Process + All work were missing — Mat's call
          2026-08-11); links scroll if the screen is short, actions stay
          pinned at the bottom. Animated in/out (index.css keyframes). */}
      {open &&
        createPortal(
          <div
            id="mobile-menu"
            className="fixed inset-0 z-40 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div
              className={`absolute inset-0 bg-space-950/70 backdrop-blur-sm ${
                closing ? 'drawer-backdrop-out' : 'drawer-backdrop-in'
              }`}
              onClick={closeDrawer}
            />
            <nav
              className={`glass v2-header-glass absolute inset-0 flex flex-col px-8 pt-20 pb-10 ${
                closing ? 'drawer-panel-out' : 'drawer-panel-in'
              }`}
            >
              {/* Native sheet grammar (Mat's call 2026-08-11 — "no X or
                  close button when it's extended, align with the system"):
                  a grabber handle at top-center + an explicit close button
                  at top-right, INSIDE the panel — so there is always a
                  visible close affordance, even if the header bar tucked. */}
              <div className="relative mb-8 shrink-0">
                <span className="mx-auto block h-1.5 w-12 rounded-full bg-star-300/40" aria-hidden="true" />
                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close menu"
                  className="absolute -top-2 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-star-300/30 text-star-400 transition-colors hover:border-ember-500/60 hover:text-ember-500 active:scale-90"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col">
                  {FOOTER_LINKS.map((l, i) => renderDrawerLink(l, i))}
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-6">
                <a
                  href={BRAND.calendly}
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeDrawer}
                  className="v2-btn v2-btn-primary v2-btn-lg w-full"
                >
                  Book a Call
                </a>
                <button
                  onClick={() => {
                    toggleTheme()
                  }}
                  className="flex items-center justify-center gap-2 py-3 text-sm text-star-400 transition-colors hover:text-ember-500"
                >
                  {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                </button>
              </div>
            </nav>
          </div>,
          document.body
        )}
    </header>
  )
}
