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
  { label: 'Selected works', kind: 'route', to: '/projects' },
]

export const HERO = {
  eyebrow: 'Custom software · Web · Mobile · AI',
  titleA: 'Innovating the',
  titleHighlight: 'Future',
  titleB: 'Together.',
  subtitle:
    'Custom software, systems, and technology solutions to help your business thrive in the digital age.',
  ctaPrimary: 'Get Started',
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
        {
          shape: 'browser',
          kind: 'gallery',
          src: null,
          span: '',
          images: [
            '/services/web-gallery-1.webp',
            '/services/web-gallery-2.webp',
            '/services/web-gallery-3.webp',
            '/services/web-gallery-4.webp',
          ],
        },
        { shape: 'browser', kind: 'form', src: null, span: '' },
        { shape: 'browser', kind: 'list', src: null, span: '' },
        {
          shape: 'browser',
          kind: 'cards',
          src: null,
          span: '',
          images: ['/services/web-cards-1.webp', '/services/web-cards-2.webp'],
        },
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
// Retail & Small Business and Travel were removed 2026-08-17 when the
// roster shrank to the 14 image-backed projects — no project maps to
// either chip anymore (ByaheGo reclassified under Hotel & Hospitality:
// it books hotels, flights and cars).
export const INDUSTRIES = [
  'Restaurant & Food',
  'Hotel & Hospitality',
  'Logistics & Delivery',
  'E-commerce',
  'Platform & SaaS',
]

// ─── Work manifest — 14 projects, all with generated logo images ───
// Mat + CTO call (2026-08-17): the roster was cut from 33 down to the
// projects that have brand images (7 real + 7 concept launches). Every
// name is believable and was web-screened for real-site collisions — no
// generic/cringe names, no demo/concept labels anywhere.
// featured: true → shown on the home Work showcase. Home mirrors this
// exact list — one source of truth, no separate "taste" subset.
export const PROJECTS = [{
    id: 'dory',
    image: '/projects/dory.webp',
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
    image: '/projects/dmap.webp',
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
    image: '/projects/whatahotel.webp',
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
    image: '/projects/agenxure.webp',
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
    image: '/projects/ukay.webp',
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
    image: '/projects/byahego.webp',
    name: 'ByaheGo',
    industry: 'Hotel & Hospitality',
    category: 'Travel & Stay System',
    description: 'Hotel, flight and car rental mobile app and web app system.',
    url: null,
    tags: ['Hotel', 'Travel', 'Booking'],
    featured: true,
  },
{
    id: 'dorx',
    image: '/projects/dorx.webp',
    name: 'DORX',
    industry: 'Logistics & Delivery',
    category: 'Logistics System',
    description: 'Logistics system built by the Inovers team.',
    url: null,
    tags: ['Logistics', 'System'],
    featured: true,
  },
{
    id: 'kanto',
    image: '/projects/kanto.webp',
    name: 'Kanto Bites',
    industry: 'Restaurant & Food',
    category: 'Delivery App',
    description: 'Food delivery app for a local restaurant group with real-time order tracking.',
    url: null,
    tags: ['Mobile', 'Delivery'],
    featured: true,
  },
{
    id: 'silog',
    image: '/projects/silog.webp',
    name: 'Silog Express',
    industry: 'Restaurant & Food',
    category: 'Delivery App',
    description: 'Breakfast delivery app — silog meals from partner carinderias, ordered ahead for pickup or delivery.',
    url: null,
    tags: ['Mobile', 'Food', 'Delivery'],
    featured: true,
  },
{
    id: 'sundo',
    image: '/projects/sundo.webp',
    name: 'Sundo Express',
    industry: 'Logistics & Delivery',
    category: 'On-Demand Courier',
    description: 'On-demand pickup and parcel delivery — book a rider in minutes with live tracking and cash or card payment.',
    url: null,
    tags: ['Courier', 'On-Demand', 'Tracking'],
    featured: true,
  },
{
    id: 'padala',
    image: '/projects/padala.webp',
    name: 'Padala PH',
    industry: 'Logistics & Delivery',
    category: 'Remittance & Parcel',
    description: 'Remittance and small-parcel service for families — send cash and balikbayan-style packages from one app.',
    url: null,
    tags: ['Remittance', 'Parcel', 'Mobile'],
    featured: true,
  },
{
    id: 'tatay',
    image: '/projects/tatay.webp',
    name: "Tatay's Ihawan",
    industry: 'Restaurant & Food',
    category: 'Grill House Booking',
    description: 'Neighborhood grill house with online orders, reservation slots and family platters made for sharing.',
    url: null,
    tags: ['Restaurant', 'Grill', 'Reservations'],
    featured: true,
  },
{
    id: 'casa',
    image: '/projects/casa.webp',
    name: 'Casa Isabella',
    industry: 'Hotel & Hospitality',
    category: 'Heritage Hotel',
    description: 'Heritage hotel booking with restored interiors, curated tours and an in-house restaurant reservation system.',
    url: null,
    tags: ['Hotel', 'Heritage', 'Booking'],
    featured: true,
  },
{
    id: 'palengke',
    image: '/projects/palengke.webp',
    name: 'Palengke Go',
    industry: 'E-commerce',
    category: 'Marketplace',
    description: 'Fresh-market e-commerce — order from trusted palengke vendors and get produce delivered the same day.',
    url: null,
    tags: ['Marketplace', 'Groceries', 'Fresh'],
    featured: true,
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
        { id: 'sales', icon: 'users', title: 'Sales', description: 'Client partnerships' },
        { id: 'finance', icon: 'coin', title: 'Finance', description: 'Budget & reporting' },
        { id: 'hr', icon: 'heart', title: 'HR', description: 'People & culture' },
        { id: 'qa', icon: 'shield', title: 'QA', description: 'Validation & quality' },
      ],
    },
  ],
}

// ─── /crew — department taxonomy, derived from ORG_CHART ───
// Never hand-type a second taxonomy: the filter chips on /crew and the
// medallions on the orbital chart read from the same source, so they
// cannot drift apart. Ring 1 (Teams) provides the filterable
// departments — Leadership stays visible on the orbit as the core ring
// but is not a chip (no individual leadership seats in the roster yet).
// Yields: Engineering · Sales · Finance · HR · QA.
export const DEPARTMENTS = ORG_CHART.rings[1].roles.map((r) => r.title)

// ─── Crew — REAL roster (Mat's call 2026-08-17) ───
// Actual team members: Finance, HR, Sales, Engineering, QA. Photos are
// still pending (CEO/CTO) — CrewCard branches on `photo` truthiness and
// renders an initials disc until real images land. `demo: false`
// everywhere: the "sample crew" ribbon is off; this is the live roster.
export const CREW = [
  // Finance
  {
    id: 'fin-sharei',
    name: 'Sharei Turqueza',
    role: 'Finance',
    department: 'Finance',
    initials: 'ST',
    avatar: 'amber',
    bio: 'Keeps the books clean and every mission funded.',
    photo: null,
    demo: false,
  },
  // Human Resources
  {
    id: 'hr-leah',
    name: 'Leah Collado',
    role: 'HR Officer',
    department: 'HR',
    initials: 'LC',
    avatar: 'violet',
    bio: 'Looks after the people behind every launch.',
    photo: null,
    demo: false,
  },
  // Sales Representatives
  {
    id: 'sales-kassandra',
    name: 'Kassandra Mae Padrones',
    role: 'Sales Representative',
    department: 'Sales',
    initials: 'KP',
    avatar: 'teal',
    bio: 'Finds the missions and opens the first conversation.',
    photo: '/crew/sales-kassandra.webp',
    demo: false,
  },
  {
    id: 'sales-victoria',
    name: 'Victoria Ann Reyes',
    role: 'Sales Representative',
    department: 'Sales',
    initials: 'VR',
    avatar: 'sky',
    bio: 'Guides prospects from first call to signed scope.',
    photo: '/crew/sales-victoria.webp',
    demo: false,
  },
  {
    id: 'sales-vanessa',
    name: 'Vanessa Marie Cristobal',
    role: 'Sales Representative',
    department: 'Sales',
    initials: 'VC',
    avatar: 'blue',
    bio: 'Builds the pipeline and keeps clients close.',
    photo: '/crew/sales-vanessa.webp',
    demo: false,
  },
  {
    id: 'sales-geceline',
    name: 'Geceline Mallari',
    role: 'Sales Representative',
    department: 'Sales',
    initials: 'GM',
    avatar: 'ember',
    bio: 'Turns inquiries into kickoff calls.',
    photo: '/crew/sales-geceline.webp',
    demo: false,
  },
  // Junior Software Engineers
  {
    id: 'eng-noriel',
    name: 'Noriel John D. Vidal',
    role: 'Jr. Software Engineer',
    department: 'Engineering',
    initials: 'NV',
    avatar: 'ember',
    bio: 'Builds and ships web features end to end.',
    photo: '/crew/eng-noriel.webp',
    demo: false,
  },
  {
    id: 'eng-graciano',
    name: 'Graciano Bernabe T. Asuncion III',
    role: 'Jr. Software Engineer',
    department: 'Engineering',
    initials: 'GA',
    avatar: 'amber',
    bio: 'Crafts clean interfaces and APIs.',
    photo: '/crew/eng-graciano.webp',
    demo: false,
  },
  {
    id: 'eng-joseph',
    name: 'Joseph Baltazar Jr.',
    role: 'Jr. Software Engineer',
    department: 'Engineering',
    initials: 'JB',
    avatar: 'violet',
    bio: 'Implements features with care for detail.',
    photo: '/crew/eng-joseph.webp',
    demo: false,
  },
  {
    id: 'eng-johndenver',
    name: 'John Denver C. Cando',
    role: 'Jr. Software Engineer',
    department: 'Engineering',
    initials: 'JC',
    avatar: 'teal',
    bio: 'Turns requirements into working software.',
    photo: '/crew/eng-johndenver.webp',
    demo: false,
  },
  {
    id: 'eng-rodel',
    name: 'Rodel D. Libed',
    role: 'Jr. Software Engineer',
    department: 'Engineering',
    initials: 'RL',
    avatar: 'sky',
    bio: 'Ships reliable, maintainable code.',
    photo: '/crew/eng-rodel.webp',
    demo: false,
  },
  {
    id: 'eng-jexter',
    name: 'Jexter Tomas',
    role: 'Jr. Software Engineer',
    department: 'Engineering',
    initials: 'JT',
    avatar: 'blue',
    bio: 'Builds across the stack, front to back.',
    photo: '/crew/eng-jexter.webp',
    demo: false,
  },
  {
    id: 'eng-christian',
    name: 'Christian Erin J. Tuzon',
    role: 'Jr. Software Engineer',
    department: 'Engineering',
    initials: 'CT',
    avatar: 'amber',
    bio: 'Develops features and fixes with precision.',
    photo: '/crew/eng-christian.webp',
    demo: false,
  },
  {
    id: 'eng-reymart',
    name: 'Reymart D. Edra',
    role: 'Jr. Software Engineer',
    department: 'Engineering',
    initials: 'RE',
    avatar: 'teal',
    bio: 'Implements and ships product improvements.',
    photo: '/crew/eng-reymart.webp',
    demo: false,
  },
  {
    id: 'eng-markangelo',
    name: 'Mark Angelo De Guzman',
    role: 'Jr. Software Engineer',
    department: 'Engineering',
    initials: 'MG',
    avatar: 'sky',
    bio: 'Builds components and keeps the stack moving.',
    photo: '/crew/eng-markangelo.webp',
    demo: false,
  },
  // Quality Assurance
  {
    id: 'qa-marianne',
    name: 'Marianne Louise V. Medrano',
    role: 'Quality Assurance',
    department: 'QA',
    initials: 'MM',
    avatar: 'violet',
    bio: 'Breaks the build on purpose so clients never have to.',
    photo: '/crew/qa-marianne.webp',
    demo: false,
  },
]

// ─── /crew — page shell copy (PageHero + orbit band + grid + CTA) ───
// Every string /crew renders lives here; CrewPage/CrewCard hold none.
export const CREW_PAGE = {
  eyebrow: 'The Crew',
  heading: 'The people flying the mission',
  headingAccent: 'flying the mission',
  lede: 'Every launch has a crew behind it. Meet the people who scope, design, build, and ship what Inovers delivers.',
  // Kept for safety — the live roster has demo:false everywhere, so this
  // ribbon never renders (CrewPage checks CREW.some(m => m.demo)).
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
    line: 'Engineering, sales, finance, HR, and QA — one team, no hand-offs, no account managers in between.',
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
  eyebrow: 'Mission Log',
  heading: 'Selected works',
  headingAccent: 'works',
  lede: "A curated log of the missions we've flown — projects shipped end-to-end by the crew you'll work with. Filter by industry to find the work that fits your business.",
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
