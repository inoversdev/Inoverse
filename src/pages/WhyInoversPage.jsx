// ─── /why-inovers — Phase 2 placeholder ───
// Content TBD; the shell (3D scene, nav, footer, smooth scroll) already
// comes from the AppShell above the router, so this page is drop-in ready.
export default function WhyInoversPage() {
  return (
    <section className="relative mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 pt-32 pb-24 text-center">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ember-500">
        Why Inovers
      </p>
      <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-star-100 sm:text-5xl">
        Why choose <span className="ember-text font-light">Inovers</span>
      </h1>
      <p className="mt-5 text-sm leading-relaxed text-star-400">
        Coming soon — the story, the standards, and the results behind the crew.
      </p>
    </section>
  )
}
