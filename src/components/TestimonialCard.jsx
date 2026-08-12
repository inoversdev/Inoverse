// Avatar tints live in one shared literal class map (lib/avatars) — CrewCard
// renders the same discs, and Tailwind can't see template-literal classes.
import { avatarClass } from '../lib/avatars'

const Star = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" {...props}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

// Interactive on hover — including the quote text itself, not just the card
// shell. Lives inside a marquee track that never pauses on hover (Mat's
// call), so every effect here is a pure CSS transform/opacity on the card
// itself: it composes cleanly with the track's own translateX loop instead
// of fighting it.
export default function TestimonialCard({ item }) {
  return (
    <div
      className="testimonial-card group glass relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-transparent p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-ember-500/25 hover:shadow-[0_24px_48px_-20px_rgba(17,17,17,0.14)]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 right-4 select-none font-display text-6xl font-bold leading-none text-ember-500/10 transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-ember-500/25"
      >
        "
      </span>
      <div className="testimonial-stars flex gap-1 text-ember-500">
        {Array.from({ length: item.rating }).map((_, i) => (
          <Star
            key={i}
            className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:scale-125"
            style={{ transitionDelay: `${i * 40}ms` }}
          />
        ))}
      </div>
      <p className="relative text-sm leading-relaxed text-star-300 transition-colors duration-300 ease-out group-hover:text-star-100">
        {item.quote}
      </p>
      <div className="mt-auto flex items-center gap-3 border-t border-star-300/15 pt-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-none transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-[0_0_18px_rgba(245,48,3,0.4)] ${avatarClass(item.avatar)}`}
        >
          {item.initials}
        </div>
        <div>
          <div className="text-sm font-semibold text-star-100 transition-colors duration-300 ease-out group-hover:text-ember-500 dark:group-hover:text-ember-300">
            {item.name}
          </div>
          <div className="text-xs text-star-500">
            {item.role}
            {item.company ? `, ${item.company}` : ''}
          </div>
        </div>
      </div>
    </div>
  )
}
