# Netlify Creator Business Boilerplate — beehiiv + Stripe + Cal.com

A config-driven Vite + React + TypeScript + Tailwind starter for creators.

## What you get

- **Newsletter** via beehiiv (auto-subscribe from your site)
- **Payments** via Stripe Checkout (one-time product)
- **Booking** via Cal.com embedded calendar
- **Digital delivery** via Stripe webhook (gated download page)
- **Mobile-first responsive UI** with a hamburger menu
- **Netlify Functions** keep all API keys server-side
- **One-click deploy** to Netlify

## How to use

1. **Create your site** from this template
2. **Set env vars** in Netlify (or `.env` locally)
3. **Deploy**

The template adapts automatically based on what keys you provide.

## Required environment variables

```bash
# Newsletter — beehiiv
BEEHIIV_API_KEY=...
BEEHIIV_PUBLICATION_ID=...

# Payments — Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Booking — Cal.com
VITE_CAL_USERNAME=yourname

# CORS / site origin
ALLOWED_ORIGINS=https://your-site.netlify.app
```

## Optional env vars

- `VITE_BRAND_NAME` — defaults to "CreatorKit"
- `VITE_BRAND_TAGLINE` — defaults to "Turn your audience into income"
- `VITE_PRODUCT_NAME` — defaults to "CreatorKit License"
- `VITE_PRODUCT_PRICE` — displayed as "$49"
- `VITE_CURRENCY` — defaults to "usd"

## Local dev

```bash
npm install
npx netlify dev --port=3456 --target-port=3457 --no-open
```

## Deploy

```bash
npx netlify deploy --prod
```

## File map

- `netlify.toml` — build/publish/functions config
- `netlify/functions/` — serverless functions for newsletter, checkout, webhook, verify
- `src/components/` — Newsletter, Payments, Booking, Header
- `src/pages/` — Home, Toolkit (gated)
- `public/assets/` — README, env template, Stripe setup guide

## Support

Open an issue or PR on GitHub.
