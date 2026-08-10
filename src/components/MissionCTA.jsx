import { Link } from 'react-router-dom'
import { BRAND } from '../lib/content'

// ─── Closing CTA band — used by /projects. `secondary` (optional) adds
// a second, quieter link to another page.
export default function MissionCTA({ heading, accent, sub, secondary }) {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-28 lg:px-10">
      <div className="glass relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-14">
        <div
          data-parallax="0.12"
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-ember-500/20 blur-[90px]"
        />
        <h2 className="relative font-display text-3xl font-semibold leading-[1.1] tracking-tight text-star-100 sm:text-4xl">
          {heading} <span className="ember-text font-light">{accent}</span>
        </h2>
        {sub ? (
          <p className="relative mx-auto mt-4 max-w-md text-sm leading-relaxed text-star-400">{sub}</p>
        ) : null}
        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={BRAND.calendly}
            target="_blank"
            rel="noreferrer"
            className="v2-btn v2-btn-primary v2-btn-lg group"
          >
            Book a Call
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:translate-x-0 motion-reduce:transition-none"
            >
              →
            </span>
          </a>
          {secondary ? (
            <Link to={secondary.to} className="v2-btn v2-btn-ghost v2-btn-lg">
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
