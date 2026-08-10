// ─── CrewCard — one person on /crew ───
// Same card idiom as MissionCard (glass surface, border, hover lift,
// mouse-follow ember glow) but avatar-first instead of logo-first.
import { avatarClass } from '../lib/avatars'
import { applyBorderGlow, clearBorderGlow } from '../lib/borderGlow'

// ─── CrewAvatar — the disc, shared by the card and the home teaser ───
// Renders the real photo the moment `member.photo` is set, and the
// initials disc until then. That branch IS the "real photos later"
// contract (plan §7): dropping an image path into content.js is the only
// change needed — no component edit, no layout shift.
//
// `size` must be passed as a LITERAL class string from the call site.
// Tailwind only sees class names that appear verbatim in the source, so
// it can never be assembled as `h-${n}` (see lib/avatars for the same
// rule on the gradient stops).
export function CrewAvatar({ member, size = 'h-16 w-16 text-sm', className = '' }) {
  if (member.photo) {
    return (
      <img
        src={member.photo}
        alt={member.name}
        loading="lazy"
        className={`${size} shrink-0 rounded-full border border-star-300/20 object-cover ${className}`}
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold tracking-tight text-white ${avatarClass(
        member.avatar
      )} ${className}`}
    >
      {member.initials}
    </span>
  )
}

export default function CrewCard({ member }) {
  return (
    <article
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
        applyBorderGlow(e)
      }}
      onMouseLeave={clearBorderGlow}
      className="crew-card glow-ring group glass relative min-w-0 overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-ember-500/40 hover:shadow-[0_0_50px_rgba(245,48,3,0.12)]"
    >
      <div className="relative flex items-start gap-4">
        <CrewAvatar member={member} size="h-16 w-16 text-sm" />
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-tight tracking-tight text-star-100 transition-colors group-hover:text-ember-600">
            {member.name}
          </h3>
          <p className="mt-1 text-sm text-star-400">{member.role}</p>
        </div>
      </div>

      {/* Department tag — same pill language as the filter chips above the
          grid and MissionCard's industry tag. */}
      <span className="relative mt-5 inline-flex items-center rounded-full border border-ember-500/25 bg-ember-500/5 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-ember-600 dark:text-ember-300">
        {member.department}
      </span>

      <p className="relative mt-4 text-sm leading-relaxed text-star-400">{member.bio}</p>
    </article>
  )
}
