// ─── WispyCloud — reusable 2D canvas cloud/nebula (no WebGL) ───
// Draws layered ribbons whose edges sway with stacked sine waves, additively
// blended so overlapping colors glow instead of muddying. Shared by
// AuroraBand (hero → services nebula) and SpacePortfolio's delivery-strip
// ground cloud — same mechanic, different `curtains` palette/density.
// Pauses offscreen, draws one static frame for reduced motion, scales
// opacity with the active theme.

import { useEffect, useRef } from 'react'
import { useTheme } from '../theme'

export default function WispyCloud({ curtains, className = '', canvasClassName = '', style }) {
  const canvasRef = useRef(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const darkMul = isDark ? 1 : 0.72 // quieter in light mode

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const drawCurtain = (c, t, w, h, bobY, pulse) => {
      // fill and line opacity are independent — a cloud OUTLINE glow wants
      // almost no body fill and a bright line, not a filled curtain with a
      // bright edge on top of it.
      const fillA = (c.fillAlpha ?? c.alpha) * darkMul * pulse
      const lineA = Math.min((c.lineAlpha ?? c.alpha) * darkMul * pulse, 0.95)
      const steps = 96
      const baseY = h * (1 - c.height) + bobY
      const pts = []
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * w
        const s1 = Math.sin(x * c.freq + t * c.speed + c.phase) * c.amp
        const s2 = Math.sin(x * c.freq * 2.7 + t * c.speed * 2.3 + c.phase * 2) * c.amp * 0.4
        const s3 = Math.sin(x * c.freq * 0.45 + t * c.speed * 0.6 + c.phase * 3) * c.amp * 0.3
        pts.push([x, baseY + s1 + s2 + s3])
      }

      // faint body fill — just enough to seat the outline, not a smoke cloud
      if (fillA > 0) {
        const grad = ctx.createLinearGradient(0, h, 0, 0)
        grad.addColorStop(0, `rgba(${c.color},0)`)
        grad.addColorStop(0.3, `rgba(${c.color},${fillA})`)
        grad.addColorStop(0.7, `rgba(${c.color},${fillA * 0.55})`)
        grad.addColorStop(1, `rgba(${c.color},0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)))
        ctx.lineTo(w, h)
        ctx.lineTo(0, h)
        ctx.closePath()
        ctx.fill()
      }

      // the glow — a thin bright line traced along the cloud's silhouette,
      // this IS the visual (the reference photo's threads), not an accent
      // on top of a filled shape. Opt out per-curtain with `line: false`.
      if (c.line !== false) {
        ctx.save()
        ctx.shadowColor = `rgba(${c.color},${lineA})`
        ctx.shadowBlur = c.lineGlow ?? 24
        ctx.strokeStyle = `rgba(${c.color},${lineA})`
        ctx.lineWidth = c.lineWidth ?? 1
        ctx.lineJoin = 'round'
        ctx.beginPath()
        pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)))
        ctx.stroke()
        ctx.restore()
      }
    }

    const draw = (t) => {
      const w = canvas.getBoundingClientRect().width
      const h = canvas.getBoundingClientRect().height
      if (w === 0 || h === 0) return
      const s = t / 1000
      const bobY = Math.sin(s * 0.45) * 7
      const pulse = 0.82 + 0.18 * Math.sin(s * 0.8)
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      curtains.forEach((c) => drawCurtain(c, s, w, h, bobY, pulse))
      ctx.globalCompositeOperation = 'source-over'
    }

    let raf = 0
    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(canvas)

    if (reduce) {
      draw(0)
    } else {
      const loop = (t) => {
        if (visible) draw(t)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [isDark, curtains])

  return (
    <div className={className} aria-hidden="true">
      <canvas ref={canvasRef} className={canvasClassName} style={style} />
    </div>
  )
}
