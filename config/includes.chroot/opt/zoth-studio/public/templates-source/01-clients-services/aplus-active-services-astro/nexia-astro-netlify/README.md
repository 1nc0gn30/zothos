# A+ Active Services Astro Site

Astro/Svelte site generated from the Nexia Webflow treatment, with two supported outputs:

- `npm run build` or `npm run build:aplus`: A+ Active Services branded offer site for Netlify.
- `npm run build:clone`: exact Nexia clone output for fidelity checks or separate exact-clone deploys.

## GitOps

- Work on `codex/*` branches.
- Keep source changes in `scripts/`, `src/`, `public/`, config, and verification scripts.
- Do not commit `dist/`, `.netlify/`, `node_modules/`, or screenshot artifacts.
- CI builds the A+ variant and runs source/content verification.

## Deploy

The default Netlify build command is `npm run build`, which produces the A+ Active Services site.

For the exact clone site, build locally with `npm run build:clone`, prune any non-clone routes if needed, and deploy with `netlify deploy --no-build --dir=dist --site <exact-clone-site-id>` so Netlify does not regenerate the A+ variant.

## Verification

```sh
npm run build:aplus
npm run verify:aplus:source
npm run verify:aplus
```

For pixel fidelity against the original Webflow site:

```sh
npm run build:clone
npm run preview -- --port 4323
CLONE_BASE_URL=http://localhost:4323 npm run verify:clone:fidelity
```
