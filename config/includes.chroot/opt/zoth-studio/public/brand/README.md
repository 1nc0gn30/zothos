# Zoth Studio — Sacred Geometry & Brand Identity Design System

> **The Cyber-Alchemical Visual Language & Master Brand System**  
> *Sacred Geometry ($\Phi = 1.6180339887$) · Fibonacci Scales · Pure Vector Seals · 4-Theme Token Matrix*

---

## 1. Brand Philosophy & Cyber-Alchemical Doctrine

Zoth Studio's visual identity bridges Renaissance hermetic alchemy with high-performance sovereign cybernetics. The brand language rejects generic corporate minimalism and ephemeral trend cycles in favor of timeless mathematical harmony: the Golden Ratio ($\Phi$), the Fibonacci sequence, and geometric precision.

```
                  ▲
                 / \
                /   \            THE GREAT WORK OF SOFTWARE
               /  ✦  \           ──────────────────────────
              /  SOLVE\          ✦ Solve: Deconstruct entropy
             /─────────\         ✦ Separate: Triangulate models
            / \       / \        ✦ Purify: Enforce local zero-telemetry
           /   \  ✦  /   \       ✦ Coagulate: Synthesize immutable tools
          / COAG\   / SEPAR\
         /───────\ /────────\
        ◄─────────▼──────────►
```

### Core Brand Axioms

1. **Sacred Mathematical Harmony**: Every margin, padding, typography step, and viewport split adheres to the Fibonacci sequence and the Golden Ratio ($\Phi \approx 1.6180339887$).
2. **Vector Purity**: Zero raw OS emojis or pixelated raster artifacts in user interfaces. All glyphs, seals, badges, and controls are rendered with sharp, scalable SVG vectors.
3. **Sovereign Contrast**: High-contrast, text-emphasized typography designed for long-session operator focus across all 4 system themes (`dark`, `light`, `matrix`, `gold`).
4. **Tactile Mysticism**: Crisp glowing borders, ambient radial meshes, and astrolabe geometry paired with rigorous terminal monospace code blocks.

---

## 2. Sacred Geometry & Fibonacci Scale Architecture

The Zoth Studio CSS architecture defines strict layout ratios derived directly from the Golden Section:

$$\Phi = \frac{1 + \sqrt{5}}{2} \approx 1.6180339887$$

$$\Phi^{-1} = \Phi - 1 \approx 0.6180339887$$

```css
:root {
  /* Sacred Golden Ratio Variables */
  --phi: 1.6180339887;
  --phi-inv: 0.6180339887;
  --phi-major: 61.8%;
  --phi-minor: 38.2%;
  --phi-split: 1.618fr 1fr;
  --phi-split-inv: 1fr 1.618fr;
  --phi-sidebar: 377px;
  --phi-gutter: 233px;

  /* Fibonacci Spacing Scale */
  --fib-1: 1px;
  --fib-2: 2px;
  --fib-3: 3px;
  --fib-5: 5px;
  --fib-8: 8px;
  --fib-13: 13px;
  --fib-21: 21px;
  --fib-34: 34px;
  --fib-55: 55px;
  --fib-89: 89px;
  --fib-144: 144px;
  --fib-233: 233px;
  --fib-377: 377px;
  --fib-610: 610px;

  /* Fibonacci Border Radius Scale */
  --fib-radius-xs: 5px;
  --fib-radius-sm: 8px;
  --fib-radius-md: 13px;
  --fib-radius-lg: 21px;
  --fib-radius-xl: 34px;
  --fib-radius-pill: 9999px;
}
```

### Layout Grid Composition

- **Hero & Split Views**: `grid-template-columns: var(--phi-split);` (Major focal section 61.8%, minor inspection rail 38.2%).
- **Section Breathing Room**: `margin: clamp(60px, 8vw, 100px) 0;` and `padding: clamp(60px, 8vw, 100px) 0;`.
- **Component Padding**: `padding: var(--fib-21) var(--fib-34);` for cards; `padding: var(--fib-8) var(--fib-13);` for badges and chips.

---

## 3. Typography Hierarchy & Font Scales

Zoth Studio utilizes four typeface families, each fulfilling a designated role in the cognitive hierarchy:

| Family | Classification | Weights | Primary Role |
| :--- | :--- | :--- | :--- |
| **Syne** | Geometric Display Sans | `700`, `800` | Major page titles, hero headers, master category kickers. |
| **Fraunces** | High-Contrast Optical Serif | `600`, `700` | Alchemical doctrine headings, philosophical callouts, pull quotes. |
| **Figtree** | Neo-Grotesque Body Sans | `400`, `500`, `600`, `700` | Highly readable documentation body copy, FAQ accordions, UI controls. |
| **IBM Plex Mono** | Technical Monospace | `400`, `500`, `600`, `700` | CLI snippets, agent telemetry, port matrices, hex codes, token badges. |

### Fluid Fibonacci Font Scale

```css
:root {
  --fib-font-micro: 13px;       /* Metadata, tag chips, table footnotes */
  --fib-font-body: 16px;        /* Standard prose, FAQ answer text */
  --fib-font-subhead: 21px;     /* Card titles, tool names, h3 headings */
  --fib-font-title: 34px;       /* Major section headings, h2 headings */
  --fib-font-hero: 55px;        /* Landing page titles, h1 display */
}
```

---

## 4. Master Color Tokens & 4-Theme Palettes

Zoth Studio natively ships with four mathematically balanced, WCAG AAA accessible themes toggled globally via `<html data-theme="...">`.

### Core Palette Tokens

| Token Name | Hex Code | RGB | Alchemical Role |
| :--- | :--- | :--- | :--- |
| **Astral Cyan** | `#00f0ff` | `rgb(0, 240, 255)` | Primary energy, active focus state, verified badge, AST link. |
| **Philosopher Gold** | `#fbbf24` | `rgb(251, 191, 36)` | Alchemical crests, key metrics, VIP patronage, warnings. |
| **Transmutation Purple**| `#a855f7` | `rgb(168, 85, 247)` | Autonomous agents, consensus arena, neural weight shifts. |
| **Alchemical Amber** | `#f59e0b` | `rgb(245, 158, 11)` | Daemon activity, port bindings, warm accents. |
| **Emerald Synthesis** | `#10b981` | `rgb(16, 185, 129)` | Live health status, completed tasks, sovereign verification. |
| **Cyber Magenta** | `#ff007a` | `rgb(255, 0, 122)` | Destructive operations, security locks, hot telemetry alerts. |
| **Void Obsidian** | `#03050a` | `rgb(3, 5, 10)` | Default background canvas for zero-light emission. |
| **Surface Slate** | `#090d18` | `rgba(9, 13, 24, 0.92)` | Floating tool card backings, modal drawers, navigation docks. |

---

### The 4 Theme Specifications

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ 1. DARK (Void)  │ 2. LIGHT (Dawn) │ 3. MATRIX (CRT) │ 4. GOLD (Opus)  │
│                 │                 │                 │                 │
│ Bg: #03050a     │ Bg: #f7f9fc     │ Bg: #020804     │ Bg: #0c0802     │
│ Surface: #090d18│ Surface:#ffffff │ Surface:#041508 │ Surface:#1c1305 │
│ Accent: #00f0ff │ Accent: #0284c7 │ Accent: #34d399 │ Accent: #fbbf24 │
│ Text: #f0f6fc   │ Text: #111827   │ Text: #a7f3d0   │ Text: #fef3c7   │
│ Border: Cyan/20 │ Border: Slate/20│ Border: Green/30│ Border: Amber/30│
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

#### 1. Default Dark (`dark`)
- Background: Void Black `#03050a` / Deep Space `#050508`
- Text: Primary `#f0f6fc`, Muted `#8b949e`, Bright `#ffffff`
- Accents: Electric Cyan `#00f0ff` & Philosopher Gold `#fbbf24`
- Best For: Primary workstation environment, low-light late-night hacking, OLED displays.

#### 2. Alchemical Dawn (`light`)
- Background: Cloud White `#f7f9fc` / Warm Parchment `#f1f5f9`
- Text: Deep Dark Ink `#111827`, Muted Charcoal `#4b5563`
- Accents: Alchemical Bronze `#92400e`, Precision Blue `#0284c7`, Warm Amber `#d97706`
- Best For: Daylight audits, executive presentations, PDF/paper export fidelity.

#### 3. Phosphor Terminal (`matrix`)
- Background: Deep Matrix Black `#020804` / Sub-Phosphor `#041508`
- Text: Phosphor Green `#a7f3d0`, CRT Mint `#34d399`
- Accents: Emerald `#10b981` & Terminal Bright `#6ee7b7`
- Best For: Focused CLI sessions, real-time agent log streaming, security sweeps.

#### 4. The Grand Opus (`gold`)
- Background: Ancient Obsidian `#0c0802` / Smoked Amber `#1c1305`
- Text: Alchemical Parchment `#fef3c7`, Warm Gold `#fde68a`
- Accents: Imperial Gold `#fbbf24` & Royal Sun Amber `#f59e0b`
- Best For: Architecture showcases, patron portals, ceremonial releases.

---

## 5. Alchemical Seals & Vector Asset Catalog

All seals are vector-native SVG artworks designed on circular and hexagonal coordinate geometry.

```
               .---.               /═════\             .---.
              / / \ \             /       \           /  |  \
             | | ✦ | |           │    ✦    │         |───┼───|
              \ \ / /             \       /           \  |  /
               '---'               \═════/             '---'
            GRAND SEAL          HEXAGONAL CUBE     MINIMAL GLYPH
```

| Asset Name | Canonical Vector File | Raster Master | Description & Sacred Usage |
| :--- | :--- | :--- | :--- |
| **The Grand Astrolabe Seal** | `/assets/brand/zoth-seal-mask.svg` | `zoth-seal-mask-512.jpg` | The master seal of Zoth Studio. Features concentric transmutation rings, 12 zodiac houses, and the sacred tetragrammaton core. Used for hero headers and official releases. |
| **Hexagonal Cube of Space** | `/assets/brand/zoth-hex-seal.svg` | `zoth-hex-seal-512.png` | 6-vertex sacred boundary seal representing the isolation of the local runtime from external network entropy. Used for security badges and vault locks. |
| **Minimalist Operator Monad** | `/assets/brand/zoth-glyph-monad.svg` | `zoth-glyph-128.png` | Streamlined geometric monogram. Retains optical clarity down to 16x16px. Used as the default browser favicon, CLI prompt icon, and app dock icon. |
| **Transmutation Matrix Crest** | `/assets/brand/zoth-transmutation.svg`| `zoth-matrix-512.png` | 4-quadrant astrolabe representing the Solve, Separate, Purify, and Coagulate workflow steps. Used across CI/CD and build tooling. |
| **Azoth the Alchemical Dragon**| `/assets/brand/azoth-crest.svg` | `/assets/mascot/azoth-portrait.jpg` | Official brand mascot and autonomous workstation guardian portrait. Used for interactive assistant dialogues and mascot popups. |

---

## 6. Clearspace, Sizing & Rendering Rules

To preserve visual dignity and legibility across all platforms, adhere strictly to these bounding rules:

```
        ┌──────────────────────────────────────────────┐
        │  X = 0.618 × Radius                          │
        │                                              │
        │        ┌────────────────────────────┐        │
        │        │   ▲                        │        │
        │   X    │  / \        GRAND          │   X    │
        │        │ / ✦ \        SEAL          │        │
        │        │ ─────                      │        │
        │        └────────────────────────────┘        │
        │                                              │
        │  X = 0.618 × Radius                          │
        └──────────────────────────────────────────────┘
```

1. **Clearspace**: Maintain a minimum exclusion zone of $0.618 \times \text{Radius}$ around any seal asset where no foreign typography, buttons, or competing graphics may intrude.
2. **Minimum Digital Size**:
   - Grand Seal: Minimum width `64px` (recommended `120px+`).
   - Minimalist Monad: Minimum width `16px`.
3. **Contrast Guarantee**: When rendering on custom backgrounds, always ensure a minimum contrast ratio of `4.5:1` for normal text and `3:1` for vector seal line-art.
4. **Color Adaptability**: All vector SVGs must use `currentColor` for strokes and fills where appropriate, allowing seamless adaptation to whichever of the 4 themes is active.

---

## 7. Brand Doctrine: Do's & Don'ts

```
┌──────────────────────────────────────┬──────────────────────────────────────┐
│  DO (The Sacred Path)                │  DON'T (The Heretical Path)          │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ ✓ Use pure inline/referenced SVGs.   │ ✗ Don't use raw OS emojis in headers.│
│ ✓ Adhere to Fibonacci spacing scales.│ ✗ Don't use arbitrary margins (e.g.  │
│                                      │   margin-top: 17px or 43px).         │
│ ✓ Use CSS variables from the 4-theme │ ✗ Don't hardcode static hex colors   │
│   palette system.                    │   inside component stylesheets.      │
│ ✓ Maintain generous section padding  │ ✗ Don't cram content without 60-100px│
│   (clamp 60px to 100px).             │   breathing room between blocks.     │
│ ✓ Pair Syne display headings with    │ ✗ Don't mix more than 3 unrelated    │
│   IBM Plex Mono technical snippets.  │   font families in a single view.    │
│ ✓ Provide interactive copy buttons   │ ✗ Don't leave color tokens or code   │
│   on all color codes and tokens.     │   unselectable or uncopyable.        │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 8. Developer Asset Export & Token Integration

### Accessing Local Assets

All official vectors and images are stored within the core repository:

```bash
# Vector Seals
/assets/brand/zoth-seal-mask.svg
/assets/brand/zoth-hex-seal.svg
/assets/brand/zoth-glyph-monad.svg

# Mascot Portraits & Wallpapers
/assets/mascot/azoth-portrait.jpg
/assets/media/brand-system-overwatch.jpg
```

### Importing Design Tokens into Web Applications

```html
<!-- Include Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">

<!-- Include Master Theme & Nav Stylesheets -->
<link rel="stylesheet" href="/assets/zoth-theme.css?v=11">
<link rel="stylesheet" href="/assets/zoth-theme-light.css?v=11" id="zoth-theme-light-css">
<script src="/assets/zoth-theme.js?v=11"></script>
```

### Programmatic Theme Switching

```javascript
// Switch theme across all Zoth Studio surfaces
function setZothTheme(themeName) {
  // Accepted values: 'dark', 'light', 'matrix', 'gold'
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('zoth-theme', themeName);
}
```

---

*Authored by the Zoth Studio Brand & Typography Guild · Verified for Local Sovereign Workstations.*
