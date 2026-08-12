// ─── Project demos — domain-accurate "how it works" showcases ───
// Round 4 (Mat's feedback: "why is there a popping messages? and it
// feels like those messages shouldn't be right there"): the old
// StatusTicker was an absolutely-positioned pill stack that faded in
// and out ON TOP of each demo's real UI — it collided with the hotel
// photo badges, the boarding-pass header, the POS product tiles, the
// calendar. It read as a disconnected toast, not as product UI.
//
// It's gone. Status now lives in a StatusRail: a real strip at the
// BOTTOM of the device frame, rendered by DeviceFrame itself, with its
// own reserved layout space (so it can never overlap anything), one
// step at a time crossfading in sync with a progress track. Every demo
// gets exactly one status system instead of two competing ones.
//
// Second change: structural UI (product tiles, cart rows, calendar
// cells, KPI tiles) used to loop opacity down to 0.25/0 — mid-cycle the
// demos looked half-empty and broken. Structure now enters ONCE and
// stays (.demo-in); only two things loop: the "tapped" affordance
// (.demo-tap) and the confirmation chip (.demo-confirm), both timed to
// the rail's 8s cycle so the UI and the status agree.
//
//   DeliveryMapDemo   — map + rider racing the route (low-fi -> hi-fi)
//   PosDemo           — category tabs + product grid + running ticket
//   HotelBookingDemo  — photo banner + rating + price/night + reserve
//   TravelTicketDemo  — boarding-pass card, route + seat + barcode
//   RideHailingDemo   — mini road map + moving rider + driver card
//   CommerceDemo      — cart rows -> total -> paid
//   ClinicDemo        — appointment -> vitals -> prescription
//   DashboardDemo     — sidebar + KPI tiles + chart + table
//   FeedDemo          — post card with media, likes, comments
//   LearningDemo      — course thumbnail + progress + lesson list
//   ServiceBookingDemo— calendar -> slot -> confirmed booking

const ROUTE = 'M 18 84 C 18 84, 30 26, 96 26 S 220 26, 240 60 S 252 118, 282 118'
const ROAD = 'M 12 100 C 60 100, 70 40, 130 40 S 250 20, 288 60'

// ─── Status rail — the ONLY status surface. Sits in the frame's own
// bottom strip (never over content), shows one step at a time. ───
function StatusRail({ steps }) {
  const long = steps.length > 4
  return (
    <div className="relative z-10 shrink-0 overflow-hidden border-t border-star-300/15 bg-star-100/[0.04] px-3 py-[7px]">
      <div className="flex items-center gap-2">
        <span className="demo-live h-1.5 w-1.5 shrink-0 rounded-full bg-ember-500 shadow-[0_0_6px_rgba(245,48,3,0.7)]" />
        <span className="relative block h-3 min-w-0 flex-1">
          {steps.map((s, i) => (
            <span
              key={s}
              className={`demo-step${long ? ' demo-step-5' : ''} absolute inset-0 truncate text-[9px] font-semibold leading-3 text-star-400`}
              style={{ animationDelay: `${i * 2}s` }}
            >
              {s}
            </span>
          ))}
        </span>
        <span className="shrink-0 text-[8px] font-bold uppercase tracking-[0.18em] text-star-500">
          Live
        </span>
      </div>
      <span
        className={`demo-track${long ? ' demo-track-5' : ''} absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-ember-600 to-amber-400`}
      />
    </div>
  )
}

// ─── Device frame — shared chrome for every demo below. `variant`
// picks phone bezel vs browser chrome; the demo itself only renders
// its screen content and never worries about height/border/shadow
// or where the status text goes. ───
export function DeviceFrame({ variant = 'browser', steps, children }) {
  const rail = steps?.length ? <StatusRail steps={steps} /> : null
  if (variant === 'phone') {
    return (
      <div className="relative flex h-60 w-full items-center justify-center overflow-hidden rounded-2xl bg-star-100/5 sm:h-72">
        <div className="relative flex h-full w-[64%] flex-col overflow-hidden rounded-[1.6rem] border border-star-300/25 bg-white/85 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.28)] dark:bg-white/[0.04] sm:w-[56%]">
          <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-star-100/15" />
          <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
          {rail}
        </div>
      </div>
    )
  }
  return (
    <div className="relative flex h-60 w-full flex-col overflow-hidden rounded-2xl border border-star-300/20 bg-white/70 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.22)] dark:bg-white/[0.04] sm:h-72">
      <div className="flex shrink-0 items-center gap-1.5 border-b border-star-300/15 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-ember-400/70" />
        <span className="h-2 w-2 rounded-full bg-ember-400/40" />
        <span className="h-2 w-2 rounded-full bg-ember-400/20" />
        <span className="ml-2 h-1.5 w-32 max-w-[40%] rounded-full bg-star-100/10" />
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
      {rail}
    </div>
  )
}

// ─── 1. Delivery / logistics — the map demo ───
export function DeliveryMapDemo({ steps }) {
  return (
    <DeviceFrame variant="browser" steps={steps}>
      <div className="demo-lowfi absolute inset-0">
        <svg viewBox="0 0 300 140" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {[30, 60, 90, 120].map((y) => (
            <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
          ))}
          {[50, 100, 150, 200, 250].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="140" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
          ))}
          <path d={ROUTE} fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 4" />
          <rect x="10" y="74" width="16" height="20" rx="2" fill="currentColor" fillOpacity="0.25" />
          <rect x="274" y="108" width="16" height="20" rx="2" fill="currentColor" fillOpacity="0.25" />
        </svg>
        <span className="demo-rider absolute left-0 top-0 z-10 h-2.5 w-2.5 rounded-full bg-star-400 shadow-[0_0_10px_rgba(120,120,140,0.6)]" />
        <span className="absolute bottom-2 left-3 text-[9px] font-semibold uppercase tracking-widest text-star-500">
          Low fidelity — wireframe
        </span>
      </div>

      <div className="demo-hifi absolute inset-0">
        <svg viewBox="0 0 300 140" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="demo-map-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(245,48,3,0.12)" />
              <stop offset="50%" stopColor="rgba(245,48,3,0.04)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0.1)" />
            </linearGradient>
            <linearGradient id="demo-route" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(245,48,3,0.9)" />
              <stop offset="100%" stopColor="rgba(245,48,3,0.5)" />
            </linearGradient>
          </defs>
          <rect width="300" height="140" fill="url(#demo-map-bg)" />
          {[30, 60, 90, 120].map((y) => (
            <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" />
          ))}
          {[50, 100, 150, 200, 250].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="140" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" />
          ))}
          <path d={ROUTE} fill="none" stroke="rgba(245,48,3,0.35)" strokeWidth="7" strokeLinecap="round" />
          <path d={ROUTE} fill="none" stroke="url(#demo-route)" strokeWidth="3" strokeLinecap="round" />
          <rect x="8" y="72" width="20" height="24" rx="3" fill="rgba(245,48,3,0.9)" />
          <rect x="272" y="106" width="20" height="24" rx="3" fill="rgba(245,48,3,0.9)" />
          <circle cx="18" cy="84" r="4" fill="#fff" />
          <g className="demo-pin" style={{ transformOrigin: '282px 118px' }}>
            <circle cx="282" cy="118" r="8" fill="rgba(245,48,3,0.25)" />
            <circle cx="282" cy="118" r="4" fill="rgba(245,48,3,0.9)" />
          </g>
        </svg>
        <span className="demo-rider-fast absolute left-0 top-0 z-10">
          <span className="block h-3.5 w-3.5 rounded-full bg-ember-500 shadow-[0_0_14px_rgba(245,48,3,0.9)] ring-2 ring-white/60" />
        </span>
        {/* trip meta — sits in the map's empty top-left gutter, never
            over the route or either endpoint marker */}
        <div className="absolute left-3 top-2 leading-tight">
          <p className="text-[9px] font-bold text-star-200">Order #4821 · 3.2 km</p>
          <p className="text-[8px] text-star-500">Rider Ben M. · ETA 12 min</p>
        </div>
        <span className="absolute right-3 top-2 text-[9px] font-semibold uppercase tracking-widest text-ember-500">
          High fidelity — live
        </span>
      </div>
    </DeviceFrame>
  )
}

// ─── 2. POS — retail terminal: category tabs, product grid, ticket ───
const POS_PRODUCTS = [
  ['Rice Bowl', '₱180', 'bg-ember-500'],
  ['Iced Tea', '₱40', 'bg-amber-400'],
  ['Leche Flan', '₱60', 'bg-ember-400'],
  ['Extra Rice', '₱20', 'bg-star-400'],
  ['Siomai', '₱90', 'bg-ember-600'],
  ['Halo-Halo', '₱75', 'bg-amber-500'],
]
const POS_TICKET = [
  ['2×', 'Rice Bowl', '₱360'],
  ['1×', 'Iced Tea', '₱40'],
  ['1×', 'Leche Flan', '₱60'],
]
export function PosDemo({ steps }) {
  return (
    <DeviceFrame variant="browser" steps={steps}>
      <div className="flex h-full">
        {/* left — the terminal's button face */}
        <div className="flex min-w-0 flex-1 flex-col border-r border-star-300/15">
          <div className="flex shrink-0 items-center gap-1 border-b border-star-300/10 px-2 py-1.5">
            {['All', 'Meals', 'Drinks', 'Sweets'].map((t, i) => (
              <span
                key={t}
                className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
                  i === 0 ? 'bg-ember-500 text-white' : 'bg-star-100/8 text-star-500'
                }`}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="grid flex-1 grid-cols-3 gap-1.5 p-2">
            {POS_PRODUCTS.map(([name, price, dot], i) => (
              <div
                key={name}
                className={`demo-in flex flex-col justify-between rounded-lg border border-star-300/15 bg-white/60 p-1.5 dark:bg-white/[0.04] ${
                  i === 0 ? 'demo-tap border-ember-500/40' : ''
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className={`h-1 w-4 rounded-full ${dot}`} />
                <span className="mt-1 text-[9px] font-bold leading-tight text-star-200">{name}</span>
                <span className="text-[9px] font-semibold text-star-500">{price}</span>
              </div>
            ))}
          </div>
        </div>
        {/* right — running ticket */}
        <div className="flex w-[40%] shrink-0 flex-col p-2">
          <div className="flex shrink-0 items-baseline justify-between">
            <p className="text-[9px] font-bold text-star-200">Order #1042</p>
            <p className="text-[8px] text-star-500">Table 4</p>
          </div>
          <div className="mt-1.5 flex flex-col gap-1">
            {POS_TICKET.map(([qty, name, price], i) => (
              <div
                key={name}
                className="demo-in flex items-baseline gap-1.5 text-[9px] leading-tight"
                style={{ animationDelay: `${0.15 + i * 0.12}s` }}
              >
                <span className="font-bold text-ember-600 dark:text-ember-300">{qty}</span>
                <span className="min-w-0 flex-1 truncate font-semibold text-star-300">{name}</span>
                <span className="font-semibold text-star-400">{price}</span>
              </div>
            ))}
          </div>
          <div className="mt-1.5 border-t border-dashed border-star-300/25 pt-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-[8px] font-bold uppercase tracking-widest text-star-500">Total</span>
              <span className="font-display text-sm font-bold text-star-100">₱460</span>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-1">
            <div className="rounded-lg bg-ember-500 px-2 py-1.5 text-center text-[9px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(245,48,3,0.6)]">
              Charge ₱460
            </div>
            <div className="demo-confirm rounded-md border border-dashed border-emerald-400/40 bg-emerald-400/10 px-1.5 py-1 text-center text-[8px] font-bold text-emerald-500">
              Paid cash · change ₱40
            </div>
          </div>
        </div>
      </div>
    </DeviceFrame>
  )
}

// ─── 3. Hotel / venue booking — a listing, not a bare calendar ───
export function HotelBookingDemo({ steps }) {
  return (
    <DeviceFrame variant="browser" steps={steps}>
      <div className="flex h-full flex-col">
        {/* photo banner — faked with a soft skyline so it reads as a photo */}
        <div className="relative h-[44%] shrink-0 overflow-hidden bg-gradient-to-b from-amber-400/45 via-ember-500/35 to-ember-700/45">
          <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <circle cx="248" cy="24" r="12" fill="rgba(255,255,255,0.35)" />
            <path d="M0 100 L0 62 L26 62 L26 44 L54 44 L54 70 L86 70 L86 52 L118 52 L118 76 L150 76 L150 58 L184 58 L184 72 L214 72 L214 50 L246 50 L246 78 L300 78 L300 100 Z" fill="rgba(0,0,0,0.22)" />
            <path d="M0 100 L0 86 L60 86 L60 92 L140 92 L140 84 L220 84 L220 90 L300 90 L300 100 Z" fill="rgba(0,0,0,0.3)" />
          </svg>
          <span className="absolute left-2.5 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-amber-600 shadow-sm dark:bg-[rgba(22,18,15,0.50)] dark:text-amber-300">
            ★ 4.9 <span className="font-medium text-star-500">(212)</span>
          </span>
          <span className="absolute right-2.5 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-ember-600 shadow-sm dark:bg-[rgba(22,18,15,0.50)] dark:text-ember-300">
            ₱4,500<span className="font-medium text-star-500"> /night</span>
          </span>
          <div className="absolute bottom-2 left-2.5">
            <p className="font-display text-[11px] font-bold leading-tight text-white drop-shadow">Deluxe Suite · Sea View</p>
            <p className="text-[8px] font-semibold text-white/85 drop-shadow">Boracay, Aklan · Free cancellation</p>
          </div>
          <span className="absolute bottom-2 right-2.5 rounded-full bg-black/40 px-1.5 py-0.5 text-[8px] font-semibold text-white/90">
            1 / 8
          </span>
        </div>
        {/* dates + guests + reserve */}
        <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-2.5">
          <div className="flex gap-1.5">
            {[['Check-in', 'Fri, Aug 14'], ['Check-out', 'Mon, Aug 17']].map(([k, v], i) => (
              <div
                key={k}
                className="demo-in flex-1 rounded-md border border-star-300/15 bg-white/50 px-2 py-1 dark:bg-white/[0.04]"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <p className="text-[7px] font-bold uppercase tracking-widest text-star-500">{k}</p>
                <p className="text-[9px] font-bold text-star-300">{v}</p>
              </div>
            ))}
            <div className="demo-in flex-1 rounded-md border border-star-300/15 bg-white/50 px-2 py-1 dark:bg-white/[0.04]" style={{ animationDelay: '0.2s' }}>
              <p className="text-[7px] font-bold uppercase tracking-widest text-star-500">Guests</p>
              <p className="text-[9px] font-bold text-star-300">2 adults</p>
            </div>
          </div>
          <div className="demo-in flex items-center justify-between text-[9px]" style={{ animationDelay: '0.3s' }}>
            <span className="text-star-500">₱4,500 × 3 nights</span>
            <span className="font-bold text-star-200">₱13,500</span>
          </div>
          <div className="mt-auto flex flex-col gap-1">
            <div className="demo-tap rounded-lg bg-ember-500 px-2 py-1.5 text-center text-[10px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(245,48,3,0.6)]">
              Reserve
            </div>
            <div className="demo-confirm rounded-md bg-emerald-400/10 px-2 py-0.5 text-center text-[8px] font-bold text-emerald-500">
              Reserved ✓ · confirmation #A4821
            </div>
          </div>
        </div>
      </div>
    </DeviceFrame>
  )
}

// ─── 4. Travel ticket — boarding-pass card ───
export function TravelTicketDemo({ steps }) {
  return (
    <DeviceFrame variant="phone" steps={steps}>
      <div className="flex h-full flex-col justify-center p-2.5">
        <div className="demo-in overflow-hidden rounded-xl border border-star-300/20 bg-white/70 shadow-sm dark:bg-white/[0.04]">
          <div className="flex items-center justify-between bg-ember-500 px-2.5 py-1.5">
            <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-white">Boarding pass</span>
            <span className="text-[8px] font-bold text-white/85">2GO · 8:40 AM</span>
          </div>
          <div className="flex items-center justify-between px-2.5 py-2">
            <div>
              <p className="font-display text-base font-bold leading-none text-star-100">MNL</p>
              <p className="mt-0.5 text-[8px] text-star-500">Manila</p>
            </div>
            <div className="flex flex-1 items-center px-1.5">
              <span className="h-1 w-1 rounded-full bg-star-300/60" />
              <span className="h-px flex-1 border-t border-dashed border-star-300/50" />
              <span className="text-[9px] text-ember-500">✈</span>
              <span className="h-px flex-1 border-t border-dashed border-star-300/50" />
              <span className="h-1 w-1 rounded-full bg-ember-500" />
            </div>
            <div className="text-right">
              <p className="font-display text-base font-bold leading-none text-star-100">BOR</p>
              <p className="mt-0.5 text-[8px] text-star-500">Caticlan</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1 border-t border-star-300/15 px-2.5 py-1.5">
            {[['Date', 'Aug 14'], ['Gate', 'B2'], ['Seat', '14A']].map(([k, v]) => (
              <div key={k}>
                <p className="text-[7px] font-bold uppercase tracking-widest text-star-500">{k}</p>
                <p className="text-[9px] font-bold text-star-300">{v}</p>
              </div>
            ))}
          </div>
          <div className="relative border-t border-dashed border-star-300/30 px-2.5 py-2">
            <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full border border-star-300/25 bg-white/70 dark:bg-white/[0.04]" />
            <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full border border-star-300/25 bg-white/70 dark:bg-white/[0.04]" />
            <div className="flex h-6 items-end gap-[2px]">
              {[3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1].map((w, i) => (
                <span key={i} className="h-full bg-star-300/70" style={{ width: `${w}px` }} />
              ))}
            </div>
            <p className="mt-1 text-center text-[7px] font-semibold tracking-[0.2em] text-star-500">
              TKT 4821 0937 14A
            </p>
          </div>
        </div>
        <div className="demo-confirm mt-1.5 rounded-md bg-emerald-400/10 px-2 py-1 text-center text-[8px] font-bold text-emerald-500">
          Scanned at gate · Boarded ✓
        </div>
      </div>
    </DeviceFrame>
  )
}

// ─── 5. Ride hailing — mini road map + moving rider + driver card ───
export function RideHailingDemo({ steps }) {
  return (
    <DeviceFrame variant="phone" steps={steps}>
      <div className="flex h-full flex-col">
        <div className="relative h-[48%] shrink-0 overflow-hidden bg-star-100/[0.07]">
          <svg viewBox="0 0 300 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            {[24, 60, 96].map((y) => (
              <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="currentColor" strokeOpacity="0.07" strokeWidth="6" />
            ))}
            {[60, 150, 240].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="120" stroke="currentColor" strokeOpacity="0.07" strokeWidth="6" />
            ))}
            <path d={ROAD} fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="10" strokeLinecap="round" />
            <path d={ROAD} fill="none" stroke="rgba(245,48,3,0.75)" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" />
            <circle cx="12" cy="100" r="4" fill="currentColor" fillOpacity="0.45" />
            <circle cx="288" cy="60" r="5" fill="rgba(245,48,3,0.9)" />
          </svg>
          <span
            className="demo-rider absolute left-0 top-0 z-10 text-[11px]"
            style={{ offsetPath: `path('${ROAD}')` }}
          >
            🛵
          </span>
          <span className="absolute left-2 top-1.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[8px] font-bold text-star-300 shadow-sm dark:bg-[rgba(22,18,15,0.50)]">
            3 min away
          </span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-2">
          <div className="demo-in flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ember-500/20 text-[10px] font-bold text-ember-600 dark:text-ember-300">
              JR
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-bold text-star-200">Jun R. · ★ 4.9</p>
              <p className="text-[8px] text-star-500">Honda Click · NGT 445</p>
            </div>
            <span className="shrink-0 rounded-full bg-ember-500 px-2 py-0.5 text-[9px] font-bold text-white">₱65</span>
          </div>
          <div className="demo-in flex flex-col gap-0.5 rounded-md border border-star-300/15 bg-white/50 px-2 py-1 dark:bg-white/[0.04]" style={{ animationDelay: '0.12s' }}>
            <p className="flex items-center gap-1 truncate text-[8px] text-star-500">
              <span className="h-1 w-1 shrink-0 rounded-full bg-star-400" /> Ilagan Terminal
            </p>
            <p className="flex items-center gap-1 truncate text-[8px] font-semibold text-star-300">
              <span className="h-1 w-1 shrink-0 rounded-full bg-ember-500" /> SM City, Cauayan
            </p>
          </div>
          <div className="demo-confirm mt-auto rounded-md bg-emerald-400/10 px-2 py-1 text-center text-[8px] font-bold text-emerald-500">
            Trip complete · Cash ₱65
          </div>
        </div>
      </div>
    </DeviceFrame>
  )
}

// ─── 6. Commerce — cart → paid ───
const CART = [
  ['Denim Jacket', 'Size M', '₱899', 'from-ember-500/40 to-amber-400/30'],
  ['Canvas Tote', 'Natural', '₱349', 'from-amber-400/40 to-ember-400/25'],
  ['Vintage Shirt', 'Size L', '₱249', 'from-ember-600/40 to-ember-400/25'],
]
export function CommerceDemo({ steps }) {
  return (
    <DeviceFrame variant="browser" steps={steps}>
      <div className="flex h-full flex-col p-2.5">
        <div className="flex shrink-0 items-baseline justify-between">
          <p className="text-[10px] font-bold text-star-200">Your cart</p>
          <p className="text-[8px] text-star-500">3 items</p>
        </div>
        <div className="mt-1.5 flex flex-col gap-1.5">
          {CART.map(([name, variant, price, grad], i) => (
            <div
              key={name}
              className="demo-in flex items-center gap-2 rounded-lg border border-star-300/12 bg-white/50 px-2 py-1 dark:bg-white/[0.04]"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <span className={`h-7 w-7 shrink-0 rounded-md bg-gradient-to-br ${grad}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-semibold text-star-300">{name}</p>
                <p className="text-[8px] text-star-500">{variant} · Qty 1</p>
              </div>
              <span className="shrink-0 text-[10px] font-bold text-star-300">{price}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex shrink-0 items-baseline justify-between border-t border-dashed border-star-300/20 pt-1.5">
          <span className="text-[8px] font-bold uppercase tracking-widest text-star-500">Total incl. shipping</span>
          <span className="font-display text-sm font-bold text-star-100">₱1,547</span>
        </div>
        <div className="mt-auto flex flex-col gap-1 pt-1.5">
          <div className="demo-tap rounded-lg bg-ember-500 px-2 py-1.5 text-center text-[10px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(245,48,3,0.6)]">
            Checkout
          </div>
          <div className="demo-confirm rounded-md bg-emerald-400/10 px-2 py-0.5 text-center text-[8px] font-bold text-emerald-500">
            Paid via GCash · order #7734 packed
          </div>
        </div>
      </div>
    </DeviceFrame>
  )
}

// ─── 7. Clinic — appointment → vitals → prescription ───
export function ClinicDemo({ steps }) {
  return (
    <DeviceFrame variant="phone" steps={steps}>
      <div className="flex h-full flex-col gap-1.5 p-2">
        <div className="demo-in flex items-center gap-2 rounded-xl border border-ember-500/25 bg-ember-500/10 px-2 py-1.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ember-500/20 text-[9px] font-bold text-ember-600 dark:text-ember-300">
            DS
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[9px] font-bold text-star-200">Dr. Santos · Internal Med</p>
            <p className="text-[8px] text-star-500">Today · 10:30 AM · Room 3</p>
          </div>
          <span className="shrink-0 rounded-full bg-ember-500 px-1.5 py-0.5 text-[8px] font-bold text-white">Booked</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[['BP', '120/80', 'mmHg'], ['HR', '72', 'bpm'], ['Temp', '36.6', '°C']].map(([k, v, u], i) => (
            <div
              key={k}
              className="demo-in rounded-lg border border-star-300/12 bg-white/50 px-1 py-1 text-center dark:bg-white/[0.04]"
              style={{ animationDelay: `${0.12 + i * 0.08}s` }}
            >
              <p className="text-[7px] font-bold uppercase tracking-widest text-star-500">{k}</p>
              <p className="text-[10px] font-bold leading-tight text-star-200">{v}</p>
              <p className="text-[7px] text-star-500">{u}</p>
            </div>
          ))}
        </div>
        <div className="demo-in min-h-0 flex-1 rounded-xl border border-star-300/15 bg-white/50 px-2 py-1.5 dark:bg-white/[0.04]" style={{ animationDelay: '0.36s' }}>
          <div className="flex items-center justify-between">
            <p className="text-[8px] font-bold uppercase tracking-widest text-ember-600 dark:text-ember-300">Prescription</p>
            <span className="text-[7px] text-star-500">Rx #2094</span>
          </div>
          <p className="mt-1 text-[8px] font-semibold text-star-300">Paracetamol 500mg</p>
          <p className="text-[8px] text-star-500">1 tab · 3× daily · 5 days</p>
          <p className="mt-0.5 text-[8px] font-semibold text-star-300">Vitamin C 500mg</p>
          <p className="text-[8px] text-star-500">1 cap · once daily</p>
        </div>
        <div className="demo-confirm rounded-md bg-emerald-400/10 px-2 py-1 text-center text-[8px] font-bold text-emerald-500">
          Sent to pharmacy ✓
        </div>
      </div>
    </DeviceFrame>
  )
}

// ─── 8. Dashboard — admin console: sidebar + KPIs + chart + table ───
const BARS = [42, 68, 55, 90, 63, 78, 48]
export function DashboardDemo({ steps }) {
  return (
    <DeviceFrame variant="browser" steps={steps}>
      <div className="flex h-full">
        {/* sidebar — what makes it read as a real back-office console */}
        <div className="hidden w-[22%] shrink-0 flex-col gap-1 border-r border-star-300/12 p-2 sm:flex">
          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-star-500">Console</p>
          {['Overview', 'Records', 'Reports', 'Settings'].map((n, i) => (
            <span
              key={n}
              className={`demo-in rounded-md px-1.5 py-1 text-[8px] font-semibold ${
                i === 0 ? 'bg-ember-500/15 text-ember-600 dark:text-ember-300' : 'text-star-500'
              }`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {n}
            </span>
          ))}
          <div className="demo-in mt-auto rounded-md border border-star-300/12 bg-white/50 px-1.5 py-1 dark:bg-white/[0.04]" style={{ animationDelay: '0.3s' }}>
            <p className="text-[7px] font-bold uppercase tracking-widest text-star-500">Storage</p>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-star-100/12">
              <div className="demo-bar h-full w-[64%] rounded-full bg-gradient-to-r from-ember-600 to-amber-400" />
            </div>
            <p className="mt-0.5 text-[7px] text-star-500">6.4 / 10 GB</p>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-2">
          <div className="grid grid-cols-3 gap-1.5">
            {[['Records', '1,204', '+8.2%'], ['Synced', '98%', '+0.4%'], ['Alerts', '3', '−2']].map(([k, v, d], i) => (
              <div
                key={k}
                className="demo-in rounded-lg border border-star-300/15 bg-white/50 px-1.5 py-1 dark:bg-white/[0.04]"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <p className="text-[7px] font-bold uppercase tracking-widest text-star-500">{k}</p>
                <p className="font-display text-[12px] font-bold leading-tight text-star-100">{v}</p>
                <p className="text-[7px] font-semibold text-emerald-500">{d}</p>
              </div>
            ))}
          </div>
          <div className="demo-in flex min-h-0 flex-1 flex-col rounded-lg border border-star-300/12 bg-star-100/[0.04] p-2" style={{ animationDelay: '0.24s' }}>
            <div className="flex shrink-0 items-baseline justify-between">
              <p className="text-[8px] font-bold uppercase tracking-widest text-star-500">Volume · 7 days</p>
              <p className="text-[8px] font-semibold text-ember-600 dark:text-ember-300">▲ 12%</p>
            </div>
            <div className="mt-1 flex min-h-0 flex-1 items-end gap-1 border-b border-star-300/15">
              {BARS.map((h, i) => (
                <div
                  key={i}
                  className="demo-in flex-1 rounded-t-[2px] bg-gradient-to-t from-ember-600 to-amber-400"
                  style={{ height: `${h}%`, animationDelay: `${0.3 + i * 0.05}s` }}
                />
              ))}
            </div>
            <div className="mt-0.5 flex shrink-0 justify-between text-[6px] font-semibold uppercase tracking-widest text-star-500">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i}>{d}</span>)}
            </div>
          </div>
          <div className="demo-confirm flex shrink-0 items-center justify-between rounded-md bg-emerald-400/10 px-2 py-1 text-[8px] font-semibold text-emerald-500">
            <span>Sync complete · 1,204 records</span>
            <span>Just now</span>
          </div>
        </div>
      </div>
    </DeviceFrame>
  )
}

// ─── 9. Feed — a real post card for social / matching platforms ───
export function FeedDemo({ steps }) {
  return (
    <DeviceFrame variant="phone" steps={steps}>
      <div className="flex h-full flex-col gap-1.5 p-2">
        <div className="demo-in flex items-center gap-1.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ember-500/20 text-[9px] font-bold text-ember-600 dark:text-ember-300">
            MR
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[9px] font-bold text-star-200">Mira R. <span className="text-ember-500">✓</span></p>
            <p className="text-[8px] text-star-500">Ilagan · 2h ago</p>
          </div>
          <span className="shrink-0 text-[10px] leading-none text-star-500">···</span>
        </div>
        <div className="demo-in min-h-0 flex-1 overflow-hidden rounded-lg bg-gradient-to-br from-ember-500/35 via-amber-400/25 to-ember-700/35" style={{ animationDelay: '0.1s' }}>
          <svg viewBox="0 0 200 120" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
            <circle cx="158" cy="28" r="14" fill="rgba(255,255,255,0.3)" />
            <path d="M0 120 L0 82 L46 48 L92 82 L128 58 L200 96 L200 120 Z" fill="rgba(0,0,0,0.22)" />
          </svg>
        </div>
        <div className="demo-in flex items-center gap-2.5 text-[9px] font-semibold text-star-400" style={{ animationDelay: '0.2s' }}>
          <span className="flex items-center gap-1"><span className="demo-pin text-ember-500">♥</span> 248</span>
          <span className="flex items-center gap-1">💬 32</span>
          <span className="ml-auto text-star-500">↗</span>
        </div>
        <p className="demo-in truncate text-[8px] text-star-500" style={{ animationDelay: '0.26s' }}>
          <span className="font-semibold text-star-300">mira_r</span> Sunset run at the bay 🌅
        </p>
        <div className="demo-confirm rounded-md bg-emerald-400/10 px-2 py-1 text-center text-[8px] font-bold text-emerald-500">
          Published to 1.2k followers ✓
        </div>
      </div>
    </DeviceFrame>
  )
}

// ─── 10. Learning — course player + lesson list ───
export function LearningDemo({ steps }) {
  return (
    <DeviceFrame variant="browser" steps={steps}>
      <div className="flex h-full gap-2 p-2">
        <div className="flex w-[44%] shrink-0 flex-col gap-1.5">
          <div className="demo-in relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-ember-500/40 to-amber-400/30">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[10px] text-ember-600 shadow-sm dark:bg-[rgba(22,18,15,0.50)] dark:text-ember-300">
              ▶
            </span>
            <span className="absolute bottom-1 right-1.5 rounded bg-black/45 px-1 text-[7px] font-semibold text-white">
              12:04
            </span>
          </div>
          <div className="demo-in" style={{ animationDelay: '0.1s' }}>
            <p className="truncate text-[9px] font-bold text-star-200">Intro to Bookkeeping</p>
            <p className="text-[8px] text-star-500">Module 2 of 6 · Ms. Reyes</p>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {[
            ['Intro & goals', '4:12', true],
            ['Core lesson', '12:04', true],
            ['Practice set', '8:30', false],
            ['Quiz', '5:00', false],
          ].map(([row, dur, done], i) => (
            <div
              key={row}
              className={`demo-in flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[9px] font-semibold ${
                i === 1 ? 'bg-ember-500/12 text-star-200' : 'text-star-400'
              }`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span
                className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[7px] ${
                  done ? 'bg-emerald-400/20 text-emerald-500' : 'border border-star-300/30 text-star-500'
                }`}
              >
                {done ? '✓' : i + 1}
              </span>
              <span className="min-w-0 flex-1 truncate">{row}</span>
              <span className="shrink-0 text-[8px] font-medium text-star-500">{dur}</span>
            </div>
          ))}
          <div className="mt-auto">
            <div className="flex items-baseline justify-between text-[8px] font-semibold text-star-500">
              <span>Course progress</span>
              <span className="text-ember-600 dark:text-ember-300">62%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-star-100/10">
              <div className="demo-bar h-full w-[62%] rounded-full bg-gradient-to-r from-ember-600 to-amber-400" />
            </div>
          </div>
        </div>
      </div>
    </DeviceFrame>
  )
}

// ─── 11. Service booking — calendar → slot → confirmed ───
export function ServiceBookingDemo({ steps }) {
  return (
    <DeviceFrame variant="browser" steps={steps}>
      <div className="flex h-full gap-2.5 p-2.5">
        <div className="flex w-[52%] shrink-0 flex-col">
          <div className="flex shrink-0 items-baseline justify-between">
            <p className="text-[9px] font-bold text-star-200">August 2026</p>
            <p className="text-[8px] text-star-500">‹ ›</p>
          </div>
          <div className="mt-1 grid grid-cols-7 gap-[3px]">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="text-center text-[7px] font-bold uppercase text-star-500">{d}</div>
            ))}
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className={`demo-in flex h-4 items-center justify-center rounded text-[8px] font-semibold ${
                  i === 13
                    ? 'demo-tap bg-ember-500 text-white'
                    : i === 9 || i === 16 || i === 24
                      ? 'bg-ember-500/15 text-ember-600 dark:text-ember-300'
                      : 'bg-star-100/[0.06] text-star-400'
                }`}
                style={{ animationDelay: `${i * 0.015}s` }}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div className="demo-in mt-auto flex items-center gap-1.5 rounded-md border border-star-300/15 bg-white/50 px-2 py-1 dark:bg-white/[0.04]" style={{ animationDelay: '0.4s' }}>
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember-500/15 text-[9px]">📋</span>
            <div className="min-w-0">
              <p className="truncate text-[9px] font-bold text-star-200">Full-service package</p>
              <p className="truncate text-[7px] text-star-500">80 guests · 90 min · ₱24,000</p>
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-[8px] font-bold uppercase tracking-widest text-star-500">Available · Aug 14</p>
          {[['10:00 AM', false], ['2:00 PM', true], ['4:30 PM', false]].map(([t, sel], i) => (
            <div
              key={t}
              className={`demo-in flex items-center justify-between rounded-md border px-2 py-1 text-[9px] font-semibold ${
                sel
                  ? 'border-ember-500/40 bg-ember-500/12 text-star-200'
                  : 'border-star-300/15 bg-white/50 text-star-400 dark:bg-white/[0.04]'
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span>{t}</span>
              {sel ? (
                <span className="rounded-full bg-ember-500 px-1.5 py-0.5 text-[7px] font-bold text-white">Selected</span>
              ) : (
                <span className="text-[7px] text-star-500">Open</span>
              )}
            </div>
          ))}
          <div className="demo-confirm mt-auto rounded-md border border-star-300/15 bg-white/50 px-2 py-1 dark:bg-white/[0.04]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500">✓ Confirmed</span>
              <span className="text-[7px] text-star-500">Ref #A1B2C3</span>
            </div>
            <p className="text-[7px] text-star-500">Aug 14 · 2:00 PM · with Ana C.</p>
          </div>
        </div>
      </div>
    </DeviceFrame>
  )
}

// ─── Mapper — kind by exact project id, steps by project ───
const STEPS = {
  // Logistics & Delivery
  dory: ['Customer orders', 'Merchant preps', 'Rider picks up', 'Out for delivery', 'Delivered ✓'],
  dorx: ['Shipment booked', 'Picked up', 'In transit', 'Arrived ✓'],
  padala: ['Item dropped off', 'Sorted', 'Out for delivery', 'Delivered ✓'],
  balikbay: ['Box sealed', 'Customs cleared', 'In transit', 'Delivered ✓'],
  kargador: ['Cargo booked', 'Loading', 'At sea', 'Unloaded ✓'],
  padyak: ['Order assigned', 'Rider en route', 'Arriving', 'Delivered ✓'],
  barko: ['Container booked', 'Boarded', 'Crossing', 'Docked ✓'],
  bigasan: ['Rice ordered', 'Sacks packed', 'Out for delivery', 'Delivered ✓'],
  kanto: ['Order placed', 'Kitchen cooking', 'Out for delivery', 'Delivered ✓'],
  palengke: ['Add produce', 'Checkout', 'Rider assigned', 'Delivered ✓'],
  // Ride hailing
  byahego: ['Book ride', 'Driver assigned', 'Riding', 'Arrived ✓'],
  tricycle: ['Set destination', 'Fare quoted', 'Riding', 'Arrived ✓'],
  // Travel tickets
  sakayan: ['Pick route', 'Choose trip', 'Pay fare', 'Boarded ✓'],
  islawaves: ['Pick island', 'Choose dates', 'Confirm', 'Trip booked ✓'],
  bangka: ['Pick port', 'Choose schedule', 'Pay', 'Seat booked ✓'],
  pamana: ['Pick tour', 'Choose date', 'Confirm', 'Tour booked ✓'],
  tiket: ['Pick event', 'Choose seats', 'Pay', 'Tickets ready ✓'],
  // Hotel / venue booking
  whatahotel: ['Pick dates', 'Choose room', 'Confirm', 'Booked ✓'],
  kuwarto: ['Pick dates', 'Choose unit', 'Confirm', 'Booked ✓'],
  pahinga: ['Pick condo', 'Choose dates', 'Confirm', 'Booked ✓'],
  banquet: ['Pick venue', 'Choose date', 'Confirm', 'Event booked ✓'],
  pista: ['Pick fiesta', 'Choose date', 'Confirm', 'Booked ✓'],
  // Service booking
  harana: ['Pick package', 'Choose date', 'Confirm', 'Catering booked ✓'],
  servisyo: ['Book service', 'Housekeeper assigned', 'Cleaning', 'Done ✓'],
  guro: ['Tutor matched', 'Session live', 'Completed', 'Rated ✓'],
  bisikleta: ['Pick bike', 'Book service', 'Paid', 'Ready ✓'],
  // E-commerce
  ukay: ['Add to cart', 'Checkout', 'Paid', 'Shipped ✓'],
  tyangge: ['Add items', 'Checkout', 'Paid', 'Order packed ✓'],
  subasta: ['Place bid', 'Winning', 'Pay', 'Item shipped ✓'],
  tinda: ['Add items', 'Checkout', 'Paid', 'Pickup ready ✓'],
  kultura: ['Add craft', 'Checkout', 'Paid', 'Shipped ✓'],
  merienda: ['Pick box', 'Subscribe', 'Paid', 'Box shipped ✓'],
  tindahan: ['Scan item', 'Add to sale', 'Payment', 'Receipt ✓'],
  // Restaurant / POS
  sizzlepos: ['Add to order', 'Kitchen', 'Payment', 'Receipt ✓'],
  halo: ['Add to order', 'Kitchen', 'Payment', 'Receipt ✓'],
  uling: ['Add to order', 'Grill', 'Payment', 'Receipt ✓'],
  paluto: ['Order placed', 'Kitchen cooking', 'Ready for pickup', 'Picked up ✓'],
  timbang: ['Weigh item', 'Price computed', 'Payment', 'Receipt ✓'],
  resibo: ['Scan item', 'Add to sale', 'Payment', 'Receipt ✓'],
  suki: ['Scan & earn', 'Points added', 'Reward claimed', 'Saved ✓'],
  // Clinic / health
  klinika: ['Book appointment', 'Consult doctor', 'Prescription', 'Done ✓'],
  medisina: ['Book consult', 'Doctor online', 'Prescription', 'Done ✓'],
  bulilit: ['Book care', 'Caregiver assigned', 'In care', 'Pickup ✓'],
  saklolo: ['Alert sent', 'Response team', 'En route', 'Help arrived ✓'],
  // Dashboards / B2B systems
  dmap: ['Data synced', 'Map rendering', 'Live', 'Updated ✓'],
  agenxure: ['Quote started', 'Documents in', 'Approved', 'Policy issued ✓'],
  plano: ['Data imported', 'Processing', 'Reports ready', 'Synced ✓'],
  negosyante: ['Sales synced', 'Analyzing', 'Insights ready', 'Updated ✓'],
  dokumento: ['File uploaded', 'Processing', 'Signed', 'Archived ✓'],
  kawani: ['Leave filed', 'Manager review', 'Approved', 'Logged ✓'],
  agrikoop: ['Harvest in', 'Recorded', 'Sold', 'Paid to farmer ✓'],
  taniman: ['Plot updated', 'Watering logged', 'Growth tracked', 'Ready ✓'],
  bayad: ['Payment sent', 'Processing', 'Verified', 'Posted ✓'],
  kolekta: ['Client due', 'Payment received', 'Logged', 'Balance updated ✓'],
  silid: ['Book borrowed', 'Checked out', 'Returned', 'Fines cleared ✓'],
  sangla: ['Item appraised', 'Loan issued', 'Interest tracked', 'Paid off ✓'],
  binhi: ['Crop logged', 'Field updated', 'Yield forecast', 'Ready ✓'],
  // Feed / social / matching
  artista: ['Post uploaded', 'Moderation', 'Published', 'Boosted ✓'],
  kapatid: ['Profile verified', 'Matched', 'Connected', 'Chatting ✓'],
  balita: ['Story filed', 'Editor review', 'Published', 'Liked ✓'],
  luto: ['Save recipe', 'Cook along', 'Share', 'Liked ✓'],
  // Learning
  eskwela: ['Lesson queued', 'Rendering', 'Delivered', 'Completed ✓'],
  klase: ['Class scheduled', 'Students joined', 'Live', 'Ended ✓'],
}

const KIND = {
  // delivery
  dory: 'delivery', dorx: 'delivery', padala: 'delivery', balikbay: 'delivery',
  kargador: 'delivery', barko: 'delivery', bigasan: 'delivery', padyak: 'delivery',
  kanto: 'delivery', palengke: 'delivery',
  // ride hailing
  byahego: 'ride', tricycle: 'ride',
  // travel ticket
  sakayan: 'ticket', islawaves: 'ticket', bangka: 'ticket', pamana: 'ticket', tiket: 'ticket',
  // hotel / venue booking
  whatahotel: 'hotel', kuwarto: 'hotel', pahinga: 'hotel', banquet: 'hotel', pista: 'hotel',
  // service booking
  harana: 'service', servisyo: 'service', guro: 'service', bisikleta: 'service',
  // commerce
  ukay: 'commerce', tyangge: 'commerce', subasta: 'commerce', tinda: 'commerce',
  kultura: 'commerce', merienda: 'commerce', tindahan: 'commerce',
  // pos
  sizzlepos: 'pos', halo: 'pos', uling: 'pos', paluto: 'pos', timbang: 'pos',
  resibo: 'pos', suki: 'pos',
  // clinic
  klinika: 'clinic', medisina: 'clinic', bulilit: 'clinic', saklolo: 'clinic',
  // dashboard
  dmap: 'dashboard', agenxure: 'dashboard', plano: 'dashboard', negosyante: 'dashboard',
  dokumento: 'dashboard', kawani: 'dashboard', agrikoop: 'dashboard', taniman: 'dashboard',
  bayad: 'dashboard', kolekta: 'dashboard', silid: 'dashboard', sangla: 'dashboard', binhi: 'dashboard',
  // feed
  artista: 'feed', kapatid: 'feed', balita: 'feed', luto: 'feed',
  // learning
  eskwela: 'learning', klase: 'learning',
}

export default function ProjectDemo({ project }) {
  const steps = STEPS[project.id] || ['Connected', 'Processing', 'Almost done', 'Complete ✓']
  const kind = KIND[project.id] || 'dashboard'
  if (kind === 'delivery') return <DeliveryMapDemo steps={steps} />
  if (kind === 'pos') return <PosDemo steps={steps} />
  if (kind === 'hotel') return <HotelBookingDemo steps={steps} />
  if (kind === 'ticket') return <TravelTicketDemo steps={steps} />
  if (kind === 'ride') return <RideHailingDemo steps={steps} />
  if (kind === 'commerce') return <CommerceDemo steps={steps} />
  if (kind === 'clinic') return <ClinicDemo steps={steps} />
  if (kind === 'feed') return <FeedDemo steps={steps} />
  if (kind === 'learning') return <LearningDemo steps={steps} />
  if (kind === 'service') return <ServiceBookingDemo steps={steps} />
  return <DashboardDemo steps={steps} />
}
