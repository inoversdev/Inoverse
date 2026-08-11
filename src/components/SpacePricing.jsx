import { BRAND, PRICING } from '../lib/content'
import SplitHeading from './SplitHeading'

// ─── Pricing — two tiers (Mat's call 2026-08-11): Starter at ₱599 "as
// low as" + Customize for tailored quotes. Same v2 grammar as the other
// sections: kicker, SplitHeading, glass cards, ember CTAs. Data lives
// in content.js (PRICING) — copy edits never touch code. ───
export default function SpacePricing() {
  return (
    <section id="pricing" className="relative mx-auto max-w-6xl px-6 py-20 lg:px-10">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-ember-500">
          {PRICING.eyebrow}
        </p>
        <SplitHeading
          as="h2"
          text={PRICING.heading}
          accent={PRICING.headingAccent}
          className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-star-100 sm:text-5xl"
        />
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-star-400">{PRICING.sub}</p>
      </div>

      <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
        {PRICING.plans.map((plan, i) => (
          <div
            key={plan.id}
            className={`v2-pricing-card glass relative flex flex-col rounded-2xl p-8 ${
              i === 0 ? 'border-ember-500/25' : ''
            }`}
          >
            {i === 0 && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-ember-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-[0_6px_20px_rgba(245,48,3,0.35)]">
                Most popular
              </span>
            )}

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember-600 dark:text-ember-300">
              {plan.tagline}
            </p>
            <div className="mt-2 flex items-baseline gap-1">
              {plan.price ? (
                <>
                  <span className="font-display text-5xl font-bold tracking-[-0.03em] text-star-100">
                    {plan.currency}
                    {plan.price}
                  </span>
                  <span className="text-sm text-star-500">{plan.cadence}</span>
                </>
              ) : (
                <span className="font-display text-3xl font-semibold tracking-tight text-star-100">
                  {plan.name}
                </span>
              )}
            </div>
            <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-star-100">
              {plan.name}
            </h3>

            <ul className="mt-6 space-y-2.5 border-t border-star-300/20 pt-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-star-300">
                  <span className="mt-0.5 text-ember-500">✦</span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-2">
              <a
                href={BRAND.calendly}
                target="_blank"
                rel="noreferrer"
                className={`${i === 0 ? 'v2-btn v2-btn-primary' : 'v2-btn v2-btn-ghost'} group w-full`}
              >
                {plan.cta}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:translate-x-0 motion-reduce:transition-none"
                >→</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
