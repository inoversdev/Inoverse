// ─── MissionCard — shared project card for the home showcase and the
// /projects grid. One source of truth for how a mission renders. ───
// (No borderGlow here — Mat's call 2026-08-10: the mouse-follow glow
// forced a getBoundingClientRect + gradient repaint on every mousemove.
// Hover stays CSS-only: lift, border tint, soft shadow.)

// Try to resolve a clean 256px favicon from the project's live domain —
// the pixel size so it stays sharp even when scaled through the card.
function favicon(url) {
  try {
    return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=256`
  } catch {
    return null
  }
}

// Dummy-monogram palette — one tint per id so concept projects still
// have a visual anchor on the card (Mat's call). Rotates through six
// muted tones that fit the ember/star palette.
const DUMMY_TINTS = [
  { bg: '#2a1a14', fg: '#f5a17a' },
  { bg: '#1a2a24', fg: '#7ac5a1' },
  { bg: '#1a1f2a', fg: '#7aa1f5' },
  { bg: '#2a1a2a', fg: '#c57af5' },
  { bg: '#1a2a2a', fg: '#7af5d4' },
  { bg: '#2a241a', fg: '#f5d47a' },
]

function DummyLogo({ id, name }) {
  const initial = name.trim()[0].toUpperCase()
  const hash = [...id].reduce((s, c) => s + c.charCodeAt(0), 0)
  const t = DUMMY_TINTS[hash % DUMMY_TINTS.length]
  return (
    <svg
      viewBox="0 0 100 100"
      style={{ width: '150px', height: '150px' }}
      className="mission-card-logo pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.18] transition-opacity duration-500 group-hover:opacity-[0.30]"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="50" fill={t.bg} />
      <text
        x="50" y="53"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={t.fg}
        fontFamily="system-ui, sans-serif"
        fontWeight="700"
        fontSize="46"
        letterSpacing="-0.02em"
      >
        {initial}
      </text>
    </svg>
  )
}

export default function MissionCard({ project, onOpen }) {
  const p = project
  const logo = favicon(p.url)
  const img = p.image || null

  // Clickable again (Mat's call 2026-08-11): the card opens the
  // full-view ProjectModal — NO external redirects anymore. The old
  // links bounced clients to confirmation/disclosure pages; the modal
  // shows the animated how-it-works demo instead. Keyboard accessible
  // (button semantics + Enter/Space).
  return (
    <button
      key={p.id}
      type="button"
      onClick={() => onOpen?.(p)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen?.(p)
        }
      }}
      className={`mission-card group glass relative flex h-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl text-left transition-all duration-500 hover:-translate-y-1 hover:border-ember-500/40 hover:shadow-[0_24px_48px_-20px_rgba(17,17,17,0.16)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember-400 ${
        img ? 'aspect-[3/2] p-0' : 'min-h-[15.25rem] p-6'
      }`}
    >
      {img ? (
        /* ── Logo-image container (Mat's call 2026-08-17): the generated
           project logo IS the card — image only, grayscale, contained
           (not cropped/zoomed) so it reads at a calm size. Clicking the
           card still opens the ProjectModal. ── */
        <span className="absolute inset-0 flex items-center justify-center bg-white/[0.04] p-5 dark:bg-white/[0.02]">
          <img
            src={img}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-contain grayscale transition-all duration-700 ease-out dark:brightness-0 dark:invert group-hover:grayscale-0 group-hover:invert-0 dark:group-hover:brightness-100"
          />
        </span>
      ) : (
        <>
          {/* Logo zone — live favicon for shipped projects, stylised monogram
              for the rest. Both fade right-to-left via the same CSS mask. */}
          {logo ? (
            <img
              src={logo}
              alt=""
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
              className="mission-card-logo pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.18] transition-opacity duration-500 group-hover:opacity-[0.30]"
              style={{ width: '150px', height: '150px', objectFit: 'contain' }}
            />
          ) : (
            <DummyLogo id={p.id} name={p.name} />
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
              <span className="text-star-500">◆</span>
            </span>
          </div>
          <h3 className="relative font-display text-xl font-semibold tracking-tight text-star-100 transition-colors group-hover:text-ember-600">
            {p.name}
          </h3>
          <p className="relative mt-2.5 text-sm leading-relaxed text-star-400">{p.description}</p>
          {/* Tags pinned to the bottom (mt-auto) — every card in a row/col
              shares the same container size with aligned footers, no matter
              how long the description is (Mat's call 2026-08-11: "consistent
              size containers in Selected Works"). */}
          <div className="relative mt-5 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span
                key={t}
                className="rounded-md bg-star-100/5 px-2.5 py-1 text-[11px] font-medium text-star-300"
              >
                {t}
              </span>
            ))}
            <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-ember-600 transition-transform duration-300 group-hover:translate-x-0.5 dark:text-ember-300">
              View details →
            </span>
          </div>
        </>
      )}
    </button>
  )
}
