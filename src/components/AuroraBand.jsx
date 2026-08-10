// ─── AuroraBand — real flowing aurora curtains between Hero and Services ───
// 2D canvas aurora (no WebGL): several vertical curtain ribbons whose
// edges sway with layered sine waves, drawn additively over the fixed
// 3D space scene. Pauses offscreen, draws one static frame for reduced
// motion, scales opacity with the active theme.

import { useEffect, useRef } from 'react'
import { useTheme } from '../theme'

const CURTAINS = [
  { color: [245, 48, 3], amp: 34, freq: 0.008, speed: 1.5, phase: 0, height: 0.8, alpha: 0.55 },
  { color: [255, 138, 92], amp: 28, freq: 0.011, speed: -1.7, phase: 2.1, height: 0.92, alpha: 0.5 },
  { color: [255, 217, 201], amp: 30, freq: 0.006, speed: 1.2, phase: 4.2, height: 0.62, alpha: 0.42 },
  { color: [192, 36, 2], amp: 22, freq: 0.013, speed: 0.9, phase: 1.3, height: 0.5, alpha: 0.38 },
]

export default function AuroraBand() {
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

    // One curtain = a ribbon whose top edge is a layered sine wave;
    // filled with a vertical gradient so it fades into the dark/white bg.
    // `bobY` lifts/lowers the whole cloud, `pulse` makes it breathe.
    const drawCurtain = (c, t, w, h, bobY, pulse) => {
      const grad = ctx.createLinearGradient(0, h, 0, 0)
      const a = c.alpha * darkMul * pulse
      grad.addColorStop(0, `rgba(${c.color},0)`)
      grad.addColorStop(0.3, `rgba(${c.color},${a})`)
      grad.addColorStop(0.7, `rgba(${c.color},${a * 0.55})`)
      grad.addColorStop(1, `rgba(${c.color},0)`)
      ctx.fillStyle = grad
      ctx.beginPath()
      const steps = 72
      const baseY = h * (1 - c.height) + bobY
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * w
        const s1 = Math.sin(x * c.freq + t * c.speed + c.phase) * c.amp
        const s2 = Math.sin(x * c.freq * 2.7 + t * c.speed * 2.3 + c.phase * 2) * c.amp * 0.4
        const s3 = Math.sin(x * c.freq * 0.45 + t * c.speed * 0.6 + c.phase * 3) * c.amp * 0.3
        const y = baseY + s1 + s2 + s3
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.lineTo(w, h)
      ctx.lineTo(0, h)
      ctx.closePath()
      ctx.fill()
    }

    const draw = (t) => {
      const w = canvas.getBoundingClientRect().width
      const h = canvas.getBoundingClientRect().height
      if (w === 0 || h === 0) return
      const s = t / 1000
      // whole-cloud float + breathing pulse
      const bobY = Math.sin(s * 0.9) * 7
      const pulse = 0.82 + 0.18 * Math.sin(s * 1.6)
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      CURTAINS.forEach((c) => drawCurtain(c, s, w, h, bobY, pulse))
      ctx.globalCompositeOperation = 'source-over'
    }

    let raf = 0
    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(canvas)

    if (reduce) {
      // single static frame — no animation loop
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
  }, [isDark])

  return (
    <section className="aurora-band relative h-44 overflow-x-clip sm:h-56" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="absolute inset-x-0 top-0 h-[135%] w-full"
        style={{ filter: 'blur(14px) saturate(1.15)' }}
      />
    </section>
  )
}
