import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS, BRAND } from '../lib/content'

const expo = [0.16, 1, 0.3, 1]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: expo }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-matie ${
        scrolled
          ? 'bg-warm-50/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(26,20,16,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group"
            aria-label="Inovers home"
          >
            <img
              src="/logo.svg"
              alt="Inovers Logo"
              className="h-9 w-auto transition-transform duration-500 ease-matie group-hover:scale-105 group-hover:-rotate-3"
            />
            <span className="text-xl font-bold tracking-tight text-ink-900">Inovers</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollTo(link.target)}
                className="text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors duration-300"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('contact')}
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-ink-900 text-white text-sm font-medium hover:bg-ember-500 transition-all duration-500 ease-matie hover:scale-[0.97] active:scale-[0.95]"
            >
              Get Started
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-ink-900 transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-6 bg-ink-900 transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-ink-900 transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: expo }}
            className="md:hidden bg-warm-50/95 backdrop-blur-xl border-t border-ink-100"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.target}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4, ease: expo }}
                  onClick={() => { setOpen(false); scrollTo(link.target) }}
                  className="text-left text-2xl font-bold tracking-tight text-ink-900 hover:text-ember-500 transition-colors"
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.4, ease: expo }}
                onClick={() => { setOpen(false); scrollTo('contact') }}
                className="mt-2 inline-flex justify-center items-center px-5 py-3 rounded-full bg-ember-500 text-white text-sm font-medium hover:bg-ember-600 transition-colors"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
