import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import UfoCanvas from './effects/UfoCanvas'
import { HERO } from '../lib/content'

gsap.registerPlugin(ScrollTrigger)

const expo = [0.16, 1, 0.3, 1]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

/* Editorial fade + rise — distinct from Portfolio's letter-by-letter 3D */
const rise = {
  hidden: { opacity: 0, y: 36, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease: expo },
  },
}

export default function Hero() {
  const [loaded, setLoaded] = useState(false)
  const ufoWrapRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    setLoaded(true)

    // UFO parallax on scroll — the UFO drifts slower than the page
    const ctx = gsap.context(() => {
      gsap.to(ufoWrapRef.current, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, [ufoWrapRef])

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-warm-50"
    >
      {/* ─── UFO display (right side) ─── */}
      <div ref={ufoWrapRef} className="absolute inset-y-0 right-0 w-full md:w-[58%] pointer-events-none">
        {/* Pedestal glow behind the UFO */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] md:w-[560px] md:h-[560px] rounded-full bg-[radial-gradient(circle,rgba(245,48,3,0.10)_0%,rgba(245,48,3,0.04)_40%,transparent_70%)]" />
        <UfoCanvas />
      </div>

      {/* Soft studio gradient wash */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-24 w-[500px] h-[500px] rounded-full bg-ember-100/25 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-warm-200/50 to-transparent blur-3xl" />
      </div>

      {/* ─── Content (left editorial column) ─── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-8 flex-1 flex flex-col justify-center pt-28 pb-16">
        <div ref={contentRef} className="max-w-2xl">
          {/* Eyebrow */}
          <motion.div
            variants={rise}
            initial="hidden"
            animate={loaded ? 'visible' : 'hidden'}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-3 text-[11px] font-mono tracking-[0.18em] uppercase text-ink-500">
              <span className="w-8 h-px bg-ember-500" />
              {HERO.eyebrow}
            </span>
          </motion.div>

          {/* Serif headline — editorial, distinct voice */}
          <motion.h1
            variants={rise}
            initial="hidden"
            animate={loaded ? 'visible' : 'hidden'}
            transition={{ delay: 0.1 }}
            className="font-display text-[clamp(2.8rem,7.5vw,6rem)] font-light leading-[1.02] tracking-[-0.02em] text-ink-900"
          >
            Innovating the
            <br />
            <em className="font-medium italic text-transparent bg-clip-text bg-gradient-to-r from-ember-500 to-ember-400">
              future,
            </em>
            <br />
            together.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={rise}
            initial="hidden"
            animate={loaded ? 'visible' : 'hidden'}
            transition={{ delay: 0.25 }}
            className="text-base md:text-lg text-ink-500 max-w-md leading-relaxed mt-8 font-sans"
          >
            {HERO.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={rise}
            initial="hidden"
            animate={loaded ? 'visible' : 'hidden'}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 flex-wrap mt-10"
          >
            <button
              onClick={() => scrollTo('work')}
              className="group relative inline-flex items-center gap-3 px-6 py-3 bg-ink-900 text-white rounded-full text-sm font-medium transition-all duration-500 ease-matie hover:bg-ember-500 hover:scale-[0.96] active:scale-[0.94]"
            >
              {HERO.ctaPrimary}
              <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </span>
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-ink-600 hover:text-ink-900 transition-all duration-500 ease-matie ring-1 ring-ink-300 hover:ring-ember-400 hover:scale-[0.96]"
            >
              {HERO.ctaSecondary}
              <span className="w-7 h-7 rounded-full bg-warm-100 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </span>
            </button>
          </motion.div>

          {/* Meta */}
          <motion.div
            variants={rise}
            initial="hidden"
            animate={loaded ? 'visible' : 'hidden'}
            transition={{ delay: 0.55 }}
            className="mt-14 flex items-center gap-3 text-xs text-ink-400"
          >
            <span className="font-mono tracking-wider">/BUILDING FOR BUSINESS</span>
            <span className="w-px h-3 bg-ink-200" />
            <span className="tracking-tight">Web · Mobile · AI</span>
            <span className="w-px h-3 bg-ink-200" />
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-ember-500 animate-pulse" />
              Websites in 3 days
            </span>
          </motion.div>
        </div>
      </div>

      {/* Vertical side label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ delay: 1.4, duration: 1, ease: expo }}
        className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 z-10 items-center gap-3 [writing-mode:vertical-rl]"
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-ink-400">
          Est. Philippines
        </span>
        <span className="w-px h-16 bg-ink-200" />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ delay: 1.6, duration: 0.8, ease: expo }}
        className="relative z-10 flex justify-center pb-10"
      >
        <motion.div
          animate={{ y: [0, 6, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: expo }}
          className="w-5 h-8 rounded-full ring-1 ring-ink-300/60 flex items-start justify-center pt-2"
        >
          <div className="w-1 h-2 rounded-full bg-ember-500" />
        </motion.div>
      </motion.div>
    </section>
  )
}
