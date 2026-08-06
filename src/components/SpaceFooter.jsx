import { useLenis } from 'lenis/react'
import { BRAND, FOOTER, NAV_LINKS } from '../lib/content'

export default function SpaceFooter() {
  const lenis = useLenis()

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
    <footer className="relative border-t border-white/5 py-14">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Inovers" className="h-10 w-10" />
          <span className="font-display text-2xl text-star-100">
            Inovers<span className="ember-text">.</span>
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.target}
              href={`#${l.target}`}
              onClick={(e) => handleNav(e, l.target)}
              className="text-sm text-star-400 transition-colors hover:text-ember-300"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-star-600">
          <a href={`mailto:${BRAND.email}`} className="transition-colors hover:text-star-300">
            {BRAND.email}
          </a>
          <span>Â·</span>
          <a href={`mailto:${BRAND.emailAlt}`} className="transition-colors hover:text-star-300">
            {BRAND.emailAlt}
          </a>
          <span>Â·</span>
          <span>{BRAND.phone}</span>
        </div>

        <p className="text-center text-xs text-star-600">{FOOTER.copyright}</p>
      </div>
    </footer>
  )
}
