# Design

## Visual Theme

Space/cosmic marketing site. Light (white) is the DEFAULT theme; `.dark` on `<html>` flips to
the original deep-space ink — theme is a runtime CSS-variable swap, not two separate
stylesheets. Accent is a single warm "ember" hue that glows harder in dark mode. Grain overlay at
very low opacity (0.02 light / 0.03 dark) adds texture without reading as noisy.

## Color

Color strategy: **restrained neutrals + one committed accent.** Neutrals (`space-*` surface,
`star-*` text) are theme-aware CSS vars, tinted (never pure black/white). Ember is the single
accent, used deliberately rather than scattered — reserved for CTAs, focus rings, badges, and
the one VIP card treatment.

- `--color-space-950 → 600`: surface scale. Light: `#FFFFFF → #D4D4D8`. Dark: `#050404 → #2b2421`
  (warm-tinted near-black, not pure `#000`).
- `--color-star-100 → 600`: text scale. Light: `#111111 → #A1A1AA`. Dark: `#F5F1ED → #665C54`
  (warm off-white, not pure `#fff`).
- `--color-ember-50 → 700`: brand accent, `#FEF2ED → #A92001`, core at `ember-500 #F53003`.
  Doubles as a gold-adjacent gradient partner with `amber-400/300` for premium/VIP moments only.
- Selection color, scrollbar thumb, and focus outlines all pull from `ember-500/400` — accent
  reinforced in the small system details, not just hero surfaces.

## Typography

- `--font-display`: "Space Grotesk" — headings, prices, anything that needs presence.
- `--font-sans`: "Geist" / "Plus Jakarta Sans" — body copy, buttons, UI text.
- `--font-mono`: "Geist Mono" — incidental/technical accents.
- Headings use `tracking-tight` to `tracking-[-0.04em]` at display sizes; eyebrows use
  `uppercase tracking-[0.2em] text-xs font-semibold` in ember.
- Hierarchy leans on scale jumps (4xl→7xl for hero prices) plus weight, not color alone.

## Components

- **Buttons** (`.v2-btn`): pill radius (`9999px`), 2.75rem min-height. `.v2-btn-primary` solid
  ember; `.v2-btn-ghost` hairline ember border. Deliberately plain grammar — "the familiar,
  trustworthy button shape clients already know" (no decoration beyond shape + color). Active
  state: 1px translateY press. Focus: 2px ember outline, 3px offset.
- **Glass cards** (`.glass`): light — soft white gradient + 8% black hairline border + subtle
  shadow. Dark — near-transparent white gradient, no shadow, hairline white border. Used for
  standard (non-hero) cards.
- **Premium/VIP card material** (pricing Customize tier, `.premium-*` classes): a distinct,
  deliberately louder material reserved for the single highest-value element on a page — dark
  luxe surface even in light mode, rotating ember→gold conic ring (`@property --premium-angle`),
  flowing gold badge shimmer, floating badge, breathing ember glow, periodic light sheen. This
  tier of effect is earned by scarcity: one card per page gets it, never a whole grid.
- **Bento tiles**: cursor-following radial ember glow via `--mx/--my` custom properties set from
  pointermove, opacity-gated to hover only (never shown on touch).

## Layout

- Section rhythm: `max-w-6xl` outer, `max-w-2xl` centered intro copy, generous `py-20` section
  padding.
- Cards use `rounded-3xl`, generous internal padding (`p-10 sm:p-12`).

## Motion

- Standard easing: `ease-out`, `cubic-bezier(0.16, 1, 0.3, 1)` (expo/quart-out family). No
  bounce/elastic anywhere in the codebase.
- Transform + opacity + shadow/gradient-position only; layout properties are never animated.
- Every custom animation has a matching `@media (prefers-reduced-motion: reduce)` kill switch —
  non-negotiable convention, present on drawer motion, bento glow, and all premium-card effects.
- Hover interactions favor subtle 3D tilt (`rotateX/rotateY` + `translateZ`) over scale-only
  feedback on cards.
