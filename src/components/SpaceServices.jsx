import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SERVICES, STATS, servicesHeading, servicesSubtitle } from '../lib/content'
import { applyCardReveal } from '../lib/cardReveal'
import SplitHeading from './SplitHeading'

gsap.registerPlugin(ScrollTrigger)

const ICONS = {
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13 4l-2 16" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" />
    </svg>
  ),
}

// ─── Squiggle underline accent (from the mockup) ───
const Squiggle = ({ className = '' }) => (
  <svg viewBox="0 0 120 8" fill="none" className={className} aria-hidden="true">
    <path
      d="M2 5 Q 12 1 22 5 T 42 5 T 62 5 T 82 5 T 102 5 T 118 5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
)

// ─── Wireframe atoms — the vocabulary every "kind" below composes from.
// HIGH-FIDELITY pass 2 (Mat's call 2026-08-11: "like a real actual
// system!") — tiles now carry real product chrome: nav bars with menu
// labels, sidebars, search fields, notifications, KPI cards with icons
// + deltas, dual-series charts with gridlines, tables with avatars and
// pagination, chat with typing indicators and read receipts. Still
// illustrations (generic UI copy, no fabricated screenshots). */
const Line = ({ w = 'w-full', h = 'h-1.5', tone = 'bg-star-100/12', className = '', style }) => (
  <span className={`block rounded-full ${w} ${h} ${tone} ${className}`} style={style} />
)
const Block = ({ className = '', tone = 'bg-star-100/8', children }) => (
  <span className={`block rounded-md ${tone} ${className}`}>{children}</span>
)
const Pill = ({ w = 'w-10', tone = 'bg-ember-500/20', className = '', children }) => (
  <span className={`flex h-3 items-center rounded-full ${w} ${tone} ${className}`}>{children}</span>
)
const Dot = ({ tone = 'bg-ember-500/40', className = '', style }) => (
  <span className={`block h-2 w-2 shrink-0 rounded-full ${tone} ${className}`} style={style} />
)
const Avatar = ({ tone = 'bg-ember-500/25', size = 'h-6 w-6', children }) => (
  <span className={`flex shrink-0 items-center justify-center rounded-full ${size} ${tone}`}>{children}</span>
)
const MiniLabel = ({ children, className = '' }) => (
  <span className={`block truncate text-[9px] font-semibold leading-tight tracking-wide ${className}`}>
    {children}
  </span>
)
const MiniSub = ({ children, className = '' }) => (
  <span className={`block truncate text-[8px] leading-tight ${className}`}>
    {children}
  </span>
)
const Chip = ({ children, tone = 'bg-ember-500/20 text-ember-600 dark:text-ember-300' }) => (
  <span className={`inline-flex items-center rounded-full px-1.5 py-px text-[7px] font-semibold uppercase tracking-wider ${tone}`}>
    {children}
  </span>
)

// Tiny SVG bar chart — data-driven, ember bars, subtle grid, last-bar highlight
const MiniBars = ({ values = [40, 65, 30, 80, 55, 70, 45], className = '' }) => (
  <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={`h-full w-full ${className}`} aria-hidden="true">
    {[10, 20, 30].map((y) => (
      <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeOpacity="0.07" strokeWidth="0.5" />
    ))}
    {values.map((v, i) => (
      <rect
        key={i}
        x={i * (100 / values.length) + 3}
        y={40 - v * 0.36}
        width={100 / values.length - 6}
        height={v * 0.36}
        rx="1.5"
        className={`chart-bar ${i === values.length - 1 ? 'fill-ember-500/80' : 'fill-ember-500/30'}`}
        style={{ animationDelay: `${i * 0.14}s` }}
      />
    ))}
  </svg>
)

// Dual-series area chart — the "real system" revenue curve
const MiniArea = ({ className = '' }) => (
  <svg viewBox="0 0 120 44" preserveAspectRatio="none" className={`h-full w-full ${className}`} aria-hidden="true">
    <defs>
      <linearGradient id="mini-area-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(245,48,3,0.35)" />
        <stop offset="100%" stopColor="rgba(245,48,3,0)" />
      </linearGradient>
    </defs>
    {[10, 20, 30].map((y) => (
      <line key={y} x1="0" y1={y} x2="120" y2={y} stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.5" />
    ))}
    {/* secondary series (soft) */}
    <path d="M0 32 C 15 28, 30 30, 45 24 S 75 22, 90 18 S 110 16, 120 14" fill="none" stroke="rgba(148,163,184,0.5)" strokeWidth="1.2" strokeDasharray="3 2" strokeLinecap="round" />
    <path d="M0 36 C 15 30, 25 34, 38 26 S 60 18, 72 22 S 100 8, 120 6 L120 44 L0 44 Z" fill="url(#mini-area-fill)" />
    <path d="M0 36 C 15 30, 25 34, 38 26 S 60 18, 72 22 S 100 8, 120 6" fill="none" stroke="rgba(245,48,3,0.85)" strokeWidth="1.6" strokeLinecap="round" className="chart-line" />
    <circle cx="120" cy="6" r="2.2" fill="rgba(245,48,3,0.9)" className="loop-pulse" />
  </svg>
)

// Tiny donut — completion-style ring
const MiniDonut = ({ pct = 68, className = '' }) => (
  <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} aria-hidden="true">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="3.5" />
    <circle
      cx="12" cy="12" r="9" fill="none"
      stroke="rgba(245,48,3,0.85)" strokeWidth="3.5" strokeLinecap="round"
      strokeDasharray={`${(pct / 100) * 56.5} 56.5`} transform="rotate(-90 12 12)" className="chart-donut"
    />
  </svg>
)

// ─── Kind renderers — one per media.items[].kind. Second high-fidelity
// pass: real product chrome — navs, sidebars, KPIs, charts, tables,
// chat, kanban. Website → marketing layouts, Software → app/code
// chrome, Systems → data. ───
const KINDS = {
  hero: () => (
    <div className="flex h-full flex-col gap-1.5 p-3">
      {/* nav with real menu labels */}
      <div className="flex items-center justify-between border-b border-star-300/10 pb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ember-500/70" />
          <MiniLabel className="text-star-300">Brand</MiniLabel>
        </div>
        <div className="flex items-center gap-1.5">
          <MiniSub className="text-star-500">Features</MiniSub>
          <MiniSub className="text-star-500">Pricing</MiniSub>
          <Pill w="w-8" tone="bg-ember-500/70" />
        </div>
      </div>
      {/* hero copy */}
      <div className="mt-1 space-y-1">
        <MiniLabel className="text-ember-500/80">GROW YOUR BUSINESS</MiniLabel>
        <p className="draw-line font-display text-[13px] font-bold leading-tight text-star-100">
          Launch a site that
        </p>
        <p className="draw-line font-display text-[13px] font-bold leading-tight text-star-100" style={{ animationDelay: '0.3s' }}>
          actually converts.
        </p>
        <p className="draw-line text-[8px] leading-snug text-star-500" style={{ animationDelay: '0.6s' }}>
          Fast, modern, and built to launch in days — not months.
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="flex h-4 items-center rounded-full bg-ember-500/80 px-2 text-[7px] font-bold text-white">
          Get Started
        </span>
        <span className="flex h-4 items-center rounded-full bg-star-100/10 px-2 text-[7px] font-semibold text-star-400">
          See Work
        </span>
      </div>
      {/* hero visual — compact dashboard system, standing in for the
          product screenshot */}
      <div className="relative min-h-0 flex-1">
        <div className="flex h-full w-full gap-1 overflow-hidden rounded-md border border-star-300/15 bg-star-100/5 p-1.5">
          {/* sidebar */}
          <div className="flex w-6 flex-col items-center gap-1 rounded bg-star-100/8 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-ember-500/70" />
            {['D', 'O', 'C'].map((l, i) => (
              <span key={l} className={`flex h-3 w-3 items-center justify-center rounded ${i === 0 ? 'bg-ember-500/20' : ''}`}>
                <MiniLabel className={`text-[5px] ${i === 0 ? 'text-ember-500' : 'text-star-500'}`}>{l}</MiniLabel>
              </span>
            ))}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            {/* topbar */}
            <div className="flex items-center justify-between">
              <MiniLabel className="text-star-300">Overview</MiniLabel>
              <span className="relative h-2.5 w-2.5 rounded-full bg-star-100/15">
                <span className="loop-pulse absolute -right-0.5 -top-0.5 h-1 w-1 rounded-full bg-ember-500" />
              </span>
            </div>
            {/* KPI row */}
            <div className="grid grid-cols-3 gap-1">
              {[
                ['Visits', '12.4k', 'bg-ember-500/15'],
                ['Leads', '842', 'bg-emerald-400/15'],
                ['Rate', '6.8%', 'bg-sky-400/15'],
              ].map(([label, v, tone]) => (
                <div key={label} className={`rounded ${tone} px-1 py-0.5`}>
                  <MiniSub className="text-star-500">{label}</MiniSub>
                  <MiniLabel className="text-[8px] text-star-200">{v}</MiniLabel>
                </div>
              ))}
            </div>
            {/* chart */}
            <Block className="min-h-0 flex-1">
              <MiniArea className="p-0.5" />
            </Block>
          </div>
        </div>
        <div className="loop-bob absolute right-1.5 top-1.5 rounded-md bg-white/80 px-1.5 py-1 shadow-sm dark:bg-[rgba(22,18,15,0.50)]">
          <MiniLabel className="text-star-200">+38%</MiniLabel>
          <MiniSub className="text-emerald-500">this week</MiniSub>
        </div>
        <div className="loop-bob-sm absolute bottom-1.5 left-1.5 flex items-center gap-1.5 rounded-md bg-white/80 px-1.5 py-1 shadow-sm dark:bg-[rgba(22,18,15,0.50)]" style={{ animationDelay: '1.2s' }}>
          <Avatar tone="bg-emerald-400/30" size="h-4 w-4" />
          <div className="space-y-0.5">
            <MiniLabel className="text-star-300">2,400+ signups</MiniLabel>
            <MiniSub className="text-star-500">from your latest campaign</MiniSub>
          </div>
        </div>
      </div>
      {/* logo row */}
      <div className="flex items-center justify-between border-t border-star-300/10 pt-1.5">
        {['L1', 'L2', 'L3', 'L4'].map((l, i) => (
          <Line key={l} w="w-7" h="h-1" tone="bg-star-100/15" className="loop-pulse" style={{ animationDelay: `${i * 0.35}s` }} />
        ))}
      </div>
    </div>
  ),
  gallery: (item) => (
    <div className="flex h-full flex-col gap-1.5 p-3">
      <div className="grid flex-1 grid-cols-2 gap-1.5">
        {[
          ['from-ember-500/30 to-star-100/5', '12 likes'],
          ['from-star-100/25 to-star-100/5', '48 likes'],
          ['from-star-100/20 to-transparent', '7 likes'],
          ['from-ember-500/20 to-star-100/5', '23 likes'],
        ].map(([g, likes], i) => (
          <div key={i} className={`photo-cycle relative overflow-hidden rounded-md ${item?.images?.[i] ? '' : `bg-gradient-to-br ${g}`}`} style={{ animationDelay: `${i * 1.1}s` }}>
            {item?.images?.[i] ? (
              <img src={item.images[i]} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            ) : null}
            <span className="loop-pulse absolute right-1 top-1 rounded-full bg-white/70 px-1 py-px text-[6px] font-semibold text-star-800 dark:bg-[rgba(22,18,15,0.50)] dark:text-star-200">
              ♥ {likes}
            </span>
            <div className="absolute bottom-1 left-1 right-1 flex items-center gap-1">
              <Avatar size="h-3 w-3" tone="bg-white/50" />
              <Line w="w-2/3" h="h-1" tone="bg-white/40" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Dot tone="bg-ember-500/50" />
          <Dot tone="bg-star-100/15" />
          <Dot tone="bg-star-100/15" />
        </div>
        <Chip>View portfolio</Chip>
      </div>
    </div>
  ),
  form: () => (
    <div className="flex h-full flex-col justify-center gap-1.5 p-4">
      <MiniLabel className="text-star-300">Get in touch</MiniLabel>
      <MiniSub className="text-star-500">We usually reply within a day</MiniSub>
      <div className="mt-1 space-y-1">
        <div className="flex items-center justify-between">
          <MiniSub className="text-star-500">FULL NAME *</MiniSub>
          <MiniSub className="text-ember-500">required</MiniSub>
        </div>
        <Block className="h-4 border border-star-300/20 bg-white/60 dark:bg-[rgba(22,18,15,0.50)]" />
      </div>
      <div className="space-y-1">
        <MiniSub className="text-star-500">EMAIL *</MiniSub>
        <Block className="h-4 border border-star-300/20 bg-white/60 dark:bg-[rgba(22,18,15,0.50)]" />
      </div>
      <div className="space-y-1">
        <MiniSub className="text-star-500">BUDGET</MiniSub>
        <div className="flex items-center justify-between rounded-md bg-star-100/10 px-1.5 py-1">
          <MiniSub className="text-star-500">₱599 – Custom</MiniSub>
          <span className="text-[7px] text-star-500">▾</span>
        </div>
      </div>
      <div className="space-y-1">
        <MiniSub className="text-star-500">PROJECT DETAILS *</MiniSub>
        <Block className="h-6 border border-star-300/20 bg-white/60 dark:bg-[rgba(22,18,15,0.50)]"><span className="loop-blink inline-block h-2 w-px translate-y-1 bg-ember-500" /></Block>
      </div>
      <div className="flex items-center gap-1">
        <span className="check-tick h-2 w-2 rounded-[2px] bg-ember-500/70" />
        <MiniSub className="text-star-500">I agree to the terms & privacy policy</MiniSub>
      </div>
      <Pill w="w-full" h="h-4" tone="bg-ember-500/80" className="loop-pulse" />
    </div>
  ),
  list: () => (
    <div className="flex h-full flex-col p-3">
      {/* search + filter */}
      <div className="flex items-center gap-1.5">
        <div className="flex flex-1 items-center gap-1 rounded-md bg-star-100/10 px-1.5 py-1">
          <span className="text-[7px] text-star-500">⌕</span>
          <Line w="flex-1" h="h-1" tone="bg-star-100/15" />
        </div>
        <Chip>Filter</Chip>
      </div>
      <div className="mt-1.5 flex flex-1 flex-col justify-center gap-1.5">
        {[
          ['bg-ember-500/30', 'Maria Santos', 'Order #1042', 'Paid', 'bg-emerald-400/20 text-emerald-600 dark:text-emerald-300', '₱2,450'],
          ['bg-star-100/20', 'Juan Dela Cruz', 'Order #1041', 'Pending', 'bg-amber-400/20 text-amber-600 dark:text-amber-300', '₱1,200'],
          ['bg-star-100/20', 'Ana Reyes', 'Order #1040', 'Shipped', 'bg-sky-400/20 text-sky-600 dark:text-sky-300', '₱3,800'],
        ].map(([tone, name, sub, status, st, amt], i) => (
          <div key={name} className="row-slide flex items-center gap-1.5 rounded-md border border-star-300/10 bg-white/40 px-1.5 py-1 dark:bg-[rgba(22,18,15,0.50)]" style={{ animationDelay: `${i * 1.8}s` }}>
            <Avatar tone={tone} size="h-5 w-5" />
            <div className="min-w-0 flex-1">
              <MiniLabel className="text-star-300">{name}</MiniLabel>
              <MiniSub className="text-star-500">{sub}</MiniSub>
            </div>
            <Chip tone={st}>{status}</Chip>
            <MiniLabel className="text-star-400">{amt}</MiniLabel>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-star-300/10 pt-1">
        <MiniSub className="text-star-500">Showing 3 of 128</MiniSub>
        <div className="flex items-center gap-1">
          <Dot tone="bg-star-100/20" />
          <Dot tone="bg-ember-500/50" />
          <Dot tone="bg-star-100/20" />
        </div>
      </div>
    </div>
  ),
  cards: (item) => (
    <div className="grid h-full grid-cols-2 gap-1.5 p-2.5">
      {[
        ['from-ember-500/25 to-star-100/5', '₱599', '★ 4.9'],
        ['from-star-100/20 to-star-100/5', '₱1,299', '★ 4.7'],
      ].map(([g, price, rating], i) => (
        <div key={i} className="flex flex-col overflow-hidden rounded-md border border-star-300/15 bg-white/40 dark:bg-[rgba(22,18,15,0.50)]">
          <Block className={`img-shimmer relative min-h-0 flex-1 ${item?.images?.[i] ? '' : `bg-gradient-to-br ${g}`}`}>
            {item?.images?.[i] ? (
              <img src={item.images[i]} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            ) : null}
            <span className="loop-pulse absolute right-1 top-1 rounded-full bg-ember-500/80 px-1 py-px text-[6px] font-bold text-white">
              NEW
            </span>
          </Block>
          <div className="space-y-1 p-1.5">
            <Line w="w-3/4" h="h-1" tone="bg-star-100/25" />
            <div className="flex items-center justify-between">
              <MiniLabel className="text-star-200">{price}</MiniLabel>
              <MiniSub className="text-star-500">{rating}</MiniSub>
            </div>
            <Pill w="w-full" h="h-2.5" tone="bg-ember-500/60" className="loop-pulse" />
          </div>
        </div>
      ))}
    </div>
  ),
  footer: () => (
    <div className="flex h-full flex-col justify-between p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ember-500/70" />
          <MiniLabel className="text-star-300">Brand</MiniLabel>
        </div>
        <div className="flex items-center gap-1">
          <Dot tone="bg-star-100/20" className="loop-pulse" style={{ animationDelay: '0s' }} />
          <Dot tone="bg-star-100/20" className="loop-pulse" style={{ animationDelay: '0.2s' }} />
          <Dot tone="bg-star-100/20" className="loop-pulse" style={{ animationDelay: '0.4s' }} />
          <Dot tone="bg-ember-500/40" className="loop-pulse" style={{ animationDelay: '0.6s' }} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          ['PRODUCT', ['Features', 'Pricing', 'Integrations', 'Changelog']],
          ['COMPANY', ['About', 'Careers', 'Blog', 'Contact']],
          ['SUPPORT', ['Help center', 'Status', 'Terms', 'Privacy']],
        ].map(([h, links]) => (
          <div key={h} className="space-y-1">
            <MiniLabel className="text-star-500">{h}</MiniLabel>
            {links.map((l) => (
              <MiniSub key={l} className="text-star-400">{l}</MiniSub>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 rounded-full bg-star-100/10 p-1 pl-2">
        <MiniSub className="flex-1 text-star-500">Get product updates</MiniSub>
        <span className="loop-pulse flex h-2.5 items-center rounded-full bg-ember-500/70 px-2 text-[6px] font-bold text-white">
          Subscribe
        </span>
      </div>
      <div className="flex items-center justify-between border-t border-star-300/10 pt-1.5">
        <MiniSub className="text-star-500">© 2026 Brand. All rights reserved.</MiniSub>
        <MiniSub className="text-star-500">Privacy · Terms</MiniSub>
      </div>
    </div>
  ),
  'app-home': () => (
    <div className="flex h-full flex-col gap-1.5 p-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Avatar tone="bg-ember-500/30" size="h-5 w-5" />
          <div>
            <MiniLabel className="text-star-300">Good morning</MiniLabel>
            <MiniSub className="text-star-500">Maria <span className="wave-hand">👋</span></MiniSub>
          </div>
        </div>
        <div className="relative">
          <span className="h-3.5 w-3.5 rounded-full bg-star-100/15" />
          <span className="loop-pulse absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-ember-500" />
        </div>
      </div>
      <div className="flex items-center gap-1 rounded-md bg-star-100/10 px-1.5 py-1">
        <span className="text-[7px] text-star-500">⌕</span>
        <MiniSub className="text-star-500">Search products…</MiniSub>
      </div>
      <div className="flex gap-1">
        {['All', 'Hot', 'New'].map((c, i) => (
          <Chip key={c} tone={i === 0 ? 'bg-ember-500/70 text-white' : 'bg-star-100/10 text-star-500'}>{c}</Chip>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {[
          ['bg-gradient-to-br from-ember-500/25 to-star-100/5', 'Wireless Earbuds', '₱599', '★ 4.9'],
          ['bg-gradient-to-br from-star-100/20 to-star-100/5', 'Smart Watch', '₱1,299', '★ 4.7'],
        ].map(([g, name, price, rating], i) => (
          <div key={i} className="overflow-hidden rounded-md border border-star-300/10 bg-white/40 dark:bg-[rgba(22,18,15,0.50)]">
            <Block className={`img-shimmer min-h-0 flex-1 bg-gradient-to-br ${g}`} />
            <div className="space-y-0.5 p-1">
              <MiniSub className="text-star-300">{name}</MiniSub>
              <div className="flex items-center justify-between">
                <MiniLabel className="text-star-300">{price}</MiniLabel>
                <MiniSub className="text-star-500">{rating}</MiniSub>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-around border-t border-star-300/10 pt-1">
        {['Home', 'Shop', 'Cart', 'Profile'].map((l, i) => (
          <MiniSub key={l} className={i === 0 ? 'loop-pulse text-ember-500' : 'text-star-500'}>{l}</MiniSub>
        ))}
      </div>
    </div>
  ),
  'app-list': () => (
    <div className="flex h-full flex-col p-2.5">
      <div className="flex items-center justify-between pb-1">
        <MiniLabel className="text-star-300">Messages</MiniLabel>
        <MiniSub className="loop-pulse text-star-500">Mark all read</MiniSub>
      </div>
      <div className="flex-1 space-y-1.5">
        {[
          ['bg-ember-500/30', 'Team Alpha', 'The build is done 🎉', '9:41 AM', true],
          ['bg-star-100/20', 'Design Sync', 'Can we move the demo?', '8:12 AM', false],
          ['bg-star-100/20', 'Daily Standup', 'Blockers: none today', 'Yesterday', true],
          ['bg-star-100/20', 'Launch Plan', 'Domain: confirmed ✅', 'Mon', false],
        ].map(([tone, name, msg, time, unread], i) => (
          <div key={name} className="row-slide flex items-center gap-1.5" style={{ animationDelay: `${i * 1.4}s` }}>
            <Avatar tone={tone} size="h-6 w-6" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <MiniLabel className="text-star-300">{name}</MiniLabel>
                <MiniSub className="text-star-500">{time}</MiniSub>
              </div>
              <MiniSub className="truncate text-star-500">{msg}</MiniSub>
            </div>
            {unread && <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-ember-500 text-[6px] font-bold text-white">2</span>}
          </div>
        ))}
      </div>
    </div>
  ),
  'app-chat': () => (
    <div className="flex h-full flex-col p-2.5">
      {/* chat header */}
      <div className="flex items-center gap-1.5 border-b border-star-300/10 pb-1.5">
        <span className="text-[8px] text-star-500">‹</span>
        <Avatar tone="bg-ember-500/30" size="h-5 w-5" />
        <div className="min-w-0 flex-1">
          <MiniLabel className="text-star-300">Inovers Crew</MiniLabel>
          <MiniSub className="text-emerald-500">● online</MiniSub>
        </div>
        <span className="text-[8px] text-star-500">⋮</span>
      </div>
      <div className="flex items-center justify-center py-1">
        <Chip tone="bg-star-100/10 text-star-500">Today</Chip>
      </div>
      <div className="flex-1 space-y-1.5">
        <div className="flex items-end gap-1">
          <Avatar tone="bg-ember-500/30" size="h-4 w-4" />
          <Block className="chat-bubble max-w-[70%] self-start rounded-lg rounded-bl-sm bg-star-100/10 p-1">
            <MiniSub className="text-star-400">Hi! Is the site live yet?</MiniSub>
            <MiniSub className="text-right text-star-500">9:40 AM</MiniSub>
          </Block>
        </div>
        <div className="flex items-end justify-end gap-1">
          <Block className="chat-bubble max-w-[70%] self-end rounded-lg rounded-br-sm bg-ember-500/25 p-1" style={{ animationDelay: '1.75s' }}>
            <MiniSub className="text-ember-600 dark:text-ember-300">Deploying tomorrow 🚀</MiniSub>
            <MiniSub className="text-right text-ember-600/60 dark:text-ember-300/60">9:41 AM ✓✓</MiniSub>
          </Block>
        </div>
        <div className="flex items-end gap-1">
          <Avatar tone="bg-star-100/20" size="h-4 w-4" />
          <Block className="chat-bubble max-w-[70%] self-start rounded-lg rounded-bl-sm bg-star-100/10 p-1" style={{ animationDelay: '3.5s' }}>
            <MiniSub className="text-star-400">Perfect — can't wait!</MiniSub>
            <MiniSub className="text-right text-star-500">9:42 AM</MiniSub>
          </Block>
        </div>
        <div className="flex items-end justify-end gap-1">
          <Block className="chat-bubble self-end rounded-lg rounded-br-sm bg-ember-500/25 p-1.5" style={{ animationDelay: '5.25s' }}>
            <span className="flex gap-0.5">
              <span className="typing-dot h-1 w-1 rounded-full bg-ember-500" />
              <span className="typing-dot h-1 w-1 rounded-full bg-ember-500" style={{ animationDelay: '0.18s' }} />
              <span className="typing-dot h-1 w-1 rounded-full bg-ember-500" style={{ animationDelay: '0.36s' }} />
            </span>
          </Block>
        </div>
      </div>
      <div className="mt-1 flex items-center gap-1.5 rounded-full bg-star-100/10 px-2 py-1">
        <span className="text-[8px] text-star-500">＋</span>
        <MiniSub className="flex-1 text-star-500">Message Inovers Crew…</MiniSub>
        <span className="text-[8px] text-star-500">🎤</span>
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ember-500 text-[7px] text-white">➤</span>
      </div>
    </div>
  ),
  dashboard: () => (
    <div className="flex h-full gap-1 p-2">
      {/* sidebar with real menu */}
      <div className="flex w-9 flex-col rounded-md bg-star-100/6 p-1">
        <span className="mx-auto mb-1 h-2 w-2 rounded-full bg-ember-500/70" />
        {['D', 'O', 'C', 'S', 'R'].map((l, i) => (
          <span key={l} className={`mx-auto mb-0.5 flex h-4 w-full items-center justify-center rounded ${i === 0 ? 'bg-ember-500/20' : ''}`}>
            <MiniLabel className={i === 0 ? 'text-ember-500' : 'text-star-500'}>{l}</MiniLabel>
          </span>
        ))}
        <span className="mt-auto mx-auto h-4 w-4 rounded-full bg-star-100/20" />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        {/* topbar */}
        <div className="flex items-center justify-between">
          <MiniLabel className="text-star-300">Dashboard</MiniLabel>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-star-100/15" />
            <span className="relative h-3 w-3 rounded-full bg-star-100/15">
              <span className="loop-pulse absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-ember-500" />
            </span>
          </div>
        </div>
        {/* KPI row with icons + deltas */}
        <div className="grid grid-cols-3 gap-1">
          {[
            ['REV', '$12.4k', '↑ 8.2%', 'bg-ember-500/15'],
            ['USR', '8,204', '↑ 3.1%', 'bg-emerald-400/15'],
            ['ORD', '1,128', '↓ 1.4%', 'bg-amber-400/15'],
          ].map(([icon, v, d, tone]) => (
            <div key={v} className="rounded-md bg-star-100/6 p-1">
              <span className={`mb-0.5 flex h-3 w-3 items-center justify-center rounded ${tone}`}>
                <MiniLabel className="text-[6px] text-star-500">{icon}</MiniLabel>
              </span>
              <MiniLabel className="text-star-200">{v}</MiniLabel>
              <MiniSub className={d.startsWith('↑') ? 'text-emerald-500' : 'text-rose-400'}>{d}</MiniSub>
            </div>
          ))}
        </div>
        {/* chart with legend */}
        <Block className="min-h-0 flex-1">
          <MiniBars values={[35, 60, 42, 75, 50, 88]} className="p-1" />
        </Block>
        <div className="flex items-center gap-1.5 px-0.5">
          <Dot tone="bg-ember-500/60" />
          <MiniSub className="text-star-500">Revenue</MiniSub>
          <Dot tone="bg-star-100/30" />
          <MiniSub className="text-star-500">Expenses</MiniSub>
        </div>
        {/* recent orders table */}
        <div className="space-y-1 rounded-md bg-star-100/6 p-1.5">
          {[
            ['JR', 'Juan Ramos', 'Paid', 'bg-emerald-400/20 text-emerald-600 dark:text-emerald-300'],
            ['MC', 'Mia Cruz', 'Pending', 'bg-amber-400/20 text-amber-600 dark:text-amber-300'],
          ].map(([ini, name, status, st]) => (
            <div key={name} className="flex items-center gap-1">
              <Avatar tone="bg-ember-500/20" size="h-3.5 w-3.5"><MiniLabel className="text-[5px] text-ember-600 dark:text-ember-300">{ini}</MiniLabel></Avatar>
              <MiniSub className="flex-1 truncate text-star-400">{name}</MiniSub>
              <Chip tone={st}>{status}</Chip>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  code: () => (
    <div className="flex h-full flex-col p-2 font-mono">
      <div className="flex items-center gap-1 border-b border-star-300/10 pb-1">
        <span className="h-1.5 w-1.5 rounded-full bg-ember-500/60" />
        <span className="h-1.5 w-1.5 rounded-full bg-ember-500/30" />
        <span className="h-1.5 w-1.5 rounded-full bg-star-100/20" />
        <span className="ml-1 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-[2px] bg-star-100/15" />
          <MiniSub className="text-star-500">deliver.js</MiniSub>
        </span>
      </div>
      <div className="mt-1 flex-1 space-y-1">
        {[
          ['1', 'text-star-100/25', ['text-ember-500/80', 'import', 'text-star-100/60', ' { deliver } ', 'text-ember-500/80', 'from', 'text-emerald-400/70', "'inovers'", 'text-star-100/60', ';']],
          ['2', 'text-star-100/25', ['text-star-100/60', 'const', 'text-star-100/60', ' project ', 'text-star-100/60', '=', 'text-star-100/60', ' await ', 'text-ember-500/80', 'deliver', 'text-star-100/60', '({']],
          ['3', 'text-star-100/25', ['text-star-100/60', '  scope', 'text-star-100/60', ':', 'text-emerald-400/70', "'website'", 'text-star-100/60', ',']],
          ['4', 'text-star-100/25', ['text-star-100/60', '  speed', 'text-star-100/60', ':', 'text-emerald-400/70', "'3 days'", 'text-star-100/60', ',']],
          ['5', 'text-star-100/25', ['text-star-100/60', '});', 'text-star-100/45', ' // ship it']],
        ].map(([num, numTone, tokens]) => (
          <div key={num} className="flex items-center gap-1.5 whitespace-nowrap">
            <span className={`w-2 text-right text-[7px] leading-tight ${numTone}`}>{num}</span>
            {tokens.map((t, j) => (
              <span key={j} className={`text-[8px] leading-tight ${t.includes('text-') ? t : 'text-star-100/60'}`}>{t.includes('text-') ? '' : t}</span>
            ))}
          </div>
        ))}
        <span className="loop-blink block h-3 w-1 rounded-sm bg-ember-500" />
      </div>
    </div>
  ),
  kanban: () => (
    <div className="grid h-full grid-cols-3 gap-1.5 p-2">
      {[
        ['TODO', 'bg-star-100/15', '3', [
          ['Payment gateway', 'High'],
          ['Push notifications', 'Low'],
        ]],
        ['DOING', 'bg-amber-400/50', '2', [
          ['Checkout flow', 'High'],
          ['Order tracking', 'Med'],
        ]],
        ['DONE', 'bg-emerald-400/50', '5', [
          ['User onboarding', 'Low'],
          ['Dark mode', 'Low'],
        ]],
      ].map(([title, headTone, count, cards], col) => (
        <div key={title} className="flex flex-col gap-1.5 rounded-md bg-star-100/5 p-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Dot tone={headTone} />
              <MiniLabel className="text-star-500">{title}</MiniLabel>
            </div>
            <span className="loop-pulse rounded-full bg-star-100/10 px-1 text-[7px] text-star-500">{count}</span>
          </div>
          {cards.map(([task, prio], i) => (
            <div key={i} className="kanban-pop space-y-1 rounded-md bg-white/40 p-1 shadow-sm dark:bg-[rgba(22,18,15,0.50)]" style={{ animationDelay: `${col * 1.9 + i * 0.7}s` }}>
              <div className="flex items-center justify-between gap-1">
                <MiniSub className="truncate text-star-300">{task}</MiniSub>
                <Chip tone={prio === 'High' ? 'bg-ember-500/20 text-ember-600 dark:text-ember-300' : 'bg-star-100/10 text-star-500'}>{prio}</Chip>
              </div>
              <MiniSub className="text-star-500">#{120 + col * 10 + i}</MiniSub>
            </div>
          ))}
          <span className="flex items-center justify-center gap-0.5 rounded-md border border-dashed border-star-300/20 py-0.5 text-[7px] text-star-500">
            ＋ Add card
          </span>
        </div>
      ))}
    </div>
  ),
  'dashboard-big': () => (
    <div className="flex h-full flex-col gap-1.5 p-2.5">
      <div className="flex items-center justify-between">
        <div>
          <MiniLabel className="text-star-300">Analytics</MiniLabel>
          <MiniSub className="text-star-500">Last 30 days</MiniSub>
        </div>
        <div className="flex items-center gap-1">
          <Chip tone="bg-star-100/10 text-star-500">1D</Chip>
          <Chip tone="bg-ember-500/20 text-ember-600 dark:text-ember-300">30D</Chip>
          <Chip tone="bg-star-100/10 text-star-500">1Y</Chip>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          ['Revenue', '$48.2k', '↑ 8.2%', 'bg-ember-500/15'],
          ['Users', '1,284', '↑ 3.1%', 'bg-emerald-400/15'],
          ['Health', '96.4%', '↑ 0.8%', 'bg-sky-400/15'],
        ].map(([label, v, d, tone]) => (
          <div key={v} className="rounded-md bg-star-100/6 p-1.5">
            <MiniSub className="text-star-500">{label}</MiniSub>
            <MiniLabel className="text-star-200">{v}</MiniLabel>
            <MiniSub className="text-emerald-500">{d}</MiniSub>
          </div>
        ))}
      </div>
      <Block className="min-h-0 flex-1">
        <MiniArea className="p-1" />
      </Block>
      <div className="flex items-center justify-between rounded-md bg-star-100/6 px-1.5 py-1">
        <div className="flex items-center gap-1.5">
          <Dot tone="bg-ember-500/60" />
          <MiniSub className="text-star-500">This period</MiniSub>
          <Dot tone="bg-star-100/30" />
          <MiniSub className="text-star-500">Last period</MiniSub>
        </div>
        <MiniDonut pct={68} />
      </div>
    </div>
  ),
  flow: () => (
    <div className="flex h-full flex-col items-center justify-center gap-1 p-3">
      {[
        ['bg-ember-500/30', 'Discover', true, '1 day'],
        ['bg-star-100/10', 'Scaffold', false, '1–5 days'],
        ['bg-star-100/10', 'Review', false, '1 day'],
        ['bg-star-100/10', 'Ship', false, 'live'],
      ].map(([tone, label, active, meta], i) => (
        <div key={label} className="flex w-full items-center gap-1.5">
          <span className={`stage-flash flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${tone}`} style={{ animationDelay: `${i * 1.1}s` }}>
            <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-ember-500' : 'bg-star-100/40'}`} />
          </span>
          <div className="min-w-0 flex-1">
            <MiniLabel className={active ? 'text-ember-600 dark:text-ember-300' : 'text-star-400'}>{label}</MiniLabel>
          </div>
          <MiniSub className="text-star-500">{meta}</MiniSub>
          {i < 3 && <span className="loop-pulse shrink-0 text-[8px] text-star-100/30" style={{ animationDelay: `${i * 0.3}s` }}>↓</span>}
        </div>
      ))}
      <div className="mt-1 flex w-full items-center gap-1.5 rounded-md bg-ember-500/10 px-1.5 py-1">
        <MiniLabel className="text-ember-600 dark:text-ember-300">Done in 3 days</MiniLabel>
        <MiniSub className="ml-auto text-star-500">avg. turnaround</MiniSub>
      </div>
    </div>
  ),
  table: () => (
    <div className="flex h-full flex-col gap-1 p-2.5">
      <div className="flex items-center justify-between">
        <MiniLabel className="text-star-300">Clients</MiniLabel>
        <Chip>＋ New</Chip>
      </div>
      <div className="flex items-center gap-1 rounded-md bg-star-100/8 px-1.5 py-1">
        <MiniLabel className="w-1/3 text-star-500">CLIENT</MiniLabel>
        <MiniLabel className="w-1/4 text-star-500">STATUS</MiniLabel>
        <MiniLabel className="w-1/4 text-star-500">DATE</MiniLabel>
        <MiniLabel className="w-1/6 text-right text-star-500">AMOUNT</MiniLabel>
      </div>
      {[
        ['DR', 'Dory Delivery', 'Active', 'Aug 11', '₱12,400', 'bg-emerald-400/20 text-emerald-600 dark:text-emerald-300'],
        ['WH', 'WhatAHotel', 'In review', 'Aug 09', '₱8,900', 'bg-amber-400/20 text-amber-600 dark:text-amber-300'],
        ['KB', 'Kanto Bites', 'Active', 'Aug 07', '₱5,200', 'bg-emerald-400/20 text-emerald-600 dark:text-emerald-300'],
      ].map(([ini, name, status, date, amt, tone]) => (
        <div key={name} className="flex items-center gap-1 border-t border-star-300/10 px-1.5 pt-1">
          <div className="flex w-1/3 items-center gap-1">
            <Avatar tone="bg-ember-500/20" size="h-3.5 w-3.5"><MiniLabel className="text-[5px] text-ember-600 dark:text-ember-300">{ini}</MiniLabel></Avatar>
            <MiniLabel className="text-star-300">{name}</MiniLabel>
          </div>
          <div className="w-1/4"><Chip tone={tone}>{status}</Chip></div>
          <MiniSub className="w-1/4 text-star-500">{date}</MiniSub>
          <MiniLabel className="w-1/6 text-right text-star-400">{amt}</MiniLabel>
        </div>
      ))}
      <div className="mt-auto flex items-center justify-between border-t border-star-300/10 pt-1">
        <MiniSub className="text-star-500">Page 1 of 9</MiniSub>
        <div className="flex items-center gap-1">
          <Dot tone="bg-star-100/20" />
          <Dot tone="bg-ember-500/50" className="loop-pulse" />
          <Dot tone="bg-star-100/20" />
          <Dot tone="bg-star-100/20" />
        </div>
      </div>
    </div>
  ),
  metrics: () => (
    <div className="flex h-full items-center gap-1.5 p-2.5">
      {[
        ['Views', '84.2k', '↑ 12%', 'bg-ember-500/70', '40, 62, 50, 78, 66, 90'],
        ['Leads', '1,024', '↑ 4%', 'bg-ember-500/50', '30, 45, 40, 55, 62, 70'],
        ['Rate', '68%', '↑ 2%', 'bg-ember-500/35', '50, 48, 62, 58, 70, 68'],
        ['Goal', '92%', '↓ 1%', 'bg-star-100/25', '80, 76, 84, 78, 82, 70'],
      ].map(([label, v, d, tone, bars]) => (
        <div key={label} className="flex flex-1 flex-col rounded-md bg-star-100/6 p-1.5">
          <MiniSub className="text-star-500">{label}</MiniSub>
          <MiniLabel className="text-star-200">{v}</MiniLabel>
          <MiniSub className={d.startsWith('↑') ? 'text-emerald-500' : 'text-rose-400'}>{d}</MiniSub>
          <div className="mt-1 h-4">
            <MiniBars values={bars.split(',').map(Number)} className="opacity-70" />
          </div>
        </div>
      ))}
    </div>
  ),
  pipeline: () => (
    <div className="flex h-full items-center gap-1 p-3">
      {[
        ['bg-star-100/8', 'Source', '12k'],
        ['bg-ember-500/20', 'Process', '9.4k'],
        ['bg-star-100/8', 'Enrich', '8.1k'],
        ['bg-star-100/8', 'Store', '7.9k'],
        ['bg-star-100/8', 'Serve', '6.8k'],
      ].map(([tone, label, count], i) => (
        <div key={label} className="flex flex-1 flex-col items-center gap-1">
          <div className={`stage-flash w-full rounded-md px-1 py-1.5 text-center ${tone}`} style={{ animationDelay: `${i * 0.9}s` }}>
            <MiniLabel className={i === 1 ? 'text-ember-600 dark:text-ember-300' : 'text-star-500'}>{label}</MiniLabel>
            <MiniSub className="text-star-500">{count}</MiniSub>
          </div>
          {i < 4 && <span className="loop-pulse text-[8px] text-star-100/30" style={{ animationDelay: `${i * 0.3}s` }}>→</span>}
          <div className={`bar-fill h-1 w-full rounded-full ${i === 4 ? 'bg-emerald-400/40' : 'bg-star-100/15'}`} style={{ animationDelay: `${i * 0.45}s` }} />
        </div>
      ))}
    </div>
  ),
  integrations: () => (
    <div className="flex h-full flex-col justify-center gap-1.5 p-3">
      <div className="grid grid-cols-6 gap-1.5">
        {[
          ['bg-ember-500/25', 'A'],
          ['bg-sky-400/20', 'B'],
          ['bg-emerald-400/20', 'C'],
          ['bg-violet-400/20', 'D'],
          ['bg-amber-400/20', 'E'],
          ['bg-star-100/15', 'F'],
        ].map(([tone, letter], i) => (
          <div key={i} className={`flex aspect-square items-center justify-center rounded-lg ${tone}`}>
            <MiniLabel className="text-[8px] text-star-400">{letter}</MiniLabel>
          </div>
        ))}
      </div>
      <div className="space-y-1">
        <Line w="w-2/3" h="h-1.5" tone="bg-star-100/15" />
        <MiniSub className="text-star-500">Connect your stack — 40+ integrations</MiniSub>
      </div>
      <div className="flex items-center gap-1.5">
        <Pill w="w-16" h="h-3" tone="bg-ember-500/70" className="loop-pulse" />
        <Pill w="w-10" h="h-3" tone="bg-star-100/10" />
      </div>
    </div>
  ),
}
// ─── Media tile — screenshot slot ───
// With `src` set, renders the real screenshot (swap-in ready). With
// `src: null`, renders browser/phone chrome filled with an abstract
// wireframe illustration keyed by `item.kind` — never a fabricated
// screenshot, just a themed shape (Mat's call 2026-08-10).
const MediaTile = ({ item }) => {
  if (item.src) {
    return (
      <div className="h-full w-full overflow-hidden rounded-lg border border-star-300/25">
        <img src={item.src} alt="" className="h-full w-full object-cover" loading="lazy" />
      </div>
    )
  }

  const content = KINDS[item.kind]?.(item) ?? (
    <div className="flex h-full items-center justify-center">
      <div className="h-2 w-2 rounded-full bg-ember-500/25" />
    </div>
  )

  if (item.shape === 'phone') {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg border border-star-300/20 bg-white shadow-[0_1px_2px_rgba(21,20,18,0.04)] dark:border-white/10 dark:bg-[rgba(26,22,18,0.68)] dark:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.55)] dark:backdrop-blur-md">
        <div className="flex h-4/5 w-3/5 flex-col overflow-hidden rounded-[0.9rem] border border-star-300/25 bg-white shadow-sm dark:border-white/10 dark:bg-[rgba(20,17,14,0.72)] dark:backdrop-blur-sm">
          <div className="mx-auto mt-1.5 h-0.5 w-1/3 rounded-full bg-star-100/15" />
          <div className="min-h-0 flex-1">{content}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-star-300/20 bg-white shadow-[0_1px_2px_rgba(21,20,18,0.04)] dark:border-white/10 dark:bg-[rgba(26,22,18,0.68)] dark:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.55)] dark:backdrop-blur-md">
      <div className="flex items-center gap-1 border-b border-star-300/15 px-2 py-1 dark:border-white/10">
        <span className="h-1.5 w-1.5 rounded-full bg-ember-400/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-ember-400/40" />
        <span className="h-1.5 w-1.5 rounded-full bg-ember-400/20" />
        <span className="ml-2 h-1 w-16 rounded-full bg-star-100/10" />
      </div>
      <div className="min-h-0 flex-1">{content}</div>
    </div>
  )
}

// ─── Media block — span-driven bento mosaic ───
// The grid + per-tile span hints come from content.js, so the screenshot
// tiles form a true asymmetric bento (2×2 + tall column for websites, a
// big hero tile + wide strips for software/systems). Spans only apply at
// lg; mobile stacks tiles full-width.
const MediaBlock = ({ media }) => (
  <div className={`grid h-full grid-cols-1 gap-3 min-h-[22rem] sm:min-h-[28rem] ${media.grid}`}>
    {media.items.map((item, i) => (
      <div key={i} className={`bento-tile relative min-h-[10rem] lg:min-h-0 ${item.span || ''}`}>
        <MediaTile item={item} />
      </div>
    ))}
  </div>
)

// ─── Text card — icon badge, title, promise, squiggle underline,
// description, and the original feature bullets ───
const TextCard = ({ s }) => (
  <div className="v2-service-card glass relative flex h-full flex-col rounded-2xl p-7 sm:p-9">
    <div className="mb-5 flex items-center justify-between">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-ember-500/30 bg-ember-500/10 text-ember-600">
        {ICONS[s.icon] || ICONS.code}
      </span>
      <span className="font-display text-3xl font-bold tracking-[-0.03em] text-star-300/60">
        {s.index}
      </span>
    </div>
    <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-star-100 sm:text-[1.7rem]">
      {s.title}
    </h3>
    <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-ember-600 dark:text-ember-300">
      {s.promise}
    </p>
    <Squiggle className="mt-4 h-2 w-24 text-ember-500" />
    <p className="mt-4 text-sm leading-relaxed text-star-400">{s.description}</p>
    <ul className="mt-6 space-y-2.5 border-t border-star-300/20 pt-6">
      {s.features.map((f) => (
        <li key={f} className="flex items-center gap-2.5 text-sm text-star-300">
          <span className="text-ember-500">✦</span>
          {f}
        </li>
      ))}
    </ul>
  </div>
)

// Mobile stack order — literal classes (Tailwind can't see template
// literals, so the pair sequence is written out): text-first per pair,
// reset at lg where the desktop masonry uses DOM order.
const MOBILE_ORDER = [
  { text: 'order-1 lg:order-none', media: 'order-2 lg:order-none' },
  { text: 'order-3 lg:order-none', media: 'order-4 lg:order-none' },
  { text: 'order-5 lg:order-none', media: 'order-6 lg:order-none' },
]

export default function SpaceServices() {
  const rootRef = useRef(null)

  useEffect(() => {
    const tickers = [] // gsap.ticker callbacks — removed on teardown
    const ctx = gsap.context(() => {
      // Card entrance — v4 "What we make" choreography: alternating
      // slide + slight rotation, reversible per card; icon spin-pops.
      applyCardReveal(rootRef, '.v2-service-card', { x: 90, rotation: 4, icon: 'span.inline-flex' })
      // Media blocks — per-tile bento entrance: each tile cascades up
      // (big rise + un-scale + alternating tilt) in DOM order when its
      // block enters the viewport. Mat's call 2026-08-11 — entrance
      // animation PER bento, and the amplitudes got turned UP after he
      // called the first pass "barely noticeable". Transform + opacity
      // only (Mat's perf rule — no filters).
      gsap.utils.toArray('.v2-service-media').forEach((block) => {
        const tiles = block.querySelectorAll('.bento-tile')
        if (!tiles.length) return
        gsap.fromTo(
          tiles,
          { opacity: 0, y: 90, scale: 0.88, rotation: (i) => (i % 2 ? 3 : -3) },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 1.0,
            ease: 'back.out(1.5)',
            stagger: 0.1,
            scrollTrigger: {
              trigger: block,
              start: 'top 85%',
              once: true,
            },
          }
        )
      })

      // Bento interactivity — simple 3D tilt toward the cursor + a glow
      // that follows it (desktop pointers only; touch has no hover).
      // SMOOTH-FOLLOW lerp (Mat's call 2026-08-11): the tile chases the
      // cursor's target rotation with a frame-rate-corrected lag instead
      // of tweening to it on every move — the ease lives in BOTH
      // directions (in = glides after the cursor, out = glides back),
      // which is what kills the twitchy snap. Scale pops via short
      // enter/leave tweens (kept off the tick so it never fights the
      // entrance's scale tween). Glow vars are set per move.
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      if (fine && !reduce) {
        gsap.utils.toArray('.bento-tile').forEach((tile) => {
          // current values (eased) vs target values (from the pointer)
          const st = { rx: 0, ry: 0, lift: 0, tx: 0, ty: 0, tl: 0 }
          tile.addEventListener('pointerenter', () => {
            gsap.to(tile, { scale: 1.04, duration: 0.4, ease: 'power2.out' })
          })
          tile.addEventListener('pointermove', (e) => {
            const r = tile.getBoundingClientRect()
            const px = (e.clientX - r.left) / r.width - 0.5
            const py = (e.clientY - r.top) / r.height - 0.5
            tile.style.setProperty('--mx', `${e.clientX - r.left}px`)
            tile.style.setProperty('--my', `${e.clientY - r.top}px`)
            st.tx = px * 22
            st.ty = -py * 16
            st.tl = 1
          })
          tile.addEventListener('pointerleave', () => {
            st.tx = 0
            st.ty = 0
            st.tl = 0
            gsap.to(tile, { scale: 1, duration: 0.6, ease: 'power2.out' })
          })
          // Per-frame follow: current eases toward target. deltaRatio()
          // normalizes the lag to frame rate so 30fps and 120fps feel
          // the same. y only writes while a lift is active — otherwise
          // the tick would stomp the entrance's rise tween.
          const tick = () => {
            const k = 1 - Math.pow(0.9, gsap.ticker.deltaRatio())
            st.rx += (st.tx - st.rx) * k
            st.ry += (st.ty - st.ry) * k
            st.lift += (st.tl - st.lift) * k
            const vars = { rotateX: st.rx, rotateY: st.ry, transformPerspective: 800 }
            if (st.lift > 0.01 || st.tl > 0.01) vars.y = -12 * st.lift
            gsap.set(tile, vars)
          }
          gsap.ticker.add(tick)
          tickers.push(tick)
        })
      }

      // Stat cards — ScrollStack recipe: scale down + drift up as they
      // scroll past center, so the band peels away rather than sitting
      // static once revealed.
      gsap.utils.toArray('.v2-stat-card').forEach((card) => {
        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: 'center center',
            end: 'center top',
            scrub: 1,
            onUpdate: (self) => {
              const p = self.progress
              gsap.set(card, { scale: 1 - 0.12 * p, y: -20 * p, opacity: 1 - 0.25 * p })
            },
          },
        })
      })

      // Stat numbers — count-up when the band enters: 0 → target with a
      // per-card cascade delay, power2 ease. Mat's call 2026-08-11
      // ("text animations like they're being count"). Reduced motion
      // skips the tween — the static value is already in the markup.
      // (`reduce` comes from the tilt block above.)
      if (!reduce) {
        gsap.utils.toArray('.v2-stat-num').forEach((numEl, i) => {
          const target = parseFloat(numEl.textContent)
          ScrollTrigger.create({
            trigger: numEl.closest('.v2-stat-card'),
            start: 'top 88%',
            once: true,
            onEnter: () => {
              const obj = { v: 0 }
              numEl.textContent = '0' // avoid the "shows target, then jumps to 0" flash
              gsap.to(obj, {
                v: target,
                duration: 1.6,
                ease: 'power2.out',
                delay: i * 0.12, // cascade across the band
                onUpdate: () => {
                  numEl.textContent = Math.round(obj.v)
                },
              })
            },
          })
        })
      }
    }, rootRef)
    return () => {
      tickers.forEach((t) => gsap.ticker.remove(t))
      ctx.revert()
    }
  }, [])

  return (
    <section id="services" ref={rootRef} className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10">
      {/* ── Header — kicker with squiggle flourishes, headline, subtitle,
             centered (copy from the mockup, ember accents) ── */}
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <div className="mb-4 flex items-center justify-center gap-4">
          <Squiggle className="h-2 w-16 -scale-x-100 text-ember-500/60" />
          <p data-parallax="-0.1" className="text-xs font-semibold uppercase tracking-[0.2em] text-ember-500">
            What we build
          </p>
          <Squiggle className="h-2 w-16 text-ember-500/60" />
        </div>
        <SplitHeading
          as="h2"
          text={servicesHeading}
          accent="drive results"
          className="font-display text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.03em] text-star-100 sm:text-6xl"
        />
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-star-400">{servicesSubtitle}</p>
      </div>

      {/* ── Zigzag masonry ──
             Even rows: text card left / media block right.
             Odd rows:  media block left / text card right.
             Rows stay aligned (no vertical tuck) so the alternating
             sides read cleanly without cluttering the neighbors.
             Mobile stacks text → media per pair. ── */}
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        {SERVICES.map((s, i) => {
          const even = i % 2 === 0
          const order = MOBILE_ORDER[i] || { text: 'lg:order-none', media: 'lg:order-none' }
          const text = (
            <div className={`${even ? 'lg:col-span-5' : 'lg:col-span-6'} ${order.text}`}>
              <TextCard s={s} />
            </div>
          )
          const media = (
            <div
              className={`v2-service-media ${even ? 'lg:col-span-7' : 'lg:col-span-6'} ${order.media}`}
            >
              <MediaBlock media={s.media} />
            </div>
          )
          return (
            <div key={s.id} className="contents">
              {even ? text : media}
              {even ? media : text}
            </div>
          )
        })}
      </div>

      {/* Stats band */}
      <div className="mt-20 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="v2-stat-card glass rounded-2xl p-6 text-center">
            <p className="font-display text-3xl font-bold tracking-[-0.03em] text-star-100">
              <span className="v2-stat-num ember-text">{s.value}</span>
              <span className="text-ember-400">{s.suffix}</span>
            </p>
            <p className="mt-2 text-xs uppercase tracking-widest text-star-500">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
