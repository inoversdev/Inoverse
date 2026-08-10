import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TESTIMONIALS, TESTIMONIALS_META, TESTIMONIALS_PAGE } from '../lib/content'
import PageHero from '../components/PageHero'
import RatingBadge from '../components/RatingBadge'
import TestimonialCard from '../components/TestimonialCard'
import MissionCTA from '../components/MissionCTA'

gsap.registerPlugin(ScrollTrigger)

// ─── Testimonial grid — rise + star-pop stagger, ported from v4 ───
function TestimonialGrid() {
  const rootRef = useRef(null)

  useEffect(() => {
    // Reduced motion: cards rest in place — no rise, no star pop.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.testimonial-card', {
        y: 70,
        opacity: 0,
        duration: 0.8,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 88%', once: true },
      })
      gsap.from('.testimonial-stars svg', {
        scale: 0,
        rotation: 180,
        opacity: 0,
        duration: 0.4,
        stagger: 0.04,
        ease: 'back.out(2)',
        delay: 0.2,
        scrollTrigger: { trigger: rootRef.current, start: 'top 88%', once: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative mx-auto max-w-7xl px-6 pb-24 lg:px-10">
      {TESTIMONIALS.some((t) => t.demo) ? (
        <p className="glass mx-auto mb-10 w-fit rounded-full px-5 py-2 text-xs font-medium text-ember-500">
          {TESTIMONIALS_PAGE.demoRibbon}
        </p>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <TestimonialCard key={t.id} item={t} />
        ))}
      </div>
    </section>
  )
}

export default function TestimonialsPage() {
  return (
    <div>
      <PageHero
        eyebrow={TESTIMONIALS_PAGE.eyebrow}
        heading={TESTIMONIALS_PAGE.heading}
        accent={TESTIMONIALS_PAGE.headingAccent}
        lede={TESTIMONIALS_PAGE.lede}
      />

      {/* Content honesty (plan §6.1): demo entries render with a visible
          sample-layout ribbon; real quotes (status 'live') turn it off;
          an empty array falls back to the hold state. */}
      {TESTIMONIALS.length > 0 ? (
        <>
          <RatingBadge />
          <TestimonialGrid />
        </>
      ) : (
        <section className="relative mx-auto max-w-7xl px-6 pb-24 lg:px-10">
          <div className="glass rounded-3xl px-8 py-14 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-ember-500/40 text-ember-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true">
                <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.6 0-3.1-.4-4.4-1.2L3 20l1.2-5.1A8.5 8.5 0 1 1 21 11.5z" />
                <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-semibold text-star-100">
              {TESTIMONIALS_PAGE.holdHeading}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-star-400">
              {TESTIMONIALS_PAGE.holdNote}
            </p>
          </div>
        </section>
      )}

      <MissionCTA
        heading={TESTIMONIALS_PAGE.cta.heading}
        accent={TESTIMONIALS_PAGE.cta.accent}
        sub={TESTIMONIALS_PAGE.cta.sub}
        secondary={TESTIMONIALS_PAGE.cta.secondary}
      />
    </div>
  )
}
