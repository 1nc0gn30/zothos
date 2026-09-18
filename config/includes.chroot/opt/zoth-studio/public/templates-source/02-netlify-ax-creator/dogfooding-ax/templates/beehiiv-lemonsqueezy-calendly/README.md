# beehiiv + LemonSqueezy + Calendly — Creator Business Template

A config-driven Vite + React + TypeScript + Tailwind template for no-code creators and global indie makers.

Built by **Zoth Studio Team** + **Jai**. Powered by Netlify.

## What you get

- **Newsletter** via beehiiv (auto-subscribe from your site)
- **Payments** via LemonSqueezy (handles global VAT/tax automatically)
- **Booking** via Calendly embedded calendar
- **Gated toolkit** download page unlocked after purchase
- **Mobile-first responsive UI** with hamburger menu
- **Netlify Functions** keep all API keys server-side
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
| `VITE_CALDLY_URL` | Yes | Calendly embed URL |
| `SITE_URL` | Yes | Public site URL for redirects |
| `ALLOWED_ORIGINS` | No | CORS origin (default: *) |
| `VITE_BRAND_NAME` | No | Brand name (default: CreatorKit) |
| `VITE_BRAND_TAGLINE` | No | Hero tagline |
| `VITE_PRODUCT_NAME` | No | Product name (default: CreatorKit License) |
| `VITE_PRODUCT_PRICE` | No | Displayed price (default: $49) |

## Deploy

```bash
npx netlify deploy --prod
```

Set environment variables in the Netlify dashboard before testing.

## Why LemonSqueezy?

LemonSqueezy handles VAT/tax compliance globally — if you sell to EU or UK customers, Stripe requires you to handle tax yourself or use Stripe Tax. LemonSqueezy includes it out of the box, making it ideal for creators with a global audience.

## File map

- `netlify.toml` — build/publish/functions config
- `netlify/functions/newsletter.ts` — beehiiv subscribe
- `netlify/functions/checkout.ts` — LemonSqueezy checkout
- `src/lib/config.ts` — env-driven config
- `src/components/` — Header, Newsletter, Payments, Booking
- `src/pages/` — Home, Toolkit (gated)

## License

MIT. Ship it.