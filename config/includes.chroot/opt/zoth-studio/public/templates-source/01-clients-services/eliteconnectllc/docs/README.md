# Elite Connect — Developer Vault

Local security, cabling, and managed technology contractor based in Virginia Beach, VA. This vault tracks architecture, design decisions, component inventory, SEO strategy, and deployment configuration for the Astro-based marketing site.

---

## 👤 User Guide (For the Website Owner)

| Topic | File |
|---|---|
| [[00-User-Guide/Getting-Started\|Getting Started]] | Quick overview, everyday tasks |
| [[00-User-Guide/Editing-Content\|Editing Content]] | How to change text, services, FAQs |
| [[00-User-Guide/Deploying\|Deploying]] | Publish changes live |
| [[00-User-Guide/Troubleshooting\|Troubleshooting]] | Common problems and fixes |

---

## 🛠 Developer Documentation

| Topic | File |
|---|---|
| [[01-Overview/Project-Architecture\|Project Architecture]] | Tech stack, build pipeline, folder structure |
| [[01-Overview/Brand-Identity\|Brand Identity]] | Logos, colors, typography, tone of voice |
| [[02-Design-System/Tokens\|Design Tokens]] | CSS variables, spacing, radius, shadows |
| [[02-Design-System/Color-Palette\|Color Palette]] | Light + dark mode color system |
| [[03-Components/Component-Inventory\|Component Inventory]] | All Astro components with props |
| [[04-Pages/Page-Routes\|Page Routes]] | URL map, meta data per page |
| [[05-Forms-Functionality/Netlify-Forms\|Netlify Forms]] | Form names, fields, success flows |
| [[05-Forms-Functionality/Lead-Modal\|Lead Modal]] | Popup behavior, timing, close logic |
| [[06-SEO-Content/SEO-Strategy\|SEO Strategy]] | Titles, descriptions, canonicals, schema |
| [[06-SEO-Content/Content-Guidelines\|Content Guidelines]] | Writing tone, service descriptions |
| [[07-Deployment/Netlify-Config\|Netlify Config]] | Build settings, redirects, headers |
| [[08-Roadmap/Current-Sprint\|Current Sprint]] | Active work, known issues, next steps |
| [[08-Roadmap/Backlog\|Backlog]] | Future features and enhancements |

---

## 🤖 Agent Skills

| Agent | File | Focus |
|---|---|---|
| Frontend Designer | `.agents/frontend-designer/SKILL.md` | CSS, animations, responsive, dark mode |
| Content & SEO | `.agents/content-seo/SKILL.md` | Copy, meta tags, schema, keywords |
| Astro Developer | `.agents/astro-developer/SKILL.md` | Components, routing, data, build |
| Forms & Integrations | `.agents/forms-integrations/SKILL.md` | Netlify forms, lead modal, submissions |
| QA & Performance | `.agents/qa-performance/SKILL.md` | Testing, Lighthouse, accessibility |

---

## Site Details

- **Domain:** eliteconnectva.com
- **Phone:** 804-445-9674
- **Email:** eliteconnectva@gmail.com
- **License:** Virginia Class A Contractor
- **DCJS:** # 11-20830
- **Service Area:** Virginia Beach and Hampton Roads

## Repository Structure

```
eliteconnect-astro/
├── src/
│   ├── components/     # Reusable Astro components
│   ├── data/           # site.ts — nav, services, faqs, locations
│   ├── layouts/        # BaseLayout.astro
│   ├── pages/          # All page routes
│   └── styles/         # global.css — single design system
├── public/
│   ├── assets/brand/   # Logos, watermarks
│   ├── assets/gallery/ # Project photos
│   └── scripts/        # site.js — runtime JS
├── docs/               # ← This vault
├── .agents/            # Agent skill definitions
├── astro.config.mjs
├── netlify.toml
└── package.json
```

## Running Locally

```bash
cd eliteconnect-astro
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
```

Static output goes to `dist/`. Deployed via Netlify with `netlify.toml` config.
