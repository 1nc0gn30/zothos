# Project Architecture

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [[Astro]] v5.x (static site generation) |
| Styling | Vanilla CSS — single `global.css` file |
| Runtime JS | Vanilla JS in `public/scripts/site.js` |
| Fonts | JetBrains Mono + DM Sans via Google Fonts |
| Icons | Inline SVG only — no icon library |
| Hosting | Netlify (static deploy) |
| Forms | Netlify Forms with AJAX fallback |
| CMS | None — content in `src/data/site.ts` |

## Why Astro?

- Zero client-side JS by default — perfect for a marketing site
- Static HTML output — fast, SEO-friendly, cacheable
- Component-based — reusable headers, footers, heroes
- Islands architecture — can hydrate individual components if needed later

## Build Pipeline

```
src/ → Astro compiler → dist/ (static HTML + CSS + JS)
         ↓
      CSS minified
      Images copied from public/
      JS bundled if imported
```

## File Conventions

- Pages: `src/pages/[route].astro` → `dist/[route]/index.html`
- Components: `src/components/*.astro`
- Data: `src/data/site.ts` — single source of truth for content
- Styles: `src/styles/global.css` — imported in `BaseLayout`
- Scripts: `public/scripts/site.js` — loaded via `<script src>` in layout

## Related

- [[02-Design-System/Tokens\|Design Tokens]]
- [[07-Deployment/Netlify-Config\|Netlify Config]]
- [[03-Components/Component-Inventory\|Component Inventory]]
