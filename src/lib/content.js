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
  { label: 'Services', target: 'services' },
  { label: 'About', target: 'about' },
  { label: 'Work', target: 'work' },
  { label: 'Process', target: 'process' },
  { label: 'Contact', target: 'contact' },
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

// ─── What we Build (Services) — Instagram-style bento mosaic ───
// Data-driven: add a service by pushing an entry here — the grid
// reflows automatically. size: 'lg' anchor tiles get extra room for a
// visual; 'sm' tiles cluster around them. media picks a placeholder
// frame visual (browser / phones / flow); real screenshots can replace
// these later via a `src` field. bullets feed the hover/expand overlay.
export const SERVICES = [
  {
    id: 'web',
    icon: 'globe',
    title: 'Website Development',
    tagline: 'Conversion-ready sites, launched in 3 days.',
    size: 'xl',
    media: 'browser',
    bullets: [
      'Landing pages & company sites',
      'E-commerce & booking systems',
      'Performance-first builds',
      'Analytics & SEO foundation',
    ],
  },
  {
    id: 'software',
    icon: 'code',
    title: 'Software Development',
    tagline: 'Mobile apps and web platforms built for scale.',
    size: 'lg',
    media: 'phones',
    bullets: [
      'Mobile apps (iOS & Android)',
      'Web applications',
      'Custom business software',
      'AI integrations',
    ],
  },
  {
    id: 'systems',
    icon: 'layers',
    title: 'Systems & Automation',
    tagline: 'Smarter operations, end to end.',
    size: 'lg',
    media: 'flow',
    bullets: [
      'Business process automation',
      'CRM & workflow systems',
      'Data analytics & dashboards',
      'System architecture & strategy',
    ],
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
