import Reveal from './effects/Reveal'
import SectionHeading from './SectionHeading'
import { PROCESS } from '../lib/content'

export default function Process() {
  return (
    <section id="process" className="relative py-28 md:py-36 bg-warm-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <SectionHeading eyebrow="Process">
          How we{' '}
          <em className="font-medium italic text-transparent bg-clip-text bg-gradient-to-r from-ember-500 to-ember-400">
            work
          </em>
        </SectionHeading>

        {/* Timeline — 4 steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {PROCESS.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.12}>
              <div className="relative h-full group">
                {/* Connector line (desktop) */}
                {i < PROCESS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+2rem)] right-[calc(-50%+2rem)] h-px bg-ink-200" />
                )}

                <div className="relative h-full bg-white rounded-3xl border border-ink-100 p-8 shadow-[0_2px_20px_rgba(26,20,16,0.04)] hover:shadow-[0_20px_50px_rgba(245,48,3,0.08)] transition-shadow duration-500 group-hover:-translate-y-1 transition-transform duration-500 ease-matie">
                  {/* Step number */}
                  <div className="w-12 h-12 rounded-full bg-ink-900 text-white flex items-center justify-center text-sm font-bold font-mono group-hover:bg-ember-500 transition-colors duration-500 mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-ink-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-ink-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
