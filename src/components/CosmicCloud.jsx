// ─── CosmicCloud — a nebula built from straight line filaments ───
// Canvas 2D, no WebGL. TWO layers, same trick the 3D backdrop uses:
//
//   BODY layer (the "nebula") — the secret from SpaceScene.js: a nebula
//   is NOT noise or particles, it's SOFT RADIAL-GRADIENT GLOW BLOBS
//   (bright center → mid glow → transparent edge) drawn additively at
//   low opacity, scaled huge, slowly breathing. Here we bake ~18 such
//   blobs (deep purple / hot pink / electric blue / cyan, placed by FBM
//   rejection sampling so they clump like gas) into ONE offscreen
//   texture, then draw it full-bleed with 'lighter' composite and a
//   breathing alpha (sin-sway, just like the backdrop's nebulas).
//
//   VEIN layer (the "straight lines") — ~450 short STRAIGHT white/cyan
//   filaments, accepted only in the dense core (rejection sampling on
//   the same FBM field), drawn twice each (wide faint glow + thin
//   bright core) so they read as lightning threads INSIDE the cloud.
//
// The whole field DRIFTS slowly under the static lines (sampling
// coordinate slides with time, wrapped mod 1 so it never clamps to an
// edge), and every filament lives on a staggered life cycle (fade in
// 800ms, out over the last 1.2s of a 10s cycle) so the cloud is
// permanently, gently turning over.
//
// House conventions (same as WispyCloud): DPR cap 2, IntersectionObserver
// pause offscreen, single static frame under prefers-reduced-motion,
// quieter in light theme.

import { useEffect, useRef } from 'react'
import { createNoise } from '../lib/noise'
import { useTheme } from '../theme'

// ─── Palette (rgb triples, additive blending handles the glow) ───
const CORE = [109, 40, 217] // deep purple — dense core
const PINK = [236, 72, 153] // hot pink — mid/hot spots
const BLUE = [59, 130, 246] // electric blue — mid/veins
const CYAN = [103, 232, 249] // cyan — sparse wisp edges
const WHITE = [255, 255, 255] // filament sparkle
const ICE = [165, 243, 252] // ice cyan filaments
const PALE = [147, 197, 253] // pale blue filaments

// ─── Tunables ───
const SEED = 20260811 // stable cloud shape across reloads
const GRID_W = 128 // FBM lookup grid resolution
const GRID_H = 72
const GRID_SCALE = 0.055 // noise lattice cells covered by the grid
const BODY_WAYPOINTS = 18 // soft glow blobs (backdrop-style sprites)
const LINE_COUNT = 450 // straight-line filaments (dense core only)
const CYCLE_MS = 10000 // per-line life cycle (staggered births)
const FLOW_ANGLE = -14 * (Math.PI / 180) // global filament direction
const DRIFT_X = 0.02 // field drift speed, grid units per second
const DRIFT_Y = 0.014

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const rand = (a, b) => a + Math.random() * (b - a)
const rgba = ([r, g, b], a) => `rgba(${r | 0},${g | 0},${b | 0},${a})`

export default function CosmicCloud({ className = '', canvasClassName = '' }) {
  const canvasRef = useRef(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const bodyAlpha = isDark ? 0.85 : 0.6 // body layer strength per theme
    const veinMul = isDark ? 1 : 0.65 // quieter veins in light mode

    // ── 1. Bake the FBM density grid once (CPU, ~15k samples) ──
    const { fbm } = createNoise(SEED)
    const grid = new Float32Array(GRID_W * GRID_H)
    for (let j = 0; j < GRID_H; j++) {
      for (let i = 0; i < GRID_W; i++) {
        grid[j * GRID_W + i] = fbm(i * GRID_SCALE, j * GRID_SCALE, 4)
      }
    }

    // Bilinear sample of the baked grid. `wrap` mode wraps the coords
    // (drift never clamps to an edge — the field is infinite).
    const sampleGrid = (gx, gy, wrap = true) => {
      const fx = wrap ? gx - Math.floor(gx) : clamp01(gx)
      const fy = wrap ? gy - Math.floor(gy) : clamp01(gy)
      const x = fx * (GRID_W - 1)
      const y = fy * (GRID_H - 1)
      const ix = Math.floor(x)
      const iy = Math.floor(y)
      const tx = x - ix
      const ty = y - iy
      const a = grid[iy * GRID_W + ix]
      const b = grid[iy * GRID_W + ix + 1]
      const c = grid[(iy + 1) * GRID_W + ix]
      const d = grid[(iy + 1) * GRID_W + ix + 1]
      return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty
    }

    // ── 2. BODY layer — bake soft radial glow blobs into a texture ──
    // This is literally the backdrop's nebula sprite (makeRadialTexture:
    // bright center → mid → transparent) repeated ~18x and composited
    // additively, placed by rejection sampling so blobs clump where the
    // FBM field is dense. Baked ONCE into a single image.
    //
    // Colors are assigned by DENSITY RANK, not raw value: the FBM field
    // averages ~0.5, so absolute thresholds starve the hot bands. Rank
    // guarantees the recipe every time — densest 30% deep purple/pink
    // (core), next 40% pink/electric blue, outer 20% blue/cyan, wispy
    // edges cyan. Hot white cores stamp on the densest quarter.
    const BODY_W = 1024
    const BODY_H = 512
    const body = document.createElement('canvas')
    body.width = BODY_W
    body.height = BODY_H
    const bctx = body.getContext('2d')
    bctx.globalCompositeOperation = 'lighter'

    const candidates = []
    let guard = 0
    while (candidates.length < BODY_WAYPOINTS && guard < BODY_WAYPOINTS * 60) {
      guard++
      const gx = Math.random()
      const gy = Math.random()
      const d = sampleGrid(gx, gy, false) // clamped: blob placement stays in-canvas
      if (d < rand(0.45, 0.8)) continue // rejection sampling
      candidates.push({ gx, gy, d })
    }
    candidates.sort((a, b) => b.d - a.d) // densest first

    const mix = (c1, c2, t) => [
      c1[0] + (c2[0] - c1[0]) * t,
      c1[1] + (c2[1] - c1[1]) * t,
      c1[2] + (c2[2] - c1[2]) * t,
    ]

    candidates.forEach((c, i) => {
      const rank = candidates.length > 1 ? i / (candidates.length - 1) : 1
      let color
      if (rank < 0.3) color = mix(CORE, PINK, Math.random() * 0.5) // dense core
      else if (rank < 0.7) color = mix(PINK, BLUE, Math.random() * 0.6) // hot mid
      else if (rank < 0.9) color = mix(BLUE, CYAN, Math.random() * 0.5) // cool veins
      else color = CYAN // wispy edges
      const jitter = () => rand(-12, 12)
      color = [color[0] + jitter(), color[1] + jitter(), color[2] + jitter()]

      const radius = 90 + c.d * 190 // px in texture space
      const alpha = 0.10 + c.d * 0.13
      const g = bctx.createRadialGradient(c.gx * BODY_W, c.gy * BODY_H, 0, c.gx * BODY_W, c.gy * BODY_H, radius)
      g.addColorStop(0, rgba(color, alpha))
      g.addColorStop(0.45, rgba(color, alpha * 0.45))
      g.addColorStop(1, rgba(color, 0))
      bctx.fillStyle = g
      bctx.fillRect(c.gx * BODY_W - radius, c.gy * BODY_H - radius, radius * 2, radius * 2)
      // Hot core: the densest quarter also stamps a small bright
      // white-warm center — the "star nursery" glow of real nebulae
      // (same trick as the backdrop's galaxy cores).
      if (rank < 0.25) {
        const coreR = radius * 0.35
        const core = bctx.createRadialGradient(c.gx * BODY_W, c.gy * BODY_H, 0, c.gx * BODY_W, c.gy * BODY_H, coreR)
        core.addColorStop(0, `rgba(255, 245, 255, ${Math.min(alpha * 1.4, 0.3)})`)
        core.addColorStop(0.6, `rgba(255, 225, 255, ${alpha * 0.35})`)
        core.addColorStop(1, 'rgba(255, 255, 255, 0)')
        bctx.fillStyle = core
        bctx.fillRect(c.gx * BODY_W - coreR, c.gy * BODY_H - coreR, coreR * 2, coreR * 2)
      }
    })

    // Edge fades: melt the body into hero (top) and services (bottom),
    // and soften the horizontal ends. destination-in multiplies existing
    // alpha by the mask, so both fades stack correctly.
    bctx.globalCompositeOperation = 'destination-in'
    const vfade = bctx.createLinearGradient(0, 0, 0, BODY_H)
    vfade.addColorStop(0, 'rgba(0,0,0,0)')
    vfade.addColorStop(0.18, 'rgba(0,0,0,1)')
    vfade.addColorStop(0.82, 'rgba(0,0,0,1)')
    vfade.addColorStop(1, 'rgba(0,0,0,0)')
    bctx.fillStyle = vfade
    bctx.fillRect(0, 0, BODY_W, BODY_H)
    const hfade = bctx.createLinearGradient(0, 0, BODY_W, 0)
    hfade.addColorStop(0, 'rgba(0,0,0,0)')
    hfade.addColorStop(0.07, 'rgba(0,0,0,1)')
    hfade.addColorStop(0.93, 'rgba(0,0,0,1)')
    hfade.addColorStop(1, 'rgba(0,0,0,0)')
    bctx.fillStyle = hfade
    bctx.fillRect(0, 0, BODY_W, BODY_H)

    // ── 3. VEIN layer — straight-line filaments in the dense core ──
    const pickVeinColor = () => {
      const r = Math.random()
      if (r < 0.3) return [WHITE[0] + rand(-10, 10), WHITE[1] + rand(-10, 10), WHITE[2] + rand(-10, 10)]
      if (r < 0.7) return [ICE[0] + rand(-8, 8), ICE[1] + rand(-8, 8), ICE[2] + rand(-8, 8)]
      return [PALE[0] + rand(-8, 8), PALE[1] + rand(-8, 8), PALE[2] + rand(-8, 8)]
    }

    const lines = []
    let lineGuard = 0
    while (lines.length < LINE_COUNT && lineGuard < LINE_COUNT * 40) {
      lineGuard++
      const gx = Math.random()
      const gy = Math.random()
      const d = sampleGrid(gx, gy, false)
      if (d < rand(0.58, 0.85)) continue // dense core only — inside the cloud

      const aligned = Math.random() < 0.7
      const angle = aligned
        ? FLOW_ANGLE + rand(-28, 28) * (Math.PI / 180)
        : rand(0, Math.PI)

      const len = 8 + d * 32 // dense areas get longer "veins"
      const width = d > 0.75 ? 2 : 1
      const baseAlpha = rand(0.12, 0.28) * (d > 0.75 ? 1.3 : 1)

      const edgeFade =
        clamp01(gx / 0.06) * clamp01((1 - gx) / 0.06) *
        clamp01(gy / 0.18) * clamp01((1 - gy) / 0.18)

      lines.push({
        gx, gy,
        angle, len, width, baseAlpha,
        color: pickVeinColor(),
        birth: Math.random() * CYCLE_MS,
        phase: rand(0, Math.PI * 2),
        twSpeed: rand(0.4, 1.4),
        edgeFade,
      })
    }

    // ── 4. Render loop ──
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const smoothIn = (v) => v * v * (3 - 2 * v)

    const draw = (t) => {
      const w = canvas.getBoundingClientRect().width
      const h = canvas.getBoundingClientRect().height
      if (w === 0 || h === 0) return

      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      // BODY: draw the baked nebula texture, breathing like the backdrop
      // (sin-sway on top of a base), drifting within a baked-in margin so
      // the soft sway never exposes an edge.
      const driftX = -64 + Math.sin(t * 0.00015) * 40
      const driftY = -32 + Math.cos(t * 0.0001) * 18
      const breathe = 1 + 0.08 * Math.sin(t * 0.0003)
      ctx.globalAlpha = bodyAlpha * breathe
      ctx.drawImage(body, driftX, driftY, w + 128, h + 64)
      ctx.globalAlpha = 1

      // VEINS: straight-line filaments on top, drifting field + staggered
      // life cycle + twinkle. Two passes per line: glow then core.
      const driftFieldX = (t / 1000) * DRIFT_X
      const driftFieldY = (t / 1000) * DRIFT_Y

      for (let i = 0; i < lines.length; i++) {
        const ln = lines[i]
        const d = sampleGrid(ln.gx + driftFieldX, ln.gy + driftFieldY)

        const tw = 0.8 + 0.2 * Math.sin(t * 0.001 * ln.twSpeed + ln.phase)
        const age = (t - ln.birth) % CYCLE_MS
        const life = smoothIn(clamp01(age / 800)) * (1 - smoothIn(clamp01((age - (CYCLE_MS - 1200)) / 1200)))

        const alpha = ln.baseAlpha * (0.3 + 0.7 * d) * tw * life * veinMul * ln.edgeFade
        if (alpha < 0.006) continue

        const x = ln.gx * w
        const y = ln.gy * h
        const hx = Math.cos(ln.angle) * ln.len * 0.5
        const hy = Math.sin(ln.angle) * ln.len * 0.5
        const [r, g, b] = ln.color

        ctx.strokeStyle = rgba([r, g, b], Math.min(alpha * 0.35, 0.3))
        ctx.lineWidth = Math.min(ln.width * 4, 6)
        ctx.beginPath()
        ctx.moveTo(x - hx, y - hy)
        ctx.lineTo(x + hx, y + hy)
        ctx.stroke()

        ctx.strokeStyle = rgba([r, g, b], Math.min(alpha, 0.9))
        ctx.lineWidth = ln.width
        ctx.beginPath()
        ctx.moveTo(x - hx, y - hy)
        ctx.lineTo(x + hx, y + hy)
        ctx.stroke()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    let raf = 0
    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(canvas)

    if (reduce) {
      draw(0) // one static frame, no loop
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
    <div className={className} aria-hidden="true">
      <canvas ref={canvasRef} className={canvasClassName} />
    </div>
  )
}
