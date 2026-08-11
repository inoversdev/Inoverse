// ─── Project demos — domain-accurate "how it works" showcases ───
// Mat's call 2026-08-11 (round 2): the generic demos weren't accurate
// to each system's title and all looked the same. Now SIX visually
// distinct archetypes, each with its own layout AND per-project
// accurate steps:
//   DeliveryMap — the map + rider racing the route (low-fi -> hi-fi)
//   BookingDemo — calendar -> selection -> confirmed card
//   CommerceDemo — cart rows -> total -> paid
//   POSDemo     — ticket rows -> total -> receipt print
//   ClinicDemo  — appointment -> consult -> prescription
//   PlatformDemo— dashboard: chart + statuses + progress
// The mapper picks the archetype by category + per-project step copy.

const ROUTE = 'M 18 84 C 18 84, 30 26, 96 26 S 220 26, 240 60 S 252 118, 282 118'

function StatusTicker({ items, delay = 0.6, align = 'left' }) {
  return (
    <div className={`pointer-events-none absolute top-3 z-20 ${align === 'left' ? 'left-3' : 'right-3'}`}>
      {items.map((s, i) => (
        <div
          key={s}
          className="demo-status rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold text-space-900 shadow-sm backdrop-blur-sm dark:bg-space-950/85 dark:text-star-100"
          style={{ animationDelay: `${delay + i * 0.7}s` }}
        >
          {s}
        </div>
      ))}
    </div>
  )
}

// ─── 1. Delivery / logistics — the map demo ───
export function DeliveryMapDemo({ steps }) {
  return (
    <div className="relative h-60 w-full overflow-hidden rounded-2xl bg-star-100/5 sm:h-72">
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
        <StatusTicker items={steps.slice(0, 3)} delay={0.3} />
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
          <path d={ROUTE} fill="none" stroke="url(#demo-route)" strokeWidth="3" strokeLinecap="round" />
          <path d={ROUTE} fill="none" stroke="rgba(245,48,3,0.35)" strokeWidth="7" strokeLinecap="round" />
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
        <div className="absolute bottom-2 left-3 right-3 h-1 overflow-hidden rounded-full bg-star-100/10">
          <div className="demo-bar h-full w-full rounded-full bg-gradient-to-r from-ember-600 to-amber-400" />
        </div>
        <StatusTicker items={steps} delay={3.2} />
        <span className="absolute right-3 top-2 text-[9px] font-semibold uppercase tracking-widest text-ember-500">
          High fidelity — live
        </span>
      </div>
    </div>
  )
}

// ─── 2. Booking / reservation — calendar → confirm ───
export function BookingDemo({ steps }) {
  return (
    <div className="relative h-60 w-full overflow-hidden rounded-2xl bg-star-100/5 p-4 sm:h-72">
      <div className="flex h-full flex-col gap-3">
        {/* calendar strip */}
        <div className="grid grid-cols-7 gap-1.5">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className="text-center text-[8px] font-bold uppercase text-star-500">{d}</div>
          ))}
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className={`demo-cal flex h-7 items-center justify-center rounded-md text-[9px] font-semibold ${
                i === 6 ? 'bg-ember-500 text-white' : i === 9 ? 'bg-ember-500/20 text-ember-600 dark:text-ember-300' : 'bg-star-100/8 text-star-400'
              }`}
              style={{ animationDelay: `${i * 0.35}s` }}
            >
              {i + 1}
            </div>
          ))}
        </div>
        {/* selection card */}
        <div className="demo-row flex items-center justify-between rounded-xl border border-ember-500/25 bg-ember-500/10 px-3 py-2">
          <div>
            <p className="text-[10px] font-bold text-star-300">Deluxe Room</p>
            <p className="text-[9px] text-star-500">2 guests · 3 nights</p>
          </div>
          <span className="rounded-full bg-ember-500 px-2 py-0.5 text-[9px] font-bold text-white">₱4,500</span>
        </div>
        {/* confirm */}
        <div className="demo-row flex items-center justify-between rounded-xl border border-star-300/15 bg-white/50 px-3 py-2 dark:bg-white/5" style={{ animationDelay: '0.9s' }}>
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/20 text-[10px] text-emerald-500">✓</span>
            <p className="text-[10px] font-semibold text-star-300">Booking confirmed</p>
          </div>
          <span className="text-[9px] text-star-500">Ref #A1B2C3</span>
        </div>
        {/* progress */}
        <div className="mt-auto h-1.5 w-full overflow-hidden rounded-full bg-star-100/10">
          <div className="demo-bar h-full w-full rounded-full bg-gradient-to-r from-ember-600 to-amber-400" />
        </div>
      </div>
      <StatusTicker items={steps} />
    </div>
  )
}

// ─── 3. Commerce — cart → paid ───
export function CommerceDemo({ steps }) {
  const rows = [
    ['Denim Jacket', '₱899'],
    ['Canvas Tote', '₱349'],
    ['Vintage Shirt', '₱249'],
  ]
  return (
    <div className="relative h-60 w-full overflow-hidden rounded-2xl bg-star-100/5 p-4 sm:h-72">
      <div className="flex h-full flex-col gap-2">
        {rows.map(([name, price], i) => (
          <div
            key={name}
            className="demo-row flex items-center gap-2.5 rounded-lg border border-star-300/10 bg-white/50 px-2.5 py-1.5 dark:bg-white/5"
            style={{ animationDelay: `${i * 0.8}s` }}
          >
            <span className="h-6 w-6 shrink-0 rounded-md bg-gradient-to-br from-ember-500/30 to-star-100/5" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-semibold text-star-300">{name}</p>
              <p className="text-[9px] text-star-500">Qty 1</p>
            </div>
            <span className="text-[10px] font-bold text-star-400">{price}</span>
          </div>
        ))}
        <div className="demo-total mt-auto flex items-center justify-between rounded-xl bg-ember-500/15 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ember-600 dark:text-ember-300">Total</p>
          <p className="text-xs font-bold text-star-200">₱1,497</p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-star-100/10">
          <div className="demo-bar h-full w-full rounded-full bg-gradient-to-r from-ember-600 to-amber-400" />
        </div>
      </div>
      <StatusTicker items={steps} />
    </div>
  )
}

// ─── 4. POS — ticket → receipt ───
export function POSDemo({ steps }) {
  const rows = [
    ['Adobo Rice Bowl', 'x2', '₱180'],
    ['Iced Tea', 'x1', '₱40'],
    ['Leche Flan', 'x1', '₱60'],
  ]
  return (
    <div className="relative h-60 w-full overflow-hidden rounded-2xl bg-star-100/5 p-4 sm:h-72">
      <div className="flex h-full flex-col gap-2">
        {/* ticket rows */}
        {rows.map(([name, qty, price], i) => (
          <div
            key={name}
            className="demo-row flex items-center justify-between rounded-lg border border-star-300/10 bg-white/50 px-2.5 py-1.5 dark:bg-white/5"
            style={{ animationDelay: `${i * 0.8}s` }}
          >
            <p className="truncate text-[10px] font-semibold text-star-300">{name}</p>
            <div className="flex items-center gap-2">
              <span className="rounded bg-star-100/10 px-1.5 text-[9px] font-semibold text-star-500">{qty}</span>
              <span className="text-[10px] font-bold text-star-400">{price}</span>
            </div>
          </div>
        ))}
        <div className="demo-total mt-auto flex items-center justify-between rounded-xl bg-ember-500/15 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ember-600 dark:text-ember-300">Pay</p>
          <p className="text-xs font-bold text-star-200">₱280</p>
        </div>
        {/* receipt print */}
        <div className="demo-receipt rounded-lg border border-dashed border-star-300/25 bg-white/60 px-2.5 py-1.5 dark:bg-white/5">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-widest text-star-500">Receipt #0042</p>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/20 text-[9px] text-emerald-500">✓</span>
          </div>
          <div className="mt-0.5 flex items-center justify-between">
            <p className="text-[9px] text-star-500">Paid · Change</p>
            <p className="text-[9px] font-bold text-emerald-500">₱300 / ₱20</p>
          </div>
        </div>
      </div>
      <StatusTicker items={steps} />
    </div>
  )
}

// ─── 5. Clinic — appointment → prescription ───
export function ClinicDemo({ steps }) {
  return (
    <div className="relative h-60 w-full overflow-hidden rounded-2xl bg-star-100/5 p-4 sm:h-72">
      <div className="flex h-full flex-col gap-2.5">
        {/* appointment card */}
        <div className="demo-row flex items-center gap-2.5 rounded-xl border border-ember-500/25 bg-ember-500/10 px-3 py-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ember-500/20 text-[10px] font-bold text-ember-600 dark:text-ember-300">JD</span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-star-300">Dr. Santos</p>
            <p className="text-[9px] text-star-500">General check-up · 10:30 AM</p>
          </div>
          <span className="rounded-full bg-ember-500 px-2 py-0.5 text-[9px] font-bold text-white">Booked</span>
        </div>
        {/* vitals */}
        <div className="grid grid-cols-3 gap-1.5">
          {[['BP', '120/80'], ['HR', '72 bpm'], ['Temp', '36.6°C']].map(([k, v], i) => (
            <div key={k} className="demo-row rounded-lg bg-white/50 px-2 py-1.5 text-center dark:bg-white/5" style={{ animationDelay: `${0.8 + i * 0.5}s` }}>
              <p className="text-[8px] font-bold uppercase tracking-widest text-star-500">{k}</p>
              <p className="text-[10px] font-bold text-star-300">{v}</p>
            </div>
          ))}
        </div>
        {/* prescription */}
        <div className="demo-receipt rounded-xl border border-star-300/15 bg-white/60 px-3 py-2 dark:bg-white/5">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-widest text-ember-600 dark:text-ember-300">Prescription</p>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/20 text-[9px] text-emerald-500">✓</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-[9px] text-star-500">Paracetamol 500mg · 3× daily</p>
            <p className="text-[9px] font-bold text-star-400">₱120</p>
          </div>
        </div>
      </div>
      <StatusTicker items={steps} />
    </div>
  )
}

// ─── 6. Platform / SaaS — dashboard processing ───
export function PlatformDemo({ steps }) {
  const nodes = steps.length > 3 ? steps.slice(0, 4) : steps
  return (
    <div className="relative h-60 w-full overflow-hidden rounded-2xl bg-star-100/5 p-4 sm:h-72">
      <div className="flex h-full flex-col justify-center gap-4">
        <div className="flex w-full items-center gap-2">
          {nodes.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div
                className="demo-node flex flex-1 flex-col items-center gap-1 rounded-xl border border-ember-500/30 bg-ember-500/10 py-3"
                style={{ animationDelay: `${i * 1.1}s` }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-ember-600 dark:text-ember-300">{i + 1}</span>
                <span className="px-1 text-center text-[10px] font-semibold leading-tight text-star-300">{s}</span>
              </div>
              {i < nodes.length - 1 && <span className="shrink-0 text-sm text-ember-500">→</span>}
            </div>
          ))}
        </div>
        <StatusTicker items={steps} />
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-star-100/10">
          <div className="demo-bar h-full w-full rounded-full bg-gradient-to-r from-ember-600 to-amber-400" style={{ animationDuration: '5s' }} />
        </div>
      </div>
    </div>
  )
}

// ─── Mapper — archetype by category, steps by project ───
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
  // Travel
  byahego: ['Book ride', 'Driver assigned', 'Riding', 'Arrived ✓'],
  sakayan: ['Pick route', 'Choose trip', 'Pay fare', 'Boarded ✓'],
  islawaves: ['Pick island', 'Choose dates', 'Confirm', 'Trip booked ✓'],
  bangka: ['Pick port', 'Choose schedule', 'Pay', 'Seat booked ✓'],
  pamana: ['Pick tour', 'Choose date', 'Confirm', 'Tour booked ✓'],
  tricycle: ['Set destination', 'Fare quoted', 'Riding', 'Arrived ✓'],
  tiket: ['Pick event', 'Choose seats', 'Pay', 'Tickets ready ✓'],
  // Hotel & Hospitality
  whatahotel: ['Pick dates', 'Choose room', 'Confirm', 'Booked ✓'],
  kuwarto: ['Pick dates', 'Choose unit', 'Confirm', 'Booked ✓'],
  harana: ['Pick package', 'Choose date', 'Confirm', 'Catering booked ✓'],
  pahinga: ['Pick condo', 'Choose dates', 'Confirm', 'Booked ✓'],
  banquet: ['Pick venue', 'Choose date', 'Confirm', 'Event booked ✓'],
  servisyo: ['Book service', 'Housekeeper assigned', 'Cleaning', 'Done ✓'],
  pista: ['Pick fiesta', 'Choose date', 'Confirm', 'Booked ✓'],
  // E-commerce
  ukay: ['Add to cart', 'Checkout', 'Paid', 'Shipped ✓'],
  palengke: ['Add produce', 'Checkout', 'Rider assigned', 'Delivered ✓'],
  tyangge: ['Add items', 'Checkout', 'Paid', 'Order packed ✓'],
  subasta: ['Place bid', 'Winning', 'Pay', 'Item shipped ✓'],
  tinda: ['Add items', 'Checkout', 'Paid', 'Pickup ready ✓'],
  kultura: ['Add craft', 'Checkout', 'Paid', 'Shipped ✓'],
  suki: ['Scan & earn', 'Points added', 'Reward claimed', 'Saved ✓'],
  merienda: ['Pick box', 'Subscribe', 'Paid', 'Box shipped ✓'],
  // Restaurant & Food
  sizzlepos: ['Add to order', 'Kitchen', 'Payment', 'Receipt ✓'],
  halo: ['Add to order', 'Kitchen', 'Payment', 'Receipt ✓'],
  uling: ['Add to order', 'Grill', 'Payment', 'Receipt ✓'],
  kanto: ['Order placed', 'Kitchen cooking', 'Out for delivery', 'Delivered ✓'],
  paluto: ['Order placed', 'Kitchen cooking', 'Ready for pickup', 'Picked up ✓'],
  luto: ['Save recipe', 'Cook along', 'Share', 'Liked ✓'],
  // Retail & Small Business
  tindahan: ['Scan item', 'Add to sale', 'Payment', 'Receipt ✓'],
  timbang: ['Weigh item', 'Price computed', 'Payment', 'Receipt ✓'],
  resibo: ['Scan item', 'Add to sale', 'Payment', 'Receipt ✓'],
  agrikoop: ['Harvest in', 'Recorded', 'Sold', 'Paid to farmer ✓'],
  binhi: ['Crop logged', 'Field updated', 'Yield forecast', 'Ready ✓'],
  taniman: ['Plot updated', 'Watering logged', 'Growth tracked', 'Ready ✓'],
  silid: ['Book borrowed', 'Checked out', 'Returned', 'Fines cleared ✓'],
  sangla: ['Item appraised', 'Loan issued', 'Interest tracked', 'Paid off ✓'],
  kolekta: ['Client due', 'Payment received', 'Logged', 'Balance updated ✓'],
  bisikleta: ['Pick bike', 'Book service', 'Paid', 'Ready ✓'],
  bayad: ['Payment sent', 'Processing', 'Verified', 'Posted ✓'],
  // Clinic / health
  klinika: ['Book appointment', 'Consult doctor', 'Prescription', 'Done ✓'],
  medisina: ['Book consult', 'Doctor online', 'Prescription', 'Done ✓'],
  bulilit: ['Book care', 'Caregiver assigned', 'In care', 'Pickup ✓'],
  saklolo: ['Alert sent', 'Response team', 'En route', 'Help arrived ✓'],
  // Platform & SaaS
  dmap: ['Data synced', 'Map rendering', 'Live', 'Updated ✓'],
  agenxure: ['Quote started', 'Documents in', 'Approved', 'Policy issued ✓'],
  eskwela: ['Lesson queued', 'Rendering', 'Delivered', 'Completed ✓'],
  klase: ['Class scheduled', 'Students joined', 'Live', 'Ended ✓'],
  plano: ['Data imported', 'Processing', 'Reports ready', 'Synced ✓'],
  negosyante: ['Sales synced', 'Analyzing', 'Insights ready', 'Updated ✓'],
  dokumento: ['File uploaded', 'Processing', 'Signed', 'Archived ✓'],
  kawani: ['Leave filed', 'Manager review', 'Approved', 'Logged ✓'],
  guro: ['Tutor matched', 'Session live', 'Completed', 'Rated ✓'],
  artista: ['Post uploaded', 'Moderation', 'Published', 'Boosted ✓'],
  kapatid: ['Profile verified', 'Matched', 'Connected', 'Chatting ✓'],
  balita: ['Story filed', 'Editor review', 'Published', 'Liked ✓'],
}

const byCategory = (project) => {
  const cat = project.category || ''
  if (['Delivery Platform', 'Logistics System', 'Courier App', 'Shipping Tracker', 'Freight Booking', 'Last Mile App', 'Cargo Shipping', 'Rice Delivery'].includes(cat)) return 'delivery'
  if (['Travel System', 'Booking System', 'Booking Website', 'Ferry Booking', 'Heritage Tours', 'Transit Planner', 'Event Tickets'].includes(cat)) return 'booking'
  if (['Mobile App', 'Booking Platform', 'Condo Rental', 'Event Booking', 'Housekeeping App', 'Fiesta Booking'].includes(cat)) return 'booking'
  if (['E-commerce App', 'E-commerce Site', 'Wet Market App', 'Marketplace', 'Auction Platform', 'Loyalty Platform', 'Handicraft Shop', 'Local Market', 'Subscription Box'].includes(cat)) return 'commerce'
  if (['POS System', 'Cloud POS', 'POS Receipts', 'Weighing Kiosk', 'BBQ Kiosk'].includes(cat)) return 'pos'
  if (['Clinic System', 'Telehealth App', 'Childcare App', 'Emergency Response'].includes(cat)) return 'clinic'
  return 'platform'
}

export default function ProjectDemo({ project }) {
  const steps = STEPS[project.id] || [
    'Connected',
    'Processing',
    'Almost done',
    'Complete ✓',
  ]
  const kind = byCategory(project)
  if (kind === 'delivery') return <DeliveryMapDemo steps={steps} />
  if (kind === 'booking') return <BookingDemo steps={steps} />
  if (kind === 'commerce') return <CommerceDemo steps={steps} />
  if (kind === 'pos') return <POSDemo steps={steps} />
  if (kind === 'clinic') return <ClinicDemo steps={steps} />
  return <PlatformDemo steps={steps} />
}
