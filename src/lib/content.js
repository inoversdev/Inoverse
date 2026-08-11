// ─── Inovers site content — centralized ───
// Source: vault note "Dory Task/Day 2/Inoverse website Redesign Polish.md"

export const BRAND = {
  name: 'Inovers',
  email: 'inovers.dev@gmail.com',
  emailAlt: 'inovers@gmail.com',
  phone: '0999-570-7957',
  calendly: 'https://calendly.com/inovers-dev/30min',
  tagline: 'Innovating the Future, Together',
}

// Top bar. 'Crew' sits next to 'Work' — the two "see the actual output /
// see the actual people" links — and is the bar's only route link; the
// rest are home-section anchors. Six links fit: measured at the lg
// breakpoint (1024px — where the desktop bar replaces the mobile drawer)
// the row uses 818px of 944px, leaving 126px of slack; at 1280px+ the
// slack is 382px. That 126px is the real ceiling — a seventh link needs
// a re-measure, not a guess.
export const NAV_LINKS = [
  { label: 'Services', kind: 'anchor', target: 'services' },
  { label: 'Work', kind: 'anchor', target: 'work' },
  { label: 'Crew', kind: 'route', to: '/crew' },
  { label: 'Why Inovers', kind: 'anchor', target: 'why-inovers' },
  { label: 'Testimonials', kind: 'anchor', target: 'testimonials' },
  { label: 'Contact', kind: 'anchor', target: 'contact' },
]

// Fuller list for the footer — includes anchors that got bumped out of
// the top bar to make room for the two new routes, plus a direct link
// to the full project manifest.
export const FOOTER_LINKS = [
  ...NAV_LINKS,
  { label: 'About', kind: 'anchor', target: 'about' },
  { label: 'Process', kind: 'anchor', target: 'process' },
  { label: 'All work', kind: 'route', to: '/projects' },
]

export const HERO = {
  eyebrow: 'Custom software · Web · Mobile · AI',
  titleA: 'Innovating the',
  titleHighlight: 'Future',
  titleB: 'Together.',
  subtitle:
    'Custom software, systems, and technology solutions to help your business thrive in the digital age.',
  ctaPrimary: 'Get Started',
  ctaSecondary: 'Book Free Consultation',
}

export const STATS = [
  { value: 50, suffix: '+', label: 'Projects delivered' },
  { value: 30, suffix: '+', label: 'Happy clients' },
  { value: 7, suffix: '', label: 'Core products' },
  { value: 3, suffix: '-day', label: 'Website turnaround' },
]

export const ABOUT = {
  eyebrow: 'About',
  heading: 'The crew behind',
  headingHighlight: 'Inovers',
  paragraphs: [
    'Inovers is built on a simple belief technology should lift your business, not weigh it down. For over a decade we\u2019ve been turning raw ideas into digital products that drive real growth.',
    'Our mission is to close the gap between complex tech and real business wins. We work with companies of every size building custom software, streamlining operations, and engineering advantages that actually last.',
    'From fresh startups to established enterprises, we\u2019ve helped hundreds of teams turn technology into momentum hitting their goals, then going beyond them.',
  ],
  cta: 'Crews',
  ctaSecondary: 'Work With Us',
  values: [
    {
      id: 'innovation',
      icon: 'spark',
      title: 'Innovation',
      description:
        'Emerging tech paired with sharp strategy solutions built to outrun the market, not just match it.',
    },
    {
      id: 'reliability',
      icon: 'shield',
      title: 'Reliability',
      description:
        'Robust systems and battle tested methods. Your technology works when you need it most.',
    },
    {
      id: 'partnership',
      icon: 'users',
      title: 'Partnership',
      description:
        'From the first call to long after launch, we stay close and treat your goals as our own.',
    },
    {
      id: 'results',
      icon: 'trend',
      title: 'Results',
      description:
        'Every build is designed around measurable outcomes and bottom line impact not just features.',
    },
  ],
}

// ─── What we Build (Services) — interlocking zigzag masonry ───
// Section header copy — adopted from Mat's pixel mockup (2026-08-09).
export const servicesHeading = 'We build digital experiences that drive results.'
export const servicesSubtitle =
  'Web solutions that are fast, responsive, and designed to help your business grow.'

// Each service = { text card, media block } pair. Pairs alternate sides
// down the page (even rows: text left / media right; odd rows: media
// left / text right). media.grid picks the desktop tile grid; each item
// carries a span hint ('lg:col-span-2 lg:row-span-2' etc.) so the
// screenshot tiles form a true bento mosaic, not a uniform grid. On
// mobile the spans collapse and tiles stack full-width. media.items are
// screenshot refs — `src: null` renders an empty browser/phone chrome
// placeholder; drop a path in and the real screenshot renders in the
// same slot (layout never breaks on the swap). Text details are the
// original service copy: promise + description + feature bullets.
export const SERVICES = [
  {
    id: 'web',
    index: '01',
    icon: 'globe',
    title: 'Website Development',
    promise: 'Built within 3 days',
    description:
      'Fast, modern, conversion ready websites engineered to launch in days not months.',
    features: [
      'Landing pages & company sites',
      'E-commerce & booking systems',
      'Performance-first builds',
      'Analytics & SEO foundation',
    ],
    media: {
      grid: 'lg:grid-cols-3 lg:grid-rows-3',
      items: [
        { shape: 'browser', kind: 'hero', src: null, span: 'lg:col-span-2 lg:row-span-2' }, // big wide hero
        { shape: 'browser', kind: 'gallery', src: null, span: '' },
        { shape: 'browser', kind: 'form', src: null, span: '' },
        { shape: 'browser', kind: 'list', src: null, span: '' },
        { shape: 'browser', kind: 'cards', src: null, span: '' },
        { shape: 'browser', kind: 'footer', src: null, span: '' },
      ],
    },
  },
  {
    id: 'software',
    index: '02',
    icon: 'code',
    title: 'Software Development',
    promise: 'Mobile · Web · Custom',
    description:
      'Custom software tailored to your business from mobile apps to web platforms built for scale.',
    features: [
      'Mobile apps (iOS & Android)',
      'Web applications',
      'Custom business software',
      'AI integrations',
    ],
    media: {
      grid: 'lg:grid-cols-4 lg:grid-rows-3',
      items: [
        { shape: 'phone', kind: 'app-home', src: null, span: 'lg:col-span-2 lg:row-span-2' }, // big phone hero
        { shape: 'browser', kind: 'dashboard', src: null, span: '' },
        { shape: 'phone', kind: 'app-list', src: null, span: '' },
        { shape: 'browser', kind: 'code', src: null, span: 'lg:col-span-2' }, // wide web
        { shape: 'phone', kind: 'app-chat', src: null, span: 'lg:col-span-2' }, // wide mobile
        { shape: 'browser', kind: 'kanban', src: null, span: 'lg:col-span-2' }, // wide web
      ],
    },
  },
  {
    id: 'systems',
    index: '03',
    icon: 'layers',
    title: 'Systems & Automation',
    promise: 'Smarter operations',
    description:
      'Integrated business systems and intelligent automation that streamline how you operate.',
    features: [
      'Business process automation',
      'CRM & workflow systems',
      'Data analytics & dashboards',
      'System architecture & strategy',
    ],
    media: {
      grid: 'lg:grid-cols-4 lg:grid-rows-3',
      items: [
        { shape: 'browser', kind: 'dashboard-big', src: null, span: 'lg:col-span-2 lg:row-span-2' }, // big dashboard first
        { shape: 'browser', kind: 'flow', src: null, span: '' },
        { shape: 'browser', kind: 'table', src: null, span: '' },
        { shape: 'browser', kind: 'metrics', src: null, span: 'lg:col-span-2' }, // wide
        { shape: 'browser', kind: 'pipeline', src: null, span: 'lg:col-span-2' }, // wide
        { shape: 'browser', kind: 'integrations', src: null, span: 'lg:col-span-2' }, // wide
      ],
    },
  },
]

// Industry taxonomy for the Work filter. CTO asked for business-owner
// friendly categories (restaurants, hotels, small businesses, …).
export const INDUSTRIES = [
  'Restaurant & Food',
  'Hotel & Hospitality',
  'Retail & Small Business',
  'Logistics & Delivery',
  'Travel',
  'E-commerce',
  'Platform & SaaS',
]

// Real shipped projects + realistic placeholders (demo: true) so the
// grid demonstrates the 20+ scale the CTO asked for. Delete the demo
// entries as real launches replace them.
// featured: true → shown in the 6-card showcase on the home page
// (everything always appears on /projects).
export const PROJECTS = [
  {
    id: 'dory',
    name: 'Dory Delivery',
    industry: 'Logistics & Delivery',
    category: 'Delivery Platform',
    description:
      'Filipino delivery platform food, groceries, essentials, riders, merchants, city operator model.',
    url: 'https://dorydelivery.com/',
    tags: ['Platform', 'Web'],
    featured: true,
  },
  {
    id: 'dmap',
    name: 'DMAP',
    industry: 'Platform & SaaS',
    category: 'Web App',
    description: 'In-house web application by the Inovers team.',
    url: 'https://dmap.inovers.dev/',
    tags: ['Web App'],
    featured: true,
  },
  {
    id: 'whatahotel',
    name: 'WhatAHotel',
    industry: 'Hotel & Hospitality',
    category: 'Mobile App',
    description: 'Hotel management app for WhatAHotel.',
    url: 'https://www.whatahotel.com/',
    tags: ['Mobile', 'Hotel'],
    featured: true,
  },
  {
    id: 'agenxure',
    name: 'Agenxure',
    industry: 'Platform & SaaS',
    category: 'Web Platform',
    description: 'A serious, dedicated platform build by the Inovers team.',
    url: 'https://www.agenxure.com/',
    tags: ['Web', 'Platform'],
    featured: true,
  },
  {
    id: 'ukay',
    name: 'UkayApp',
    industry: 'E-commerce',
    category: 'E-commerce App',
    description: 'E-commerce app for everyone who wants to sell online with live selling.',
    url: null,
    tags: ['Mobile', 'E-commerce', 'Live Selling'],
    featured: true,
  },
  {
    id: 'byahego',
    name: 'ByaheGo',
    industry: 'Travel',
    category: 'Travel System',
    description: 'Hotel, flight and car rental mobile app and web app system.',
    url: null,
    tags: ['Mobile', 'Web', 'Travel'],
    featured: true,
  },
  {
    id: 'dorx',
    name: 'DORX',
    industry: 'Logistics & Delivery',
    category: 'Logistics System',
    description: 'Logistics system built by the Inovers team.',
    url: null,
    tags: ['Logistics', 'System'],
  },
  // ── Demo launches (realistic placeholders — remove as real work lands) ──
  {
    id: 'sizzlepos',
    name: 'Sizzle POS',
    industry: 'Restaurant & Food',
    category: 'POS System',
    description: 'Point-of-sale and kitchen display system for a fast-casual restaurant chain.',
    url: null,
    tags: ['Restaurant', 'POS'],
    demo: true,
  },
  {
    id: 'harana',
    name: 'Harana Catering',
    industry: 'Restaurant & Food',
    category: 'Booking Website',
    description: 'Catering booking site with menu builder, event calendar and confirmations.',
    url: null,
    tags: ['Booking', 'Web'],
    demo: true,
  },
  {
    id: 'kanto',
    name: 'Kanto Bites',
    industry: 'Restaurant & Food',
    category: 'Delivery App',
    description: 'Food delivery app for a local restaurant group with real-time order tracking.',
    url: null,
    tags: ['Mobile', 'Delivery'],
    demo: true,
  },
  {
    id: 'kuwarto',
    name: 'Kuwarto Suites',
    industry: 'Hotel & Hospitality',
    category: 'Booking Platform',
    description: 'Boutique hotel booking platform with room management and channel sync.',
    url: null,
    tags: ['Booking', 'Platform'],
    demo: true,
  },
  {
    id: 'tindahan',
    name: 'Tindahan Hub',
    industry: 'Retail & Small Business',
    category: 'E-commerce Site',
    description: 'Online storefront for a neighborhood chain with local delivery scheduling.',
    url: null,
    tags: ['E-commerce', 'Web'],
    demo: true,
  },
  {
    id: 'agrikoop',
    name: 'AgriKooperatiba',
    industry: 'Retail & Small Business',
    category: 'Inventory System',
    description: 'Cooperative inventory and member-ledger system for farm supply stores.',
    url: null,
    tags: ['Inventory', 'System'],
    demo: true,
  },
  {
    id: 'klinika',
    name: 'Klinika Plus',
    industry: 'Retail & Small Business',
    category: 'Clinic System',
    description: 'Clinic appointment, patient record and billing system for small clinics.',
    url: null,
    tags: ['Healthcare', 'System'],
    demo: true,
  },
  {
    id: 'bayad',
    name: 'BayadNow',
    industry: 'Retail & Small Business',
    category: 'Payments Dashboard',
    description: 'Bill payments kiosk dashboard with receipts and daily settlement reports.',
    url: null,
    tags: ['Payments', 'Dashboard'],
    demo: true,
  },
  {
    id: 'padala',
    name: 'Padala Express',
    industry: 'Logistics & Delivery',
    category: 'Courier App',
    description: 'Courier dispatch and rider-tracking mobile app with proof of delivery.',
    url: null,
    tags: ['Mobile', 'Courier'],
    demo: true,
  },
  {
    id: 'sakayan',
    name: 'Sakayan Ferry',
    industry: 'Travel',
    category: 'Booking System',
    description: 'Ferry ticketing and scheduling system with live seat availability.',
    url: null,
    tags: ['Booking', 'System'],
    demo: true,
  },
  {
    id: 'islawaves',
    name: 'IslaWaves',
    industry: 'Travel',
    category: 'Booking Website',
    description: 'Island tour booking website with packages, guides and online payments.',
    url: null,
    tags: ['Booking', 'Web'],
    demo: true,
  },
  {
    id: 'subasta',
    name: 'Subasta PH',
    industry: 'E-commerce',
    category: 'Auction Platform',
    description: 'Auction marketplace with live bidding and seller escrow.',
    url: null,
    tags: ['Marketplace', 'Platform'],
    demo: true,
  },
  {
    id: 'eskwela',
    name: 'Eskwela LMS',
    industry: 'Platform & SaaS',
    category: 'Learning Platform',
    description: 'Learning management platform for training centers with progress tracking.',
    url: null,
    tags: ['EdTech', 'Platform'],
    demo: true,
  },
  // ── Batch 2 — dummy projects (Mat's call: expand to 60+ total) ──
  {
    id: 'paluto',
    name: 'Paluto Kitchen',
    industry: 'Restaurant & Food',
    category: 'Order Ahead App',
    description: 'Pre-order and pickup app for a carinderia chain with daily menu rotation.',
    url: null,
    tags: ['Mobile', 'Food'],
    demo: true,
  },
  {
    id: 'merienda',
    name: 'Merienda Hub',
    industry: 'Restaurant & Food',
    category: 'Subscription Box',
    description: 'Weekly Filipino snacks subscription platform with curated boxes.',
    url: null,
    tags: ['E-commerce', 'Subscription'],
    demo: true,
  },
  {
    id: 'balikbay',
    name: 'BalikBayan Box',
    industry: 'Logistics & Delivery',
    category: 'Shipping Tracker',
    description: 'Door-to-door balikbayan box tracking and shipping management system.',
    url: null,
    tags: ['Logistics', 'Mobile'],
    demo: true,
  },
  {
    id: 'kargador',
    name: 'Kargador PH',
    industry: 'Logistics & Delivery',
    category: 'Freight Booking',
    description: 'Truck and container booking marketplace for domestic freight.',
    url: null,
    tags: ['Logistics', 'Platform'],
    demo: true,
  },
  {
    id: 'bangka',
    name: 'Bangka Link',
    industry: 'Travel',
    category: 'Ferry Booking',
    description: 'Inter-island bangka and small craft booking app with live weather.',
    url: null,
    tags: ['Travel', 'Mobile'],
    demo: true,
  },
  {
    id: 'pamana',
    name: 'Pamana Tours',
    industry: 'Travel',
    category: 'Heritage Tours',
    description: 'Heritage walking tour booking platform with local guide marketplace.',
    url: null,
    tags: ['Booking', 'Web'],
    demo: true,
  },
  {
    id: 'tricycle',
    name: 'Tricycle Nav',
    industry: 'Travel',
    category: 'Transit Planner',
    description: 'Multi-modal transit planner pooling tricycle, jeepney and bus routes.',
    url: null,
    tags: ['Mobile', 'Maps'],
    demo: true,
  },
  {
    id: 'palengke',
    name: 'Palengke Go',
    industry: 'E-commerce',
    category: 'Wet Market App',
    description: 'Online wet market ordering — fresh produce, meat, seafood, same-day delivery.',
    url: null,
    tags: ['Mobile', 'E-commerce'],
    demo: true,
  },
  {
    id: 'tyangge',
    name: 'Tyangge Hub',
    industry: 'E-commerce',
    category: 'Marketplace',
    description: 'Multi-vendor marketplace for small Philippine sellers with logistics integration.',
    url: null,
    tags: ['Marketplace', 'Platform'],
    demo: true,
  },
  {
    id: 'suki',
    name: 'Suki Club',
    industry: 'E-commerce',
    category: 'Loyalty Platform',
    description: 'Neighbourhood loyalty and rewards platform connecting sari-sari stores online.',
    url: null,
    tags: ['Loyalty', 'Mobile'],
    demo: true,
  },
  {
    id: 'pahinga',
    name: 'Pahinga Stay',
    industry: 'Hotel & Hospitality',
    category: 'Condo Rental',
    description: 'Short-stay condo and vacation rental booking with host verification.',
    url: null,
    tags: ['Booking', 'Platform'],
    demo: true,
  },
  {
    id: 'banquet',
    name: 'Banquet PH',
    industry: 'Hotel & Hospitality',
    category: 'Event Booking',
    description: 'Venue and banquet hall booking with catering add-ons and guest management.',
    url: null,
    tags: ['Booking', 'Web'],
    demo: true,
  },
  {
    id: 'servisyo',
    name: 'Servisyo Hub',
    industry: 'Hotel & Hospitality',
    category: 'Housekeeping App',
    description: 'Housekeeping task scheduler and inventory tracker for hotel chains.',
    url: null,
    tags: ['Mobile', 'Dashboard'],
    demo: true,
  },
  {
    id: 'klase',
    name: 'Klase Hub',
    industry: 'Platform & SaaS',
    category: 'Online School',
    description: 'Virtual classroom platform with attendance, quizzes and parent dashboard.',
    url: null,
    tags: ['EdTech', 'Platform'],
    demo: true,
  },
  {
    id: 'medisina',
    name: 'Medisina PH',
    industry: 'Platform & SaaS',
    category: 'Telehealth App',
    description: 'Telehealth consultation app connecting rural patients with doctors.',
    url: null,
    tags: ['Healthcare', 'Mobile'],
    demo: true,
  },
  {
    id: 'plano',
    name: 'Plano ERP',
    industry: 'Platform & SaaS',
    category: 'ERP System',
    description: 'Lightweight ERP for Philippine SMEs — inventory, payroll, invoicing.',
    url: null,
    tags: ['ERP', 'Dashboard'],
    demo: true,
  },
  {
    id: 'negosyante',
    name: 'Negosyante App',
    industry: 'Platform & SaaS',
    category: 'Business Dashboard',
    description: 'All-in-one SME dashboard — sales, expenses, reminders, growth reports.',
    url: null,
    tags: ['Dashboard', 'Mobile'],
    demo: true,
  },
  {
    id: 'dokumento',
    name: 'Dokumento',
    industry: 'Platform & SaaS',
    category: 'Doc Automation',
    description: 'Government form auto-fill and appointment scheduler for local transactions.',
    url: null,
    tags: ['Automation', 'Web'],
    demo: true,
  },
  {
    id: 'kolekta',
    name: 'Kolekta App',
    industry: 'Retail & Small Business',
    category: 'Collections Tracker',
    description: 'Credit collections tracker for small lending businesses and cooperatives.',
    url: null,
    tags: ['Finance', 'Dashboard'],
    demo: true,
  },
  {
    id: 'timbang',
    name: 'Timbang Scale',
    industry: 'Retail & Small Business',
    category: 'Weighing Kiosk',
    description: 'Digital weighing and pricing kiosk for market stalls and grocery stores.',
    url: null,
    tags: ['Kiosk', 'System'],
    demo: true,
  },
  {
    id: 'resibo',
    name: 'Resibo Cloud',
    industry: 'Retail & Small Business',
    category: 'POS Receipts',
    description: 'Cloud receipt printer and daily sales recorder for small stores.',
    url: null,
    tags: ['Cloud', 'POS'],
    demo: true,
  },
  {
    id: 'halo',
    name: 'Halo Halo POS',
    industry: 'Retail & Small Business',
    category: 'Cloud POS',
    description: 'Cloud POS with offline mode for sari-sari stores and carinderias.',
    url: null,
    tags: ['POS', 'Cloud'],
    demo: true,
  },
  {
    id: 'binhi',
    name: 'Binhi Farms',
    industry: 'Retail & Small Business',
    category: 'Farm Manager',
    description: 'Farm management app with crop tracking, input logging and yield forecasting.',
    url: null,
    tags: ['AgriTech', 'Mobile'],
    demo: true,
  },
  {
    id: 'silid',
    name: 'Silid Books',
    industry: 'Retail & Small Business',
    category: 'Library System',
    description: 'Digital library catalog and lending system for community libraries.',
    url: null,
    tags: ['Library', 'Web'],
    demo: true,
  },
  {
    id: 'kawani',
    name: 'Kawani HR',
    industry: 'Platform & SaaS',
    category: 'HR System',
    description: 'HR and attendance system with biometric integration for mid-sized firms.',
    url: null,
    tags: ['HR', 'Dashboard'],
    demo: true,
  },
  {
    id: 'sangla',
    name: 'Sangla Track',
    industry: 'Retail & Small Business',
    category: 'Pawn System',
    description: 'Pawnshop inventory, valuation and customer ledger management system.',
    url: null,
    tags: ['Finance', 'System'],
    demo: true,
  },
  {
    id: 'padyak',
    name: 'Padyak Express',
    industry: 'Logistics & Delivery',
    category: 'Last Mile App',
    description: 'Bicycle last-mile delivery fleet app with live rider GPS and job queue.',
    url: null,
    tags: ['Mobile', 'Delivery'],
    demo: true,
  },
  {
    id: 'bigasan',
    name: 'Bigasan Go',
    industry: 'E-commerce',
    category: 'Rice Delivery',
    description: 'Rice and staple goods delivery app sourced direct from farmers.',
    url: null,
    tags: ['E-commerce', 'Mobile'],
    demo: true,
  },
  {
    id: 'bulilit',
    name: 'Bulilit Care',
    industry: 'Platform & SaaS',
    category: 'Childcare App',
    description: 'Daycare management and parent communication app for childcare centres.',
    url: null,
    tags: ['Mobile', 'Dashboard'],
    demo: true,
  },
  {
    id: 'artista',
    name: 'Artista PH',
    industry: 'Platform & SaaS',
    category: 'Creator Platform',
    description: 'Creator monetisation platform for Filipino artists with commission tools.',
    url: null,
    tags: ['Marketplace', 'Platform'],
    demo: true,
  },
  {
    id: 'guro',
    name: 'Guro Connect',
    industry: 'Platform & SaaS',
    category: 'Tutor Platform',
    description: 'Tutor matching and virtual whiteboard platform with scheduled sessions.',
    url: null,
    tags: ['EdTech', 'Web'],
    demo: true,
  },
  {
    id: 'luto',
    name: 'Luto PH',
    industry: 'Restaurant & Food',
    category: 'Recipe Platform',
    description: 'Filipino recipe sharing and meal planner with ingredient delivery.',
    url: null,
    tags: ['Community', 'Web'],
    demo: true,
  },
  {
    id: 'tinda',
    name: 'Tinda Lokal',
    industry: 'E-commerce',
    category: 'Local Market',
    description: 'Hyper-local online marketplace for barangay-level storefronts.',
    url: null,
    tags: ['E-commerce', 'Mobile'],
    demo: true,
  },
  {
    id: 'balita',
    name: 'Balita Barangay',
    industry: 'Platform & SaaS',
    category: 'Community News',
    description: 'Barangay news and bulletin board app with event posting and surveys.',
    url: null,
    tags: ['Community', 'Mobile'],
    demo: true,
  },
  {
    id: 'barko',
    name: 'Barko Logistics',
    industry: 'Logistics & Delivery',
    category: 'Cargo Shipping',
    description: 'Inter-island cargo shipping booking and container tracking system.',
    url: null,
    tags: ['Logistics', 'Dashboard'],
    demo: true,
  },
  {
    id: 'tiket',
    name: 'Tiket Lokal',
    industry: 'Travel',
    category: 'Event Tickets',
    description: 'Event ticketing platform for small venues with seat maps and QR entry.',
    url: null,
    tags: ['Ticketing', 'Platform'],
    demo: true,
  },
  {
    id: 'saklolo',
    name: 'Saklolo App',
    industry: 'Platform & SaaS',
    category: 'Emergency Response',
    description: 'Community emergency alert and first-responder dispatch mobile app.',
    url: null,
    tags: ['Mobile', 'Dashboard'],
    demo: true,
  },
  {
    id: 'kapatid',
    name: 'Kapatid Connect',
    industry: 'Platform & SaaS',
    category: 'OFW Platform',
    description: 'OFW family communication and remittance tracking unified dashboard.',
    url: null,
    tags: ['Platform', 'Mobile'],
    demo: true,
  },
  {
    id: 'bisikleta',
    name: 'Bisikleta Hub',
    industry: 'Retail & Small Business',
    category: 'Bike Shop App',
    description: 'Bike repair booking and spare parts marketplace with service tracker.',
    url: null,
    tags: ['Mobile', 'Dashboard'],
    demo: true,
  },
  {
    id: 'taniman',
    name: 'Taniman Cloud',
    industry: 'Retail & Small Business',
    category: 'Agri Dashboard',
    description: 'Cloud dashboard for small farms — soil, water, pest and harvest logs.',
    url: null,
    tags: ['AgriTech', 'Dashboard'],
    demo: true,
  },
  {
    id: 'kultura',
    name: 'Kultura PH',
    industry: 'E-commerce',
    category: 'Handicraft Shop',
    description: 'Artisan handicraft marketplace connecting indigenous weavers to buyers.',
    url: null,
    tags: ['Marketplace', 'Web'],
    demo: true,
  },
  {
    id: 'pista',
    name: 'Pista Planner',
    industry: 'Hotel & Hospitality',
    category: 'Fiesta Booking',
    description: 'Fiesta and town festival booking platform with vendor and stage management.',
    url: null,
    tags: ['Booking', 'Platform'],
    demo: true,
  },
  {
    id: 'uling',
    name: 'Uling POS',
    industry: 'Restaurant & Food',
    category: 'BBQ Kiosk',
    description: 'Minimalist touch POS for ihawan and street-food stalls with QR ordering.',
    url: null,
    tags: ['POS', 'Kiosk'],
    demo: true,
  },
]

// ─── Organizational chart (About orbit) — generic roles so real names
// can be dropped in later. CEO/CTO confirmed: keep editable here. ───
export const ORG_CHART = {
  core: { title: 'Inovers', subtitle: 'Tech Solutions' },
  rings: [
    {
      label: 'Leadership',
      roles: [
        { id: 'ceo', icon: 'crown', title: 'CEO', description: 'Vision & direction' },
        { id: 'cto', icon: 'chip', title: 'CTO', description: 'Engineering & delivery' },
      ],
    },
    {
      label: 'Teams',
      roles: [
        { id: 'eng', icon: 'code', title: 'Engineering', description: 'Web · Mobile · Systems' },
        { id: 'design', icon: 'pen', title: 'Design', description: 'UI/UX & brand' },
        { id: 'qa', icon: 'shield', title: 'QA', description: 'Validation & quality' },
        { id: 'product', icon: 'users', title: 'Product', description: 'Planning & delivery' },
      ],
    },
  ],
}

// ─── /crew — department taxonomy, derived from ORG_CHART ───
// Never hand-type a second taxonomy: the filter chips on /crew and the
// medallions on the orbital chart read from the same source, so they
// cannot drift apart. Ring 0 (Leadership) collapses to its ring LABEL —
// its roles are individual seats (CEO, CTO), too narrow to be useful
// filters — while ring 1's role titles are the real team departments.
// Yields: Leadership · Engineering · Design · QA · Product.
export const DEPARTMENTS = [
  ORG_CHART.rings[0].label,
  ...ORG_CHART.rings[1].roles.map((r) => r.title),
]

// ─── Crew — PLACEHOLDER people (content honesty, Mat's call 2026-08-10) ───
// These are NOT real employees and must never read as any. Real names,
// photos and bios are pending from the CEO/CTO. Every entry is named after
// the SEAT, not after an invented human, so nothing here can be mistaken
// for a person who doesn't exist — the same rule TESTIMONIALS follows.
// `demo: true` is what raises the visible ribbon above the grid.
//
// Going live (plan §7) is a pure data swap, no component change:
//   1. set `photo` to a real image path — CrewCard branches on its
//      truthiness and renders an <img> instead of the initials disc;
//   2. swap `name` / `role` / `bio` to the real values;
//   3. flip `demo` to false — ALL of them or none. A partial swap keeps
//      demo:true everywhere and the ribbon stays up (same all-or-nothing
//      honesty rule as TESTIMONIALS_META.status).
export const CREW = [
  {
    id: 'lead-ceo',
    name: 'Crew Lead — CEO',
    role: 'Chief Executive Officer',
    department: 'Leadership',
    initials: 'CEO',
    avatar: 'ember',
    bio: 'Sets direction and keeps every mission aligned to the client’s goals.',
    photo: null,
    demo: true,
  },
  {
    id: 'lead-cto',
    name: 'Flight Director — CTO',
    role: 'Chief Technology Officer',
    department: 'Leadership',
    initials: 'CTO',
    avatar: 'amber',
    bio: 'Owns the technical call on every build — architecture, stack, and delivery.',
    photo: null,
    demo: true,
  },
  {
    id: 'eng-web',
    name: 'Engineer — Web',
    role: 'Full-Stack Web Engineer',
    department: 'Engineering',
    initials: 'WEB',
    avatar: 'blue',
    bio: 'Builds the sites and dashboards clients live in every day.',
    photo: null,
    demo: true,
  },
  {
    id: 'eng-mobile',
    name: 'Engineer — Mobile',
    role: 'Mobile Engineer',
    department: 'Engineering',
    initials: 'MOB',
    avatar: 'teal',
    bio: 'Ships the iOS and Android side of a product, tested on real devices.',
    photo: null,
    demo: true,
  },
  {
    id: 'eng-systems',
    name: 'Engineer — Systems',
    role: 'Systems & Integrations Engineer',
    department: 'Engineering',
    initials: 'SYS',
    avatar: 'violet',
    bio: 'Wires the back office together — APIs, data, and everything between them.',
    photo: null,
    demo: true,
  },
  {
    id: 'design-product',
    name: 'Designer — Product',
    role: 'Product & UI Designer',
    department: 'Design',
    initials: 'UI',
    avatar: 'sky',
    bio: 'Turns scope into screens people can use without a manual.',
    photo: null,
    demo: true,
  },
  {
    id: 'design-brand',
    name: 'Designer — Brand',
    role: 'Brand & Visual Designer',
    department: 'Design',
    initials: 'BR',
    avatar: 'violet',
    bio: 'Keeps every launch looking like it belongs to the same company.',
    photo: null,
    demo: true,
  },
  {
    id: 'qa-functional',
    name: 'QA — Functional',
    role: 'QA Engineer',
    department: 'QA',
    initials: 'QA',
    avatar: 'teal',
    bio: 'Breaks the build on purpose so the client never has to.',
    photo: null,
    demo: true,
  },
  {
    id: 'qa-release',
    name: 'QA — Release',
    role: 'Release & Regression QA',
    department: 'QA',
    initials: 'REL',
    avatar: 'amber',
    bio: 'Guards the last mile — regression passes and the go/no-go before launch.',
    photo: null,
    demo: true,
  },
  {
    id: 'product-delivery',
    name: 'Product Lead — Delivery',
    role: 'Product & Delivery Lead',
    department: 'Product',
    initials: 'PD',
    avatar: 'ember',
    bio: 'Holds scope, schedule, and the weekly checkpoint the client actually sees.',
    photo: null,
    demo: true,
  },
]

// ─── /crew — page shell copy (PageHero + orbit band + grid + CTA) ───
// Every string /crew renders lives here; CrewPage/CrewCard hold none.
export const CREW_PAGE = {
  eyebrow: 'The Crew',
  heading: 'The people flying the mission',
  headingAccent: 'flying the mission',
  lede: 'Every launch has a crew behind it. Meet the people who scope, design, build, and ship what Inovers delivers.',
  // Raised automatically while any CREW entry carries demo:true.
  demoRibbon: 'Sample crew — placeholder roles while we collect real names and photos',
  allLabel: 'All',
  filterLabel: 'Filter crew by department',
  counterNoun: 'crew',
  emptyState: 'No crew in this department yet.',
  orbit: {
    eyebrow: 'Mission structure',
    caption:
      'Leadership at the centre, teams in orbit — how a build is staffed from the first call to launch day.',
  },
  // Compact teaser that replaced the orbit in the home About section.
  teaser: {
    eyebrow: 'The crew',
    line: 'Leadership, engineering, design, QA, and product — one team, no hand-offs, no account managers in between.',
    link: 'Meet the full crew',
    to: '/crew',
  },
  cta: {
    heading: 'Want this crew on',
    accent: 'your next mission?',
    sub: 'Book a free call and tell us what you’re building.',
    secondary: { label: 'See our work', to: '/projects' },
  },
}

export const PROCESS = [
  {
    step: '01',
    title: 'Discover',
    description:
      'We dig into your goals, users, and constraints a free consultation to scope exactly what you need.',
  },
  {
    step: '02',
    title: 'Design',
    description:
      'High fidelity design crafted around your brand  interfaces people actually enjoy using.',
  },
  {
    step: '03',
    title: 'Build',
    description:
      'Rapid, clean development. Websites in 3 days. Complex systems shipped in weeks, not months.',
  },
  {
    step: '04',
    title: 'Launch & Grow',
    description:
      'Deploy, monitor, and iterate. We stay with you beyond launch to keep your product sharp.',
  },
]

// ─── /projects — page shell copy (PageHero + closing CTA) ───
export const PROJECTS_PAGE = {
  eyebrow: 'Our Work',
  heading: 'All missions launched',
  headingAccent: 'launched',
  lede: "The full fleet — every project we've shipped, from restaurant systems to hotel platforms. Filter by industry to find the work that fits your business.",
  cta: {
    heading: "Like what you see? Let's launch",
    accent: 'your mission next.',
    sub: 'A free 30-minute call — your goals, our playbook, zero commitment.',
    // Cross-link so /projects and /crew stay one hop from each other.
    secondary: { label: 'Meet the crew', to: '/crew' },
  },
}

export const CONTACT = {
  heading: "Let's build something together",
  subheading:
    'Tell us about your project — a free call or a live chat, your choice. No commitment required.',
  callWhy: [
    'Get immediate expert feedback on your ideas',
    'Detailed discussion of project requirements',
    'Personalized recommendations for your business',
    'No commitment required completely free!',
  ],
  // The contact chat feature Mat's co-developer is building (replaces
  // the old email form, Mat's call 2026-08-11). It's an API; this block
  // is the wiring point: set `url` (or endpoint + auth once the spec is
  // shared) and the contact card goes live. Empty url → the card shows
  // a disabled "coming soon" state. Label is deliberately generic —
  // the internal name "Vibs" is not client-facing (Mat's call).
  vibs: {
    label: 'Live chat',
    heading: 'Message us',
    url: '', // co-developer's link/endpoint — paste when shared
    blurb:
      'Chat with the crew in real time — the fastest way to get answers about your project.',
  },
}

export const FOOTER = {
  blurb:
    'Custom software, systems, and technology solutions — helping your business thrive in the digital age.',
  copyright: '© 2024 Inovers. All rights reserved.',
}

// ─── Pricing — two tiers (Mat's call 2026-08-11): ₱599 "as low as"
// starter + Customize for tailored quotes. Feature lists are EDITABLE
// placeholders — confirm the exact inclusions with the CTO before
// launch (don't invent promises the team can't keep).
export const PRICING = {
  eyebrow: 'Pricing',
  heading: 'Simple pricing,',
  headingAccent: 'built for your goals',
  sub: 'Start with the essentials or get a fully tailored plan — no hidden fees, no surprises.',
  plans: [
    {
      id: 'starter',
      name: 'Starter',
      tagline: 'as low as',
      price: '599',
      currency: '₱',
      cadence: '/mo',
      badge: 'Most popular',
      features: [
        'Landing page or simple website',
        'Mobile-ready, responsive design',
        'Fast delivery turnaround',
        'Deployed & live',
      ],
      cta: 'Book a call',
    },
    {
      id: 'custom',
      name: 'Customize',
      tagline: 'Tailored to you',
      price: null,
      badge: 'Premium',
      features: [
        'Custom scope & features',
        'Complex systems & integrations',
        'Dedicated squad, end-to-end delivery',
        'Support beyond launch',
      ],
      cta: 'Let’s talk',
    },
  ],
}

// ─── Why Inovers — comparison deck + standards (home section) ───
// Compare rows are index-matched: row N of "us" answers row N of "them",
// so the two columns line up claim-for-claim on desktop.
export const WHY = {
  eyebrow: 'Why Inovers',
  heading: 'Why crews fly with Inovers',
  headingAccent: 'Inovers',
  lede:
    'Two ways to ship software. One keeps you close to the work. The other keeps you waiting.',
  compare: {
    usLabel: 'Inovers',
    themLabel: 'Typical agencies',
    // Full v4 content — Mat's call (2026-08-10): the complete 8-item
    // comparison, index-matched so the columns answer claim-for-claim.
    rows: [
      { us: 'You work with the people who build', them: 'Account managers between you and the work' },
      { us: 'No account managers, no hand-offs', them: 'Hand-offs into silence' },
      { us: 'Working checkpoints, not a black box', them: 'Progress hidden until the big reveal' },
      { us: 'Focused launches in as little as 3 days', them: 'Months of process for weeks of work' },
      { us: 'Design and engineering move together', them: 'Design and engineering in separate silos' },
      { us: 'Clear scope before code begins', them: 'Scope creep without a shared plan' },
      { us: 'Cross-border collaboration built in', them: 'Layers of people you never meet' },
      { us: 'Visible progress at every step', them: 'Theatre over forward motion' },
    ],
  },
  standards: {
    eyebrow: 'How we work',
    heading: 'The standards we hold.',
  },
}

// ─── Testimonials — crew transmissions (home section) ───
// Content honesty (plan §6): REAL quotes from named, consenting clients
// are still pending from the CEO/CTO. These six are DUMMY entries (Mat's
// call, 2026-08-10) — demo:true so the page renders a visible
// "Sample stories — real client words coming soon" ribbon, never passing as
// real endorsements. Swap this array for real quotes when they land.
// `status: 'live'` + a real average/source turns the demo ribbon off.
export const TESTIMONIALS_META = {
  status: 'pending', // 'pending' | 'live'
  average: null, // e.g. 4.9 — ONLY with a real source
  count: null, // e.g. 50
  source: null, // e.g. 'Google Reviews' — required if average is set
}

export const TESTIMONIALS = [
  {
    id: 'juan',
    quote:
      'We went from a messy manual workflow to a system our team actually uses every day. Direct communication, no layers, real results.',
    name: 'Juan Ramos',
    role: 'Operations Head',
    company: 'Logistics',
    initials: 'JR',
    avatar: 'ember',
    rating: 5,
    demo: true,
  },
  {
    id: 'mia',
    quote:
      'The launch was fast, but what stood out was the clarity. We always knew what was being built and why. Exactly the partner we needed.',
    name: 'Mia Cruz',
    role: 'Founder',
    company: 'Commerce Startup',
    initials: 'MC',
    avatar: 'violet',
    rating: 5,
    demo: true,
  },
  {
    id: 'david',
    quote:
      'Working across borders felt seamless. Clear checkpoints, honest updates, and software that shipped on schedule. Highly recommended.',
    name: 'David Santos',
    role: 'Product Lead',
    company: 'Travel',
    initials: 'DS',
    avatar: 'teal',
    rating: 5,
    demo: true,
  },
  {
    id: 'anna',
    quote:
      'They turned a rough idea into a product our customers love. Weekly working demos meant no surprises — just steady progress.',
    name: 'Anna Torres',
    role: 'CEO',
    company: 'Delivery Platform',
    initials: 'AT',
    avatar: 'blue',
    rating: 5,
    demo: true,
  },
  {
    id: 'karla',
    quote:
      'The AI integration they built actually saves our team hours every week. Practical, well-guarded, and exactly what we asked for.',
    name: 'Karla Perez',
    role: 'COO',
    company: 'Business Services',
    initials: 'KP',
    avatar: 'amber',
    rating: 5,
    demo: true,
  },
  {
    id: 'marco',
    quote:
      'From first conversation to launch, it felt like one team. Fast, honest, and the app performs beautifully on real devices.',
    name: 'Marco Lim',
    role: 'Founder',
    company: 'Hospitality App',
    initials: 'ML',
    avatar: 'sky',
    rating: 5,
    demo: true,
  },
]

// Section copy — holds the shell even while the grid is empty.
export const TESTIMONIALS_PAGE = {
  eyebrow: 'What clients say',
  heading: "Signals from the crews we've flown with",
  headingAccent: "crews we've flown with",
  lede: 'Real words from teams who traded silence and hand-offs for a direct line to the people building their product.',
  holdNote: "We're gathering real words from the crews we've flown with — they'll appear here as they come in.",
  holdHeading: 'Transmissions incoming',
  demoRibbon: 'A Glimpse of What’s to Come',
}
