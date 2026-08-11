import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useLenis } from 'lenis/react'
import { BRAND } from '../lib/content'
import ProjectDemo from './projectDemos'

// ─── Project modal — full-view details with an animated demo ───
// Mat's call 2026-08-11: clicking a mission no longer redirects to the
// project's external site — it opens THIS modal instead (services-bento
// styling: glass panel, ember accents, the animated how-it-works demo
// on top). Escape / backdrop / X close; Lenis scroll locks while open.
export default function ProjectModal({ project, onClose }) {
  const panelRef = useRef(null)
  const lenis = useLenis()

  // Scroll lock + Escape close
  useEffect(() => {
    lenis?.stop()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    // focus the panel for a11y
    const t = setTimeout(() => panelRef.current?.focus(), 50)
    return () => {
      lenis?.start()
      window.removeEventListener('keydown', onKey)
      clearTimeout(t)
    }
  }, [lenis, onClose])

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={project.name}>
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-space-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="project-modal-panel glass relative max-h-full w-full max-w-3xl overflow-y-auto rounded-3xl p-6 outline-none sm:p-8"
      >
        {/* header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-ember-500/30 bg-ember-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ember-600 dark:text-ember-300">
              {project.industry}
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-star-100 sm:text-3xl">
              {project.name}
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span key={t} className="rounded-md bg-star-100/5 px-2 py-0.5 text-[11px] font-medium text-star-400">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-star-300/30 text-star-400 transition-colors hover:border-ember-500/60 hover:text-ember-500 active:scale-90"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* the animated how-it-works demo */}
        <div className="mb-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-star-500">
            How it works — live demo
          </p>
          <ProjectDemo project={project} />
        </div>

        {/* description */}
        <p className="text-sm leading-relaxed text-star-400">{project.description}</p>

        {/* footer CTA */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-star-300/20 pt-5">
          <a
            href={BRAND.calendly}
            target="_blank"
            rel="noreferrer"
            className="v2-btn v2-btn-primary group"
          >
            Build something like this
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:translate-x-0 motion-reduce:transition-none"
            >→</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="v2-btn v2-btn-ghost"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
