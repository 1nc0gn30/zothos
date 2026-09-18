# TICKER VARIANT A — "Institutional" · Design Spec (Design Lead)

## Role split
- **Design Lead (me)**: this file + `ticker.css` (`tk-` prefixed classes).
- **Interaction Engineer**: `ticker.js` — builds against the contract below.
- **Content/QA**: asset verification, responsive + a11y audit.

## Visual direction
Stripe/Linear partner-wall restraint on Zoth's dark canvas:
- Single-row marquee, desktop; hairline `1px` top/bottom rules framing the strip.
- Generous whitespace: logos at 24px height, 88px gap (`var(--fib-21)`-ish rhythm via local token `--tk-gap`).
- Label row: IBM Plex Mono, 0.62rem, letter-spacing 0.22em uppercase muted — "RUNS WITH THE SOVEREIGN STACK" with a small gold tick before it.
- Logos rendered **monochrome by default** (`grayscale(1) brightness(1.6) opacity .45`). On hover: filter removed, opacity 1, label brightens white, and an underline accent (gold→cyan gradient) fades in under the item. No scale transform (that's Variant-B energy); only a subtle translateY(-1px) is allowed. Transition 300ms cubic-bezier(0.22,1,0.36,1).
- Edge fade masks at 6%/94% so items dissolve into whitespace rather than clip hard.

## Motion
- Marquee: 46s linear infinite, translateX(-50%), GPU-only (`transform`), duplicated track content for seamless loop.
- Staggered fade-in when scrolled into view: each `.tk-logo` starts `opacity:0; translateY(6px)`, transitions in with per-item delay `calc(var(--i) * 55ms)` capped ~600ms. Trigger = `.tk-inview` added to the section root.
- Pause on hover (desktop) and pause-on-tap (touch): toggling `.tk-paused` on the marquee sets `animation-play-state: paused`.

## CONTRACT for ticker.js
1. Root element carries id `tk-ticker` and class `tk-stack`. JS must:
   - **IntersectionObserver** (threshold 0.25, once): add `tk-inview` to `#tk-ticker`.
   - **Touch tap** on `.tk-marquee`: toggle `tk-paused`; also add `tk-paused` on `mouseenter`, remove on `mouseleave`.
2. JS may set `style="--i:N"` on each `.tk-logo` OR rely on markup already carrying it (markup includes it; JS doesn't need to).
3. Do not animate layout properties. Only `transform` / `opacity` / `filter`.
4. Reduced motion: CSS handles everything under `prefers-reduced-motion: reduce`; JS should skip observers/toggles if `matchMedia('(prefers-reduced-motion: reduce)').matches`.

### Class contract (owned by ticker.css)
| Class | Element | Purpose |
|---|---|---|
| `tk-stack` | section root | spacing, border-top rule |
| `tk-head` | label row | flex label + hairline |
| `tk-label` | span | mono eyebrow text |
| `tk-rule` | span | flex-grow hairline separator |
| `tk-marquee` | div | overflow hidden, masks; gets `tk-paused` |
| `tk-track` | div | flex, width max-content, animation `tk-scroll` |
| `tk-logo` | a/span | one partner item; `--i` custom prop for stagger |
| `tk-logo img` | img | 24px height, monochrome filter default |
| `tk-logo .tk-name` | span | mono caption |
| `tk-stack.tk-inview .tk-logo` | — | reveal state |

Modifier: `tk-logo--dup` on the aria-hidden duplicate set (visually identical).

## Mobile behavior
- ≤720px: marquee persists but slows to 60s and gap tightens; tap-to-pause is the primary control (JS contract #1).
- ≤480px fallback option: track wraps into a centered 3-column-ish grid, mask removed — handled purely in CSS via `@media` (engineer needs no extra work).

## Reduced motion
Marquee stops, duplicates hidden, grid wrap, all transitions off. Fully specified in `ticker.css`.

## Assets
Logos live at `/assets/logos/*.svg` (absolute path from site root — same as current markup). QA: verify all referenced files exist before sign-off.
