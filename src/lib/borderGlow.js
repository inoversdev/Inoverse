// Shared math for the .glow-ring border effect (ported from Inovers V4's
// BorderGlowEffect) — used inline by mapped card lists where a single hook
// ref can't cover every item. Sets --glow-angle / --glow-intensity, which
// the .glow-ring CSS class reads to drive a rotating conic-gradient ring.
export function applyBorderGlow(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = e.clientX - r.left
  const y = e.clientY - r.top
  const cx = r.width / 2
  const cy = r.height / 2

  const dist = Math.hypot(x - cx, y - cy)
  const maxDist = Math.hypot(cx, cy)
  const edgeProximity = 1 - Math.min(dist / (maxDist / 2), 1)
  const intensity = Math.pow(edgeProximity, 2)
  const angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 90

  el.style.setProperty('--glow-angle', `${angle}deg`)
  el.style.setProperty('--glow-intensity', String(intensity))
}

export function clearBorderGlow(e) {
  e.currentTarget.style.setProperty('--glow-intensity', '0')
}
