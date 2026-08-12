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

import { useEffect, useState } from 'react'

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

const TOOLS = [
  { id: 'js', name: 'JavaScript', src: jsIcon },
  { id: 'ts', name: 'TypeScript', src: tsIcon },
  { id: 'react', name: 'React', src: reactIcon },
  { id: 'html', name: 'HTML5', src: htmlIcon },
  { id: 'css', name: 'CSS3', src: cssIcon },
  { id: 'tailwind', name: 'Tailwind CSS', src: tailwindIcon },
  { id: 'node', name: 'Node.js', src: nodeIcon },
  { id: 'mysql', name: 'MySQL', src: mysqlIcon },
  { id: 'laravel', name: 'Laravel', src: laravelIcon },
  { id: 'vite', name: 'Vite', src: viteIcon },
  { id: 'gsap', name: 'GSAP', src: gsapIcon },
  { id: 'three', name: 'Three.js', src: threeIcon },
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
      className="shrink-0"
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
          width="36"
          height="36"
          className={`h-8 w-8 transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10 ${
            tool.id === 'three' ? 'text-star-400 dark:text-star-200' : ''
          }`}
        />
      </div>
    </div>
  )
}

function TechField() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-x-4 gap-y-10 sm:gap-x-6 lg:flex-nowrap">
      {TOOLS.map((t, i) => (
        <ToolTile key={t.id} tool={t} index={i} />
      ))}
    </div>
  )
}

// ─── TechStack — sits in the UFO gap between Services and Work. A quiet
// eyebrow + a floating field of official tool logos. ───
export default function TechStack() {
  const [reduce, setReduce] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduce(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <section
      id="tools"
      className={`relative overflow-x-clip px-6 py-16 lg:px-10 ${reduce ? '' : 'tech-float-field'}`}
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
