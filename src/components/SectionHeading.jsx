import Reveal from './effects/Reveal'

export default function SectionHeading({ eyebrow, children, description, align = 'left' }) {
  return (
    <Reveal>
      <div className={`mb-16 md:mb-20 ${align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'}`}>
        <span className="inline-flex items-center gap-3 text-[11px] font-mono tracking-[0.18em] uppercase text-ink-500">
          <span className="w-8 h-px bg-ember-500" />
          {eyebrow}
        </span>
        <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-light leading-[1.05] tracking-[-0.02em] text-ink-900 mt-5">
          {children}
        </h2>
        {description && (
          <p className="text-base md:text-lg text-ink-500 leading-relaxed mt-6 font-sans">
            {description}
          </p>
        )}
      </div>
    </Reveal>
  )
}
