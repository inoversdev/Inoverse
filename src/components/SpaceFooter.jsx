import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { BRAND, FOOTER, FOOTER_LINKS } from '../lib/content'

// ─── Footer — typed FOOTER_LINKS renderer ───
// Same contract as the top bar: anchors scroll home sections (with a
// navigate-home handoff from other routes), routes use react-router
// <Link>. Fed the fuller list — About + Process live here since the top
// bar dropped them for the two new routes.
export default function SpaceFooter() {
  const lenis = useLenis()
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

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
      navigate('/', { state: { scrollTo: target } })
    }
  }

  return (
    <footer className="relative border-t border-star-300/20 py-14">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Inovers" className="h-10 w-10" />
          <span className="font-display text-2xl font-semibold tracking-tight text-star-100">
            Inovers<span className="ember-text">.</span>
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-8">
          {FOOTER_LINKS.map((l) =>
            l.kind === 'route' ? (
              <Link
                key={l.to}
                to={l.to}
                className="py-2 text-sm text-star-400 transition-colors hover:text-ember-500"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.target}
                href={`#${l.target}`}
                onClick={(e) => handleNav(e, l.target)}
                className="py-2 text-sm text-star-400 transition-colors hover:text-ember-500"
              >
                {l.label}
              </a>
            )
          )}
        </nav>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-star-600">
          <a href={`mailto:${BRAND.email}`} className="transition-colors hover:text-star-300">
            {BRAND.email}
          </a>
          <span>·</span>
          <a href={`mailto:${BRAND.emailAlt}`} className="transition-colors hover:text-star-300">
            {BRAND.emailAlt}
          </a>
          <span>·</span>
          <span>{BRAND.phone}</span>
        </div>

        <p className="text-center text-xs text-star-600">{FOOTER.copyright}</p>
      </div>
    </footer>
  )
}
