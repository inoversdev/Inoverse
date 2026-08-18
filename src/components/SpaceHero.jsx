import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import { HERO } from '../lib/content'

gsap.registerPlugin(ScrollTrigger)

export default function SpaceHero() {
  const rootRef = useRef(null)
  const lenis = useLenis()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.v2-hero-reveal',
        { opacity: 0, y: 40, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.4,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.2,
        }
      )
      // Hero content parallax fade + shrink — in sync with the UFO departure
      gsap.to('.v2-hero-content', {
        opacity: 0,
        y: -40,
        scale: 0.55,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      // Soft glam glow behind the headline — fades out as the UFO departs
      gsap.to('.v2-hero-glow', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const scrollToContact = (e) => {
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
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      {/* Soft glam glow — the UFO lighting this part of the sky.
          data-parallax: drifts slower than the pinned text as you scroll
          into the hero, reading as a layer further back in the scene. */}
      <div
        data-parallax="0.2"
        className="v2-hero-glow pointer-events-none absolute left-1/2 top-[38%] h-[62vh] w-[80vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(245,48,3,0.16) 0%, rgba(245,48,3,0.06) 45%, transparent 70%)',
          filter: 'blur(30px)',
        }}
        aria-hidden="true"
      />
      <div className="v2-hero-content mx-auto max-w-5xl text-center">
        <p className="v2-hero-reveal mb-6 text-xs uppercase tracking-[0.2em] text-ember-500">
          {HERO.eyebrow}
        </p>
        <h1 className="v2-hero-reveal font-display text-6xl font-bold leading-[0.9] tracking-[-0.045em] text-star-100 sm:text-8xl lg:text-[7.5rem] text-balance">
          Innovating the <span className="ember-text font-light">Future,</span>
          <br />
          Together.
        </h1>
        <p className="v2-hero-reveal mx-auto mt-8 max-w-xl text-base text-star-400 sm:text-lg">
          {HERO.subtitle}
        </p>
        <div className="v2-hero-reveal mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#contact"
            onClick={scrollToContact}
            className="v2-btn v2-btn-primary v2-btn-lg group"
          >
            {HERO.ctaPrimary}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:translate-x-0 motion-reduce:transition-none"
            >→</span>
          </a>
        </div>
        <p className="v2-hero-reveal mt-14 text-xs uppercase tracking-[0.2em] text-star-600">
          Scroll to begin the journey ↓
        </p>
      </div>
    </section>
  )
}
