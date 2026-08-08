// ─── MissionCard — shared project card for the home showcase and the
// /projects grid. One source of truth for how a mission renders. ───
import { applyBorderGlow, clearBorderGlow } from '../lib/borderGlow'

const EXTERNAL = 'https://dorydelivery.com/'
const LINKED = [
  { id: 'dory', url: 'https://dorydelivery.com/' },
  { id: 'dmap', url: 'https://dmap.inovers.dev/' },
  { id: 'whatahotel', url: 'https://www.whatahotel.com/' },
  { id: 'agenxure', url: 'https://www.agenxure.com/' },
]

export default function MissionCard({ project }) {
  const p = project
  const hasLink = LINKED.some((l) => l.id === p.id)
  const hrefFor = p.url || EXTERNAL

  return (
    <a
      key={p.id}
      href={hasLink ? hrefFor : undefined}
      target={hasLink ? '_blank' : undefined}
      rel={hasLink ? 'noreferrer' : undefined}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
        applyBorderGlow(e)
      }}
      onMouseLeave={clearBorderGlow}
      className={`mission-card glow-ring group glass min-w-0 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-ember-500/40 hover:shadow-[0_0_50px_rgba(245,48,3,0.12)] ${
        hasLink ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-ember-500/25 bg-ember-500/5 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-ember-600 dark:text-ember-300">
          {p.industry}
        </span>
        <span className="flex items-center gap-2">
          {p.demo && (
            <span className="rounded-full bg-star-100/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-star-500">
              concept
            </span>
          )}
          {hasLink ? (
            <span className="text-star-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ember-500">
              ↗
            </span>
          ) : (
            <span className="text-star-500">◆</span>
          )}
        </span>
      </div>
      <h3 className="font-display text-xl font-semibold tracking-tight text-star-100 transition-colors group-hover:text-ember-600">
        {p.name}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-star-400">{p.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {p.tags.map((t) => (
          <span
            key={t}
            className="rounded-md bg-star-100/5 px-2.5 py-1 text-[11px] font-medium text-star-300"
          >
            {t}
          </span>
        ))}
      </div>
    </a>
  )
}
