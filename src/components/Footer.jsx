import { NAV_LINKS, BRAND, FOOTER } from '../lib/content'

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center">
              <img src="/logo.svg" alt="Inovers Logo" className="h-9 w-auto mr-3" />
              <h3 className="text-2xl font-bold tracking-tight">Inovers</h3>
            </div>
            <p className="text-warm-100/60 text-sm leading-relaxed max-w-sm">
              {FOOTER.blurb}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ember-500 animate-pulse" />
              <span className="text-xs text-warm-100/50">Building for business since day one</span>
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-warm-100/40 mb-4">Navigate</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.target}>
                  <button
                    onClick={() => scrollTo(link.target)}
                    className="text-warm-100/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-warm-100/40 mb-4">Contact Info</h4>
            <ul className="space-y-3 text-warm-100/70 text-sm">
              <li>
                <a href={`mailto:${BRAND.emailAlt}`} className="hover:text-white transition-colors">
                  {BRAND.emailAlt}
                </a>
              </li>
              <li>
                <a href={`tel:${BRAND.phone.replace(/-/g, '')}`} className="hover:text-white transition-colors">
                  {BRAND.phone}
                </a>
              </li>
              <li>
                <a href={BRAND.calendly} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Book a consultation
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-warm-100/40 text-sm">
            {FOOTER.copyright}
          </p>
          <p className="text-warm-100/30 text-xs font-mono tracking-wider">
            /INOVERS — INNOVATING THE FUTURE, TOGETHER
          </p>
        </div>
      </div>
    </footer>
  )
}
