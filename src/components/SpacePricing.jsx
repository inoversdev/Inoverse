import { BRAND, PRICING } from '../lib/content'
import SplitHeading from './SplitHeading'

// Crown mark for the Premium badge
const Crown = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
    <path d="M2.5 8l4 3.5L12 4l5.5 7.5 4-3.5-2 9h-15l-2-9z" />
  </svg>
)

// ─── Pricing — two tiers (Mat's call 2026-08-11). Cards use the SAME
// design as the Why Inovers compare deck: the PREMIUM (Customize) card
// is the standout — ember gradient-tint surface, glow, taller scale,
// primary CTA (Mat's call: "apply the standout to Customize since it
// is Premium"); the Starter sits neutral beside it. Identical 3D tilt
// interaction (rotateX 6 / rotateY ±8 / translateZ 20). Badges stay
// clean pills — Most popular (solid ember) vs Premium (ember→gold,
// crown). Copy lives in content.js PRICING. ───
export default function SpacePricing() {
  return (
    <section id="pricing" className="relative mx-auto max-w-6xl px-6 py-20 lg:px-10">
      <div className="mx-auto mb-16 max-w-2xl text-center">
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

      <div className="mx-auto grid max-w-4xl items-stretch gap-8 sm:grid-cols-2">
        {PRICING.plans.map((plan, i) => {
          // The PREMIUM (Customize) card is the standout — tint, glow,
          // taller scale (Mat's call 2026-08-11: "instead of most
          // popular, apply it to Customize since it is Premium").
          const standout = i === 1
          return (
            <div
              key={plan.id}
              className={`v2-pricing-card isolate relative flex flex-col rounded-3xl p-8 transition-transform duration-500 ease-out [transform-style:preserve-3d] hover:[transform:rotateX(6deg)_rotateY(-8deg)_translateZ(20px)] motion-reduce:hover:transform-none sm:p-9 ${
                standout
                  ? 'premium-glow border border-ember-500/35 bg-gradient-to-b from-ember-500/[0.09] to-transparent shadow-[0_30px_70px_-25px_rgba(245,48,3,0.45)] md:scale-[1.03]'
                  : 'border border-star-300/15 bg-star-800/[0.015] dark:bg-white/[0.02] md:scale-[0.97]'
              }`}
            >
              {/* Live halo — the blurred ember aura behind the Premium
                  card, swelling on a 5s cycle (see index.css) */}
              {standout && (
                <span
                  aria-hidden="true"
                  className="premium-halo pointer-events-none absolute -inset-4 -z-10 rounded-3xl"
                />
              )}
              {plan.badge && (
                <span
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-[0_8px_24px_rgba(245,48,3,0.4)] ${
                    i === 0
                      ? 'bg-ember-500'
                      : 'bg-gradient-to-r from-ember-600 via-ember-500 to-amber-400'
                  }`}
                >
                  {i === 1 && <Crown />} {plan.badge}
                </span>
              )}

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember-600 dark:text-ember-300">
                {plan.tagline}
              </p>

              {/* Oversized price — the hero of the card */}
              <div className="mt-4 flex items-baseline gap-2">
                {plan.price ? (
                  <>
                    <span className="font-display text-6xl font-bold leading-none tracking-[-0.04em] text-star-100 sm:text-7xl">
                      {plan.currency}
                      {plan.price}
                    </span>
                    <span className="text-base text-star-500">{plan.cadence}</span>
                  </>
                ) : (
                  <span className="font-display text-4xl font-bold tracking-[-0.03em] text-star-100 sm:text-5xl">
                    {plan.name}
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-star-100">
                {plan.name}
              </h3>

              <ul className="mt-8 space-y-3.5 border-t border-star-300/20 pt-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-base text-star-300">
                    <span className="mt-1 text-ember-500">✦</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-10 pt-2">
                <a
                  href={BRAND.calendly}
                  target="_blank"
                  rel="noreferrer"
                  className={`${standout ? 'v2-btn v2-btn-primary' : 'v2-btn v2-btn-ghost'} group/btn w-full`}
                >
                  {plan.cta}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-out group-hover/btn:translate-x-1 motion-reduce:translate-x-0 motion-reduce:transition-none"
                  >→</span>
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
