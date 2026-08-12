# Product

## Register

brand

## Users

Founders, CTOs, and product owners (many Filipino SMEs and startups) evaluating a small dev
agency for a build. They're comparing Inovers against "typical agencies" (account managers,
black-box process, scope creep) and freelancers. On the pricing section specifically, they're
deciding between a fast fixed-scope starter build and a fully custom, higher-touch engagement.

## Product Purpose

Inovers v2 is the marketing site for Inovers, a small dev agency ("You work with the people who
build," no account managers, focused launches in as little as 3 days). The site's job is to
convert visitors into booked calls. Pricing is the money moment: Starter (₱599, "as low as") is
the low-friction entry tier; Customize is the premium/VIP tier for tailored, higher-value
engagements and should read as the more desirable, higher-margin option.

## Brand Personality

Premium, confident, close-to-the-metal. Not corporate-agency (that's the anti-reference: account
managers, black-box process, generic SaaS-cream). Space/cosmic visual motif (space-950/star-100
tokens, "crew," "transmissions," parked scenes) paired with an ember-to-gold accent that signals
craft and warmth rather than cold tech-blue. Three words: premium, direct, crafted.

## Anti-references

- Generic SaaS-cream marketing sites (soft pastel gradients, stock illustration, hero-metric
  template)
- Corporate agency sites that read as "account managers between you and the work"
- Cheap-looking "premium" cues: overused gradient text, gratuitous glassmorphism, cheesy gold
  foil clichés

## Design Principles

- Show, don't tell: the Customize tier should *feel* premium through material and motion, not
  just say "Premium" on a badge
- Practice what you preach: no scope creep in the design either — every effect on the VIP card
  earns its place, nothing decorative-only or gratuitous
- One clear hierarchy per screen: Starter and Customize must both read clearly, but Customize
  should unmistakably outrank Starter at a glance
- Motion serves meaning: the space/cosmic theme licenses more atmospheric motion than a typical
  SaaS site, but it still must stay purposeful and reduced-motion safe

## Accessibility & Inclusion

Respect `prefers-reduced-motion` everywhere motion is used (established convention in this
codebase). Maintain WCAG AA contrast in both the light (default) and dark theme variants. Keep
focus states visible on all interactive elements (CTAs, links).
