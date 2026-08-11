import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BRAND, CONTACT } from '../lib/content'

gsap.registerPlugin(ScrollTrigger)

export default function SpaceContact() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.v2-contact-block').forEach((block) => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 92%',
              once: true,
            },
          }
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const vibsLive = Boolean(CONTACT.vibs.url)

  return (
    <section id="contact" ref={rootRef} className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="glass relative overflow-hidden rounded-3xl p-8 sm:p-14">
        <div
          data-parallax="0.12"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ember-500/20 blur-[90px]"
        />

        <div className="relative grid gap-12 lg:grid-cols-2">
          <div className="v2-contact-block">
            <p data-parallax="-0.1" className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ember-500">Contact</p>
            <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-star-100 sm:text-5xl">
              Let's build something <span className="ember-text font-light">together</span>
            </h2>
            <p className="mt-5 text-star-400">{CONTACT.subheading}</p>

            <ul className="mt-8 space-y-3">
              {CONTACT.callWhy.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm text-star-300">
                  <span className="mt-0.5 text-ember-500">✦</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="v2-contact-block space-y-5">
            {/* ── Vibs — THE contact channel now. Email form removed,
                   then the free-consultation card removed too (Mat's
                   calls 2026-08-11) — Vibs takes the full spotlight.
                   CONTACT.vibs.url is the wiring point; empty → disabled
                   "coming soon" state so demos never look broken. ── */}
            <div className="relative overflow-hidden rounded-2xl border border-ember-500/25 bg-white/80 p-7 dark:border-ember-500/20 dark:bg-white/5">
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-ember-500/15 blur-[60px]" />
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ember-500/40 text-ember-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      vibsLive
                        ? 'bg-ember-500/15 text-ember-600 dark:text-ember-300'
                        : 'bg-star-100/10 text-star-500'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${vibsLive ? 'bg-ember-500' : 'bg-star-500'}`} />
                    {vibsLive ? 'Live' : 'Coming soon'}
                  </span>
                </div>
                <p className="mt-5 text-sm uppercase tracking-widest text-star-500">{CONTACT.vibs.label}</p>
                <p className="mt-1 text-xl text-star-100">Message us on {CONTACT.vibs.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-star-400">{CONTACT.vibs.blurb}</p>
                <div className="mt-6">
                  {vibsLive ? (
                    <a
                      href={CONTACT.vibs.url}
                      target="_blank"
                      rel="noreferrer"
                      className="v2-btn v2-btn-primary group w-full"
                    >
                      Start a conversation
                      <span aria-hidden="true" className="transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className="v2-btn v2-btn-primary w-full opacity-60"
                    >
                      Start a conversation
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-star-300/30 bg-white/80 p-5 dark:bg-white/5">
              <p className="text-sm uppercase tracking-widest text-star-500">Phone</p>
              <p className="text-lg text-star-100">{BRAND.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
