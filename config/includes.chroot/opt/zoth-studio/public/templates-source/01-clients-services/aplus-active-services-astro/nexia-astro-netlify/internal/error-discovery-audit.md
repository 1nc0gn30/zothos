# A+ Active Services Error Discovery Audit

Last updated: 2026-06-28 16:30 ET

## Actual Request To Satisfy

Use the Nexia Webflow design treatment and downloaded public assets as the visual base, then build the A+ Active Services site around:

- Healthcare Hackathon Heroes: one-time $197 access.
- Free weekly masterclass, event calendar, and office hours with the trio.
- Healthcare Software Factory: quarterly AI operations and MVP retainer starting at $3K/quarter.
- Slack-informed messaging from A+ Active workspace, `#trio`, Khizar DMs, and the latest `differentiated-messaging.md` Slack file.
- Dependency-injected integrations for Stripe, Substack, Cal.com, Podcast Guest Launch, and back-office automation.
- Throughline from masterclass to newsletter/event reminder to AI Practice Audit to first workflow to retained implementation.
- Remove Webflow references in the branded deliverable and replace the footer credit with “Designed by Healthcare Engineers”.
- Deploy-ready Astro/Svelte static site for Netlify.

The exact Nexia clone remains a baseline for visual fidelity, not the final branded business deliverable.

## Error Pattern

### Error 1: Objective Drift

Observed:
- The generator default was restored to an exact Nexia clone.
- The A+ Active work became auxiliary first-party pages and optional `APLUS=1` generation.

Why it matters:
- The user’s latest substantive request asked for the Nexia treatment to sell A+ Active Services, not only a raw clone.

Fix:
- Keep exact clone as the baseline and verification harness.
- Make the branded A+ Active version the primary deploy target or provide separate scripts/output names so this is explicit.

### Error 2: Branded Pages Do Not Inherit Enough Nexia Treatment

Observed:
- `/masterclass`, `/healthcare-engineers`, `/wiki`, `/resources`, and case-study pages use a simpler custom layout.
- They share color and typography but not enough of the original Nexia motion/section structure.

Why it matters:
- User wanted the design treatment wholesale, not a newly invented static design language.

Fix:
- Either generate A+ versions of the Webflow routes as the primary pages or move first-party A+ content into localized Nexia sections.
- Reuse Webflow-derived nav/footer/CTA surfaces instead of a separate custom header where possible.

### Error 3: CTA Dependency Injection Is Only Placeholder-Level

Observed:
- `public/aplus-config.js` can contain placeholder Stripe and Cal.com URLs when real deployment values are not supplied.
- The Sweet Science Substack is wired as the newsletter example.

Why it matters:
- User explicitly asked for Stripe Link, Substack, Cal.com, and Slack automation with strong dependency injection.

Fix:
- Centralize all external URLs and labels in config.
- Add visible fallback states for placeholders.
- Add a deploy-time env/config path so real Netlify values can override placeholders without editing generated pages.

### Error 4: Slack-Derived Assets Are Not Incorporated

Observed:
- Slack messages identified trio photos and proof-of-humanity need.
- Slack file search found `Khizar's Photo.png` and `headshot.jpg`, but the connector did not expose durable static image URLs for deployment.

Why it matters:
- The request specifically calls out Slack pictures of the trio and using them for conversion-oriented placement.

Fix:
- Add a team/proof section that supports injected image URLs.
- Keep explicit image placeholders in config with documented replacement paths.

### Error 5: Acceptance Evidence Is Split Across Two Goals

Observed:
- Exact clone now has strong screenshot evidence.
- Branded A+ version has build/browser smoke but not full-route visual or conversion-flow verification.

Why it matters:
- “Exact match” evidence helps the design baseline but does not prove the A+ business site is complete.

Fix:
- Create separate verification commands:
  - `npm run verify:clone`
  - `npm run verify:aplus`
- Capture route, CTA, mobile, and visual evidence for the branded deploy target.

## Current Evidence

- `npm run build` now regenerates A+ Active pages by default with `npm run generate:aplus`.
- Slack `#trio`, Khizar DM, and `differentiated-messaging.md` have been read and summarized in `internal/slack-offer-context.md`.
- The latest differentiated messaging defines the core buyer as solo/small private-practice physician owners with documentation burden, staffing cost, and AI implementation friction.
- The local wiki confirms the lean-canvas step: masterclass -> AI Practice Audit -> first workflow -> retained managed service when scheduling, storage, payment, reminders, or tenant separation become necessary.
- `npm run build:clone` keeps the exact Nexia clone baseline available.
- Exact clone generator preserves source `data-wf-page` and local Webflow JS state.
- Exact clone visual diff across 27 cloned routes x desktop/mobile: no route over 2% mismatch.
- A+ production build succeeds.
- `npm run verify:aplus` passes on required A+ text and visible-residue checks for 10 core routes.
- `npm run verify:aplus:browser` passes rendered desktop/mobile checks for `/`, `/pricing`, `/masterclass`, `/healthcare-engineers`, and `/resources`.
- A route smoke check passed for 18 A+ and retained offer routes on `http://localhost:4322`.
- Webflow cart/nav wrappers are stripped from generated A+ pages while exact clone generation remains available.
- `/checkout`, `/product/starter-plan`, and `/product/growth-plan` are now A+ first-party CTA handoff pages instead of Webflow ecommerce checkout/add-to-cart pages.
- Source-level fake phone/social links were replaced with calendar, Substack, and inbound/factory inquiry links.
- Pricing bullets now map to the A+ offer ladder instead of generic website/branding deliverables.
- `npm run verify:aplus:source` now checks source/build output for commerce, fake contact, template-purchase, and high-risk residue.
- Project, blog, blog-post, project-detail, utility, 401, and 404 routes are now generated as A+ compatibility pages in branded mode.
- Exact clone mode was rechecked with `npm run build:clone` after A+ generator changes and still builds.
- Netlify project `aplus-active-services` was created and linked.
- Production deploy is live: `https://aplus-active-services.netlify.app`.
- Public route smoke passed against `https://aplus-active-services.netlify.app` for 18 routes.
- `npm run verify:aplus` still warns that Stripe and Cal.com links are placeholders.
- Netlify CLI is installed and authenticated.
- Netlify site is linked and deployable from the app directory.

## Task Board

### P0: Decide Primary Build Target

Owner: Main agent

Tasks:
- [x] Make the Netlify default deploy the A+ Active branded site.
- [x] Create explicit clone and A+ build scripts.
- [x] Avoid silently deploying the exact Nexia clone as if it satisfies the A+ request.

Evidence:
- `package.json` has `build`, `build:aplus`, `build:clone`, `generate:aplus`, `generate:clone`.
- `netlify.toml` calls `npm run build`, which now generates A+ first.

### P0: Restore A+ Active Branded Pages As Primary Deliverable

Owner: Main agent

Tasks:
- [x] Regenerate branded pages after exact clone baseline.
- [x] Ensure core routes mention the full offer ladder.
- [x] Remove the highest-risk visible residue from core routes.
- [x] Remove generated Webflow ecommerce cart/checkout/add-to-cart routes from the branded purchase flow.
- [x] Replace fake phone/social footer links with A+ calendar/newsletter/inbound routes.
- [x] Rewrite pricing/product source-level purchase surfaces around the A+ offer ladder.
- [x] Replace deeper generic blog/project copy with healthcare-specific field notes and proof.

Evidence:
- `npm run verify:aplus` checks for “Healthcare Hackathon Heroes”, “Healthcare Software Factory”, “AI Practice Audit”, “private-practice”, and “Designed by Healthcare Engineers”.
- `npm run verify:aplus` currently passes on forbidden visible residue for the 10 core routes.

### P0: CTA And Integration Config

Owner: Routing/CTA subagent audit, then main agent implementation

Tasks:
- [x] Keep external A+ links in `public/aplus-config.js`.
- [x] Support Stripe membership, Stripe retainer/contract, Substack, Cal.com calendar, inbound request, and Podcast Guest Launch metadata.
- [x] Generate `public/aplus-config.js` from build-time environment variables for Netlify/local overrides.
- [x] Add placeholder warnings through `npm run verify:aplus`.
- [ ] Replace placeholder Stripe and Cal.com URLs with real links when available.

Evidence:
- One config file or generated config module controls all CTAs.
- `scripts/generate-aplus-config.mjs` reads `APLUS_COLLECTIVE_STRIPE_URL`, `APLUS_RETAINER_STRIPE_URL`, `APLUS_CALENDAR_URL`, `APLUS_SUBSTACK_URL`, `APLUS_INBOUND_URL`, `APLUS_PODCAST_GUEST_LAUNCH_URL`, and trio image/calendar env vars.
- Browser check proves all `[data-aplus-link]` anchors resolve from config.

### P1: Slack-Informed Proof And Team Section

Owner: Content subagent audit, then main agent implementation

Tasks:
- [x] Add trio/proof-of-humanity section.
- [x] Support configurable image sources for Jai, Khizar, and the third trio member.
- [x] If real Slack images cannot be downloaded, provide drop-in file paths and use styled placeholders.

Evidence:
- Section exists in generated Webflow-derived pages and shared `AplusPage.astro`.
- `public/aplus-config.js` exposes `trio[].imageUrl` slots.
- `internal/slack-offer-context.md` records the Slack image evidence and why image URLs remain drop-in config values.
- `npm run verify:aplus` requires “Proof of humanity”.
- `npm run verify:aplus:browser` passes on desktop/mobile.

### P1: Route And Information Architecture

Owner: Routing/CTA subagent audit, then main agent implementation

Tasks:
- Keep or improve routes: `/`, `/masterclass`, `/healthcare-engineers`, `/wiki`, `/resources`, `/case-studies/*`, `/pricing`, `/contact`.
- Make nav and dropdown routes match the branded A+ journey.
- [x] Avoid Webflow ecommerce cart dead ends if external Stripe is the payment path.
- [x] Remove template utility links from generated Webflow dropdowns or noindex/redirect those routes.
- [x] Replace fake portfolio project names with healthcare proof/case-study destinations.
- [x] Replace template blog cards/posts with Substack/Healthcare Heroes field-note framing.

Evidence:
- Route smoke test passes.
- CTA click map matches user’s offer ladder.

### P1: Verification Harness

Owner: Main agent

Tasks:
- [x] Add visible-copy/residue checks for A+ core routes.
- [x] Keep screenshot diff harness artifacts for exact clone.
- [x] Add rendered DOM/CTA checks for A+ mobile and desktop.
- [x] Run A+ route smoke for key routes.
- [x] Promote route smoke into an npm script.
- [x] Add source-level residue verification for checkout/cart/template/fake-contact patterns.

Evidence:
- `npm run build` passes.
- Verification scripts emit deterministic summaries under `artifacts/`.
- `artifacts/verify-aplus.json` and `artifacts/verify-aplus-browser.json` are written by verification.

### P2: Netlify Deployment

Owner: Main agent

Tasks:
- [x] Create/link Netlify site.
- [x] Deploy the intended branded output after verification.
- [x] Record deploy URL.

Evidence:
- `netlify deploy --prod --dir=dist` succeeded.
- Production URL: `https://aplus-active-services.netlify.app`.
- Latest unique deploy URL: `https://6a41829912beeab84b9f5b99--aplus-active-services.netlify.app`.
- Public route smoke: `APLUS_BASE_URL=https://aplus-active-services.netlify.app npm run verify:routes` passed.

## Subagent Assignments

- James: content, Slack mapping, offer ladder copy gaps. Completed.
- Cicero: routes, CTAs, config, Netlify readiness. Completed.
- Aquinas: objective adherence and failure-mode checklist. Completed.

## Subagent Findings Incorporated

- The A+ layer existed, but the deliverable was still a Nexia clone with partial overlays.
- A+ must be the default deploy target; exact clone should remain an explicit baseline.
- Runtime mutation is insufficient for SEO/source correctness; generation must brand source output.
- Webflow commerce/cart/template promo artifacts conflict with Stripe/Substack/Cal.com dependency injection.
- Placeholder Stripe and Cal.com URLs remain the main external-state blocker.
- Proof-of-humanity/team image placement needs real Slack/headshot image URLs, but the layout/config slots are present.
- The high-conviction offer copy is now private-practice AI operations rather than generic MVP language.
- Product and checkout pages must be owned A+ pages, not Webflow ecommerce pages. Implemented.
- Footer contact/socials must not ship fake phone/social/template links. Implemented for generated A+ output.

## Next Main-Agent Sequence

1. Replace placeholder Stripe and Cal.com URLs when real links are supplied.
2. Add durable team headshot URLs or local licensed images when available.
3. Optionally run a fresh full visual-diff sweep for the exact clone baseline if the final acceptance path is clone-only rather than A+ branded deployment.

## Current 30-Minute Self-Directed Queue

1. P0 external links: set `APLUS_COLLECTIVE_STRIPE_URL`, `APLUS_RETAINER_STRIPE_URL`, and `APLUS_CALENDAR_URL` in Netlify when the final links exist.
2. P1 headshots: replace `trio[].imageUrl` placeholders with durable public/local image URLs.
3. P1 exact-clone acceptance: rerun the full visual diff if final review is against raw Nexia clone fidelity.
