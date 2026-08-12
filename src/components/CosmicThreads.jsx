// ─── CosmicThreads — the page-breaker band between Hero and Services.
// Mat's call 2026-08-12: replace the orange WispyCloud with animated
// "cosmic clouds".
//
// THEME SPLIT (final decision — Mat: WebThreads/Strands never satisfied
// on light paper; the orange cloud is proven there):
//   dark  → WebThreads ember-fire weave (glows on ink, keep it)
//   light → AuroraBand — the ORANGE WispyCloud page breaker (the
//           original, proven design on the white theme)
// Reduced motion: WebThreads renders a static frame; WispyCloud draws
// one static frame. Both pause offscreen + on hidden tab.

import { useTheme } from '../theme'
import WebThreads from './WebThreads'
import AuroraBand from './AuroraBand'

export default function CosmicThreads() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return isDark ? (
    /* ── Dark: the ember web-threads fire weave ── */
    <section
      data-parallax="0.18"
      className="cosmic-threads-band relative h-64 overflow-x-clip sm:h-96"
      aria-hidden="true"
    >
      <div className="cosmic-threads-mask absolute inset-0">
        <WebThreads
          color1="#7C2D12"
          color2="#E11D2E"
          color3="#FFC9A0"
          speed={0.35}
          threadCount={6}
          frequency={4.5}
          spread={0.22}
          taper={1.1}
          position={0.5}
          fanMode="center"
          glow={0.045}
          falloff={0.55}
          thickness={1.3}
          brightness={0.75}
          opacity={0.9}
          mirror
          shimmer
          grain={false}
          grainIntensity={0}
          mouseInteraction
          mouseStrength={0.6}
        />
      </div>
    </section>
  ) : (
    /* ── Light: the ORIGINAL orange WispyCloud band ── */
    <AuroraBand />
  )
}
