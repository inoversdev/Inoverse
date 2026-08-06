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

export const SERVICES = [
  {
    id: 'web',
    icon: 'globe',
    title: 'Website Development',
    promise: 'Built within 3 days',
    description:
      'Fast, modern, conversion ready websites engineered to launch in days not months.',
    features: [
      'Landing pages & company sites',
      'E-commerce & booking systems',
      'Performancefirst builds',
      'Analytics & SEO foundation',
    ],
  },
  {
    id: 'software',
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
  },
  {
    id: 'systems',
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
  },
]

export const PROJECTS = [
  {
    id: 'dory',
    name: 'Dory Delivery',
    category: 'Delivery Platform',
    description:
      'Filipino delivery platform food, groceries, essentials, riders, merchants, city operator model.',
    url: 'https://dorydelivery.com/',
    tags: ['Platform', 'Web'],
  },
  {
    id: 'dmap',
    name: 'DMAP',
    category: 'Web App',
    description: 'In-house web application by the Inovers team.',
    url: 'https://dmap.inovers.dev/',
    tags: ['Web App'],
  },
  {
    id: 'whatahotel',
    name: 'WhatAHotel',
    category: 'Mobile App',
    description: 'Hotel management app for WhatAHotel.',
    url: 'https://www.whatahotel.com/',
    tags: ['Mobile', 'Hotel'],
  },
  {
    id: 'agenxure',
    name: 'Agenxure',
    category: 'Web Platform',
    description: 'A serious, dedicated platform build by the Inovers team.',
    url: 'https://www.agenxure.com/',
    tags: ['Web', 'Platform'],
  },
  {
    id: 'ukay',
    name: 'UkayApp',
    category: 'E-commerce App',
    description: 'E-commerce app for everyone who wants to sell online with live selling.',
    url: null,
    tags: ['Mobile', 'E-commerce', 'Live Selling'],
  },
  {
    id: 'byahego',
    name: 'ByaheGo',
    category: 'Travel System',
    description: 'Hotel, flight and car rental mobile app and web app system.',
    url: null,
    tags: ['Mobile', 'Web', 'Travel'],
  },
  {
    id: 'dorx',
    name: 'DORX',
    category: 'Logistics System',
    description: 'Logistics system built by the Inovers team.',
    url: null,
    tags: ['Logistics', 'System'],
  },
]

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
