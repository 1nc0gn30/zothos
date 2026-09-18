# IndieKit — The Indie Hacker Template (beehiiv + LemonSqueezy + Cal.com + AX API)

A build-in-public SaaS template for indie hackers. Sell a lifetime deal via LemonSqueezy, grow a beehiiv newsletter, book product strategy calls via Cal.com, AND self-document your entire setup with the AX API.

Built by **Zoth Studio Team** + **Jai**. Powered by Netlify.

## What makes this the most advanced template

This is the **Indie Hacker** persona — it combines business functionality (newsletter, payments, booking) with **AX self-documentation**. The template uses the AX API client to fetch its own setup knowledge from a deployed CreatorKit boilerplate, making the entire stack agent-readable.

- **Newsletter** via beehiiv — themed as "Join the build log"
- **Payments** via LemonSqueezy — single lifetime deal price card with "Pay once, use forever" messaging
- **Booking** via Cal.com — themed as "Book a product strategy call"
- **AX Badge** — live status indicator that fetches `/api/ax/overview` from your configured AX URL (green dot if connected, grey if not)
- **AX self-documentation section** — shows live AX endpoints and a copy-able curl example
- **Gated deal page** — LemonSqueezy redirect unlocks `/deal` with download links for the SaaS starter kit
- **Build-in-public link** — external "Build Log" link in the header nav
- **Dark theme with cyan/teal accents** — differentiated from other templates via a `brand` color mapped to cyan
- **Mobile-first responsive UI** with hamburger menu
- **Config-driven** — set env vars, never edit code

## Quick start

```bash
npm install
cp .env.example .env
npm run netlify:dev
```

## Environment variables

| Key | Required | Description |
|-----|----------|-------------|
| `BEEHIIV_API_KEY` | Yes | beehiiv API v2 key with write access |
| `BEEHIIV_PUBLICATION_ID` | Yes | beehiiv publication ID |
| `LS_API_KEY` | Yes | LemonSqueezy API key |
| `LS_STORE_ID` | Yes | LemonSqueezy store ID |
| `LS_VARIANT_ID` | Yes | LemonSqueezy variant ID |
| `VITE_CAL_USERNAME` | Yes | Cal.com username (for booking embed) |
| `VITE_AX_API_URL` | Yes | URL of your deployed CreatorKit boilerplate (serves AX API) |
| `VITE_BUILD_LOG_URL` | No | External build-in-public log URL (blog, changelog, etc.) |
| `SITE_URL` | Yes | Public site URL for redirects |
| `ALLOWED_ORIGINS` | No | CORS origin (default: *) |
| `VITE_BRAND_NAME` | No | Brand name (default: IndieKit) |
| `VITE_BRAND_TAGLINE` | No | Hero tagline (default: "Build in public. Sell for life.") |
| `VITE_PRODUCT_NAME` | No | Product name (default: Lifetime Deal) |
| `VITE_PRODUCT_PRICE` | No | Displayed price (default: $79) |

## AX API — self-documentation

This template includes an `AxClient` class (in `src/lib/ax-client.ts`) that fetches knowledge from a deployed CreatorKit boilerplate's AX endpoints. The `AxBadge` component checks live connection status by fetching `/api/ax/overview` — if the AX API is reachable, the badge shows a green dot with "AX-Powered · Live".

Point `VITE_AX_API_URL` at your deployed CreatorKit boilerplate to enable:
- Live AX connection badge in the header
- AX endpoint documentation section on the home page
- Any AI agent (including Jai) can read your setup as structured JSON

## Deploy

```bash
npx netlify deploy --prod
```

Set environment variables in the Netlify dashboard before testing.

## Why LemonSqueezy?

LemonSqueezy handles VAT/tax compliance globally as merchant of record — ideal for indie hackers selling to a global audience. No webhook setup needed for this template; the LemonSqueezy checkout redirect handles the flow.

## Why Cal.com?

Cal.com is open-source, developer-friendly scheduling. This template uses Cal.com (not Calendly) for booking embeds.

## File map

- `netlify.toml` — build/publish/functions config + redirects
- `netlify/functions/newsletter.ts` — beehiiv subscribe (beehiiv-only)
- `netlify/functions/checkout.ts` — LemonSqueezy checkout (LemonSqueezy-only)
- `src/lib/config.ts` — env-driven config
- `src/lib/ax-client.ts` — AX API client class
- `src/components/Header.tsx` — sticky nav with branding, GitHub, Build Log link
- `src/components/Newsletter.tsx` — beehiiv newsletter, themed as "Join the build log"
- `src/components/Payments.tsx` — LemonSqueezy lifetime deal price card
- `src/components/Booking.tsx` — Cal.com embed, themed as "Book a product strategy call"
- `src/components/AxBadge.tsx` — AX-Powered badge with live status indicator
- `src/pages/Home.tsx` — hero, features, AX section, newsletter, pricing, booking, footer
- `src/pages/Deal.tsx` — gated lifetime deal page with download links

## License

MIT. Ship it.