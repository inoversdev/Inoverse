import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ABOUT, BRAND } from '../lib/content'
import SplitHeading from './SplitHeading'
import OrbitSystem from './OrbitSystem'

gsap.registerPlugin(ScrollTrigger)

export default function SpaceAbout() {
  const rootRef = useRef(null)

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

  return (
    <section id="about" ref={rootRef} className="relative mx-auto max-w-7xl overflow-x-clip px-6 py-24 lg:px-10">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Narrative */}
        <div className="lg:col-span-5">
          <p data-parallax="-0.1" className="v2-about-copy mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ember-600">
            {ABOUT.eyebrow}
          </p>
          <SplitHeading
            as="h2"
            text={`${ABOUT.heading} ${ABOUT.headingHighlight}`}
            accent={ABOUT.headingHighlight}
            className="font-display text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.03em] text-star-100 sm:text-6xl"
          />
          {ABOUT.paragraphs.map((p) => (
            <p key={p} className="v2-about-copy mt-5 leading-relaxed text-star-400">
              {p}
            </p>
          ))}
          <div className="v2-about-copy mt-9 flex flex-wrap gap-4">
            {/* Crews → the /crew page — the About section is the crew's
                home ("The crew behind Inovers"), so its primary action
                opens the crew (Mat's call 2026-08-10). */}
            <Link to="/crew" className="v2-btn v2-btn-primary v2-btn-lg group">
              {ABOUT.cta}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:translate-x-0 motion-reduce:transition-none"
              >→</span>
            </Link>
            {/* Work With Us → books the free call directly (Mat's call
                2026-08-10): working with Inovers starts with the
                booking, not the form. */}
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

        {/* The interactive orbital org chart — the same OrbitSystem the
            /crew page opens with (drag to spin, medallions billboard).
            Restored here per Mat's call after the /crew relocation. */}
        <div className="flex items-center lg:col-span-7">
          <OrbitSystem />
        </div>
      </div>
    </section>
  )
}
