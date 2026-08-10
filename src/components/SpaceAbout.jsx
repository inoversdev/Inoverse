import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import { ABOUT, BRAND, CREW, CREW_PAGE } from '../lib/content'
import SplitHeading from './SplitHeading'
import { CrewAvatar } from './CrewCard'

gsap.registerPlugin(ScrollTrigger)

// How many avatar discs the teaser shows before collapsing the rest into
// a "+N" disc. Six fills the row at every breakpoint without wrapping.
const TEASER_COUNT = 6

export default function SpaceAbout() {
  const rootRef = useRef(null)
  const lenis = useLenis()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.v2-about-copy').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          }
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const handleCta = (e) => {
    e.preventDefault()
    if (lenis) {
      lenis.scrollTo('#contact', {
        offset: 0,
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="about" ref={rootRef} className="relative mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Narrative */}
        <div className="lg:col-span-5">
          <p className="v2-about-copy mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ember-600">
            {ABOUT.eyebrow}
          </p>
          <SplitHeading
            as="h2"
            text={`${ABOUT.heading} ${ABOUT.headingHighlight}`}
            accent={ABOUT.headingHighlight}
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-star-100 sm:text-5xl"
          />
          {ABOUT.paragraphs.map((p) => (
            <p key={p} className="v2-about-copy mt-5 leading-relaxed text-star-400">
              {p}
            </p>
          ))}
          <div className="v2-about-copy mt-9 flex flex-wrap gap-4">
            <button onClick={handleCta} className="v2-btn v2-btn-primary v2-btn-lg group">
              {ABOUT.cta}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:translate-x-0 motion-reduce:transition-none"
              >→</span>
            </button>
            <a
              href={BRAND.calendly}
              target="_blank"
              rel="noreferrer"
              className="v2-btn v2-btn-ghost v2-btn-lg"
            >
              {ABOUT.ctaSecondary}
            </a>
          </div>
        </div>

        {/* Crew teaser — the 3D orbital org chart that used to live in this
            column moved to /crew (components/OrbitalBand); it is not
            duplicated here. What's left is a compact pointer: a cluster of
            crew discs and a link through to the full page. The section's
            two-column layout and its .v2-about-copy scroll reveal are
            unchanged. */}
        <div className="flex items-center lg:col-span-7">
          <div className="v2-about-copy glass relative w-full overflow-hidden rounded-3xl p-8 sm:p-10">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-ember-500/15 blur-[80px]"
            />
            <p className="relative mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ember-500">
              {CREW_PAGE.teaser.eyebrow}
            </p>
            <p className="relative max-w-md leading-relaxed text-star-400">
              {CREW_PAGE.teaser.line}
            </p>

            {/* Same discs the /crew cards use (CrewAvatar), so a real photo
                dropped into content.js shows up in both places at once. */}
            <div className="relative mt-8 flex flex-wrap items-center gap-3">
              {CREW.slice(0, TEASER_COUNT).map((m) => (
                <CrewAvatar key={m.id} member={m} size="h-14 w-14 text-xs" />
              ))}
              {CREW.length > TEASER_COUNT ? (
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-dashed border-star-300/35 text-xs font-semibold text-star-400">
                  +{CREW.length - TEASER_COUNT}
                </span>
              ) : null}
            </div>

            <Link
              to={CREW_PAGE.teaser.to}
              className="group relative mt-8 inline-flex items-center gap-2 text-sm font-medium text-star-300 transition-colors hover:text-ember-500"
            >
              {CREW_PAGE.teaser.link}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:translate-x-0 motion-reduce:transition-none"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
