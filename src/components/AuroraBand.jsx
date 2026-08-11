// ─── AuroraBand — ember cloud page breaker (Hero → Services) ───
// The orange cloud between hero and services — the SAME WispyCloud
// curtains as SpacePortfolio's delivery cloud (duplicated, Mat's call
// 2026-08-11: "put back the old orange cloud, duplicate the one from
// the our work section"). Layered sine-wave ribbons drawn additively
// ('lighter') so overlapping glows read as a glowing gas cloud.
//
// Scroll-reactive depth via data-parallax — the band lags behind the
// page. The fill gradient fades to transparent at the canvas top AND
// bottom, so the cloud melts into the hero above and services below;
// the horizontal mask feathers both edges (same as the delivery strip).
//
// CosmicCloud (the straight-line FBM nebula experiment) is parked —
// swap the import back to restore it.

import WispyCloud from './WispyCloud'

// Exact copy of SpacePortfolio's DELIVERY_CLOUD_CURTAINS (Mat's call):
// ember-toned to match the brand accent (dune fills used the same
// tokens before).
const BAND_CLOUD_CURTAINS = [
  { color: [245, 48, 3], amp: 14, freq: 0.02, speed: 1.0, phase: 0, height: 0.55, alpha: 0.22, line: false },
  { color: [255, 138, 92], amp: 10, freq: 0.026, speed: -1.2, phase: 2.0, height: 0.4, alpha: 0.16, line: false },
  { color: [192, 36, 2], amp: 9, freq: 0.017, speed: 0.7, phase: 3.4, height: 0.28, alpha: 0.14, line: false },
]

export default function AuroraBand() {
  return (
    <section
      data-parallax="0.18"
      className="aurora-band relative h-64 overflow-x-clip sm:h-96"
      aria-hidden="true"
    >
      <WispyCloud
        curtains={BAND_CLOUD_CURTAINS}
        canvasClassName="absolute inset-0 h-full w-full"
        style={{
          filter: 'blur(6px)',
          maskImage:
            'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      />
    </section>
  )
}
