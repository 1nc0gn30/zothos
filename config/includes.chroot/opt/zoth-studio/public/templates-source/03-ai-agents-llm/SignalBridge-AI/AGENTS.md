cat > ~/codex-site-ops/AGENTS.template.md <<'EOF'
# AGENTS.md

## Project objective
Finish this site for production deployment on Netlify with minimal safe changes.

## Platform
- Frontend: usually React + Vite or static
- Deployment target: Netlify
- Preferred domain: subdomain on nealfrazier.tech or 757tech.pro
- Fallback domain: Netlify subdomain

## Requirements
- Build must pass
- SEO basics must exist
- Canonical URL must be set
- robots.txt and sitemap must exist when appropriate
- og-image.png must exist when appropriate
- netlify.toml must be correct
- security headers should be safe and not break the site
- .gitignore should be production-ready

## Netlify Forms
If a form should use Netlify Forms, ensure the form is detectable in static HTML at deploy time.
If the app is client-rendered only, create a hidden static HTML form pattern so Netlify can detect it.

## Functions
Use Netlify Functions only when needed for security or lightweight backend behavior.

## Supabase
If the site truly needs Supabase:
- create a schema SQL file
- use unique table names
- document required env vars
- keep schema minimal

## API strategy
Prefer user-provided API keys.
If hosted API support is necessary, add rate limiting and a waitlist CTA when appropriate.

## Change policy
- prefer minimal changes
- preserve branding
- do not redesign unless necessary
- stop before deploy and summarize changes
EOF
