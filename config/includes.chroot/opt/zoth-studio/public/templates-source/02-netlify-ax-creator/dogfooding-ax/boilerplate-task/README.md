# CreatorKit — Netlify Creator Business Boilerplate with AX API

A real, deployable creator business built on Netlify. Newsletter, payments, booking, digital delivery, and an agent-readable AX knowledge API — all wired together.

Built by **Zoth Studio Team** + **Jai** ([trydogfooding.com](https://trydogfooding.com)). Powered by Netlify.

## What this is

CreatorKit is a starter business for solo creators who want to:

- grow a newsletter (beehiiv or Substack)
- sell a digital toolkit (Stripe or LemonSqueezy)
- book strategy calls (Cal.com or Calendly)
- deliver purchases automatically via Stripe webhooks
- let any AI agent read their boilerplate setup via the AX API

Built with Vite + React + TypeScript + Tailwind CSS and deploys to Netlify with serverless functions.

## Pages & Endpoints

| Route | Description |
|-------|-------------|
| `/` | Landing page with newsletter, pricing, booking, AX section |
| `/toolkit` | Gated download page unlocked after Stripe purchase |
| `/api/newsletter` | Subscribe via beehiiv or Substack fallback |
| `/api/checkout` | Start Stripe or LemonSqueezy checkout |
| `/api/stripe-webhook` | Stripe webhook for order recording |
| `/api/verify-purchase` | Verify a Stripe session and unlock toolkit |
| `/api/ax/overview` | AX — full boilerplate knowledge summary |
| `/api/ax/playbooks` | AX — all setup playbooks |
| `/api/ax/playbooks/:id` | AX — single playbook |
| `/api/ax/integrations` | AX — all integrations with env var schemas |
| `/api/ax/integrations/:id` | AX — single integration |
| `/api/ax/env-vars` | AX — every env var with descriptions |
| `/api/ax/templates` | AX — available templates and stacks |
| `/api/ax/query` | AX — natural-language knowledge query (POST) |

## Quick start

```bash
npm install
cp .env.example .env
npm run netlify:dev
```

## AX API — Agent-Readable Knowledge

The AX API lets any AI agent understand this boilerplate programmatically. An agent can:

1. `GET /api/ax/overview` to see what's available
2. `GET /api/ax/playbooks` to list all setup guides
3. `POST /api/ax/query` with `{"topic":"stripe"}` to get relevant playbooks, integrations, and env vars

All AX responses are JSON with CORS enabled. Point an agent at your deployed URL and it can guide a creator through full setup without reading source code.

### Example: Agent queries Stripe setup

```bash
curl -X POST https://your-site.netlify.app/api/ax/query \
  -H "Content-Type: application/json" \
  -d '{"topic":"stripe"}' | jq
```

Returns matching playbooks (Stripe Checkout setup), integrations (Stripe with all env vars), and templates that include Stripe.

## Environment variables

| Key | Purpose |
|-----|---------|
| `BEEHIIV_API_KEY` | beehiiv API v2 key |
| `BEEHIIV_PUBLICATION_ID` | beehiiv publication ID |
| `SUBSTACK_NEWSLETTER_URL` | Substack fallback URL |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_PRICE_ID` | Stripe price ID for toolkit |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook endpoint secret |
| `LS_API_KEY` | LemonSqueezy API key |
| `LS_STORE_ID` | LemonSqueezy store ID |
| `LS_VARIANT_ID` | LemonSqueezy variant ID |
| `SITE_URL` | Public site URL |
| `VITE_CAL_USERNAME` | Cal.com username |
| `VITE_CALDLY_URL` | Calendly embed URL |
| `ALLOWED_ORIGINS` | CORS origin |

## Deployment

```bash
npx netlify deploy --prod
```

Set environment variables in the Netlify dashboard before testing payments.

## Integration templates

This repo ships as the full-stack CreatorKit business. Templates are extracted under `templates/`:

- `beehiiv-stripe-cal` — writer / consultant
- `beehiiv-lemonsqueezy-calendly` — no-code creator
- `substack-stripe-calendly` — newsletter-first minimal
- `beehiiv-stripe-subscription-cal` — membership model
- `ax-creator-flow` — template that uses the AX API to self-document (new)

## License

MIT. Ship it.