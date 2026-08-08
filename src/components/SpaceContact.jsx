import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BRAND, CONTACT } from '../lib/content'

gsap.registerPlugin(ScrollTrigger)

const FIELD =
  'w-full rounded-lg border border-star-300/30 bg-white px-4 py-3 text-sm text-star-100 placeholder:text-star-600 outline-none transition-colors focus:border-ember-500/60 dark:bg-space-950/60'

export default function SpaceContact() {
  const rootRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, message } = form
    const subject = `Project Inquiry — ${name}`
    const body = `Hi Inovers team,\n\n${message}\n\n— ${name} (${email})`

    // True API delivery once an access key is configured (Web3Forms)
    if (CONTACT.formAccessKey) {
      setStatus('sending')
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: CONTACT.formAccessKey,
            name,
            email,
            message,
            subject,
          }),
        })
        const data = await res.json()
        setStatus(data.success ? 'success' : 'error')
      } catch {
        setStatus('error')
      }
      return
    }

    // Fallback — same flow the old inovers.vercel.app used: open the
    // visitor's email app with the message pre-filled, and if the page
    // is still visible a second later, open Gmail compose as backup.
    const enc = encodeURIComponent
    const mailto = `mailto:${BRAND.email}?subject=${enc(subject)}&body=${enc(body)}`
    window.location.href = mailto
    setTimeout(() => {
      if (!document.hidden) {
        window.open(
          `https://mail.google.com/mail/?view=cm&fs=1&to=${BRAND.email}&su=${enc(subject)}&body=${enc(body)}`,
          '_blank'
        )
      }
    }, 1000)
    setStatus('success')
  }

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

  return (
    <section id="contact" ref={rootRef} className="relative mx-auto max-w-7xl px-6 py-28 lg:px-10">
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
            <form onSubmit={handleSubmit} className="rounded-2xl border border-star-300/30 bg-white/80 p-6 dark:bg-white/5">
              <p className="text-sm uppercase tracking-widest text-star-500">Email us</p>
              <div className="mt-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className={FIELD}
                  />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Your email"
                    className={FIELD}
                  />
                </div>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your project…"
                  className={`${FIELD} resize-none`}
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    aria-busy={status === 'sending'}
                    className="v2-btn v2-btn-primary group min-w-[12.5rem]"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send message'}
                    <span
                      aria-hidden="true"
                      className={`transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:translate-x-0 motion-reduce:transition-none ${
                        status === 'sending' ? 'opacity-0' : ''
                      }`}
                    >→</span>
                  </button>
                  {status === 'success' && (
                    <p className="text-xs text-star-300">
                      {CONTACT.formAccessKey
                        ? "Message sent — we'll get back to you within 24 hours."
                        : 'Your email app is opening — press Send to deliver it.'}
                    </p>
                  )}
                  {status === 'error' && (
                    <p className="text-xs text-ember-600">
                      Send failed — please email {BRAND.email} directly.
                    </p>
                  )}
                </div>
              </div>
            </form>

            <a
              href={BRAND.calendly}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-star-300/30 bg-white/80 p-6 transition-all hover:border-ember-500/50 hover:bg-ember-500/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember-400 dark:bg-white/5 dark:hover:bg-ember-500/10"
            >
              <div>
                <p className="text-sm uppercase tracking-widest text-star-500">Free consultation</p>
                <p className="mt-1 text-lg text-star-100">Book a 30-minute call</p>
              </div>
              <span className="text-2xl text-star-500 transition-all group-hover:translate-x-1 group-hover:text-ember-500">→</span>
            </a>

            <div className="flex items-center justify-between rounded-2xl border border-star-300/30 bg-white/80 p-6 dark:bg-white/5">
              <p className="text-sm uppercase tracking-widest text-star-500">Phone</p>
              <p className="text-lg text-star-100">{BRAND.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
