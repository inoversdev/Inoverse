// Avatar tints live in one shared literal class map (lib/avatars) — CrewCard
// renders the same discs, and Tailwind can't see template-literal classes.
import { avatarClass } from '../lib/avatars'

const Star = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" {...props}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

export default function TestimonialCard({ item }) {
  return (
    <div className="testimonial-card glass relative flex flex-col gap-4 overflow-hidden rounded-2xl p-6">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 right-4 select-none font-display text-6xl font-bold leading-none text-ember-500/10"
      >
        "
      </span>
      <div className="testimonial-stars flex gap-1 text-ember-500">
        {Array.from({ length: item.rating }).map((_, i) => (
          <Star key={i} />
        ))}
      </div>
      <p className="relative text-sm leading-relaxed text-star-300">{item.quote}</p>
      <div className="mt-auto flex items-center gap-3 border-t border-star-300/15 pt-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${avatarClass(item.avatar)}`}
        >
          {item.initials}
        </div>
        <div>
          <div className="text-sm font-semibold text-star-100">{item.name}</div>
          <div className="text-xs text-star-500">
            {item.role}
            {item.company ? `, ${item.company}` : ''}
          </div>
        </div>
      </div>
    </div>
  )
}
