# SIGNOFF — "Constellation Ledger" Sovereign Stack ticker

**Component version:** 1.0.0
**Date:** 2026-08-23 (The Coder, closing pass)
**Polish passes completed:** 1–39 (see changelog.md)
**Status: SHIP**

## Final verification (P39)

| Check | Result |
|---|---|
| `node --check ticker.js` | PASS |
| Byte-parity snippet.html ↔ preview.html `<section id="tk-ticker">` | PASS — 2882 = 2882 bytes |
| All 6 `/assets/logos/*.svg` referenced resolve on disk | PASS |
| Every `tk-` class in markup exists in ticker.css | PASS (`tk-inview`/`tk-paused` are JS-applied state classes, documented) |
| JS query targets (`#tk-ticker`, `.tk-marquee`) present in markup | PASS |
| SVG crispness at 28px height / 2× DPR | PASS — all six SVGs are viewBox-only (100×100), no fixed pixel width/height attrs; snippet `<img>` tags carry no width attributes; CSS sizes via height only |
| Print rendering | PASS by construction — §9 @media print collapses to one static row of logos + names |

## Known limitations (accepted, documented)

1. **Horizontal focus-ring clipping at marquee edges** — the cyan
   `:focus-visible` outline clips at the left/right overflow boundaries of the
   marquee viewport. Inherent to any masked marquee; edges are mask-faded
   anyway (judged P33).
2. **Mid-ignition un-hover re-applies the stagger once** — worst case a logo
   holds pre-ignition values up to 600ms if the cursor leaves mid-wave.
   Happens at most once per page load; fixing it would need JS-driven motion
   phases, breaking the CSS-only contract (audited P32).
3. **Fixed 46s duration scales px/s with content** — adding logos speeds the
   drift (~74px/s at 8 items). Still inside marquee norms; documented seam
   constraint at §3 (P29).
4. **Print/light-scheme guards are best-effort** — the component is tuned for
   the permanently-dark production page; print and light-context blocks cover
   readability but are not pixel-tuned experiences.

## Professional judgment

**SHIP.** The component meets its spec budget exactly (IntersectionObserver +
class toggles, no rAF), degrades correctly in every direction tested (no-JS,
reduced motion, ≤480px, light context, print), passes byte-parity between the
snippet and the verified preview, and every rule in ticker.css traces to a
logged decision in changelog.md. Passes 36–39 were genuinely closing-phase:
one real-world correctness rule (print), two verifications that required zero
code change (DPI sanity, integration checklist), and this sign-off. Nothing
left on the table that earns another pass.
