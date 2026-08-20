// ─── CrewCard — one person on /crew ───
// Profile design ported from dorydelivery.com/about (Mat's call
// 2026-08-10): a compact circular-avatar card — dashed ring behind the
// disc (solidifies on hover), accent ring + soft glow + photo zoom on
// hover, then a growing accent bar over an uppercase name and a muted
// role. No bio / department pill on the card — the reference keeps it
// clean; the department still filters the grid, and CREW still carries
// the full bio data for when the CEO/CTO lands real profiles.
import { avatarClass } from '../lib/avatars'

// Deterministic 0–1 "seed" from a member id/name — used to stagger the
// idle animations (float/sway/blink/twinkle) so a grid of placeholder
// aliens doesn't move in lockstep. No randomness: same member always
// gets the same seed across renders/SSR.
function seedFrom(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return (h % 1000) / 1000
}

// ─── CrewAvatar — the disc, shared by the card and the home teaser ───
// Renders the real photo the moment `member.photo` is set; until then
// every member is a GLASSMORPHISM alien (Mat's call 2026-08-17: put the
// alien placeholders BACK — the roster is real people, but photos are
// still pending, so the alien stands in until real images replace it).
// The branch IS the "real photos later" contract (plan §7): dropping an
// image path into content.js is the only change needed — no component
// edit, no layout shift.
//
// `size` must be passed as a LITERAL class string from the call site.
// Tailwind only sees class names that appear verbatim in the source, so
// it can never be assembled as `h-${n}` (see lib/avatars for the same
// rule on the gradient stops).

// ─── AlienGlyph — the placeholder crew member, ALIVE ───
// Classic little grey-ish visitor: antenna, oval head, big almond eyes
// with a light glint. Inline SVG — the site ships zero icon fonts.
// Idle: antenna sways, eyes blink, glints twinkle — each offset by
// `seed` (see seedFrom above) so a grid of these doesn't move in
// lockstep. Hover (via the card's `.group`): antenna perks up, eyes
// pick up a soft glow, glints twinkle faster — a little "oh, hi!".
function AlienGlyph({ className = '', seed = 0 }) {
  const swayDelay = `${-seed * 3.6}s`
  const blinkDelay = `${-seed * 5.5}s`
  const glintDelay = `${-seed * 2.8}s`
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      {/* antenna — outer group sways idly, inner group perks up on hover */}
      <g className="alien-antenna-sway" style={{ animationDelay: swayDelay }}>
        <g className="alien-antenna-perk">
          <path d="M32 12v7" stroke="#9fd8b4" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="8" r="3" fill="#9fd8b4" />
        </g>
      </g>
      {/* head */}
      <path
        d="M12 41c0-13.5 9-24 20-24s20 10.5 20 24c0 7.5-5.5 11.5-9.5 13.5-3 1.5-6.5 2-10.5 2s-7.5-.5-10.5-2C17.5 52.5 12 48.5 12 41Z"
        fill="#8fd3a8"
      />
      {/* eye sockets — blink idly, glow on hover */}
      <ellipse cx="23" cy="40" rx="6" ry="7.5" fill="#123524" className="alien-eye" style={{ animationDelay: blinkDelay }} />
      <ellipse cx="41" cy="40" rx="6" ry="7.5" fill="#123524" className="alien-eye" style={{ animationDelay: blinkDelay }} />
      {/* glints — twinkle idly, faster on hover */}
      <circle cx="25" cy="37" r="2" fill="#eafff2" className="alien-glint" style={{ animationDelay: glintDelay }} />
      <circle cx="43" cy="37" r="2" fill="#eafff2" className="alien-glint" style={{ animationDelay: glintDelay }} />
      {/* mouth — a tiny calm smile */}
      <path d="M28 52c2.5 2 5.5 2 8 0" stroke="#123524" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function CrewAvatar({ member, size = 'h-16 w-16 text-sm', className = '' }) {
  const seed = seedFrom(member.id || member.name || '')
  if (member.photo) {
    return (
      <img
        src={member.photo}
        alt={member.name}
        loading="lazy"
        className={`${size} shrink-0 rounded-full object-cover ${className}`}
      />
    )
  }
  return (
    <span
      role="img"
      aria-label={`${member.name} — placeholder`}
      className={`${size} relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}
    >
      {/* per-member colour wash (the old initials tint, kept subtle) */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 bg-gradient-to-br ${avatarClass(member.avatar)} opacity-35`}
      />
      {/* frosted layer — the scene's stars blur through the disc */}
      <span aria-hidden="true" className="absolute inset-0 bg-white/15 backdrop-blur-md dark:bg-white/5" />
      {/* top light catch */}
      <span aria-hidden="true" className="absolute inset-x-3 top-2 h-1/3 rounded-full bg-white/30 blur-md" />
      {/* rim highlight */}
      <span aria-hidden="true" className="absolute inset-0 rounded-full border border-white/25 dark:border-white/15" />
      <AlienGlyph className="relative h-[56%] w-[56%]" seed={seed} />
    </span>
  )
}

export default function CrewCard({ member }) {
  const seed = seedFrom(member.id || member.name || '')
  return (
    <article className="crew-card group flex w-[170px] cursor-default flex-col items-center text-center sm:w-[190px]">
      {/* Avatar stack — dashed ring behind, glow blob, accent-ringed disc.
          The whole stack idly floats when it's a placeholder (real
          photos hold still) — floating the disc itself would clip
          against its own overflow-hidden, so the float lives one level
          up on this un-clipped wrapper instead. */}
      <div
        className={`relative mb-5 shrink-0 ${member.photo ? '' : 'crew-float'}`}
        style={member.photo ? undefined : { animationDelay: `${-seed * 4.5}s` }}
      >
        {/* Dashed halo — solidifies toward ember on hover */}
        <span
          aria-hidden="true"
          className="absolute -inset-1.5 rounded-full border-2 border-dashed border-ember-500/25 transition-colors duration-300 group-hover:border-ember-500/50"
        />
        {/* Soft ember glow behind the disc — fades in on hover */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-36 w-36 -translate-x-1/2 rounded-full bg-ember-500/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 sm:h-44 sm:w-44"
        />
        <div className="relative h-36 w-36 overflow-hidden rounded-full border-2 border-white/70 ring-[3px] ring-ember-500/40 shadow-md transition-all duration-300 group-hover:border-white group-hover:ring-ember-500 sm:h-44 sm:w-44">
          <CrewAvatar member={member} size="h-full w-full text-2xl" />
        </div>
      </div>

      {/* Name block — accent bar (grows on hover) + uppercase name + role */}
      <span
        aria-hidden="true"
        className="mb-3 h-0.5 w-6 rounded-full bg-ember-500/40 transition-all duration-300 group-hover:w-10 group-hover:bg-ember-500"
      />
      <h3 className="text-sm font-bold uppercase tracking-wider text-star-100 transition-colors duration-200 group-hover:text-ember-500 sm:text-[15px]">
        {member.name}
      </h3>
      <p className="mt-1.5 text-[11px] font-medium leading-snug text-star-400 sm:text-xs">
        {member.role}
      </p>
    </article>
  )
}
