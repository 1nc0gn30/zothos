# Kitchen Kit — The Food Creator Template

A Vite + React + TypeScript + Tailwind template for **chefs and food creators** who sell digital recipe kits, grow a newsletter, and book kitchen consultations.

This is **"The Food Creator"** persona — a working chef who:

- **Sells digital recipe kits** via Stripe Checkout (recipe cards, shopping lists, prep guides)
- **Grows a newsletter** via beehiiv ("Join the kitchen crew")
- **Books kitchen consultation calls** via Cal.com

Connects to Jai's gameplan around commercial kitchen access and building a food business.

## What's included

- **Gated recipe kit delivery page** (`/recipes`) — verifies a Stripe `session_id` via Netlify Functions + Blobs, then unlocks downloads for:
  - Recipe cards (PDF, 12 cards)
  - Shopping list templates
  - Prep guides & timing sheets
  - Plating reference photos
- **Stripe checkout** — single price card themed as "Get the Recipe Kit Pack"; success URL redirects to `/recipes?session_id={CHECKOUT_SESSION_ID}`
- **beehiiv newsletter signup** — server-side auto-subscribe via Netlify Function ("Join the kitchen crew")
- **Cal.com booking embed** — "Book a kitchen consultation"
- **Chef/cuisine personalization** via `VITE_CHEF_NAME` and `VITE_CUISINE` env vars
- **Dark theme with warm orange/amber accents** (Tailwind `brand` palette)

## Stack

- Vite + React 19 + TypeScript + Tailwind CSS 3
- Netlify Functions (TypeScript) for newsletter, checkout, Stripe webhook, purchase verification
- Netlify Blobs for order storage
- Stripe for payments
- beehiiv for newsletter
- Cal.com for booking (via `VITE_CAL_USERNAME`)

## Getting started

```bash
npm install
cp .env.example .env   # fill in your keys
npm run dev            # starts on port 3472
```

## Environment variables

See `.env.example` for the full list. Key vars:

| Var | Purpose |
|---|---|
| `BEEHIIV_API_KEY` / `BEEHIIV_PUBLICATION_ID` | beehiiv auto-subscribe |
| `STRIPE_SECRET_KEY` / `STRIPE_PRICE_ID` / `STRIPE_WEBHOOK_SECRET` | Stripe checkout + webhook |
| `VITE_CAL_USERNAME` | Cal.com booking username |
| `VITE_CHEF_NAME` / `VITE_CUISINE` | Hero personalization |
| `VITE_BRAND_NAME` / `VITE_BRAND_TAGLINE` | Branding |
| `VITE_PRODUCT_NAME` / `VITE_PRODUCT_PRICE` | Product label + price |
| `SITE_URL` / `ALLOWED_ORIGINS` | Redirects + CORS |

## Deploy

1. Push to a Git-connected Netlify site
2. Set env vars in Netlify dashboard
3. Create a Stripe Price and set `STRIPE_PRICE_ID`
4. Configure Stripe webhook → `/api/stripe-webhook`
5. Set `VITE_CAL_USERNAME` to your Cal.com username

## Notes

- **No Substack** — beehiiv only.
- **No Calendly** — Cal.com only via `VITE_CAL_USERNAME`.
- **No LemonSqueezy** — Stripe only.
- Recipe kit assets (`/assets/recipe-cards.pdf`, etc.) should be added to `public/assets/` before deploy.