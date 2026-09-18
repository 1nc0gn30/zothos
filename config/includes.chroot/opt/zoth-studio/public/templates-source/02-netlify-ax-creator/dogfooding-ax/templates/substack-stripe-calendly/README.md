# Substack + Stripe + Calendly — Minimalist Writer Template

A single-page Vite + React + TypeScript + Tailwind template for writers who already publish on Substack and want the simplest possible monetization landing page.

Built by **Zoth Studio Team** + **Jai**. Powered by Netlify.

## What you get

- **Newsletter** — redirects signups straight to your Substack subscribe page (no separate ESP needed)
- **Payments** — sell a single writing guide via Stripe Checkout (one price, no tiers)
- **Booking** — embedded Calendly calendar for reader/feedback calls
- **Single page** — hero, newsletter, guide, booking, footer. Nothing else.
- **No gated delivery** — writers sell a guide link, not a digital vault. Stripe handles the receipt; you deliver the file/link however you like.
- **Mobile-first responsive UI** with hamburger menu
- **Netlify Functions** keep all API keys server-side
- **Config-driven** — set env vars, never edit code

## What this is NOT

- No beehiiv, LemonSqueezy, or Cal.com integrations
- No gated/toolkit download page
- No Stripe webhook or purchase-verification functions
- No multi-tier pricing — one product, one price

## Quick start

```bash
npm install
cp .env.example .env
npm run netlify:dev
```

## Environment variables

| Key | Required | Description |
|-----|----------|-------------|
| `SUBSTACK_NEWSLETTER_URL` | Yes | Your Substack newsletter URL (e.g. `https://yourname.substack.com`) |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key (`sk_live_...` or `sk_test_...`) |
| `STRIPE_PRICE_ID` | Yes | Stripe price ID for the writing guide (`price_...`) |
| `VITE_CALDLY_URL` | Yes | Calendly embed URL |
| `SITE_URL` | Yes | Public site URL for checkout success/cancel redirects |
| `ALLOWED_ORIGINS` | No | CORS origin (default: `*`) |
| `VITE_BRAND_NAME` | No | Brand name (default: The Minimalist Writer) |
| `VITE_BRAND_TAGLINE` | No | Hero tagline |
| `VITE_PRODUCT_NAME` | No | Product name (default: The Minimalist Writing Guide) |
| `VITE_PRODUCT_PRICE` | No | Displayed price (default: $19) |

## Deploy

```bash
npx netlify deploy --prod
```

Set environment variables in the Netlify dashboard before testing checkout.

## How the newsletter works

This template assumes you already run a Substack. Instead of calling a separate ESP API, the newsletter function builds a Substack subscribe URL (`https://yourname.substack.com/subscribe?email=...`) and the frontend redirects the reader there. Substack handles double opt-in and delivery — no API key, no subscriber database to maintain.

## File map

- `netlify.toml` — build/publish/functions config + redirects
- `netlify/functions/newsletter.ts` — Substack redirect builder
- `netlify/functions/checkout.ts` — Stripe Checkout session creator
- `src/lib/config.ts` — env-driven brand/product config
- `src/components/` — Header, Newsletter, Payments, Booking
- `src/pages/Home.tsx` — single-page layout (hero, newsletter, pricing, booking, footer)

## License

MIT. Ship it.