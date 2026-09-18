# Virginia Beach New Business Lead Analyzer

Vanilla JavaScript Netlify app that analyzes new Virginia Beach business registrations and suggests website-service opportunities per business.

## Data flow

1. Source CSV: `output/new-business-listings-2026-jan-feb.csv`
2. Enrichment script: `app/scripts/build_dataset.py`
3. App dataset output: `app/data/businesses-enriched.json`
4. UI files: `app/index.html`, `app/styles.css`, `app/app.js`

## Rebuild dataset

```bash
python3 app/scripts/build_dataset.py
```

## Local preview

```bash
python3 -m http.server 4173 --directory app
```

Then open `http://localhost:4173`.

## Netlify deploy

- Publish directory: `app`
- Build command: none required
- Config: `netlify.toml`

## Canonical domain

Current canonical/sitemap/robots domain is set to:

`https://newlistingsinvb.netlify.app/`

If your production domain differs, update:

- `app/index.html` canonical + OG url/image
- `app/robots.txt` sitemap URL
- `app/sitemap.xml` URL entries
