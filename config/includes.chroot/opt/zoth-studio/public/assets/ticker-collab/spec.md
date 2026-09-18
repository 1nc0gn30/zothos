# SPEC — "Constellation Ledger" (refined per direction.md) · The Visionary → The Coder

> This is the build spec for the one approved version. It is intentionally a
> refinement of `design-spec.md` (Design Lead) under the constraints of
> `direction.md` (Rubin). Where this file and design-spec.md overlap,
> **design-spec.md's class contract is canonical** (`tk-` prefix); this file
> adds the surviving-vision details and hard "don'ts". Build to both.

## What this is

A single row of partner logos at the foot of the page. Stillness with weight.
It is a signature at the bottom of a letter — glanced at, trusted, never
watched. If you notice the ticker before you notice the logos, we've failed.

**Everything from Pitch 1/3 is dead. No orbit, no rAF, no constellation lines,
no twinkle cycle, no timed sequence.** What survived of Pitch 2: fixed stars,
reading order, ignition on scroll-in, then silence.

## Structure (markup)

- Section root: `<section id="tk-ticker" class="tk-stack">` with label row
  ("RUNS WITH THE SOVEREIGN STACK", mono eyebrow + hairline rule) exactly as
  in design-spec.md.
- One `.tk-marquee` > `.tk-track` containing each `.tk-logo` (anchor or span)
  with `<img src="/assets/logos/*.svg" alt="">` plus visible text name
  (`.tk-name`) — names must exist as real text so the strip reads fully with
  CSS/JS disabled.
- Duplicate the track content once inside `.tk-track`, marked
  `aria-hidden="true"` with class `tk-logo--dup` on those items, for the
  seamless CSS loop. Duplicates are display-hidden under reduced motion.
- Each original `.tk-logo` carries `style="--i:N"` (N = 0..n-1 reading order).

## Motion (the only motion that ships)

1. **Marquee:** pure CSS keyframes, `translateX(-50%)`, 46s linear infinite.
   No JS rAF anywhere. GPU-only properties: `transform`, `opacity`, `filter`.
2. **Ignition on scroll-in:** IntersectionObserver (threshold 0.25, fire once)
   adds `.tk-inview` to `#tk-ticker`. Logos start `opacity:0;
   translateY(6px)` and transition in with delay `calc(var(--i) * 55ms)`
   capped ~600ms. Happens once. No exit animation, no repeat.
3. **Pause:** add `.tk-paused` on marquee `mouseenter` / touch-tap toggle;
   remove on `mouseleave`. Pause = `animation-play-state: paused`. Nothing
   else changes visually on pause.
4. **Hover on a logo:** monochrome filter removed, opacity 1, `.tk-name`
   brightens white, gold→cyan underline accent fades in. **No scale — at most
   `translateY(-1px)`.** Transitions 300ms cubic-bezier(0.22,1,0.36,1).

## Reduced motion (`prefers-reduced-motion: reduce`)

Static wrapped centered grid, masks off, duplicates hidden, all transitions
off. This is an equally legitimate resting state, not a fallback. JS skips
observer/pause wiring entirely when the media query matches.

## Mobile

- ≤720px: marquee persists, slows to 60s, gap tightens; tap-to-pause is the
  primary control.
- ≤480px: wrap to centered grid, drop edge-fade masks (CSS-only).

## Hard don'ts (from direction.md — treat as tests)

- No rAF loops, no 3D transforms, no depth sorting, no scale-on-hover, no
  constellation lines, no twinkle/shimmer cycles, no entrance choreography
  beyond the single staggered fade-in, no layout-property animation.
- JS budget: IntersectionObserver + two class toggles. That's the whole file.

— V · aligned with Rubin's final direction
