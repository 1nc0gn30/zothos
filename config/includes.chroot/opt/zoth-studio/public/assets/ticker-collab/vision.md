# SOVEREIGN-STACK TICKER — VISION PITCHES (The Visionary)

> Three concepts for the partner-logo strip. Each: the feeling, the signature moment,
> logo behavior, and one honest risk. Rubin — cut anything gratuitous.

---

## PITCH 1 — "Orbital Command"

**Feeling:** The sovereign stack is not a list of vendors — it's a solar system.
Zoth is the star; the models and tools orbit it. Watching it should feel like
looking at an orrery in a dark observatory: quiet, inevitable, alive. Authority
through physics, not through motion graphics.

**Signature moment:** A visitor hovers any orbiting logo → the entire system
*holds its breath*. The orbit freezes, that logo lifts toward the viewer with a
depth-correct scale/brightness bloom, its name fades up beneath it, and the
azoth seal at the core pulses once — as if acknowledging the introduction.
Release, and the system resumes its slow rotation exactly where it was.

**Logo behavior:** Logos ride one shared elliptical path (3D-projected:
front-of-orbit logos are larger, brighter, unoccluded; far-side logos shrink,
dim, and pass *behind* the core via z-index/depth sorting). Constant angular
velocity, ~40s per revolution. Depth = truth: no fake parallax layers, one real
ellipse computed per frame in rAF, applied as `transform3d` only.

**Risk:** It's the boldest of the three — if Rubin wants restraint he'll call
the orbit a gimmick. Mitigation is already built in: reduced-motion collapses
it to a static ring, mobile to a compact ring/horizontal scroll, and the
default speed is glacial. But it *is* a hero gesture, not a footer whisper.

---

## PITCH 2 — "Constellation Ledger" (quiet version of Pitch 1)

**Feeling:** A star chart, inked. Logos are fixed stars connected by hairline
constellation lines; nothing orbits, but the lines shimmer faintly in sequence,
like a chart being read by candlelight. Scholarly, archival, sovereign-doctrine
energy — closer to Variant A's restraint but with a soul.

**Signature moment:** On scroll-in, the constellation "draws itself": hairline
SVG strokes trace between logos over ~1.2s, then each logo ignites in reading
order (staggered opacity). After that, stillness — only a 0.05-opacity twinkle
cycles around the chart every few seconds.

**Logo behavior:** Static positions on a loose elliptical scatter (not a grid).
Hover = brighten + label reveal, same as Variant A but the underline is a tiny
star-point instead. No transforms beyond translateY(-1px).

**Risk:** Too close to Variant A. If both variants ship, they'd read as twins;
this pitch's value is mostly as a fallback if Orbit gets cut.

---

## PITCH 3 — "Forge Sequence"

**Feeling:** Alchemical. Each logo is struck into existence like a coin on an
anvil — appears with a single bright flash-and-settle, then holds. The strip is
a slow ritual procession, left to right, one logo every ~2s, never looping
visibly fast enough to feel mechanical. Gold-on-black, ceremonial.

**Signature moment:** The final logo in the sequence lands, a beat passes, then
everything dims except the azoth seal watermark behind them — the stack exists
*because of* the core. Then the cycle restarts with a soft crossfade.

**Logo behavior:** Sequential materialization (opacity + slight blur→sharp),
monochrome until "settled," then color. No marquee at all — a timed sequence.

**Risk:** Timing-driven sequences fight user attention spans and are hostile
to screen readers / SEO unless carefully doubled with static markup. Highest
engineering cost, most fragile to interruption (tab-switch, resize). Also the
most likely to feel gimmicky after the third viewing.

---

## MY RECOMMENDATION

**Pitch 1 — Orbital Command** — because it's the only one where the *core
emblem earns its place structurally*: the azoth seal isn't decoration, it's the
thing everything physically revolves around. It degrades honestly (static ring
under reduced-motion is genuinely elegant, not a broken fallback), and depth-
sorted 3D projection is cheap: one ellipse equation, transform3d writes only,
zero layout thrash. Pitch 2 is its safety twin; Pitch 3 I expect Rubin to gut.

— V
