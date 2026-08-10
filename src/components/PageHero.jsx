import SplitHeading from './SplitHeading'

// ─── Sub-page hero — eyebrow + SplitHeading + lede ───
// Used by /projects. Why Inovers and Testimonials moved onto the home
// scroll (WhyInoversSection / TestimonialsSection) and use a lighter
// mid-page header instead — this one's sized for the top of a page,
// under the fixed nav.
export default function PageHero({ eyebrow, heading, accent, lede }) {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-40 pb-16 lg:px-10 lg:pt-48">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ember-500">{eyebrow}</p>
      <SplitHeading
        as="h1"
        text={heading}
        accent={accent}
        className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-star-100 sm:text-5xl lg:text-6xl"
      />
      {lede ? (
        <p className="mt-5 max-w-lg leading-relaxed text-star-400">{lede}</p>
      ) : null}
    </section>
  )
}
