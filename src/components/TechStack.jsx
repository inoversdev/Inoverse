// ─── TechStack — the tools Inovers ships with, floating in the gap
// between Services and Work (Mat's call 2026-08-12).
//
// OFFICIAL brand logos — real SVGs vendored in src/assets/tools
// (pulled from simple-icons), NOT hand-drawn approximations. Each logo
// keeps its true brand colors (CSS3 blue, TS blue, React cyan, JS
// yellow, Tailwind sky, Laravel red…). Three.js has no fixed brand hue
// so it uses currentColor (theme-aware).
//
// FLOATING animation (Mat's call: "animate them like floating instead
// of a marquee") — each tile gently bobs on its own sine cycle
// (offset by a deterministic per-tool delay so the field never moves
// in lockstep). Pure transform animation, compositor-friendly, dead
// under prefers-reduced-motion. No marquee, no offscreen cost: it's a
// static grid that only floats in place.
//
// PERFORMANCE: tiles use the solid `.tech-pill` surface — NO
// backdrop-filter — so nothing re-rasterizes while they float.

import { useEffect, useRef, useState } from 'react'

import jsIcon from '../assets/tools/js.svg'
import tsIcon from '../assets/tools/ts.svg'
import reactIcon from '../assets/tools/react.svg'
import htmlIcon from '../assets/tools/html.svg'
import cssIcon from '../assets/tools/css.svg'
import tailwindIcon from '../assets/tools/tailwind.svg'
import nodeIcon from '../assets/tools/node.svg'
import mysqlIcon from '../assets/tools/mysql.svg'
import laravelIcon from '../assets/tools/laravel.svg'
import viteIcon from '../assets/tools/vite.svg'
import gsapIcon from '../assets/tools/gsap.svg'
import threeIcon from '../assets/tools/three.svg'
import expressIcon from '../assets/tools/express.svg'
import redisIcon from '../assets/tools/redis.svg'
import nginxIcon from '../assets/tools/nginx.svg'
import digitaloceanIcon from '../assets/tools/digitalocean.svg'
import railwayIcon from '../assets/tools/railway.svg'
import firebaseIcon from '../assets/tools/firebase.svg'
import typeormIcon from '../assets/tools/typeorm.svg'
import socketioIcon from '../assets/tools/socketdotio.svg'
import bullmqIcon from '../assets/tools/bullmq.svg'
import zodIcon from '../assets/tools/zod.svg'
import cloudflareIcon from '../assets/tools/cloudflare.svg'
import xenditIcon from '../assets/tools/xendit.svg'
import livekitIcon from '../assets/tools/livekit.svg'
import geminiIcon from '../assets/tools/googlegemini.svg'
import huggingfaceIcon from '../assets/tools/huggingface.svg'
import qdrantIcon from '../assets/tools/qdrant.svg'
import reactqueryIcon from '../assets/tools/reactquery.svg'
import axiosIcon from '../assets/tools/axios.svg'

const TOOLS = [
  // Core languages / frameworks (kept from v1)
  { id: 'react', name: 'React', src: reactIcon },
  { id: 'js', name: 'JavaScript', src: jsIcon },
  { id: 'ts', name: 'TypeScript', src: tsIcon },
  { id: 'node', name: 'Node.js', src: nodeIcon },
  { id: 'express', name: 'Express', src: expressIcon },
  { id: 'reactnative', name: 'React Native', src: reactIcon },
  // Data / infra
  { id: 'mysql', name: 'MySQL', src: mysqlIcon },
  { id: 'typeorm', name: 'TypeORM', src: typeormIcon },
  { id: 'redis', name: 'Redis', src: redisIcon },
  { id: 'nginx', name: 'Nginx', src: nginxIcon },
  { id: 'digitalocean', name: 'DigitalOcean', src: digitaloceanIcon },
  { id: 'railway', name: 'Railway', src: railwayIcon },
  { id: 'firebase', name: 'Firebase', src: firebaseIcon },
  { id: 'cloudflare', name: 'Cloudflare R2', src: cloudflareIcon },
  // Realtime / queues / validation
  { id: 'socketio', name: 'Socket.IO', src: socketioIcon },
  { id: 'bullmq', name: 'BullMQ', src: bullmqIcon },
  { id: 'zod', name: 'Zod', src: zodIcon },
  // Payments / comms / AI
  { id: 'xendit', name: 'Xendit', src: xenditIcon },
  { id: 'livekit', name: 'LiveKit', src: livekitIcon },
  { id: 'gemini', name: 'Gemini', src: geminiIcon },
  { id: 'huggingface', name: 'Hugging Face', src: huggingfaceIcon },
  { id: 'qdrant', name: 'Qdrant', src: qdrantIcon },
  // Frontend stack (kept from v1)
  { id: 'tailwind', name: 'Tailwind CSS', src: tailwindIcon },
  { id: 'reactquery', name: 'TanStack Query', src: reactqueryIcon },
  { id: 'axios', name: 'Axios', src: axiosIcon },
  { id: 'vite', name: 'Vite', src: viteIcon },
  { id: 'gsap', name: 'GSAP', src: gsapIcon },
  { id: 'three', name: 'Three.js', src: threeIcon },
  { id: 'html', name: 'HTML5', src: htmlIcon },
  { id: 'css', name: 'CSS3', src: cssIcon },
  { id: 'laravel', name: 'Laravel', src: laravelIcon },
]

// Deterministic 0..1 seed from the tool id — every logo floats on its
// own phase/delay so the field feels organic, never lockstep.
function seedFrom(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return (h % 1000) / 1000
}

function ToolTile({ tool, index }) {
  const seed = seedFrom(tool.id)
  // S-curve offset (pocketdevs.ph style): a sine wave over the row so the
  // tiles rise and fall gently — 0, up, peak, down, 0, up… like an
  // S-shaped ribbon. The tile keeps its own float bob on top (the two
  // transforms compose: offset is margin, bob is animation transform).
  const sCurve = Math.round(26 * Math.abs(Math.sin((index / TOOLS.length) * Math.PI * 2)))
  return (
    <div
      className="shrink-0 select-none"
      style={{ marginTop: `${sCurve}px` }}
    >
      <div
        title={tool.name}
        className="tech-pill group flex h-16 w-16 items-center justify-center rounded-full sm:h-20 sm:w-20 lg:h-[4.5rem] lg:w-[4.5rem]"
        style={{
          animationDelay: `${-seed * 6}s`,
          animationDuration: `${4.5 + seed * 2.5}s`,
        }}
      >
        <img
          src={tool.src}
          alt={tool.name}
          loading="lazy"
          draggable="false"
          width="36"
          height="36"
          className={`pointer-events-none h-8 w-8 transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10 ${
            tool.id === 'three' ? 'text-star-400 dark:text-star-200' : ''
          }`}
        />
      </div>
    </div>
  )
}

// ─── Draggable tech field (Mat's call 2026-08-17) — the strip slides
// left/right by dragging, with momentum fling, spring-back at the edges
// and click-vs-drag detection (a click on a tile is a no-op here — tiles
// have no action — but the distinction keeps accidental drags from
// feeling broken). Pointer events handle mouse + touch in one code path;
// `touch-action: pan-y` keeps vertical page scrolling native while we
// claim horizontal drags. Reduced motion: strip becomes a plain static
// grid (no float, no drag) so nothing moves for users who opt out. ───
function TechField() {
  const [reduce, setReduce] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduce(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const viewportRef = useRef(null)
  const trackRef = useRef(null)

  const state = useRef({
    pointerId: null,
    startX: 0,
    startTranslate: 0,
    dragging: false,
    moved: false,
    velocity: 0,
    lastX: 0,
    lastTime: 0,
    raf: null,
  })

  // Current translate offset (kept in a ref so the RAF loop reads it
  // without re-rendering React on every frame).
  const offset = useRef(0)

  // Bounds: translate must keep the track filling the viewport — clamp
  // so the right edge never leaves a gap when the track is wider than
  // the viewport, and the left edge never goes past 0 when narrower.
  const clamp = (value) => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return 0
    const max = Math.max(0, track.scrollWidth - viewport.clientWidth)
    return Math.min(0, Math.max(-max, value))
  }

  const applyOffset = (value, animate = false) => {
    const track = trackRef.current
    if (!track) return
    offset.current = value
    track.style.transition = animate ? 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)' : 'none'
    track.style.transform = `translate3d(${value}px, 0, 0)`
    // nudge the transition off after an animated snap so the next drag
    // starts from an untransitioned state
    if (animate) {
      window.setTimeout(() => {
        if (track) track.style.transition = 'none'
      }, 360)
    }
  }

  // Momentum fling — decay velocity each frame until it stops or hits a
  // bound; then spring back if it overshot.
  const fling = (from, velocity) => {
    const { raf } = state.current
    if (raf) cancelAnimationFrame(raf)
    let v = velocity
    let pos = from
    const step = () => {
      v *= 0.95
      pos += v
      const bounded = clamp(pos)
      const atEdge = Math.abs(pos - bounded) > 0.5
      if (atEdge) {
        // overshot — spring back to the bound
        applyOffset(bounded, true)
        return
      }
      if (Math.abs(v) < 0.5) {
        applyOffset(bounded)
        return
      }
      applyOffset(pos)
      state.current.raf = requestAnimationFrame(step)
    }
    state.current.raf = requestAnimationFrame(step)
  }

  const onPointerDown = (e) => {
    if (reduce) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const s = state.current
    if (s.raf) cancelAnimationFrame(s.raf)
    s.pointerId = e.pointerId
    s.startX = e.clientX
    s.startTranslate = offset.current
    s.dragging = true
    s.moved = false
    s.velocity = 0
    s.lastX = e.clientX
    s.lastTime = performance.now()
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch { /* older browsers */ }
  }

  const onPointerMove = (e) => {
    const s = state.current
    if (!s.dragging || e.pointerId !== s.pointerId) return
    const dx = e.clientX - s.startX
    const now = performance.now()
    const dt = Math.max(1, now - s.lastTime)
    // track instantaneous velocity from the last sample for a smooth fling
    const instV = (e.clientX - s.lastX) / dt
    s.velocity = s.velocity * 0.7 + instV * 0.3
    s.lastX = e.clientX
    s.lastTime = now
    if (Math.abs(dx) > 3) s.moved = true
    applyOffset(clamp(s.startTranslate + dx))
  }

  const onPointerUp = (e) => {
    const s = state.current
    if (!s.dragging || e.pointerId !== s.pointerId) return
    s.dragging = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch { /* older browsers */ }
    if (s.moved) {
      // fling with the sampled velocity (px/ms → px/frame scale)
      fling(offset.current, s.velocity * 16)
    }
  }

  const onPointerCancel = () => {
    const s = state.current
    s.dragging = false
  }

  // If the viewport resizes (e.g. breakpoint change), re-clamp the
  // current offset so the strip never lands out of bounds.
  useEffect(() => {
    const onResize = () => applyOffset(clamp(offset.current), true)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (reduce) {
    // Reduced motion: plain centered grid, no float, no drag.
    return (
      <div className="flex flex-wrap items-start justify-center gap-x-4 gap-y-10 sm:gap-x-6">
        {TOOLS.map((t, i) => (
          <ToolTile key={t.id} tool={t} index={i} />
        ))}
      </div>
    )
  }

  return (
    <div
      ref={viewportRef}
      className="tech-strip-viewport overflow-hidden"
      style={{ touchAction: 'pan-y' }}
    >
      <div
        ref={trackRef}
        className="tech-strip-track flex w-max cursor-grab items-start gap-x-4 px-2 py-2 active:cursor-grabbing sm:gap-x-6"
        style={{ willChange: 'transform' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        {TOOLS.map((t, i) => (
          <ToolTile key={t.id} tool={t} index={i} />
        ))}
      </div>
    </div>
  )
}

// ─── TechStack — sits in the UFO gap between Services and Work. A quiet
// eyebrow + a draggable strip of official tool logos (drag to slide
// left/right, Mat's call 2026-08-17). ───
export default function TechStack() {
  return (
    <section
      id="tools"
      className="tech-float-field relative overflow-x-clip px-6 py-16 lg:px-10"
      aria-label="Technologies we work with"
    >
      <div className="mb-10 text-center">
        <p data-parallax="-0.1" className="text-xs font-medium uppercase tracking-[0.2em] text-ember-500">
          Built with
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-star-400">
          The tools behind every mission we launch.
        </p>
      </div>
      <TechField />
    </section>
  )
}
