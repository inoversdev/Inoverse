import { createContext, useContext, useEffect, useState } from 'react'

// ─── Theme system — light (white) is the DEFAULT base; dark = Space classic.
// The `.dark` class on <html> flips the design-token CSS variables in index.css.
// Persisted in localStorage so the visitor's choice survives reloads.
//
// Toggle uses a deterministic soft "dip": a solid overlay in the TARGET
// theme's base color fades in (masking the 3D-scene re-skin), the theme
// flips underneath, then the overlay fades out with the signature ease
// cubic-bezier(0.16, 1, 0.3, 1). Falls back to an instant switch for
// reduced-motion.

const STORAGE_KEY = 'inovers-theme'
const MATIE_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} })

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })

  // Apply the theme to <html> + meta theme-color
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#080706' : '#F7F6F4')
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* storage unavailable — theme still works for the session */
    }
  }, [theme])

  const applyThemeDom = (t) => {
    document.documentElement.classList.toggle('dark', t === 'dark')
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', t === 'dark' ? '#080706' : '#F7F6F4')
    try {
      localStorage.setItem(STORAGE_KEY, t)
    } catch {
      /* storage unavailable */
    }
  }

  const toggleTheme = (e) => {
    const next = theme === 'dark' ? 'light' : 'dark'

    // ─── Flip the theme IMMEDIATELY (synchronous) ───
    // The toggle never depends on animation timing — even if the browser
    // starves the frame loop (e.g. heavy WebGL on software rendering), the
    // theme still switches. The overlay below is purely cosmetic masking.
    applyThemeDom(next)
    setTheme(next)

    // ─── Soft dip mask (cosmetic) ───
    // Overlay starts transparent, fades to the TARGET base color (hiding the
    // instant 3D re-skin), then fades out with the signature ease.
    if (typeof document === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const overlay = document.createElement('div')
    overlay.setAttribute('aria-hidden', 'true')
    overlay.style.cssText = `position:fixed;inset:0;z-index:9998;pointer-events:none;opacity:0;background:${
      next === 'dark' ? '#080706' : '#F7F6F4'
    }`
    document.body.appendChild(overlay)

    // Safety net: never leave a stuck overlay behind
    const cleanup = setTimeout(() => {
      if (overlay.isConnected) overlay.remove()
    }, 1200)

    const fadeIn = overlay.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 180,
      easing: 'ease-in',
    })
    fadeIn.onfinish = () => {
      const fadeOut = overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 450,
        easing: MATIE_EASE,
      })
      fadeOut.onfinish = () => {
        clearTimeout(cleanup)
        overlay.remove()
      }
    }
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
