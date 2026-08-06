import { motion } from 'framer-motion'
import Reveal from './effects/Reveal'
import SectionHeading from './SectionHeading'
import { PROJECTS } from '../lib/content'

const expo = [0.16, 1, 0.3, 1]

export default function Portfolio() {
  return (
    <section id="work" className="relative py-28 md:py-36 bg-warm-100/60">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <SectionHeading eyebrow="Work">
              Projects we're{' '}
              <em className="font-medium italic text-transparent bg-clip-text bg-gradient-to-r from-ember-500 to-ember-400">
                proud of
              </em>
            </SectionHeading>
          </div>
          <Reveal delay={0.15}>
            <p className="text-ink-500 leading-relaxed max-w-sm md:text-right font-sans">
              From delivery platforms to hotel apps — real products shipping in the real world.
            </p>
          </Reveal>
        </div>

        {/* Project grid — editorial alternating rows */}
        <div className="flex flex-col gap-8">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.05}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.5, ease: expo }}
                className={`group relative bg-white rounded-3xl border border-ink-100 shadow-[0_2px_20px_rgba(26,20,16,0.04)] hover:shadow-[0_20px_50px_rgba(245,48,3,0.08)] transition-all duration-500 overflow-hidden ${
                  i % 2 === 1 ? 'md:flex-row-reverse' : ''
                } flex flex-col md:flex-row`}
              >
                {/* Visual tile */}
                <div className="md:w-2/5 min-h-[220px] relative overflow-hidden bg-gradient-to-br from-ember-500/90 via-ember-400/80 to-warm-300/70 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-[0.08] mix-blend-multiply"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '256px 256px' }}
                  />
                  {/* Big initial */}
                  <span className="relative text-[clamp(5rem,10vw,8rem)] font-black leading-none text-white/90 tracking-tighter">
                    {project.name.charAt(0)}
                  </span>
                  {/* Floating category chip */}
                  <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-ink-900/60 backdrop-blur-sm text-white/90 text-[11px] font-medium tracking-wide">
                    {project.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono tracking-wider text-ember-500">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="w-px h-3 bg-ink-200" />
                    <span className="text-xs font-medium tracking-[0.1em] uppercase text-ink-400">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-ink-900 mb-3">
                    {project.name}
                  </h3>
                  <p className="text-ink-500 leading-relaxed mb-6 max-w-lg">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 rounded-full bg-warm-100 text-ink-600 text-xs font-medium ring-1 ring-ink-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-2 text-sm font-semibold text-ember-600 hover:text-ember-500 transition-colors duration-300 w-fit"
                    >
                      Visit project
                      <span className="w-6 h-6 rounded-full bg-ember-50 flex items-center justify-center group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5 transition-transform duration-500">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                      </span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-ink-400">
                      In the works
                      <span className="w-1.5 h-1.5 rounded-full bg-ember-400 animate-pulse" />
                    </span>
                  )}
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
