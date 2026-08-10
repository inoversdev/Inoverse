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

export const NAV_LINKS = [
  { label: 'Services', kind: 'anchor', target: 'services' },
  { label: 'Work', kind: 'anchor', target: 'work' },
  { label: 'Why Inovers', kind: 'route', to: '/why-inovers' },
  { label: 'Testimonials', kind: 'route', to: '/testimonials' },
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
  cta: 'Work With Us',
  ctaSecondary: 'Book a free call',
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
        { shape: 'browser', src: null, span: 'lg:col-span-2 lg:row-span-2' }, // big wide hero
        { shape: 'browser', src: null, span: '' },
        { shape: 'browser', src: null, span: '' },
        { shape: 'browser', src: null, span: '' },
        { shape: 'browser', src: null, span: '' },
        { shape: 'browser', src: null, span: '' },
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
        { shape: 'phone', src: null, span: 'lg:col-span-2 lg:row-span-2' }, // big phone hero
        { shape: 'browser', src: null, span: '' },
        { shape: 'phone', src: null, span: '' },
        { shape: 'browser', src: null, span: 'lg:col-span-2' }, // wide web
        { shape: 'phone', src: null, span: 'lg:col-span-2' }, // wide mobile
        { shape: 'browser', src: null, span: 'lg:col-span-2' }, // wide web
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
        { shape: 'browser', src: null, span: 'lg:col-span-2 lg:row-span-2' }, // big dashboard first
        { shape: 'browser', src: null, span: '' },
        { shape: 'browser', src: null, span: '' },
        { shape: 'browser', src: null, span: 'lg:col-span-2' }, // wide
        { shape: 'browser', src: null, span: 'lg:col-span-2' }, // wide
        { shape: 'browser', src: null, span: 'lg:col-span-2' }, // wide
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
    secondary: { label: 'Read what clients say →', to: '/testimonials' },
  },
}

export const CONTACT = {
  heading: "Let's build something together",
  subheading:
    'Tell us about your project a call or an email, your choice. No commitment required.',
  callWhy: [
    'Get immediate expert feedback on your ideas',
    'Detailed discussion of project requirements',
    'Personalized recommendations for your business',
    'No commitment required completely free!',
  ],
  emailWhy: [
    'Brief description of your project',
    'Your goals and timeline',
    'Any specific requirements or preferences',
    'Your budget range (if available)',
  ],
  mailtoHref:
    'mailto:inovers.dev@gmail.com?subject=Project%20Inquiry&body=Hi%20Inovers%20team,%0D%0A%0D%0AI%27m%20interested%20in%20discussing%20a%20project%20with%20you.%0D%0A%0D%0AProject%20Details:%0D%0A-%20%0D%0A%0D%0ABest%20regards,',
  // Web3Forms access key — paste it here to enable true API delivery.
  // Empty → the contact form falls back to the pre-filled Gmail compose
  // flow (the same behavior the old inovers.vercel.app used).
  formAccessKey: '',
}

export const FOOTER = {
  blurb:
    'Custom software, systems, and technology solutions — helping your business thrive in the digital age.',
  copyright: '© 2024 Inovers. All rights reserved.',
}

// ─── /why-inovers — comparison deck + standards ───
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
    rows: [
      { us: 'You work with the people who build', them: 'Account managers between you and the work' },
      { us: 'Working checkpoints, not a black box', them: 'Progress hidden until the big reveal' },
      { us: 'Focused launches in as little as 3 days', them: 'Months of process for weeks of work' },
      { us: 'Design and engineering move together', them: 'Design and engineering in separate silos' },
      { us: 'Clear scope before code begins', them: 'Scope creep without a shared plan' },
    ],
  },
  standards: {
    eyebrow: 'How we work',
    heading: 'The standards we hold.',
  },
  cta: {
    heading: "Like what you see? Let's launch",
    accent: 'your mission next.',
    sub: 'A free 30-minute call — your goals, our playbook, zero commitment.',
    secondary: { label: 'Read what clients say →', to: '/testimonials' },
  },
}

// ─── /testimonials — crew transmissions ───
// Content honesty (plan §6): REAL quotes from named, consenting clients
// are still pending from the CEO/CTO. These six are DUMMY entries (Mat's
// call, 2026-08-10) — demo:true so the page renders a visible
// "Sample layout — awaiting client sign-off" ribbon, never passing as
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

// Page copy — holds the /testimonials shell even while the grid is empty.
export const TESTIMONIALS_PAGE = {
  eyebrow: 'What clients say',
  heading: "Signals from the crews we've flown with",
  headingAccent: "crews we've flown with",
  lede: 'Real words from teams who traded silence and hand-offs for a direct line to the people building their product.',
  holdNote: "We're gathering real words from the crews we've flown with — they'll appear here as they come in.",
  holdHeading: 'Transmissions incoming',
  demoRibbon: 'Sample layout — awaiting client sign-off',
  cta: {
    heading: 'Ready to be the next',
    accent: 'mission we launch?',
    sub: 'A free 30-minute call — your goals, our playbook, zero commitment.',
    secondary: { label: 'See why crews choose us →', to: '/why-inovers' },
  },
}
