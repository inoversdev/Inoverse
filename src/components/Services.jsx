import { motion } from 'framer-motion'
import Reveal from './effects/Reveal'
import SectionHeading from './SectionHeading'
import { SERVICES } from '../lib/content'

const expo = [0.16, 1, 0.3, 1]

const ICONS = {
  globe: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  ),
  code: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  layers: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
}

export default function Services() {
  return (
    <section id="services" className="relative py-28 md:py-36 bg-warm-50">
      {/* Ember glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] ember-glow pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <SectionHeading eyebrow="Services">
          What we{' '}
          <em className="font-medium italic text-transparent bg-clip-text bg-gradient-to-r from-ember-500 to-ember-400">
            build
          </em>
        </SectionHeading>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.5, ease: expo }}
                className="group relative h-full bg-white rounded-3xl p-8 border border-ink-100 shadow-[0_2px_20px_rgba(26,20,16,0.04)] hover:shadow-[0_20px_50px_rgba(245,48,3,0.10)] transition-shadow duration-500"
              >
                {/* Promise badge */}
                <div className="absolute top-6 right-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ember-50 text-ember-600 text-[11px] font-semibold">
                    <span className="w-1 h-1 rounded-full bg-ember-500 animate-pulse" />
                    {service.promise}
                  </span>
                </div>

                {/* Icon tile */}
                <div className="w-14 h-14 rounded-2xl bg-ink-900 text-white flex items-center justify-center group-hover:bg-ember-500 transition-colors duration-500 mb-6">
                  {ICONS[service.icon]}
                </div>

                <h3 className="text-2xl font-bold tracking-tight text-ink-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-ink-500 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Feature chips */}
                <ul className="flex flex-wrap gap-2">
                  {service.features.map((f) => (
                    <li
                      key={f}
                      className="px-3 py-1.5 rounded-full bg-warm-100 text-ink-600 text-xs font-medium ring-1 ring-ink-100"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
