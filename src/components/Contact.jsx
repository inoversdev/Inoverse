import Reveal from './effects/Reveal'
import SectionHeading from './SectionHeading'
import { CONTACT, BRAND } from '../lib/content'

export default function Contact() {
  return (
    <section id="contact" className="relative py-28 md:py-36 bg-warm-100/60">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <SectionHeading eyebrow="Contact">
          {CONTACT.heading.split(' together')[0]}
          {' '}
          <em className="font-medium italic text-transparent bg-clip-text bg-gradient-to-r from-ember-500 to-ember-400">
            together
          </em>
        </SectionHeading>

        {/* Two cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1 — Book a call (Calendly) */}
          <Reveal delay={0.1}>
            <div className="group h-full bg-white rounded-3xl border border-ink-100 shadow-[0_2px_20px_rgba(26,20,16,0.04)] hover:shadow-[0_20px_50px_rgba(245,48,3,0.08)] transition-all duration-500 p-8 md:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-ember-500 flex items-center justify-center text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-ink-900">
                  Why Choose a Call?
                </h3>
              </div>
              <ul className="text-ink-500 space-y-3 pl-6 list-disc mb-8">
                {CONTACT.callWhy.map((item) => (
                  <li key={item} className="leading-relaxed">{item}</li>
                ))}
              </ul>
              <a
                href={BRAND.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-2 px-6 py-3 bg-ink-900 text-white rounded-full text-sm font-medium hover:bg-ember-500 transition-all duration-500 ease-matie hover:scale-[0.97]"
              >
                Book Free Consultation
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover/link:translate-x-1 transition-transform duration-500">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </span>
              </a>
            </div>
          </Reveal>

          {/* Card 2 — Email (original mailto API kept verbatim) */}
          <Reveal delay={0.2}>
            <div className="group h-full bg-white rounded-3xl border border-ink-100 shadow-[0_2px_20px_rgba(26,20,16,0.04)] hover:shadow-[0_20px_50px_rgba(245,48,3,0.08)] transition-all duration-500 p-8 md:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-ink-900 flex items-center justify-center text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-ink-900">
                  Send Us an Email
                </h3>
              </div>
              <p className="text-ink-500 leading-relaxed mb-8">
                Prefer to write? Click below to open your email app with our address pre-filled, or use our direct email address.
              </p>

              <div className="bg-warm-100 rounded-2xl p-5 mb-6">
                <h4 className="font-semibold text-ink-900 mb-4 flex items-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-ember-500 mr-3">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  What to Include in Your Email:
                </h4>
                <ul className="text-ink-500 space-y-2 pl-6 list-disc">
                  {CONTACT.emailWhy.map((item) => (
                    <li key={item} className="leading-relaxed text-sm">{item}</li>
                  ))}
                </ul>
              </div>

              {/* Original mailto + Gmail compose fallback logic */}
              <button
                onClick={() => {
                  window.location.href = CONTACT.mailtoHref
                  setTimeout(() => {
                    if (document.hidden) {
                      window.open('https://mail.google.com/mail/?view=cm&fs=1&to=inovers.dev@gmail.com&su=Project%20Inquiry&body=Hi%20Inovers%20team,%0D%0A%0D%0AI%27m%20interested%20in%20discussing%20a%20project%20with%20you.%0D%0A%0D%0AProject%20Details:%0D%0A-%20%0D%0A%0D%0ABest%20regards,', '_blank')
                    }
                  }, 1500)
                }}
                className="group/link inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-ember-600 ring-1 ring-ember-200 hover:bg-ember-500 hover:text-white transition-all duration-500 ease-matie hover:scale-[0.97] w-full justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Open Email App
              </button>
              <div className="mt-4 text-center text-sm text-ink-400">
                Direct: <span className="text-ink-600 font-medium">{BRAND.email}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
