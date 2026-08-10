// ─── OrbitalBand — the /crew opening band ───
// Renders the shared interactive OrbitSystem (drag-to-rotate, billboard
// medallions — the same system the home About section uses) plus the
// caption naming what the visual shows. Department-level only: seats
// and teams from ORG_CHART, the same taxonomy the filter chips below
// are derived from.
import { BRAND, CREW_PAGE, ORG_CHART } from '../lib/content'
import OrbitSystem from './OrbitSystem'

export default function OrbitalBand() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-10 lg:px-10">
      <div className="flex flex-col items-center">
        <OrbitSystem />

        {/* Caption — names what the visual is showing, so the band reads as
            the department map the filter chips below are built from. */}
        <p className="mt-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-ember-500">
          {CREW_PAGE.orbit.eyebrow}
        </p>
        <p className="mt-3 max-w-md text-center text-sm leading-relaxed text-star-400">
          {CREW_PAGE.orbit.caption}
        </p>
      </div>
    </section>
  )
}
