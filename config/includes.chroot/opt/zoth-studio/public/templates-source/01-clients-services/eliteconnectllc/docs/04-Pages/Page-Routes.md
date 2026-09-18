# Page Routes

All pages are `.astro` files in `src/pages/`.

## Route Map

| URL | File | Purpose |
|---|---|---|
| `/` | `index.astro` | Homepage — hero, services, trust, CTA, FAQ |
| `/services/` | `services.astro` | Service listing overview |
| `/commercial/` | `commercial.astro` | Commercial service focus |
| `/residential/` | `residential.astro` | Residential service focus |
| `/gallery/` | `gallery.astro` | Project photo gallery |
| `/about-us/` | `about-us.astro` | Company story, team, credentials |
| `/faq/` | `faq.astro` | Full FAQ page |
| `/contact/` | `contact.astro` | Consultation form + contact info |
| `/thank-you/` | `thank-you.astro` | Form success page |
| `/client-portal/` | `client-portal.astro` | Client login placeholder |
| `/privacy-policy/` | `privacy-policy.astro` | Legal |
| `/terms-of-service/` | `terms-of-service.astro` | Legal |
| `/404/` | `404.astro` | Not found |

## Shared Patterns

Every page uses `BaseLayout` with:
- Unique `title` and `description`
- `canonical` URL
- `HeroSection` with `variant="page"` (except home)

## Content Source

Most content comes from `src/data/site.ts`:
- `site` object — contact info, phone, license
- `nav` array — navigation links
- `services` array — 9 service definitions
- `faqs` array — FAQ entries
- `locations` array — Hampton Roads cities
- `gallery` array — photo metadata

## Related

- [[03-Components/Component-Inventory\|Component Inventory]]
- [[06-SEO-Content/SEO-Strategy\|SEO Strategy]]
