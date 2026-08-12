// ─── Device capability profile — gates every expensive effect so the
// site runs smooth on low-end laptops/phones (Mat's call 2026-08-12:
// "optimize for low-end devices").
//
// A device is LOW-END if it fails ANY of these:
//   - 4GB or less RAM (navigator.deviceMemory — Chromium only; unknown
//     on Safari/Firefox, so that alone never triggers low-end)
//   - 4 or fewer CPU cores (navigator.hardwareConcurrency)
//   - Mobile / small screen (phablet+ only — phones have weak GPUs and
//     no hover to notice the missing polish)
//   - Software rendering (SwiftShader / llvmpipe = no GPU acceleration)
//
// The profile is computed once and cached; components read it through
// useDeviceProfile() (a hook that also flips the `low-end` class on
// <html> so CSS can kill blurs/glows declaratively).

import { useSyncExternalStore } from 'react'

let cached = null

export function getDeviceProfile() {
  if (cached) return cached
  if (typeof window === 'undefined') {
    cached = { lowEnd: false, dprCap: 1.5, starScale: 1, subtle: false }
    return cached
  }

  const nav = navigator

  const deviceMemory = nav.deviceMemory // GB, Chromium only; undefined elsewhere
  const cores = nav.hardwareConcurrency || 8
  const mobile = /Mobi|Android|iPhone|iPad/i.test(nav.userAgent || '')
  const smallScreen = window.innerWidth < 768

  // Software rendering detection: read the WebGL renderer string.
  let swr = false
  try {
    const c = document.createElement('canvas')
    const gl =
      c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl')
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info')
      const r = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : ''
      swr = /swiftshader|llvmpipe|software/i.test(r)
    }
  } catch {
    swr = true // no WebGL at all → treat as low-end
  }

  const weakRam = typeof deviceMemory === 'number' && deviceMemory <= 4
  const weakCores = cores <= 4
  const isMobile = mobile || smallScreen

  const lowEnd = swr || weakRam || weakCores || isMobile

  cached = {
    lowEnd,
    // Cap the 3D scene render resolution: even high-end Retina screens
    // get 1.25× (crisp, ~40% less GPU fill than 1.5× on a 2× display).
    // Low-end drops to 1× (half the fill). This is the single biggest
    // GPU lever on the site.
    dprCap: lowEnd ? 1 : 1.25,
    // Low-end draws a fraction of the starfield particles.
    starScale: lowEnd ? 0.35 : 1,
    // Subtle mode → no cursor aura, no per-frame glow overlays.
    subtle: lowEnd,
  }
  return cached
}

const listeners = new Set()

function subscribe(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

// Hook that exposes the cached profile and keeps the `low-end` class on
// <html> in sync (so CSS `:root.low-end` rules apply).
export function useDeviceProfile() {
  return useSyncExternalStore(
    subscribe,
    () => {
      const p = getDeviceProfile()
      document.documentElement.classList.toggle('low-end', p.lowEnd)
      return p
    },
    () => getDeviceProfile()
  )
}
