export const clientProjects = [
  {
    name: 'Marketing Site',
    status: 'Healthy',
    lastDeployed: '2h ago',
    guardrails: 'Auto-block prod deploys during events',
  },
  {
    name: 'Docs',
    status: 'Preview only',
    lastDeployed: 'Yesterday',
    guardrails: 'Only approved presets allowed',
  },
  {
    name: 'Landing Experiments',
    status: 'In flight',
    lastDeployed: '5m ago',
    guardrails: 'Agent-controlled A/B rollouts',
  },
]

export const clientWebsites = [
  {
    name: 'Willow & Pine Café',
    domain: 'willowpinecafe.com',
    environment: 'Production',
    status: 'Healthy',
    lastUpdated: '2h ago',
    guardrails: 'Agent blocks deploys during events and protects DNS',
  },
  {
    name: 'Seasonal Menu Preview',
    domain: 'preview.willowpinecafe.com',
    environment: 'Preview',
    status: 'Preview only',
    lastUpdated: '45m ago',
    guardrails: 'Menu edits require approval; rollbacks ready',
  },
  {
    name: 'Events Landing',
    domain: 'events.willowpinecafe.com',
    environment: 'Staging',
    status: 'In flight',
    lastUpdated: 'Today, 10:12',
    guardrails: 'Edge routing locked; experiments gated',
  },
]

export const clientProfile = {
  businessName: 'Willow & Pine Café',
  industry: 'Restaurant / Café',
  goal: 'Reservations',
  tone: 'friendly',
  guidance: 'Keep copy warm and concise. Highlight seasonal menu and local sourcing.',
  contact: {
    email: 'owner@willowpinecafe.com',
    phone: '+1 (415) 555-0118',
    notifications: true,
  },
}

export const agentDirectory = [
  {
    name: 'Agent Runner',
    type: 'AI Agent',
    specialty: 'Instant adjustments and safe previews',
    availability: 'Instant',
    turnaround: 'Under 2 min',
    score: 'High',
    bio: 'Optimized for content tweaks, light design edits, and safe rollouts.',
    focus: ['Update homepage copy', 'Generate preview links', 'Check site health'],
  },
  {
    name: 'Kendra M.',
    type: 'Human Developer',
    specialty: 'Design-forward sites for local businesses',
    availability: 'Same day',
    turnaround: '1-2 hours',
    score: 'Trusted',
    bio: 'Netlify specialist focused on cafés, salons, and boutique retail.',
    focus: ['Create new sections', 'Implement promos', 'Tune forms for leads'],
  },
  {
    name: 'Luis R.',
    type: 'Human Developer',
    specialty: 'Performance, accessibility, and QA',
    availability: 'Next business day',
    turnaround: '1 day',
    score: 'Reliable',
    bio: 'Checks lighthouse scores, accessibility, and stability before launch.',
    focus: ['Run site health checks', 'Handoff QA results', 'Coordinate approvals'],
  },
]

export const projectTemplates = [
  {
    name: 'Neighborhood Restaurant',
    industry: 'Restaurant / Café',
    pages: 6,
    setup: 'Agent guided',
    description: 'Menu-first layout with reservations and weekly specials.',
    highlight: 'Built-in menu + booking requests',
    pagesIncluded: ['Homepage', 'Menu', 'Reservations', 'Gallery', 'About', 'Contact'],
    features: ['Reservations', 'Menu manager', 'Events spotlight', 'Email capture'],
    actions: ['Choose tone & theme', 'Import menu items', 'Schedule launch'],
  },
  {
    name: 'Auto & Trades',
    industry: 'Auto shop / Trades',
    pages: 5,
    setup: 'Assisted',
    description: 'Service-first layout with rapid quotes and reviews.',
    highlight: 'Service intake with ETA prompts',
    pagesIncluded: ['Homepage', 'Services', 'Reviews', 'Service request', 'Contact'],
    features: ['Quote form', 'Photo gallery', 'Urgent request toggle'],
    actions: ['Pick services', 'Upload before/after gallery', 'Share preview link'],
  },
  {
    name: 'Local Retail',
    industry: 'Small retail',
    pages: 7,
    setup: 'Assisted',
    description: 'Product storytelling with lightweight checkout paths.',
    highlight: 'Edge-personalized promos',
    pagesIncluded: ['Homepage', 'Products', 'Promotions', 'Story', 'Gallery', 'FAQ', 'Contact'],
    features: ['Promo banners', 'Featured collections', 'Email capture'],
    actions: ['Add hero products', 'Configure promo cadence', 'Publish safe preview'],
  },
  {
    name: 'Service Pro',
    industry: 'Local service business',
    pages: 5,
    setup: 'Agent guided',
    description: 'Scheduling and inquiry friendly layout for appointments.',
    highlight: 'Booking guardrails and polite follow-ups',
    pagesIncluded: ['Homepage', 'Services', 'Booking', 'Testimonials', 'Contact'],
    features: ['Booking requests', 'Follow-up emails', 'Guarantee highlights'],
    actions: ['Confirm service list', 'Set response windows', 'Send preview to clients'],
  },
  {
    name: 'Creator / Portfolio',
    industry: 'Creator / Portfolio',
    pages: 4,
    setup: 'Instant',
    description: 'Gallery-forward layout for creators and consultants.',
    highlight: 'Adaptive galleries with safe publishing',
    pagesIncluded: ['Homepage', 'Portfolio', 'About', 'Contact'],
    features: ['Case study cards', 'Contact capture', 'Press highlights'],
    actions: ['Pick showcase work', 'Set tone & CTA', 'Share preview'],
  },
]

export const guidedActions = [
  {
    id: 'content-refresh',
    title: 'Update homepage content',
    summary: 'Adjust hero messaging and update seasonal highlights.',
    impact: ['Refresh hero headline', 'Publish preview to stakeholders'],
    wontChange: ['No production deploys', 'Checkout and forms stay locked'],
    safety: 'Agent validates structure and blocks broken sections.',
    rollback: 'Revert to previous preview snapshot in 20 seconds.',
  },
  {
    id: 'menu-item',
    title: 'Add new menu item',
    summary: 'Append seasonal drink or dish to the live menu preview.',
    impact: ['Add item to menu page', 'Sync pricing across menu widgets'],
    wontChange: ['No change to live site', 'No asset uploads without review'],
    safety: 'Agent checks formatting and allergies list.',
    rollback: 'Remove item from preview instantly.',
  },
  {
    id: 'site-health',
    title: 'Check site health',
    summary: 'Run accessibility and performance scan on the current preview.',
    impact: ['Audit core web vitals', 'Summarize accessibility issues'],
    wontChange: ['No edits to code', 'No deploys or rollbacks'],
    safety: 'Read-only scans with signed findings.',
    rollback: 'Not applicable — results only.',
  },
  {
    id: 'redesign',
    title: 'Request redesign',
    summary: 'Bundle goals and tone into a scoped design request.',
    impact: ['Collect goals', 'Draft design direction', 'Queue for human review'],
    wontChange: ['No theme swaps', 'No DNS or routing changes'],
    safety: 'Human review before any visual changes.',
    rollback: 'Request can be cancelled at any time.',
  },
  {
    id: 'preview',
    title: 'Generate preview',
    summary: 'Spin up a safe preview with today’s edits and guardrails on.',
    impact: ['Bundle edits into preview', 'Share link with expiration'],
    wontChange: ['No production deploys', 'No database writes'],
    safety: 'Preview expires automatically after 48 hours.',
    rollback: 'Auto-cleanup restores previous preview.',
  },
]

export const clientActivity = [
  {
    id: 'a1',
    actor: 'Agent Runner',
    action: 'Dry run — Update homepage content',
    status: 'Stable',
    timestamp: 'Today, 09:14',
    detail: 'Preview link shared with owner@willowpinecafe.com',
  },
  {
    id: 'a2',
    actor: 'Kendra (Dev)',
    action: 'Queued redesign concepts',
    status: 'Queued',
    timestamp: 'Today, 08:32',
    detail: 'Waiting for brand tone confirmation',
  },
  {
    id: 'a3',
    actor: 'Agent Runner',
    action: 'Scheduled site health scan',
    status: 'Completed',
    timestamp: 'Yesterday, 17:50',
    detail: 'Report pinned in Activity with no prod impact',
  },
]

export const domainSuggestions = [
  {
    domain: 'willowpine.ai',
    status: 'Available',
    price: '$14/yr',
    match: 'Brand name + AI concierge',
  },
  {
    domain: 'pineandwillow.com',
    status: 'Available',
    price: '$12/yr',
    match: 'Shortened pair for merch and menus',
  },
  {
    domain: 'willowpinecafe.app',
    status: 'Available',
    price: '$20/yr',
    match: 'Great for mobile ordering and loyalty',
  },
  {
    domain: 'willowpinecafe.net',
    status: 'Taken',
    price: '—',
    match: 'Owner verified, connected to preview',
  },
]

export const gigBoardListings = [
  {
    id: 'gig-1',
    title: 'Seasonal menu landing page',
    budget: '$600',
    urgency: 'This week',
    summary: 'Design-forward landing with hero video slot and weekly specials feed.',
    tags: ['Design polish', 'Copy refresh', 'Preview only'],
  },
  {
    id: 'gig-2',
    title: 'Setup SMS reservation reminders',
    budget: '$450',
    urgency: 'Within 3 days',
    summary: 'Connect booking form to SMS reminders with friendly tone templates.',
    tags: ['Integrations', 'Forms', 'Guardrails'],
  },
  {
    id: 'gig-3',
    title: 'Accessibility and performance sweep',
    budget: '$520',
    urgency: 'Next week',
    summary: 'Audit lighthouse + ARIA labels, handoff findings with safe fixes.',
    tags: ['QA', 'Accessibility', 'Performance'],
  },
]
