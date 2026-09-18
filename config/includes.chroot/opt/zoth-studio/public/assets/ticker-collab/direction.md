# DIRECTION — Sovereign-Stack Ticker · Final Verdict (Rick Rubin)

I read all three pitches. Here's the truth of it.

## The soul of this thing
This ticker lives at the foot of a hermetic doctrine page. It's not a hero.
It's a signature at the bottom of a letter — quiet proof that the people
behind the words are real. The soul is **stillness with weight**. When a
visitor's eye reaches this strip, nothing should demand attention; something
should simply *be there*, correct and calm, like instruments in a case.

## Verdicts

**Pitch 1 — Orbital Command: CUT.**
Beautiful idea, wrong room. An orrery is a spectacle, and a spectacle asks
the visitor to watch it. This strip's job is to be glanced at and trusted,
not observed. The moment you build a 3D depth-sorted orbit, you've made a
toy that will feel clever exactly once. Also honest engineering concern:
per-frame rAF work for a footer element is spending the page's budget on
the least important square inch. Not the vision's fault — it's pitched at
the wrong altitude.

**Pitch 3 — Forge Sequence: CUT ENTIRELY.**
Timed ritual sequences fight the user, break under tab-switching, and are
hostile to screen readers. The Visionary predicted I'd gut this one. Gutted.
The only thing worth keeping is the *feeling* of inevitability — which we
get from restraint, not from choreography.

**Pitch 2 — Constellation Ledger: THE SEED — but strip it further.**
Even this is over-drawn. No constellation lines. No twinkle cycle. A line
that shimmers every few seconds is decoration pretending to be atmosphere.
What survives from Pitch 2 is its instinct: fixed stars, reading order,
ignition on scroll-in, then silence.

## What ships (the one true version)
A single row of logos on the dark field. That's it.

1. **One row, hairline-framed.** 1px rules above and below at very low
   contrast. The frame does the framing; nothing else decorates.
2. **Monochrome by default.** Logos sit at ~45% opacity, grayscale, like
   plates in a book. They gain full color *only* when hovered — color is
   earned by attention, never broadcast.
3. **Slow drift.** The single concession to life: a glacial marquee
   (~46s loop) that pauses when touched or hovered. If the motion were
   removed entirely the strip would still be complete — that's the test
   of whether the motion belongs. It passes.
4. **Staggered ignition on scroll-in.** Each logo fades up in reading
   order, ~55ms apart, once. Then no further entrance theatrics, ever.
5. **Reduced-motion = static wrapped grid.** Not a fallback — an equally
   legitimate resting state.
6. **No scale on hover.** At most translateY(-1px). Logos don't lunge.

## For the Coder — hard constraints
- GPU-only animation: `transform` / `opacity` / `filter`. Never layout props.
- Marquee via CSS keyframes + duplicated track (`aria-hidden`), not JS rAF.
- JS limited to: IntersectionObserver adds `.tk-inview` once;
  hover/touch toggles `.tk-paused`; respect `prefers-reduced-motion`.
- Class contract is defined in `design-spec.md` (`tk-` prefix) — my earlier
  design spec stands as the implementation reference. Build to it.
- Mobile ≤480px: wrap to centered grid, drop masks. Tap-to-pause elsewhere.
- Static markup must carry names as text — the strip reads fully with
  CSS and JS disabled.

## One-line north star
**If you notice the ticker before you notice the logos, we've failed.**

— Rubin · approved for build
