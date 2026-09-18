# SaaS Starter Kit — Boilerplate Code Reference

## Stack
- Vite + React 19 + TypeScript
- Tailwind CSS 3 (dark theme, cyan brand accent)
- React Router 7 (BrowserRouter, / and /deal routes)
- Netlify Functions (newsletter + checkout)

## Structure

```
src/
  main.tsx              — React root
  App.tsx               — Router + SuccessBanner
  index.css             — Tailwind + dark body
  vite-env.d.ts         — Vite client types
  lib/
    config.ts           — env-driven config (brand, product, price, AX URL, etc.)
    ax-client.ts        — AxClient class for AX API
  components/
    Header.tsx          — sticky nav, mobile hamburger, Build Log link
    Newsletter.tsx      — beehiiv subscribe (POST /api/newsletter)
    Payments.tsx        — LemonSqueezy lifetime deal card
    Booking.tsx         — Cal.com embed
    AxBadge.tsx         — live AX connection status badge
  pages/
    Home.tsx            — landing page (hero, features, AX, newsletter, pricing, booking)
    Deal.tsx            — gated lifetime deal page with download links
netlify/
  functions/
    newsletter.ts       — beehiiv subscribe handler
    checkout.ts         — LemonSqueezy checkout handler
netlify.toml            — build + redirects config
```

## Key Patterns

### Config-driven
All branding, pricing, and integration URLs come from environment variables via `src/lib/config.ts`. No code edits needed to rebrand.

### AX self-documentation
The `AxClient` class fetches from a deployed CreatorKit boilerplate's AX API. The `AxBadge` component checks live status. Set `VITE_AX_API_URL` to connect.

### Lifetime deal model
Single one-time payment via LemonSqueezy. No subscriptions, no webhooks. The checkout redirect unlocks the gated `/deal` page.