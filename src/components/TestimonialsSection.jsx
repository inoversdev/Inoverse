import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TESTIMONIALS, TESTIMONIALS_PAGE } from '../lib/content'
import { applyCardReveal } from '../lib/cardReveal'
import SplitHeading from './SplitHeading'
import RatingBadge from './RatingBadge'
import TestimonialCard from './TestimonialCard'

gsap.registerPlugin(ScrollTrigger)

// ─── Testimonial grid — v4 alternating slide + star-pop stagger ───
function TestimonialGrid() {
  const rootRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      applyCardReveal(rootRef, '.testimonial-card', { x: 80 })
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
    <div ref={rootRef}>
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
    </div>
  )
}

// ─── Testimonials — home section, sits right after Why Inovers ───
// Was a standalone /testimonials route (Phase 2); merged onto the home
// scroll per Mat's call (2026-08-10). Content honesty (plan §6.1) still
// applies: an empty TESTIMONIALS array renders the hold state, demo
// entries carry the sample-layout ribbon.
export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="mb-14 max-w-xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ember-500">{TESTIMONIALS_PAGE.eyebrow}</p>
        <SplitHeading
          as="h2"
          text={TESTIMONIALS_PAGE.heading}
          accent={TESTIMONIALS_PAGE.headingAccent}
          className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-star-100 sm:text-5xl"
        />
        <p className="mt-5 leading-relaxed text-star-400">{TESTIMONIALS_PAGE.lede}</p>
      </div>

      {TESTIMONIALS.length > 0 ? (
        <>
          <RatingBadge />
          <TestimonialGrid />
        </>
      ) : (
        <div className="glass rounded-3xl px-8 py-14 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-ember-500/40 text-ember-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true">
              <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.6 0-3.1-.4-4.4-1.2L3 20l1.2-5.1A8.5 8.5 0 1 1 21 11.5z" />
              <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="font-display text-xl font-semibold text-star-100">{TESTIMONIALS_PAGE.holdHeading}</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-star-400">{TESTIMONIALS_PAGE.holdNote}</p>
        </div>
      )}
    </section>
  )
}
