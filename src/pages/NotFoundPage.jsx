import { Link } from 'react-router-dom'

// ─── 404 — "you drifted off course" ───
// Catch-all route (SpaceApp path="*"). Space-themed, on-brand: the
// visitor lost in the universe gets a way home, not a blank page.
// Launch prep, Mat's call 2026-08-11.
export default function NotFoundPage() {
  return (
    <section className="relative mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-28 text-center">
      <p className="font-display text-[7rem] font-bold leading-none tracking-[-0.04em] text-star-100/15 sm:text-[9rem]">
        404
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-star-100 sm:text-4xl">
        You&apos;ve drifted off course
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-star-400">
        This part of the universe doesn&apos;t exist — or it moved. Either
        way, the crew can get you back to known space.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link to="/" className="v2-btn v2-btn-primary group">
          Return home
          <span
            aria-hidden="true"
            className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:translate-x-0 motion-reduce:transition-none"
          >→</span>
        </Link>
        <Link to="/projects" className="v2-btn v2-btn-ghost">
          Browse missions
        </Link>
      </div>
    </section>
  )
}
