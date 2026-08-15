# Inovers Tech Solutions — Marketing Site

The official marketing site for **Inovers**, a small dev agency built on a simple promise: *"You work with the people who build."* No account managers, no black-box process — focused launches in as little as 3 days.

The site is a space/cosmic-themed, motion-rich React single-page application designed to convert visitors into booked calls. Pricing is the money moment: a low-friction **Starter** tier (₱599/mo) and a premium **Customize** tier.

> Design intent: **premium, direct, crafted.** Read [`DESIGN.md`](./DESIGN.md) for the full visual system and [`PRODUCT.md`](./PRODUCT.md) for positioning.

## Features

- **Space/cosmic visual universe** — a real-time WebGL starfield (Three.js) that powers a fixed background scene, with scroll-driven camera flight through the page.
- **Two themes** — warm paper-white by default, deep-space ink in dark mode. A runtime CSS-variable swap (no separate stylesheets), chosen via a nav toggle and persisted to `localStorage`.
- **Smooth scrolling** — Lenis virtual scroll kept in lockstep with GSAP ScrollTrigger so parallax, reveals, and scrubbed animations never lag or clamp mid-page.
- **Atmospheric motion** — ember cursor aura, aurora bands, light pillars, orbiting systems, wispy clouds, and WebGL thread/strand effects (OGL). Every custom animation has a `prefers-reduced-motion` kill switch.
- **Pages**
  - `/` — Home: hero, stats, about, services (bento media grids), work showcase, process, pricing, why-Inovers comparison deck, testimonials, contact.
  - `/projects` — full project manifest with industry filtering.
  - `/crew` — the team, with department filtering and an organizational orbit.
  - `*` — 404.
- **Content honesty** — placeholder crew and testimonials render a visible "sample/demo" ribbon until real names and quotes land. Swapping real content is a pure data change in `src/lib/content.js`.
- **Performance-first** — code-split routes (`/projects`, `/crew`), manual chunks for `three` and `gsap`, deferred WebGL boot, and a low-end device profile that cuts heavy effects.
- **Analytics ready** — Meta Pixel installed (head snippet fires `PageView` on every route).

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite`) |
| Routing | React Router 7 |
| Animation | GSAP 3 + ScrollTrigger |
| Smooth scroll | Lenis |
| 3D scene | Three.js |
| WebGL effects | OGL |
| Deployment | Vercel (SPA rewrite) |

## Getting Started

Requires **Node.js 18+**.

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Create a production build
npm run build

# Preview the production build locally
npm run preview
```

The dev server is configured with an `allowedHosts` allowlist for public tunnel hosts (`*.trycloudflare.com`, `*.ngrok-free.app`, `*.loca.lt`, etc.) so live-share/preview sessions work out of the box.

## Project Structure

```
src/
├── main.jsx              # Entry — mounts ThemeProvider + BrowserRouter
├── SpaceApp.jsx          # App shell: 3D universe, nav, footer, routes (survives navigation)
├── theme.jsx             # Light/dark theme provider (runtime CSS-variable swap)
├── index.css             # Tailwind entry + design tokens + grain/vignette system
├── pages/
│   ├── HomePage.jsx      # Eager-loaded landing route
│   ├── ProjectsPage.jsx  # Lazy-loaded /projects
│   ├── CrewPage.jsx      # Lazy-loaded /crew
│   └── NotFoundPage.jsx  # Lazy-loaded 404
├── components/           # SpaceNav, SpaceHero, SpacePricing, SpacePortfolio, CrewCard, …
│   └── effects/          # CursorAura and other ambient effects
├── three/                # SpaceScene, buildUfo, textures (the 3D universe)
├── hooks/                # useDeviceProfile, useParallaxLayers
└── lib/
    ├── content.js        # ALL site copy + projects + crew + testimonials (edit here)
    ├── avatars.js        # Avatar/medallion definitions
    ├── cardReveal.js     # Scroll-triggered card reveal helpers
    └── noise.js          # Grain overlay generation
```

## Architecture Highlights

- **App shell pattern** — the 3D universe, smooth scroll, nav, and footer live in `SpaceApp` and survive route changes; only `<main>` content swaps. The scene re-skins on theme toggle but never remounts on navigation.
- **Lenis ⇄ ScrollTrigger sync** — a `ResizeObserver` on the app root re-syncs the Lenis scroll limit whenever the page height changes (fonts, lazy content), preventing the stale-limit scroll clamp that silently capped scrubbed animations.
- **Code splitting** — home is eager; `/projects` and `/crew` are `React.lazy` chunks. `three` and `gsap` are split into long-cacheable manual chunks, keeping the app chunk small so text paints fast.
- **Device awareness** — `useDeviceProfile` flips a `low-end` class on `<html>` that disables expensive blur/glow and reduces 3D object counts on modest hardware.

## Editing Content

All site copy, projects, crew, testimonials, pricing, and navigation live in **one file**: [`src/lib/content.js`](./src/lib/content.js).

- **Projects** — add/remove entries in `PROJECTS`. Entries with `demo: true` are placeholders; remove the flag as real launches land.
- **Crew** — entries named after seats (not invented people) with `demo: true`. Going live is a data swap: add real `photo` paths, real names/bios, and flip `demo` off (all-or-nothing).
- **Testimonials** — dummy entries render under a "sample stories" ribbon while `TESTIMONIALS_META.status` is `'pending'`. Flip to `'live'` with a real average/source when real quotes land.
- **Pricing** — `PRICING.plans` holds both tiers. Feature lists are placeholders — confirm inclusions with the CTO before launch.
- **Contact chat** — the live-chat card is wired via `CONTACT.vibs.url`; leaving it empty shows a disabled "coming soon" state.

## Deployment

The site deploys to **Vercel** with a catch-all rewrite (`vercel.json`) so client-side routing works on every path.

1. Push to the repo (builds via `npm run build`).
2. `og:url` in `index.html` must point at the final production domain before launch (currently `https://inovers.dev/`).
3. An `og:image` (1200×630) share card should be generated once design assets land.

## Accessibility & Performance

- Every custom animation has a matching `@media (prefers-reduced-motion: reduce)` kill switch.
- WCAG AA contrast maintained in both light and dark themes; visible focus states on all interactive elements.
- Motion animates only transform/opacity/shadow — never layout properties.
- Standard easing is the expo/quart-out family (`cubic-bezier(0.16, 1, 0.3, 1)`); no bounce/elastic anywhere.

## Related Documents

- [`DESIGN.md`](./DESIGN.md) — visual theme, color tokens, typography, component materials, motion conventions.
- [`PRODUCT.md`](./PRODUCT.md) — brand personality, target users, anti-references, design principles.
