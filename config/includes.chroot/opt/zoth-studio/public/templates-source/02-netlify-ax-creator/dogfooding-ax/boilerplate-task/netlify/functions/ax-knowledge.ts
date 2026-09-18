// AX Knowledge Base — structured data served to AI agents
// This is the single source of truth for the boilerplate's agent-readable knowledge.

export interface Playbook {
  id: string;
  title: string;
  description: string;
  steps: { action: string; detail: string }[];
  category: 'newsletter' | 'payments' | 'booking' | 'delivery' | 'deploy' | 'agent';
}

export interface Integration {
  id: string;
  name: string;
  category: 'newsletter' | 'payments' | 'booking' | 'delivery';
  envVars: { key: string; required: boolean; description: string }[];
  setupUrl: string;
  notes: string;
}

export interface Template {
  slug: string;
  name: string;
  stack: string;
  description: string;
  envVars: string[];
  useCase: string;
}

export const PLAYBOOKS: Playbook[] = [
  {
    id: 'newsletter-beehiiv',
    title: 'Set up beehiiv newsletter',
    description: 'Wire beehiiv API v2 so subscribers are auto-added from your landing page.',
    category: 'newsletter',
    steps: [
      { action: 'Create beehiiv publication', detail: 'Go to beehiiv.com, create a publication, and copy the Publication ID from Settings.' },
      { action: 'Generate API key', detail: 'Settings → API → Create API Key. Needs write access for subscriptions.' },
      { action: 'Set env vars', detail: 'In Netlify: BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID. These are server-side only (no VITE_ prefix).' },
      { action: 'Test the endpoint', detail: 'POST /api/newsletter with { "email": "test@example.com" }. Should return { success: true }.' },
      { action: 'Verify on landing page', detail: 'The newsletter form on / calls /api/newsletter automatically. Submit with a real email.' },
    ],
  },
  {
    id: 'newsletter-substack',
    title: 'Set up Substack fallback',
    description: 'When beehiiv is not configured, the newsletter function redirects to Substack subscribe URL.',
    category: 'newsletter',
    steps: [
      { action: 'Set Substack URL', detail: 'In Netlify: SUBSTACK_NEWSLETTER_URL=https://yourname.substack.com' },
      { action: 'How fallback works', detail: 'If BEEHIIV_API_KEY is missing, the function returns { redirect: true, url: "https://yourname.substack.com/subscribe?email=..." } and the client opens it in a new tab.' },
      { action: 'Test', detail: 'POST /api/newsletter with beehiiv vars unset. Response should include redirect: true.' },
    ],
  },
  {
    id: 'payments-stripe',
    title: 'Set up Stripe Checkout',
    description: 'Accept one-time payments via Stripe Checkout with webhook-verified delivery.',
    category: 'payments',
    steps: [
      { action: 'Create Stripe account', detail: 'Go to stripe.com and create an account.' },
      { action: 'Create product', detail: 'Dashboard → Products → Add product. Set price (e.g. $49 one-time). Copy the Price ID (price_...).' },
      { action: 'Get secret key', detail: 'Dashboard → Developers → API keys → copy Secret key (sk_test_... or sk_live_...).' },
      { action: 'Set env vars', detail: 'In Netlify: STRIPE_SECRET_KEY, STRIPE_PRICE_ID, SITE_URL' },
      { action: 'Create webhook endpoint', detail: 'Dashboard → Developers → Webhooks → Add endpoint. URL: https://YOUR_SITE/api/stripe-webhook. Event: checkout.session.completed. Copy whsec_... into STRIPE_WEBHOOK_SECRET.' },
      { action: 'Test with Stripe CLI', detail: 'stripe listen --forward-to localhost:3456/api/stripe-webhook. Use test card 4242 4242 4242 4242.' },
      { action: 'Verify toolkit unlock', detail: 'After payment, /toolkit?session_id=... should show the unlocked download page.' },
    ],
  },
  {
    id: 'payments-lemonsqueezy',
    title: 'Set up LemonSqueezy Checkout',
    description: 'Accept payments via LemonSqueezy as a Stripe alternative (better for global/indie creators).',
    category: 'payments',
    steps: [
      { action: 'Create LemonSqueezy account', detail: 'Go to lemonsqueezy.com and create an account.' },
      { action: 'Create product and variant', detail: 'Dashboard → Products → Add product. Create a variant. Copy the Variant ID and Store ID.' },
      { action: 'Generate API key', detail: 'Settings → API → Create API key.' },
      { action: 'Set env vars', detail: 'In Netlify: LS_API_KEY, LS_STORE_ID, LS_VARIANT_ID, SITE_URL' },
      { action: 'Test', detail: 'POST /api/checkout?provider=lemonsqueezy with { return_path: "/toolkit" }. Should return { url: "..." }.' },
    ],
  },
  {
    id: 'booking-calcom',
    title: 'Set up Cal.com booking',
    description: 'Embed a Cal.com scheduling widget on your landing page.',
    category: 'booking',
    steps: [
      { action: 'Create Cal.com account', detail: 'Go to cal.com and create an account.' },
      { action: 'Create event type', detail: 'Set up a 30-minute event type.' },
      { action: 'Set env var', detail: 'In Netlify: VITE_CAL_USERNAME=yourname (VITE_ prefix makes it client-visible).' },
      { action: 'How it renders', detail: 'The Booking component embeds an iframe pointing to https://app.cal.com/yourname/30min' },
    ],
  },
  {
    id: 'booking-calendly',
    title: 'Set up Calendly booking',
    description: 'Use Calendly instead of Cal.com for booking.',
    category: 'booking',
    steps: [
      { action: 'Create Calendly account', detail: 'Go to cal.com and create an account.' },
      { action: 'Create event type', detail: 'Set up a 30-minute event.' },
      { action: 'Set env var', detail: 'In Netlify: VITE_CALDLY_URL=https://calendly.com/yourname/30min (VITE_ prefix, client-visible).' },
      { action: 'Priority', detail: 'If both VITE_CALDLY_URL and VITE_CAL_USERNAME are set, Calendly URL takes priority.' },
    ],
  },
  {
    id: 'delivery-gated-toolkit',
    title: 'Set up gated digital delivery',
    description: 'Stripe webhook records orders to Netlify Blobs; /toolkit page verifies and unlocks.',
    category: 'delivery',
    steps: [
      { action: 'Webhook flow', detail: 'stripe-webhook.ts listens for checkout.session.completed, stores session data in Netlify Blobs "orders" store.' },
      { action: 'Verify flow', detail: 'verify-purchase.ts checks Blobs for session_id. If missing, falls back to live Stripe session retrieval.' },
      { action: 'Frontend flow', detail: 'After Stripe checkout success, redirect to /toolkit?session_id=cs_test_... The Toolkit page calls /api/verify-purchase.' },
      { action: 'Downloadable assets', detail: 'Place files in public/assets/. The unlocked Toolkit page links to them with download attributes.' },
    ],
  },
  {
    id: 'deploy-netlify',
    title: 'Deploy to Netlify',
    description: 'Full deploy workflow from local to production.',
    category: 'deploy',
    steps: [
      { action: 'Connect repo', detail: 'Push to GitHub, connect the repo in Netlify dashboard.' },
      { action: 'Build settings', detail: 'netlify.toml already configures: build command = npm run build, publish = dist, functions = netlify/functions' },
      { action: 'Set env vars', detail: 'Site settings → Environment variables. Set all keys from .env.example (without VITE_ prefix for server-side).' },
      { action: 'Deploy', detail: 'npx netlify deploy --prod or trigger via Git push.' },
      { action: 'Update webhook URL', detail: 'After deploy, update Stripe webhook endpoint URL to your production domain.' },
    ],
  },
  {
    id: 'ax-integrate-agent',
    title: 'Integrate an AI agent via AX API',
    description: 'How an AI agent can fetch knowledge from this boilerplate to help set up a creator business.',
    category: 'agent',
    steps: [
      { action: 'AX overview', detail: 'GET /api/ax/overview returns a structured summary of the entire boilerplate: integrations, playbooks, templates, env vars.' },
      { action: 'Fetch playbooks', detail: 'GET /api/ax/playbooks returns all setup playbooks. GET /api/ax/playbooks/:id returns a single playbook.' },
      { action: 'Fetch integrations', detail: 'GET /api/ax/integrations returns all supported integrations with their env vars.' },
      { action: 'Query knowledge', detail: 'POST /api/ax/query with { "topic": "stripe" } returns relevant playbooks, integrations, and env vars matching that topic.' },
      { action: 'Fetch env var schema', detail: 'GET /api/ax/env-vars returns all env vars with descriptions, required flags, and which integration they belong to.' },
      { action: 'List templates', detail: 'GET /api/ax/templates returns all available templates and their stack configurations.' },
      { action: 'Agent workflow', detail: 'An agent calls overview first, then drills into specific playbooks or integrations based on user needs. The agent can guide a creator through full setup without reading source code.' },
    ],
  },
];

export const INTEGRATIONS: Integration[] = [
  {
    id: 'beehiiv',
    name: 'beehiiv',
    category: 'newsletter',
    envVars: [
      { key: 'BEEHIIV_API_KEY', required: true, description: 'beehiiv API v2 key with write access' },
      { key: 'BEEHIIV_PUBLICATION_ID', required: true, description: 'beehiiv publication ID from Settings' },
    ],
    setupUrl: 'https://beehiiv.com/settings/api',
    notes: 'Server-side only. If not set, newsletter function falls back to Substack redirect.',
  },
  {
    id: 'substack',
    name: 'Substack',
    category: 'newsletter',
    envVars: [
      { key: 'SUBSTACK_NEWSLETTER_URL', required: true, description: 'Your Substack URL (https://yourname.substack.com)' },
    ],
    setupUrl: 'https://substack.com',
    notes: 'Fallback when beehiiv is not configured. Client gets redirected to Substack subscribe page.',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'payments',
    envVars: [
      { key: 'STRIPE_SECRET_KEY', required: true, description: 'Stripe secret key (sk_test_... or sk_live_...) ' },
      { key: 'STRIPE_PRICE_ID', required: true, description: 'Stripe price ID for your product (price_...)' },
      { key: 'STRIPE_WEBHOOK_SECRET', required: true, description: 'Stripe webhook signing secret (whsec_...)' },
      { key: 'SITE_URL', required: true, description: 'Public site URL for checkout redirects' },
    ],
    setupUrl: 'https://dashboard.stripe.com/apikeys',
    notes: 'Server-side only. Webhook must be configured for gated delivery.',
  },
  {
    id: 'lemonsqueezy',
    name: 'LemonSqueezy',
    category: 'payments',
    envVars: [
      { key: 'LS_API_KEY', required: true, description: 'LemonSqueezy API key' },
      { key: 'LS_STORE_ID', required: true, description: 'LemonSqueezy store ID' },
      { key: 'LS_VARIANT_ID', required: true, description: 'LemonSqueezy variant ID for your product' },
      { key: 'SITE_URL', required: true, description: 'Public site URL for checkout redirects' },
    ],
    setupUrl: 'https://app.lemonsqueezy.com/settings/api',
    notes: 'Server-side only. Better for global creators (handles VAT/tax automatically).',
  },
  {
    id: 'calcom',
    name: 'Cal.com',
    category: 'booking',
    envVars: [
      { key: 'VITE_CAL_USERNAME', required: true, description: 'Cal.com username (client-visible via VITE_ prefix)' },
    ],
    setupUrl: 'https://cal.com',
    notes: 'Client-visible. Renders an iframe embed. Lower priority than Calendly if both are set.',
  },
  {
    id: 'calendly',
    name: 'Calendly',
    category: 'booking',
    envVars: [
      { key: 'VITE_CALDLY_URL', required: true, description: 'Full Calendly embed URL (client-visible via VITE_ prefix)' },
    ],
    setupUrl: 'https://calendly.com',
    notes: 'Client-visible. Takes priority over Cal.com if both are configured.',
  },
  {
    id: 'netlify-blobs',
    name: 'Netlify Blobs',
    category: 'delivery',
    envVars: [
      { key: 'NETLIFY_BLOBS_CONTEXT_URL', required: false, description: 'Auto-provided by Netlify runtime' },
      { key: 'NETLIFY_BLOBS_TOKEN', required: false, description: 'Auto-provided by Netlify runtime' },
      { key: 'NETLIFY_SITE_ID', required: false, description: 'Auto-provided by Netlify runtime' },
    ],
    setupUrl: 'https://docs.netlify.com/blobs/overview/',
    notes: 'Used by stripe-webhook to store order data. Auto-configured in Netlify environment.',
  },
];

export const TEMPLATES: Template[] = [
  {
    slug: 'beehiiv-stripe-cal',
    name: 'beehiiv + Stripe + Cal.com',
    stack: 'beehiiv,stripe,calcom',
    description: 'Writer/consultant stack. Auto-subscribe via beehiiv, one-time Stripe payment, Cal.com booking.',
    envVars: ['BEEHIIV_API_KEY', 'BEEHIIV_PUBLICATION_ID', 'STRIPE_SECRET_KEY', 'STRIPE_PRICE_ID', 'STRIPE_WEBHOOK_SECRET', 'VITE_CAL_USERNAME', 'SITE_URL', 'ALLOWED_ORIGINS'],
    useCase: 'Writers, consultants, and coaches who want beehiiv newsletter + Stripe payments + Cal.com scheduling.',
  },
  {
    slug: 'beehiiv-lemonsqueezy-calendly',
    name: 'beehiiv + LemonSqueezy + Calendly',
    stack: 'beehiiv,lemonsqueezy,calendly',
    description: 'No-code creator stack. beehiiv newsletter, LemonSqueezy payments (handles global tax), Calendly booking.',
    envVars: ['BEEHIIV_API_KEY', 'BEEHIIV_PUBLICATION_ID', 'LS_API_KEY', 'LS_STORE_ID', 'LS_VARIANT_ID', 'VITE_CALDLY_URL', 'SITE_URL', 'ALLOWED_ORIGINS'],
    useCase: 'Global/no-code creators who need automatic VAT handling and prefer Calendly.',
  },
  {
    slug: 'substack-stripe-calendly',
    name: 'Substack + Stripe + Calendly (Minimalist Writer)',
    stack: 'substack,stripe,calendly',
    description: 'Minimal newsletter-first stack. Substack redirect, Stripe one-time payment, Calendly booking. No gated page — single-page only.',
    envVars: ['SUBSTACK_NEWSLETTER_URL', 'STRIPE_SECRET_KEY', 'STRIPE_PRICE_ID', 'VITE_CALDLY_URL', 'SITE_URL', 'ALLOWED_ORIGINS', 'VITE_BRAND_NAME', 'VITE_PRODUCT_NAME', 'VITE_PRODUCT_PRICE'],
    useCase: 'Writers who already have a Substack and want the simplest possible monetization landing page. No digital delivery needed.',
  },
  {
    slug: 'chef-food-creator',
    name: 'Chef Food Creator (beehiiv + Stripe + Cal.com)',
    stack: 'beehiiv,stripe,calcom',
    description: 'Food creator stack with gated recipe kit delivery. beehiiv newsletter, Stripe checkout with webhook, Cal.com kitchen consultations. Persona-themed with chef name and cuisine config.',
    envVars: ['BEEHIIV_API_KEY', 'BEEHIIV_PUBLICATION_ID', 'STRIPE_SECRET_KEY', 'STRIPE_PRICE_ID', 'STRIPE_WEBHOOK_SECRET', 'VITE_CAL_USERNAME', 'VITE_CHEF_NAME', 'VITE_CUISINE', 'VITE_BRAND_NAME', 'VITE_PRODUCT_NAME', 'VITE_PRODUCT_PRICE', 'SITE_URL', 'ALLOWED_ORIGINS'],
    useCase: 'Chefs and food creators selling digital recipe kits and booking kitchen consultation calls. Connects to commercial kitchen gameplan.',
  },
  {
    slug: 'saas-indie-maker',
    name: 'SaaS Indie Maker (beehiiv + LemonSqueezy + Cal.com + AX)',
    stack: 'beehiiv,lemonsqueezy,calcom,ax-api',
    description: 'Build-in-public SaaS stack with AX self-documentation. beehiiv newsletter, LemonSqueezy lifetime deal, Cal.com strategy calls, AX badge with live status. Cyan/teal theme.',
    envVars: ['BEEHIIV_API_KEY', 'BEEHIIV_PUBLICATION_ID', 'LS_API_KEY', 'LS_STORE_ID', 'LS_VARIANT_ID', 'VITE_CAL_USERNAME', 'VITE_AX_API_URL', 'VITE_BUILD_LOG_URL', 'VITE_BRAND_NAME', 'VITE_PRODUCT_NAME', 'VITE_PRODUCT_PRICE', 'SITE_URL', 'ALLOWED_ORIGINS'],
    useCase: 'Indie hackers and SaaS makers selling lifetime deals who want agent-readable self-documentation and build-in-public branding.',
  },
  {
    slug: 'ax-creator-flow',
    name: 'AX Creator Flow',
    stack: 'ax-api,react,tailwind',
    description: 'Self-documenting template that fetches its own setup knowledge from a CreatorKit AX API deployment. Includes a live knowledge browser and interactive setup wizard.',
    envVars: ['VITE_AX_API_URL', 'VITE_BRAND_NAME', 'VITE_CAL_USERNAME', 'VITE_CALDLY_URL'],
    useCase: 'Any creator who wants an AI-agent-readable template that guides its own setup by fetching playbooks and integration docs from a live AX API.',
  },
  {
    slug: 'beehiiv-stripe-subscription-cal',
    name: 'beehiiv + Stripe Subscriptions + Cal.com',
    stack: 'beehiiv,stripe-subscription,calcom',
    description: 'Membership model. beehiiv newsletter, Stripe recurring subscription, Cal.com booking.',
    envVars: ['BEEHIIV_API_KEY', 'BEEHIIV_PUBLICATION_ID', 'STRIPE_SECRET_KEY', 'STRIPE_PRICE_ID', 'STRIPE_WEBHOOK_SECRET', 'VITE_CAL_USERNAME', 'SITE_URL', 'ALLOWED_ORIGINS'],
    useCase: 'Creators running a membership model with recurring billing.',
  },
];

export const META = {
  name: 'CreatorKit',
  version: '2.0.0',
  authors: 'Zoth Studio Team + Jai (trydogfooding.com)',
  description: 'A Netlify-native creator business boilerplate with newsletter, payments, booking, digital delivery, and an agent-readable AX knowledge API.',
  stack: 'Vite + React + TypeScript + Tailwind CSS + Netlify Functions',
  axVersion: '1.0.0',
  endpoints: [
    'GET /api/ax/overview',
    'GET /api/ax/playbooks',
    'GET /api/ax/playbooks/:id',
    'GET /api/ax/integrations',
    'GET /api/ax/integrations/:id',
    'GET /api/ax/env-vars',
    'GET /api/ax/templates',
    'GET /api/ax/patterns',
    'GET /api/ax/patterns/:id',
    'POST /api/ax/query',
    'POST /api/ax/configure',
  ],
};

export function getOverview() {
  return {
    ...META,
    integrationCount: INTEGRATIONS.length,
    playbookCount: PLAYBOOKS.length,
    templateCount: TEMPLATES.length,
    integrations: INTEGRATIONS.map((i) => ({ id: i.id, name: i.name, category: i.category })),
    playbooks: PLAYBOOKS.map((p) => ({ id: p.id, title: p.title, category: p.category })),
    templates: TEMPLATES.map((t) => ({ slug: t.slug, name: t.name, stack: t.stack })),
  };
}

export function queryKnowledge(topic: string) {
  const lower = topic.toLowerCase().trim();
  const playbooks = PLAYBOOKS.filter(
    (p) =>
      p.title.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.category.includes(lower) ||
      p.id.includes(lower),
  );
  const integrations = INTEGRATIONS.filter(
    (i) =>
      i.name.toLowerCase().includes(lower) ||
      i.category.includes(lower) ||
      i.id.includes(lower),
  );
  const envVars: { key: string; description: string; integration: string }[] = [];
  for (const integ of INTEGRATIONS) {
    for (const v of integ.envVars) {
      if (v.key.toLowerCase().includes(lower) || v.description.toLowerCase().includes(lower)) {
        envVars.push({ key: v.key, description: v.description, integration: integ.name });
      }
    }
  }
  const templates = TEMPLATES.filter(
    (t) =>
      t.name.toLowerCase().includes(lower) ||
      t.stack.includes(lower) ||
      t.description.toLowerCase().includes(lower) ||
      t.useCase.toLowerCase().includes(lower),
  );
  return { topic, playbooks, integrations, envVars, templates };
}