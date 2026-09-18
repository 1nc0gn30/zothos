# SEO Strategy

## Per-Page Meta

Every page in `BaseLayout.astro` receives:
- `<title>` — unique, keyword-rich
- `<meta name="description">` — unique per page
- `<link rel="canonical">` — absolute URL
- OG tags (title, description, url, image)
- Twitter card tags

## Schema.org

LocalBusiness JSON-LD in `<head>`:
- Name, URL, telephone, email
- Virginia Beach address
- Links to logo image

## Sitemap & Robots

- `public/sitemap.xml` — manually maintained or generated
- `public/robots.txt` — allow all, reference sitemap
- `public/_redirects` — Netlify redirect rules

## Canonical Domain

`eliteconnectva.com` — no `www` prefix.

## Key Keywords

- Virginia Beach security cameras
- Hampton Roads low-voltage contractor
- CCTV installation Virginia Beach
- Structured cabling VA
- Access control installer
- Class A contractor security
- DCJS registered security

## Content Strategy

- Every service page has unique copy (not duplicated)
- FAQ answers are specific to Elite Connect
- Location names appear naturally in copy
- No generic "we are the best" language

## Related

- [[04-Pages/Page-Routes\|Page Routes]]
- [[06-SEO-Content/Content-Guidelines\|Content Guidelines]]
- [[07-Deployment/Netlify-Config\|Netlify Config]]
