// AX Integration Patterns — framework-agnostic knowledge for any AI agent
// These describe HOW each integration works so an agent can wire it onto ANY site.

export interface IntegrationPattern {
  id: string;
  name: string;
  category: 'newsletter' | 'payments' | 'booking';
  // How the integration works conceptually
  howItWorks: string;
  // What the agent needs from the user (API keys, account setup)
  prerequisites: { item: string; detail: string }[];
  // Framework-specific implementation snippets
  snippets: { framework: string; language: string; code: string; notes: string }[];
  // Server-side vs client-side
  requiresServer: boolean;
  // Key URLs
  docsUrl: string;
  dashboardUrl: string;
}

export const INTEGRATION_PATTERNS: IntegrationPattern[] = [
  {
    id: 'stripe-checkout',
    name: 'Stripe Checkout',
    category: 'payments',
    howItWorks: 'Server creates a Checkout Session using the Stripe secret key, returns a URL, client redirects to Stripe-hosted payment page. After payment, Stripe redirects back to your success_url. Optionally configure a webhook endpoint to receive payment events server-side for order fulfillment.',
    requiresServer: true,
    docsUrl: 'https://docs.stripe.com/checkout',
    dashboardUrl: 'https://dashboard.stripe.com',
    prerequisites: [
      { item: 'Stripe account', detail: 'Create at stripe.com. Get your secret key from Developers → API keys.' },
      { item: 'Product + Price', detail: 'Dashboard → Products → Add product. Copy the Price ID (price_...).' },
      { item: 'Secret key', detail: 'sk_test_... for testing, sk_live_... for production. NEVER expose client-side.' },
      { item: 'Webhook secret (optional)', detail: 'For post-payment fulfillment. Dashboard → Developers → Webhooks → Add endpoint. Copy whsec_...' },
    ],
    snippets: [
      {
        framework: 'any',
        language: 'bash',
        code: `# 1. Install Stripe SDK
npm install stripe
# or: pip install stripe
# or: gem install stripe

# 2. Test cards
# 4242 4242 4242 4242 — success
# 4000 0000 0000 9995 — declined`,
        notes: 'Stripe SDK available in Node, Python, Ruby, PHP, Go, .NET, Java.',
      },
      {
        framework: 'next.js',
        language: 'typescript',
        code: `// app/api/checkout/route.ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: \`\${process.env.SITE_URL}/success\`,
    cancel_url: \`\${process.env.SITE_URL}/cancel\`,
  });
  return Response.json({ url: session.url });
}

// app/api/webhook/route.ts
export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature')!;
  const event = stripe.webhooks.constructEvent(
    await request.text(), sig, process.env.STRIPE_WEBHOOK_SECRET!
  );
  if (event.type === 'checkout.session.completed') {
    // Fulfill the order
    const session = event.data.object;
    console.log('Paid:', session.customer_details?.email);
  }
  return new Response('ok');
}`,
        notes: 'Use Next.js Route Handlers. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID in .env.local.',
      },
      {
        framework: 'netlify-functions',
        language: 'typescript',
        code: `// netlify/functions/checkout.ts
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const handler = async (event: any) => {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: \`\${process.env.SITE_URL}/success\`,
    cancel_url: \`\${process.env.SITE_URL}/cancel\`,
  });
  return {
    statusCode: 200,
    body: JSON.stringify({ url: session.url }),
  };
};`,
        notes: 'netlify.toml: redirect /api/checkout → /.netlify/functions/checkout',
      },
      {
        framework: 'astro',
        language: 'typescript',
        code: `// src/pages/api/checkout.ts
import Stripe from 'stripe';
const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: import.meta.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: \`\${import.meta.env.SITE_URL}/success\`,
    cancel_url: \`\${import.meta.env.SITE_URL}/cancel\`,
  });
  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'Content-Type': 'application/json' },
  });
}`,
        notes: 'Astro API routes work server-side. Use import.meta.env for env vars.',
      },
      {
        framework: 'plain-html',
        language: 'javascript',
        code: `<!-- Client-side redirect to your server endpoint -->
<button onclick="buy()">Buy</button>
<script>
async function buy() {
  const res = await fetch('/api/checkout', { method: 'POST' });
  const { url } = await res.json();
  window.location.href = url;
}
</script>

<!-- You still need a server endpoint. Use a serverless function
     or a Stripe Payment Link for zero-server setup. -->
<!-- Stripe Payment Link (no server needed): -->
<!-- https://dashboard.stripe.com/payment-links -->`,
        notes: 'For zero-server setup, use Stripe Payment Links — no code required, just a URL.',
      },
    ],
  },
  {
    id: 'lemonsqueezy-checkout',
    name: 'LemonSqueezy Checkout',
    category: 'payments',
    howItWorks: 'Server calls LemonSqueezy API to create a checkout, returns a checkout URL. Client redirects to LemonSqueezy-hosted checkout. After payment, redirects back to your return_url. LemonSqueezy handles VAT/tax globally as merchant of record.',
    requiresServer: true,
    docsUrl: 'https://docs.lemonsqueezy.com/api',
    dashboardUrl: 'https://app.lemonsqueezy.com',
    prerequisites: [
      { item: 'LemonSqueezy account', detail: 'Create at lemonsqueezy.com.' },
      { item: 'Store ID', detail: 'Dashboard → Settings → Store. Copy Store ID.' },
      { item: 'Product + Variant', detail: 'Dashboard → Products → Add product → Create variant. Copy Variant ID.' },
      { item: 'API key', detail: 'Dashboard → Settings → API → Create API key.' },
    ],
    snippets: [
      {
        framework: 'any',
        language: 'bash',
        code: `# No SDK needed — pure REST API with fetch
# Base URL: https://api.lemonsqueezy.com/v1/
# Auth: Bearer token in Authorization header`,
        notes: 'LemonSqueezy has no official SDK — use fetch in any language.',
      },
      {
        framework: 'next.js',
        language: 'typescript',
        code: `// app/api/checkout/route.ts
export async function POST() {
  const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: \`Bearer \${process.env.LS_API_KEY}\`,
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: { redirect_url: \`\${process.env.SITE_URL}/success\` },
        },
        relationships: {
          store: { data: { type: 'stores', id: process.env.LS_STORE_ID } },
          variant: { data: { type: 'variants', id: process.env.LS_VARIANT_ID } },
        },
      },
    }),
  });
  const data = await res.json();
  return Response.json({ url: data.data.attributes.url });
}`,
        notes: 'Set LS_API_KEY, LS_STORE_ID, LS_VARIANT_ID in .env.local',
      },
      {
        framework: 'netlify-functions',
        language: 'typescript',
        code: `// netlify/functions/checkout.ts
export const handler = async (event: any) => {
  const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: \`Bearer \${process.env.LS_API_KEY}\`,
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: { redirect_url: \`\${process.env.SITE_URL}/success\` },
        },
        relationships: {
          store: { data: { type: 'stores', id: process.env.LS_STORE_ID } },
          variant: { data: { type: 'variants', id: process.env.LS_VARIANT_ID } },
        },
      },
    }),
  });
  const data = await res.json();
  return { statusCode: 200, body: JSON.stringify({ url: data.data.attributes.url }) };
};`,
        notes: 'LemonSqueezy handles VAT/tax — no Stripe Tax equivalent needed.',
      },
      {
        framework: 'plain-html',
        language: 'javascript',
        code: `<!-- Zero-server option: LemonSqueezy Checkout Overlay -->
<script src="https://app.lemonsqueezy.com/js/lemonsqueezy.js"></script>
<button onclick="checkout()">Buy</button>
<script>
async function checkout() {
  // You can use a LemonSqueezy Checkout URL directly
  // Get it from Dashboard → Products → Share
  window.LemonSqueezy.Url.Open('https://yourstore.lemonsqueezy.com/checkout/var/123');
}
</script>

<!-- Or just link directly to the checkout URL -->
<a href="https://yourstore.lemonsqueezy.com/checkout/var/123">Buy</a>`,
        notes: 'LemonSqueezy Checkout Overlay allows client-side only. Get URL from dashboard.',
      },
    ],
  },
  {
    id: 'beehiiv-newsletter',
    name: 'beehiiv Newsletter',
    category: 'newsletter',
    howItWorks: 'Server calls beehiiv API v2 to subscribe an email to your publication. Returns success or error. Email is auto-added to subscriber list. Requires API key with write access.',
    requiresServer: true,
    docsUrl: 'https://developers.beehiiv.com',
    dashboardUrl: 'https://app.beehiiv.com/settings/api',
    prerequisites: [
      { item: 'beehiiv publication', detail: 'Create at beehiiv.com. Copy Publication ID from Settings.' },
      { item: 'API key', detail: 'Settings → API → Create API Key. Needs write access for subscriptions.' },
    ],
    snippets: [
      {
        framework: 'any',
        language: 'bash',
        code: `# beehiiv API v2
# Base URL: https://api.beehiiv.com/v2/
# Auth: Bearer token
# POST /publications/{publication_id}/subscriptions
# Body: { "email": "...", "reactivate_existing": true }`,
        notes: 'Pure REST API — works with fetch in any language.',
      },
      {
        framework: 'next.js',
        language: 'typescript',
        code: `// app/api/newsletter/route.ts
export async function POST(request: Request) {
  const { email } = await request.json();
  const res = await fetch(
    \`https://api.beehiiv.com/v2/publications/\${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions\`,
    {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${process.env.BEEHIIV_API_KEY}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, reactivate_existing: true }),
    }
  );
  if (!res.ok) return Response.json({ error: 'Failed' }, { status: 500 });
  return Response.json({ success: true });
}`,
        notes: 'Set BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID in .env.local',
      },
      {
        framework: 'netlify-functions',
        language: 'typescript',
        code: `// netlify/functions/newsletter.ts
export const handler = async (event: any) => {
  const { email } = JSON.parse(event.body || '{}');
  const res = await fetch(
    \`https://api.beehiiv.com/v2/publications/\${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions\`,
    {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${process.env.BEEHIIV_API_KEY}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, reactivate_existing: true }),
    }
  );
  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};`,
        notes: 'Server-side only — never expose BEEHIIV_API_KEY to client.',
      },
      {
        framework: 'astro',
        language: 'typescript',
        code: `// src/pages/api/newsletter.ts
export async function POST({ request }) {
  const { email } = await request.json();
  const res = await fetch(
    \`https://api.beehiiv.com/v2/publications/\${import.meta.env.BEEHIIV_PUBLICATION_ID}/subscriptions\`,
    {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${import.meta.env.BEEHIIV_API_KEY}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, reactivate_existing: true }),
    }
  );
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}`,
        notes: 'Astro server endpoints have access to env vars via import.meta.env.',
      },
      {
        framework: 'plain-html',
        language: 'html',
        code: `<!-- beehiiv embed form (no server needed) -->
<!-- Get this from: beehiiv Dashboard → Settings → Subscription → Embed -->
<form action="https://api.beehiiv.com/v2/publications/PUB_ID/subscriptions" method="POST">
  <input type="email" name="email" placeholder="you@example.com" required />
  <button type="submit">Subscribe</button>
</form>

<!-- Or use beehiiv's hosted form: link to your publication URL -->
<a href="https://yourpub.beehiiv.com/subscribe">Subscribe</a>`,
        notes: 'beehiiv offers embedded forms and hosted subscribe pages for zero-server setup.',
      },
    ],
  },
  {
    id: 'substack-newsletter',
    name: 'Substack Newsletter',
    category: 'newsletter',
    howItWorks: 'No API. Redirect users to your Substack subscribe page with their email pre-filled via URL query param. Simplest newsletter integration — no server needed.',
    requiresServer: false,
    docsUrl: 'https://substack.com/help',
    dashboardUrl: 'https://substack.com',
    prerequisites: [
      { item: 'Substack publication', detail: 'Create at substack.com. Note your publication URL (yourname.substack.com).' },
    ],
    snippets: [
      {
        framework: 'any',
        language: 'javascript',
        code: `// Redirect to Substack with email pre-filled
const subscribeUrl = \`https://yourname.substack.com/subscribe?email=\${encodeURIComponent(email)}\`;
window.open(subscribeUrl, '_blank');`,
        notes: 'No API key, no server, no secrets. Just a URL redirect.',
      },
      {
        framework: 'plain-html',
        language: 'html',
        code: `<!-- Direct link with email pre-fill -->
<form action="https://yourname.substack.com/subscribe" method="GET">
  <input type="email" name="email" placeholder="you@example.com" required />
  <button type="submit">Subscribe</button>
</form>

<!-- Or just link to your Substack -->
<a href="https://yourname.substack.com/subscribe">Subscribe on Substack</a>`,
        notes: 'Simplest possible newsletter integration. Works in plain HTML, no JavaScript needed.',
      },
    ],
  },
  {
    id: 'calcom-booking',
    name: 'Cal.com Booking',
    category: 'booking',
    howItWorks: 'Embed an iframe pointing to your Cal.com event type URL. The iframe renders a scheduling widget where users pick a time slot. No server needed — it is a client-side iframe embed.',
    requiresServer: false,
    docsUrl: 'https://cal.com/docs',
    dashboardUrl: 'https://app.cal.com',
    prerequisites: [
      { item: 'Cal.com account', detail: 'Create at cal.com. Set up an event type (e.g. 30-minute call).' },
      { item: 'Username', detail: 'Your Cal.com username. The embed URL is https://app.cal.com/yourname/30min' },
    ],
    snippets: [
      {
        framework: 'any',
        language: 'html',
        code: `<!-- Cal.com iframe embed -->
<iframe
  src="https://app.cal.com/yourname/30min"
  frameborder="0"
  style="width:100%;height:100%;min-height:600px"
  title="Book a call"
></iframe>

<!-- Or use Cal.com embed script for popup -->
<script src="https://app.cal.com/embed/embed.js"></script>
<button data-cal-link="yourname/30min">Book a call</button>`,
        notes: 'Client-side only. Replace "yourname" with your Cal.com username.',
      },
      {
        framework: 'next.js',
        language: 'tsx',
        code: `// components/Booking.tsx
export function Booking({ username }: { username: string }) {
  return (
    <iframe
      src={\`https://app.cal.com/\${username}/30min\`}
      className="w-full h-[600px]"
      title="Book a call"
    />
  );
}

// Usage: <Booking username="yourname" />`,
        notes: 'Pass username via prop or env var.',
      },
      {
        framework: 'astro',
        language: 'astro',
        code: `---
const calUsername = import.meta.env.PUBLIC_CAL_USERNAME || 'yourname';
---
<iframe
  src={"https://app.cal.com/" + calUsername + "/30min"}
  class="w-full h-[600px]"
  title="Book a call"
/>`,
        notes: 'Use PUBLIC_ prefix for client-visible env vars in Astro.',
      },
    ],
  },
  {
    id: 'calendly-booking',
    name: 'Calendly Booking',
    category: 'booking',
    howItWorks: 'Embed an iframe or use Calendly embed script pointing to your event URL. Client-side only — no server needed.',
    requiresServer: false,
    docsUrl: 'https://developer.calendly.com',
    dashboardUrl: 'https://calendly.com',
    prerequisites: [
      { item: 'Calendly account', detail: 'Create at cal.com (now calendly.com). Set up an event type.' },
      { item: 'Event URL', detail: 'Your Calendly event URL: https://calendly.com/yourname/30min' },
    ],
    snippets: [
      {
        framework: 'any',
        language: 'html',
        code: `<!-- Calendly iframe embed -->
<iframe
  src="https://calendly.com/yourname/30min"
  frameborder="0"
  style="width:100%;height:100%;min-height:600px"
  title="Book a call"
></iframe>

<!-- Or use Calendly embed script -->
<link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css">
<script src="https://assets.calendly.com/assets/external/widget.js"></script>
<button onclick="Calendly.initPopupWidget({url:'https://calendly.com/yourname/30min'})">
  Book a call
</button>`,
        notes: 'Client-side only. Replace URL with your Calendly event URL.',
      },
      {
        framework: 'next.js',
        language: 'tsx',
        code: `// components/Booking.tsx
export function Booking({ url }: { url: string }) {
  return (
    <iframe
      src={url}
      className="w-full h-[600px]"
      title="Book a call"
    />
  );
}`,
        notes: 'Pass the full Calendly URL via prop or NEXT_PUBLIC_CALENDLY_URL env var.',
      },
    ],
  },
];

// Framework configure endpoint
export interface ConfigureRequest {
  framework: 'next.js' | 'astro' | 'netlify-functions' | 'plain-html' | 'vite-react' | 'remix' | 'sveltekit' | 'hugo';
  integrations: ('stripe' | 'lemonsqueezy' | 'beehiiv' | 'substack' | 'calcom' | 'calendly')[];
}

export interface ConfigureResponse {
  framework: string;
  integrations: {
    id: string;
    name: string;
    category: string;
    requiresServer: boolean;
    snippet: { code: string; language: string; notes: string };
    envVars: { key: string; description: string }[];
    prerequisiteSteps: { item: string; detail: string }[];
  }[];
  setupOrder: string[];
  notes: string[];
}

const INTEGRATION_TO_PATTERN: Record<string, string> = {
  stripe: 'stripe-checkout',
  lemonsqueezy: 'lemonsqueezy-checkout',
  beehiiv: 'beehiiv-newsletter',
  substack: 'substack-newsletter',
  calcom: 'calcom-booking',
  calendly: 'calendly-booking',
};

const ENV_VARS: Record<string, { key: string; description: string }[]> = {
  'stripe-checkout': [
    { key: 'STRIPE_SECRET_KEY', description: 'Stripe secret key (sk_test_... or sk_live_...)' },
    { key: 'STRIPE_PRICE_ID', description: 'Stripe price ID for your product (price_...)' },
    { key: 'STRIPE_WEBHOOK_SECRET', description: 'Webhook signing secret (whsec_...) — optional, for fulfillment' },
    { key: 'SITE_URL', description: 'Your site URL for checkout redirects' },
  ],
  'lemonsqueezy-checkout': [
    { key: 'LS_API_KEY', description: 'LemonSqueezy API key' },
    { key: 'LS_STORE_ID', description: 'LemonSqueezy store ID' },
    { key: 'LS_VARIANT_ID', description: 'LemonSqueezy variant ID' },
    { key: 'SITE_URL', description: 'Your site URL for redirects' },
  ],
  'beehiiv-newsletter': [
    { key: 'BEEHIIV_API_KEY', description: 'beehiiv API v2 key with write access' },
    { key: 'BEEHIIV_PUBLICATION_ID', description: 'beehiiv publication ID' },
  ],
  'substack-newsletter': [
    { key: 'SUBSTACK_NEWSLETTER_URL', description: 'Your Substack URL (https://yourname.substack.com)' },
  ],
  'calcom-booking': [
    { key: 'CAL_USERNAME', description: 'Cal.com username (client-visible)' },
  ],
  'calendly-booking': [
    { key: 'CALENDLY_URL', description: 'Full Calendly event URL' },
  ],
};

export function configure(req: ConfigureRequest): ConfigureResponse {
  const { framework, integrations } = req;

  const result: ConfigureResponse = {
    framework,
    integrations: [],
    setupOrder: [],
    notes: [],
  };

  // Setup order: newsletter first (easy win), then payments (needs more config), then booking (easiest)
  const order = ['beehiiv', 'substack', 'stripe', 'lemonsqueezy', 'calcom', 'calendly'];

  for (const integ of order) {
    if (!integrations.includes(integ as any)) continue;

    const patternId = INTEGRATION_TO_PATTERN[integ];
    const pattern = INTEGRATION_PATTERNS.find((p) => p.id === patternId);
    if (!pattern) continue;

    // Find the snippet for this framework, or fall back to 'any'
    const snippet = pattern.snippets.find((s) => s.framework === framework) ||
      pattern.snippets.find((s) => s.framework === 'any') ||
      pattern.snippets[0];

    result.integrations.push({
      id: pattern.id,
      name: pattern.name,
      category: pattern.category,
      requiresServer: pattern.requiresServer,
      snippet: { code: snippet.code, language: snippet.language, notes: snippet.notes },
      envVars: ENV_VARS[pattern.id] || [],
      prerequisiteSteps: pattern.prerequisites,
    });

    result.setupOrder.push(pattern.id);
  }

  // Add helpful notes
  const needsServer = result.integrations.some((i) => i.requiresServer);
  if (needsServer && (framework === 'plain-html' || framework === 'hugo')) {
    result.notes.push(`${framework} is a static site. You need serverless functions for server-side integrations. Use Netlify Functions, Vercel Functions, or Cloudflare Workers.`);
  }
  if (integrations.includes('stripe') && integrations.includes('lemonsqueezy')) {
    result.notes.push('Both Stripe and LemonSqueezy selected. Pick one — they serve the same purpose. Stripe is more common; LemonSqueezy handles global VAT/tax automatically.');
  }
  if (integrations.includes('beehiiv') && integrations.includes('substack')) {
    result.notes.push('Both beehiiv and Substack selected. Pick one — they serve the same purpose. beehiiv has an API for server-side subscribe; Substack is a redirect only.');
  }
  if (integrations.includes('calcom') && integrations.includes('calendly')) {
    result.notes.push('Both Cal.com and Calendly selected. Pick one — they serve the same purpose.');
  }

  return result;
}