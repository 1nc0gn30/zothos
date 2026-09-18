# AX Creator Flow — Self-Documenting Creator Business Template

The first creator business template that fetches its own documentation from a live AX API. Built by **Zoth Studio Team** + **Jai**.

## What this is

A Vite + React + TypeScript + Tailwind template that connects to a deployed CreatorKit boilerplate's AX API to:

- **Browse knowledge live** — playbooks, integrations, env var schemas, and templates are fetched from the AX API in real-time
- **Guide setup step-by-step** — an interactive setup wizard powered by AX playbooks with progress tracking
- **Be agent-readable** — any AI agent can call the same AX endpoints to guide a creator through setup

## Quick start

```bash
npm install
cp .env.example .env
# Set VITE_AX_API_URL to your deployed CreatorKit boilerplate URL
npm run dev
```

## Environment variables

| Key | Required | Description |
|-----|----------|-------------|
| `VITE_AX_API_URL` | Yes | URL of your deployed CreatorKit boilerplate (serves the AX API) |
| `VITE_BRAND_NAME` | No | Brand name shown in header (default: "AX Creator Flow") |
| `VITE_BRAND_TAGLINE` | No | Hero tagline |
| `VITE_CAL_USERNAME` | No | Cal.com username for booking embed |
| `VITE_CALDLY_URL` | No | Calendly URL for booking embed |

## How it works

1. The CreatorKit boilerplate runs AX API endpoints via Netlify Functions
2. This template's `AxClient` (in `src/lib/ax-client.ts`) fetches from those endpoints
3. The AxBrowser component renders the knowledge in a tabbed UI
4. The SetupWizard component turns playbooks into interactive step-by-step checklists
5. Progress is tracked locally in the browser

## AX API endpoints used

- `GET /api/ax/overview` — summary of available knowledge
- `GET /api/ax/playbooks` — all setup playbooks
- `GET /api/ax/integrations` — all integrations with env var schemas
- `GET /api/ax/env-vars` — flat list of all env vars
- `GET /api/ax/templates` — available templates
- `POST /api/ax/query` — natural-language search across all knowledge

## Deploy

```bash
npx netlify deploy --prod
```

## Architecture

```
src/
  lib/
    config.ts        — env-var-driven brand config
    ax-client.ts     — AX API client class
  components/
    Header.tsx       — nav with AX branding
    AxBrowser.tsx    — tabbed knowledge browser (overview, playbooks, integrations, env-vars, templates)
    SetupWizard.tsx  — interactive playbook checklist with progress tracking
    Booking.tsx      — Cal.com / Calendly embed
  pages/
    Home.tsx         — landing page with all sections
```

## License

MIT. Ship it.