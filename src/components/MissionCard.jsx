// ─── MissionCard — shared project card for the home showcase and the
// /projects grid. One source of truth for how a mission renders. ───
import { applyBorderGlow, clearBorderGlow } from '../lib/borderGlow'

const EXTERNAL = 'https://dorydelivery.com/'

// Try to resolve a clean 256px favicon from the project's live domain —
// the pixel size so it stays sharp even when scaled through the card.
// Falls back to nothing when the project has no url (concept / pre-launch).
function favicon(url) {
  try {
    return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=256`
  } catch {
    return null
  }
}

export default function MissionCard({ project }) {
  const p = project
  const hasLink = p.url != null
  const hrefFor = p.url || EXTERNAL
  const logo = favicon(p.url)

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
      className={`mission-card glow-ring group glass relative min-w-0 overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-ember-500/40 hover:shadow-[0_0_50px_rgba(245,48,3,0.12)] ${
        hasLink ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      {/* Faded live logo — pinned right, fading left via CSS mask.
          Low opacity so it reads as atmosphere, not content. Hover lifts
          it slightly so the card focus stays on the text. */}
      {logo && (
        <img
          src={logo}
          alt=""
          loading="lazy"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
          className="mission-card-logo pointer-events-none absolute right-0 top-1/2 h-4/5 max-h-40 -translate-y-1/2 object-contain opacity-[0.08] transition-opacity duration-500 group-hover:opacity-[0.14]"
        />
      )}

      <div className="relative mb-4 flex items-center justify-between gap-3">
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
      <h3 className="relative font-display text-xl font-semibold tracking-tight text-star-100 transition-colors group-hover:text-ember-600">
        {p.name}
      </h3>
      <p className="relative mt-2.5 text-sm leading-relaxed text-star-400">{p.description}</p>
      <div className="relative mt-5 flex flex-wrap gap-2">
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
