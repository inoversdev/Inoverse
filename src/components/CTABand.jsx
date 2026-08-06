import Reveal from './effects/Reveal'
import { BRAND } from '../lib/content'

export default function CTABand() {
  return (
    <section className="relative py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink-900 px-8 py-16 md:px-16 md:py-20 text-center">
            {/* Ember gradient wash */}
            <div className="absolute inset-0 bg-gradient-to-br from-ember-500/25 via-transparent to-ember-500/10" />
            <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-ember-500/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-ember-600/15 blur-3xl" />

            <div className="relative z-10">
              <span className="text-xs font-mono tracking-wider text-ember-300 uppercase">/Free 30-min consultation</span>
              <h2 className="font-display text-[clamp(1.8rem,4.5vw,3.2rem)] font-light leading-[1.1] tracking-[-0.02em] text-white mt-5 mb-5">
                Get personalized advice
                <br />
                <em className="font-medium italic text-ember-300">from our experts</em>
              </h2>
              <p className="text-warm-100/70 leading-relaxed max-w-xl mx-auto mb-10">
                Book a free 30-minute consultation to discuss your project needs and receive immediate feedback.
              </p>
              <a
                href={BRAND.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-7 py-3.5 bg-ember-500 text-white rounded-full text-sm font-semibold hover:bg-ember-400 transition-all duration-500 ease-matie hover:scale-[0.97] active:scale-[0.95]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Book Free Consultation
                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-500">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
