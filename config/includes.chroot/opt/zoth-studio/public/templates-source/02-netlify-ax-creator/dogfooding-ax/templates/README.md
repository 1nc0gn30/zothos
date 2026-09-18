# Templates

Persona-driven creator business templates built from the CreatorKit boilerplate. Each template is a standalone Vite + React + TypeScript + Tailwind app that deploys to Netlify.

## Available templates

| Template | Persona | Stack | Gated page |
|----------|---------|-------|------------|
| [beehiiv-stripe-cal](./beehiiv-stripe-cal/) | Writer / consultant | beehiiv + Stripe + Cal.com | Yes (Stripe webhook) |
| [beehiiv-lemonsqueezy-calendly](./beehiiv-lemonsqueezy-calendly/) | No-code / global creator | beehiiv + LemonSqueezy + Calendly | Yes (redirect) |
| [substack-stripe-calendly](./substack-stripe-calendly/) | The Minimalist Writer | Substack + Stripe + Calendly | No (single page) |
| [chef-food-creator](./chef-food-creator/) | The Food Creator | beehiiv + Stripe + Cal.com | Yes (recipe kits) |
| [saas-indie-maker](./saas-indie-maker/) | The Indie Hacker | beehiiv + LemonSqueezy + Cal.com + AX | Yes (lifetime deal) |
| [ax-creator-flow](./ax-creator-flow/) | Self-documenting | AX API client (no server functions) | No (knowledge browser) |

## Using a template

```bash
cd templates/<template-name>
npm install
cp .env.example .env
# Edit .env with your provider keys
npm run dev
```

Each template has its own README with setup instructions specific to its stack.

## Building a new template

The boilerplate's AX API can guide template creation:

```bash
# Ask the AX API for setup patterns for a specific framework
curl -X POST https://your-creatorkit.netlify.app/api/ax/configure \
  -H "Content-Type: application/json" \
  -d '{"framework":"next.js","integrations":["stripe","beehiiv","calcom"]}'
```

See the [main README](../README.md) for the full AX API documentation.