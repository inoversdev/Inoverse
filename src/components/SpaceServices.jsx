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
// HIGH-FIDELITY pass (Mat's call 2026-08-11): the tiles now read as
// polished product screens — real charts (SVG), KPI numbers, tables,
// chat bubbles, kanban boards — instead of abstract bars. Still
// illustrations, not fabricated screenshots (same honesty rule):
// labels are generic UI copy, never a claim about a real product. */
const Line = ({ w = 'w-full', h = 'h-1.5', tone = 'bg-star-100/12' }) => (
  <span className={`block rounded-full ${w} ${h} ${tone}`} />
)
const Block = ({ className = '', tone = 'bg-star-100/8', children }) => (
  <span className={`block rounded-md ${tone} ${className}`}>{children}</span>
)
const Pill = ({ w = 'w-10', tone = 'bg-ember-500/20' }) => (
  <span className={`block h-3 rounded-full ${w} ${tone}`} />
)
const Dot = ({ tone = 'bg-ember-500/40' }) => (
  <span className={`block h-2 w-2 shrink-0 rounded-full ${tone}`} />
)
const Avatar = ({ tone = 'bg-ember-500/25', size = 'h-6 w-6' }) => (
  <span className={`block shrink-0 rounded-full ${size} ${tone}`} />
)
const MiniLabel = ({ children, className = '' }) => (
  <span className={`block truncate text-[9px] font-medium leading-tight tracking-wide ${className}`}>
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

// Tiny SVG bar chart — data-driven, ember bars, subtle grid
const MiniBars = ({ values = [40, 65, 30, 80, 55, 70, 45], className = '' }) => (
  <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={`h-full w-full ${className}`} aria-hidden="true">
    {[10, 20, 30].map((y) => (
      <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.5" />
    ))}
    {values.map((v, i) => (
      <rect
        key={i}
        x={i * (100 / values.length) + 3}
        y={40 - v * 0.36}
        width={100 / values.length - 6}
        height={v * 0.36}
        rx="1.5"
        className={i === values.length - 1 ? 'fill-ember-500/80' : 'fill-ember-500/30'}
      />
    ))}
  </svg>
)

// Tiny SVG area/line chart — smooth revenue-style curve
const MiniArea = ({ className = '' }) => (
  <svg viewBox="0 0 120 44" preserveAspectRatio="none" className={`h-full w-full ${className}`} aria-hidden="true">
    <defs>
      <linearGradient id="mini-area-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(245,48,3,0.35)" />
        <stop offset="100%" stopColor="rgba(245,48,3,0)" />
      </linearGradient>
    </defs>
    <path d="M0 36 C 15 30, 25 34, 38 26 S 60 18, 72 22 S 100 8, 120 6 L120 44 L0 44 Z" fill="url(#mini-area-fill)" />
    <path d="M0 36 C 15 30, 25 34, 38 26 S 60 18, 72 22 S 100 8, 120 6" fill="none" stroke="rgba(245,48,3,0.8)" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="120" cy="6" r="2.2" fill="rgba(245,48,3,0.9)" />
  </svg>
)

// ─── Kind renderers — one per media.items[].kind. High-fidelity
// product-screen mockups: Website leans on marketing layouts,
// Software on app/code chrome, Systems on data (charts/tables/
// pipelines) — the visual vocabulary matches what each service
// actually builds. ───
const KINDS = {
  hero: () => (
    <div className="flex h-full flex-col gap-2 p-3">
      {/* nav */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ember-500/70" />
          <Line w="w-8" h="h-1.5" tone="bg-star-100/20" />
        </div>
        <div className="flex items-center gap-1.5">
          <Line w="w-6" h="h-1" tone="bg-star-100/15" />
          <Pill w="w-8" />
        </div>
      </div>
      {/* hero */}
      <div className="mt-1 space-y-1">
        <MiniLabel className="text-ember-500/80">YOUR BRAND HERE</MiniLabel>
        <Line w="w-4/5" h="h-2.5" tone="bg-star-100/40" />
        <Line w="w-3/5" h="h-2.5" tone="bg-star-100/40" />
        <Line w="w-2/3" tone="bg-star-100/15" />
        <Line w="w-1/2" tone="bg-star-100/15" />
      </div>
      <div className="flex items-center gap-1.5">
        <Pill w="w-12" />
        <Pill w="w-10" tone="bg-star-100/10" />
      </div>
      {/* hero image */}
      <Block className="min-h-0 flex-1 bg-gradient-to-br from-ember-500/25 via-star-100/10 to-transparent" />
      <div className="flex items-center gap-2">
        <Avatar />
        <div className="flex-1 space-y-1">
          <Line w="w-3/4" h="h-1.5" tone="bg-star-100/20" />
          <Line w="w-1/2" tone="bg-star-100/10" />
        </div>
        <span className="h-2 w-2 rounded-full bg-ember-500/60" />
      </div>
    </div>
  ),
  gallery: () => (
    <div className="flex h-full flex-col gap-2 p-3">
      <div className="grid flex-1 grid-cols-2 gap-1.5">
        {['from-ember-500/30 to-star-100/5', 'from-star-100/25 to-star-100/5', 'from-star-100/20 to-transparent', 'from-ember-500/20 to-star-100/5'].map((g, i) => (
          <div key={i} className={`relative overflow-hidden rounded-md bg-gradient-to-br ${g}`}>
            <Line w="w-1/2" h="h-1" className="absolute bottom-1 left-1" tone="bg-white/40" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <MiniLabel className="text-star-500">PROJECT GALLERY</MiniLabel>
        <Chip>View all</Chip>
      </div>
    </div>
  ),
  form: () => (
    <div className="flex h-full flex-col justify-center gap-2 p-4">
      <MiniLabel className="text-star-500">TELL US ABOUT YOU</MiniLabel>
      <div className="space-y-1">
        <MiniSub className="text-star-500">NAME</MiniSub>
        <Block className="h-4 bg-star-100/10" />
      </div>
      <div className="space-y-1">
        <MiniSub className="text-star-500">EMAIL</MiniSub>
        <Block className="h-4 bg-star-100/10" />
      </div>
      <div className="space-y-1">
        <MiniSub className="text-star-500">MESSAGE</MiniSub>
        <Block className="h-6 bg-star-100/10" />
      </div>
      <Pill w="w-full" className="h-4" />
      <MiniSub className="text-center text-star-500">We reply within 24 hours</MiniSub>
    </div>
  ),
  list: () => (
    <div className="flex h-full flex-col justify-center gap-2.5 p-3">
      {[
        ['bg-ember-500/30', 'Maria Santos', 'Order #1042', 'Paid', 'bg-emerald-400/20 text-emerald-600 dark:text-emerald-300'],
        ['bg-star-100/20', 'Juan Dela Cruz', 'Order #1041', 'Pending', 'bg-amber-400/20 text-amber-600 dark:text-amber-300'],
        ['bg-star-100/20', 'Ana Reyes', 'Order #1040', 'Shipped', 'bg-sky-400/20 text-sky-600 dark:text-sky-300'],
      ].map(([tone, name, sub, status, st]) => (
        <div key={name} className="flex items-center gap-2">
          <Avatar tone={tone} size="h-5 w-5" />
          <div className="min-w-0 flex-1">
            <MiniLabel className="text-star-300">{name}</MiniLabel>
            <MiniSub className="text-star-500">{sub}</MiniSub>
          </div>
          <Chip tone={st}>{status}</Chip>
        </div>
      ))}
    </div>
  ),
  cards: () => (
    <div className="grid h-full grid-cols-2 gap-1.5 p-2.5">
      {[0, 1].map((i) => (
        <div key={i} className="flex flex-col overflow-hidden rounded-md border border-star-300/15">
          <Block className={`min-h-0 flex-1 ${i === 0 ? 'bg-gradient-to-br from-ember-500/25 to-star-100/5' : 'bg-gradient-to-br from-star-100/20 to-star-100/5'}`} />
          <div className="space-y-1 p-1.5">
            <Line w="w-3/4" h="h-1" tone="bg-star-100/20" />
            <div className="flex items-center justify-between">
              <Line w="w-6" h="h-1.5" tone="bg-ember-500/40" />
              <span className="h-2 w-2 rounded-full bg-ember-500/50" />
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
  footer: () => (
    <div className="flex h-full flex-col justify-between p-3">
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-ember-500/70" />
        <Line w="w-10" h="h-1.5" tone="bg-star-100/25" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {['PRODUCT', 'COMPANY', 'LEGAL'].map((h) => (
          <div key={h} className="space-y-1">
            <MiniLabel className="text-star-500">{h}</MiniLabel>
            <Line w="w-4/5" tone="bg-star-100/12" />
            <Line w="w-3/5" tone="bg-star-100/12" />
            <Line w="w-2/3" tone="bg-star-100/12" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-star-300/10 pt-1.5">
        <MiniSub className="text-star-500">© 2026 Your Brand</MiniSub>
        <div className="flex gap-1">
          <Dot tone="bg-star-100/20" />
          <Dot tone="bg-star-100/20" />
          <Dot tone="bg-ember-500/40" />
        </div>
      </div>
    </div>
  ),
  'app-home': () => (
    <div className="flex h-full flex-col gap-2 p-2.5">
      <div className="flex items-center justify-between">
        <Avatar tone="bg-ember-500/30" size="h-5 w-5" />
        <Line w="w-12" h="h-1.5" tone="bg-star-100/25" />
        <span className="h-3 w-3 rounded-full bg-star-100/15" />
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <div className="rounded-md bg-star-100/6 p-1.5">
          <MiniLabel className="text-star-500">SALES</MiniLabel>
          <MiniLabel className="text-star-200">₱1.2k</MiniLabel>
          <MiniSub className="text-emerald-500">↑ 12%</MiniSub>
        </div>
        <div className="rounded-md bg-ember-500/10 p-1.5">
          <MiniLabel className="text-star-500">ORDERS</MiniLabel>
          <MiniLabel className="text-star-200">48</MiniLabel>
          <MiniSub className="text-ember-500">today</MiniSub>
        </div>
      </div>
      <Block className="min-h-0 flex-1">
        <MiniBars values={[30, 55, 40, 70, 60, 85]} className="p-1" />
      </Block>
      <div className="flex items-center justify-around border-t border-star-300/10 pt-1.5">
        {[0, 1, 2, 3].map((i) => (
          <Dot key={i} tone={i === 0 ? 'bg-ember-500/60' : 'bg-star-100/15'} />
        ))}
      </div>
    </div>
  ),
  'app-list': () => (
    <div className="flex h-full flex-col justify-center gap-2 p-2.5">
      {[
        ['bg-ember-500/30', 'Team Alpha', '9:41 AM', true],
        ['bg-star-100/20', 'Design Sync', '8:12 AM', false],
        ['bg-star-100/20', 'Daily Standup', 'Yesterday', true],
        ['bg-star-100/20', 'Launch Plan', 'Mon', false],
      ].map(([tone, name, time, unread]) => (
        <div key={name} className="flex items-center gap-2">
          <Avatar tone={tone} size="h-6 w-6" />
          <div className="min-w-0 flex-1">
            <MiniLabel className="text-star-300">{name}</MiniLabel>
            <MiniSub className="text-star-500">{time}</MiniSub>
          </div>
          {unread && <span className="flex h-3 w-3 items-center justify-center rounded-full bg-ember-500 text-[6px] font-bold text-white">2</span>}
        </div>
      ))}
    </div>
  ),
  'app-chat': () => (
    <div className="flex h-full flex-col justify-center gap-1.5 p-3">
      <Block className="h-5 w-2/3 self-start rounded-lg bg-star-100/10 p-1">
        <MiniSub className="text-star-500">Hi! Is the site live yet?</MiniSub>
      </Block>
      <Block className="h-5 w-1/2 self-end rounded-lg bg-ember-500/25 p-1">
        <MiniSub className="text-ember-600 dark:text-ember-300">Deploying tomorrow 🚀</MiniSub>
      </Block>
      <Block className="h-5 w-3/5 self-start rounded-lg bg-star-100/10 p-1">
        <MiniSub className="text-star-500">Perfect — excited to see it!</MiniSub>
      </Block>
      <Block className="h-5 w-2/5 self-end rounded-lg bg-ember-500/25 p-1">
        <MiniSub className="text-ember-600 dark:text-ember-300">You'll love it :)</MiniSub>
      </Block>
      <div className="mt-1 flex items-center gap-1.5 rounded-full bg-star-100/10 px-2 py-1">
        <Line w="flex-1" h="h-1" tone="bg-star-100/15" />
        <span className="h-3 w-3 shrink-0 rounded-full bg-ember-500/60" />
      </div>
    </div>
  ),
  dashboard: () => (
    <div className="flex h-full gap-1.5 p-2">
      {/* sidebar */}
      <div className="flex w-7 flex-col items-center gap-1.5 rounded-md bg-star-100/6 py-1.5">
        <span className="h-2 w-2 rounded-full bg-ember-500/70" />
        {[0, 1, 2].map((i) => (
          <Dot key={i} tone={i === 0 ? 'bg-ember-500/50' : 'bg-star-100/15'} />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        {/* KPI row */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="rounded-md bg-star-100/6 p-1">
            <MiniSub className="text-star-500">REVENUE</MiniSub>
            <MiniLabel className="text-star-200">$12.4k</MiniLabel>
          </div>
          <div className="rounded-md bg-star-100/6 p-1">
            <MiniSub className="text-star-500">USERS</MiniSub>
            <MiniLabel className="text-star-200">8,204</MiniLabel>
          </div>
        </div>
        {/* chart */}
        <Block className="min-h-0 flex-1">
          <MiniBars values={[35, 60, 42, 75, 50, 88]} className="p-1" />
        </Block>
        {/* table */}
        <div className="space-y-1 rounded-md bg-star-100/6 p-1.5">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <Dot tone={i === 0 ? 'bg-emerald-400/60' : 'bg-amber-400/60'} />
              <Line w="w-1/3" h="h-1" tone="bg-star-100/15" />
              <Line w="w-1/4" h="h-1" tone="bg-ember-500/25" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  code: () => (
    <div className="flex h-full flex-col p-2.5 font-mono">
      <div className="flex items-center gap-1 pb-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-ember-500/60" />
        <span className="h-1.5 w-1.5 rounded-full bg-ember-500/30" />
        <span className="h-1.5 w-1.5 rounded-full bg-star-100/20" />
        <Line w="w-16" h="h-1" className="ml-2" tone="bg-star-100/10" />
      </div>
      <div className="flex-1 space-y-1">
        {[
          ['text-ember-500/80', 'import', ' { deliver }', 'from', "'inovers'", ';'],
          ['text-star-100/40', 'const', ' project', ' = ', 'await', ' deliver({'],
          ['text-star-100/40', '  scope:', "'website'", ','],
          ['text-star-100/40', '  speed:', "'3 days'", ','],
          ['text-star-100/40', '});'],
        ].map((parts, i) => (
          <div key={i} className="flex items-center gap-1 whitespace-nowrap">
            {parts.map((p, j) => (
              <span key={j} className={`text-[8px] leading-tight ${j === 0 ? p : 'text-star-100/45'}`}>{j === 0 ? '' : p}</span>
            ))}
          </div>
        ))}
        <span className="block h-2 w-6 rounded-full bg-ember-500/50" />
      </div>
    </div>
  ),
  kanban: () => (
    <div className="grid h-full grid-cols-3 gap-1.5 p-2">
      {[
        ['TODO', 'bg-star-100/15', [
          ['w-4/5', 'bg-ember-500/25'],
          ['w-3/5', 'bg-star-100/20'],
        ]],
        ['DOING', 'bg-amber-400/50', [
          ['w-3/4', 'bg-ember-500/30'],
          ['w-full', 'bg-star-100/20'],
          ['w-2/3', 'bg-star-100/20'],
        ]],
        ['DONE', 'bg-emerald-400/50', [
          ['w-4/5', 'bg-star-100/20'],
          ['w-1/2', 'bg-star-100/20'],
        ]],
      ].map(([title, headTone, cards]) => (
        <div key={title} className="flex flex-col gap-1.5 rounded-md bg-star-100/5 p-1.5">
          <div className="flex items-center justify-between">
            <MiniLabel className="text-star-500">{title}</MiniLabel>
            <Dot tone={headTone} />
          </div>
          {cards.map(([w, tone], i) => (
            <div key={i} className="space-y-1 rounded bg-white/40 p-1 dark:bg-white/5">
              <Line w={w} h="h-1" tone={tone} />
              <Line w="w-1/2" h="h-1" tone="bg-star-100/10" />
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
  'dashboard-big': () => (
    <div className="flex h-full flex-col gap-1.5 p-2.5">
      <div className="grid grid-cols-3 gap-1.5">
        {[['$48.2k', '↑ 8.2%'], ['1,284', '↑ 3.1%'], ['96.4%', '↑ 0.8%']].map(([v, d]) => (
          <div key={v} className="rounded-md bg-star-100/6 p-1.5">
            <MiniLabel className="text-star-200">{v}</MiniLabel>
            <MiniSub className="text-emerald-500">{d}</MiniSub>
          </div>
        ))}
      </div>
      <Block className="min-h-0 flex-1">
        <MiniArea className="p-1" />
      </Block>
      <div className="flex items-center justify-between rounded-md bg-star-100/6 px-1.5 py-1">
        <MiniLabel className="text-star-500">GROWTH</MiniLabel>
        <Chip>Quarterly</Chip>
      </div>
    </div>
  ),
  flow: () => (
    <div className="flex h-full flex-col items-center justify-center gap-1.5 p-3">
      {[
        ['bg-ember-500/30', 'Discover', true],
        ['bg-star-100/10', 'Build', false],
        ['bg-star-100/10', 'Launch', false],
      ].map(([tone, label, active], i) => (
        <div key={label} className="flex w-full items-center gap-1.5">
          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${tone}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-ember-500' : 'bg-star-100/40'}`} />
          </span>
          <Line w="flex-1" h="h-1.5" tone={active ? 'bg-ember-500/40' : 'bg-star-100/15'} />
          {i < 2 && <span className="shrink-0 text-[8px] text-star-100/30">→</span>}
        </div>
      ))}
    </div>
  ),
  table: () => (
    <div className="flex h-full flex-col gap-1 p-2.5">
      <div className="flex items-center gap-1 rounded-md bg-star-100/8 px-1.5 py-1">
        <MiniLabel className="w-1/3 text-star-500">CLIENT</MiniLabel>
        <MiniLabel className="w-1/3 text-star-500">STATUS</MiniLabel>
        <MiniLabel className="w-1/3 text-right text-star-500">AMOUNT</MiniLabel>
      </div>
      {[
        ['Dory Delivery', 'Active', '₱12,400', 'bg-emerald-400/20 text-emerald-600 dark:text-emerald-300'],
        ['WhatAHotel', 'In review', '₱8,900', 'bg-amber-400/20 text-amber-600 dark:text-amber-300'],
        ['Kanto Bites', 'Active', '₱5,200', 'bg-emerald-400/20 text-emerald-600 dark:text-emerald-300'],
      ].map(([name, status, amt, tone]) => (
        <div key={name} className="flex items-center gap-1 border-t border-star-300/10 px-1.5 pt-1">
          <MiniLabel className="w-1/3 text-star-300">{name}</MiniLabel>
          <div className="w-1/3"><Chip tone={tone}>{status}</Chip></div>
          <MiniLabel className="w-1/3 text-right text-star-400">{amt}</MiniLabel>
        </div>
      ))}
    </div>
  ),
  metrics: () => (
    <div className="flex h-full items-center gap-2 p-3">
      {[
        ['Views', '84.2k', '↑ 12%', 'text-ember-500/70'],
        ['Leads', '1,024', '↑ 4%', 'text-ember-500/50'],
        ['Rate', '68%', '↑ 2%', 'text-ember-500/30'],
        ['Goal', '92%', '↓ 1%', 'text-star-100/25'],
      ].map(([label, v, d, tone]) => (
        <div key={label} className="flex-1 space-y-1 rounded-md bg-star-100/6 p-1.5">
          <MiniSub className="text-star-500">{label}</MiniSub>
          <MiniLabel className="text-star-200">{v}</MiniLabel>
          <div className={`h-1 w-full rounded-full ${tone}`} />
          <MiniSub className="text-emerald-500">{d}</MiniSub>
        </div>
      ))}
    </div>
  ),
  pipeline: () => (
    <div className="flex h-full items-center gap-1 p-3">
      {[
        ['bg-star-100/8', 'Source'],
        ['bg-ember-500/20', 'Process'],
        ['bg-star-100/8', 'Enrich'],
        ['bg-star-100/8', 'Store'],
        ['bg-star-100/8', 'Serve'],
      ].map(([tone, label], i) => (
        <div key={label} className="flex flex-1 items-center gap-1">
          <div className={`flex-1 rounded-md px-1 py-2 text-center ${tone}`}>
            <MiniLabel className={i === 1 ? 'text-ember-600 dark:text-ember-300' : 'text-star-500'}>{label}</MiniLabel>
          </div>
          {i < 4 && <span className="shrink-0 text-[8px] text-star-100/30">→</span>}
        </div>
      ))}
    </div>
  ),
  integrations: () => (
    <div className="grid h-full grid-cols-6 items-center gap-1.5 p-3">
      {[
        'bg-ember-500/25',
        'bg-sky-400/20',
        'bg-emerald-400/20',
        'bg-violet-400/20',
        'bg-amber-400/20',
        'bg-star-100/15',
      ].map((tone, i) => (
        <div key={i} className={`flex aspect-square items-center justify-center rounded-lg ${tone}`}>
          <span className={`h-3 w-3 rounded-sm ${i % 2 ? 'bg-star-100/40' : 'bg-ember-500/50'}`} />
        </div>
      ))}
      <div className="col-span-6 space-y-1">
        <Line w="w-2/3" h="h-1.5" tone="bg-star-100/15" />
        <MiniSub className="text-star-500">Connect your stack — 40+ integrations</MiniSub>
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

  const content = KINDS[item.kind]?.() ?? (
    <div className="flex h-full items-center justify-center">
      <div className="h-2 w-2 rounded-full bg-ember-500/25" />
    </div>
  )

  if (item.shape === 'phone') {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg border border-star-300/25 bg-white/60 dark:bg-white/5">
        <div className="flex h-4/5 w-3/5 flex-col overflow-hidden rounded-[0.9rem] border border-star-300/30 bg-white/80 dark:bg-space-900/70">
          <div className="mx-auto mt-1.5 h-0.5 w-1/3 rounded-full bg-star-100/15" />
          <div className="min-h-0 flex-1">{content}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-star-300/25 bg-white/60 dark:bg-white/5">
      <div className="flex items-center gap-1 border-b border-star-300/20 px-2 py-1">
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember-500">
            What we build
          </p>
          <Squiggle className="h-2 w-16 text-ember-500/60" />
        </div>
        <SplitHeading
          as="h2"
          text={servicesHeading}
          accent="drive results"
          className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-star-100 sm:text-5xl"
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
