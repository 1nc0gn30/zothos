# Constellation Ledger — Sovereign Stack ticker

A single-purpose marquee component for `zoth/index.html`: six supported model
provider logos (Claude, Gemini, Grok, DeepSeek, Cerebras, Nous Research) drifting
endlessly behind a gold-dotted mono label — "RUNS WITH THE SOVEREIGN STACK".

## Files

| File | Role |
|---|---|
| `ticker.css` | Class-contract owner. All styling, motion, breakpoints, reduced-motion grid. |
| `ticker.js` | Interaction layer. IntersectionObserver ignition + pause state via class toggles only. No rAF. |
| `snippet.html` | The exact drop-in markup (verbatim copy into `zoth/index.html`). |
| `preview.html` | Standalone render rig inside a faithful replica of the real `#alchemical-doctrine` / `.alchemical-deck` context — open in a browser without touching `zoth/index.html`. Includes dev-only init timing instrumentation (console). |
| `changelog.md` | One line per change, passes 1–35. |
| `vision.md` → `direction.md` → `spec.md` / `design-spec.md` | The design story. |

## Design story

- **Vision** — a "ledger of sovereigns": logos as quiet constellation entries,
  monochrome and muted at rest, igniting to full color under attention.
- **Direction** — glacial-but-alive linear marquee (~57px/s), hairline rules above
  and below, gold→cyan accent language, mono micro-typography with wide tracking.
- **Spec** — `tk-` prefixed class contract, GPU-only animated properties
  (transform/opacity/filter), one staggered fade-in on scroll-in (55ms×--i, capped
  600ms), hover = full color + -1px lift + underline accent, no scale.

## Integration into `zoth/index.html`

1. **Replace** the existing `.sovereign-stack` block with the contents of
   `snippet.html` (the whole `<section id="tk-ticker" class="tk-stack">…</section>`).
2. **Add** to `<head>` (or before `</body>`):
   ```html
   <link rel="stylesheet" href="/assets/ticker-collab/ticker.css" />
   <script src="/assets/ticker-collab/ticker.js" defer></script>
   ```
3. The component reads site tokens with safe fallbacks:
   `--font-mono`, `--gold`, `--cyan`, `--mute`, `--line`, `--fib-*`. If the page
   defines them, it inherits; if not, the fallbacks match the intended look.
4. Verify with `preview.html`: serve `core-app/public` and open
   `/assets/ticker-collab/preview.html`. It imports the **real site tokens**
   (`--gold`, `--cyan`, `--line`, `--fib-*`, fonts) verbatim from
   `zoth/index.html`'s `:root`, so what you see is production rendering.

## Hover micro-feel A/B (preview only)

Open the preview with `?hover=b` to compare hover easings:

- **A** (default / no param) — `cubic-bezier(0.22, 1, 0.36, 1)` — production curve.
- **B** (`?hover=b`) — `cubic-bezier(0.34, 1.3, 0.64, 1)` — slightly springier
  (mild overshoot on the -1px lift and underline accent).

To flip a winner into production permanently, change `--tk-ease` in
`ticker.css` §1 to the winning curve — that single token drives every
transition (logos, names, underline). Nothing else needs touching.

## Design Decisions (appendix)

| Decision | Rationale | Pass |
|---|---|---|
| 46s marquee loop (~57px/s desktop) | Glacial-but-alive: a full logo set crosses a viewport in ~17s; longest name holds ~24s of visibility (10× past the 4s readability floor). 60s at ≤720px keeps the same feel at narrower widths. | P13, re-verified P20 |
| `--i` stagger capped at 600ms (`calc(min(var(--i) * 55ms, 600ms))`) | Ignition reads as one wave, not a per-item relay; cap keeps total reveal ≤1.2s even if items are added. Distinct from the 300ms hover transition so attention states stay snappy. | P2 |
| Pre-ignition hide gated on `.tk-armed` | Progressive enhancement: `.tk-armed` is added by ticker.js before observing. If JS never runs, logos render visible at rest — ignition can only enhance, never hide content. | P21 |
| Hover lift capped at `translateY(-1px)`, no scale | Direction.md forbids anything that makes the ticker perform. -1px is perceptible as "alive" without drawing the eye; scale would break the shared optical axis of logo + mono text. | Spec / P8 |
| Per-item `margin-right` instead of flex `gap` on the track | Track width must be exactly 2× one set for a seamless `translateX(-50%)` loop; `gap` reintroduces a half-gap jump at the seam. | P1 |
| Explicit linear timing + `translateZ(0)` layer on track | Firefox must never inherit an eased timing; the forced compositing layer kills Safari's masked-track repaint flicker each loop. | P7 |
| Optical normalization (+2/+3/+1px img heights) | All six SVGs share a 100×100 viewBox but fill it differently; Grok/Cerebras/DeepSeek read small at equal rendered height. Applied to the img only, so the hover transform on the link stays untouched. | P8 |
| Pause via single `tk-paused` class + sticky-intent flag | One source of truth survives hybrid-device synthesized mouse events, focus races, and tab switches with zero rAF or per-frame work. | P9 |
| Focus pause with deferred `focusout` (one tick) | Tabbing between adjacent logos would otherwise flicker paused↔running between focusout/focusin. | P6, P9 |
| Reduced-motion = wrapped static grid, not a fallback | Equal resting state: same rules, masks, spacing parity; only motion removed. Alignment lift kept because it's alignment, not animation. | P4 |
| Muted label contrast raised to rgba(255,255,255,.62) | ~5.9:1 on the dark ground — quiet but readable; still visually subordinate to page content. | P5 |
| Hairline rules above AND below the strip | direction.md's ledger frame: the strip settles the page after the bright gold deck instead of competing with it. | P1, judged again P19 |

## Minification

The shipped `ticker.css` / `ticker.js` are deliberately unminified — commented,
sectioned, and meant to be read. If bundle size matters at integration time, a
minified pair (`ticker.min.css` / `ticker.min.js`) can be generated at that point
(e.g. `lightningcss --minify` and `terser`) without touching this source. Do not
edit the minified copies by hand; regenerate from these sources.

## Don'ts

- **Don't rename or remove any `tk-` class** — CSS and JS both own the contract;
  `.tk-paused` / `.tk-inview` are applied by JS, not present in markup.
- **Don't add flex `gap` to `.tk-track`** — per-item margins make track width exactly
  2× one set so `translateX(-50%)` loops with zero seam. `gap` reintroduces a half-gap jump.
- **Don't animate layout properties** (width/margin/padding) — GPU props only.
- **Don't remove the duplicate logo set or its `aria-hidden`** — it *is* the seamless loop.
- **Don't touch the hover specificity** — `.tk-stack .tk-logo:hover` deliberately matches
  `.tk-stack.tk-inview .tk-logo`; lower it and hover inherits up to 600ms stagger delay.
- **Don't add JS features** (rAF loops, per-frame work, autoplay controls) — the budget is
  IntersectionObserver + class toggles, full stop.
- **Don't strip the reduced-motion block** — it's an equal resting grid, not a degraded fallback.

## INTEGRATION CHECKLIST

Copy-paste-ready. Do these in order; each step depends on the last.

1. **Replace the old block** in `core-app/public/zoth/index.html` (~lines
   1153–1170): delete the entire `<div class="sovereign-stack" …> … </div>`
   block (from `<!-- Supported tools / Sovereign Stack logo strip -->` through
   its closing `</div>`) and paste in its place the full `<section id="tk-ticker"
   class="tk-stack" …>` block from `snippet.html` — byte-for-byte, no edits.
2. **Add the stylesheet** inside `<head>` of `zoth/index.html`:
   ```html
   <link rel="stylesheet" href="/assets/ticker-collab/ticker.css" />
   ```
3. **Add the script** before `</body>` (or with the other deferred scripts):
   ```html
   <script defer src="/assets/ticker-collab/ticker.js"></script>
   ```

### Post-integration smoke tests

- [ ] Hard-reload `http://127.0.0.1:8088/zoth/`; DevTools Network shows
      `ticker.css` and `ticker.js` both **200**, no 404s for any
      `/assets/logos/*.svg`.
- [ ] Scroll to the deck: strip ignites once with a staggered fade-in wave;
      scrolling away/back does NOT re-run it.
- [ ] Hover a logo: full color + gold→cyan underline within ~300ms, strip pauses;
      mouse out resumes drift.
- [ ] Tab onto a logo: cyan focus ring fully visible (not clipped top/bottom),
      strip paused while focused.
- [ ] Tap on mobile (≤720px): pause toggles; vertical page scroll still works.
- [ ] Narrow to ≤480px: wraps to a centered static grid, exactly 6 logos,
      no ghost duplicates.
- [ ] OS "reduce motion" on: static wrapped grid at rest; hover still works.
- [ ] Print preview (Ctrl+P): one clean static row of logos + names.
- [ ] Disable JS and reload: logos visible at rest (no blank strip).
