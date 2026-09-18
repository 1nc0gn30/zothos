# Color Palette

## Light Mode (`:root`)

| Token | Hex | Usage |
|---|---|---|
| `--ink` | `#0f172a` | Primary text |
| `--muted` | `#475569` | Secondary text |
| `--soft` | `#64748b` | Tertiary labels |
| `--paper` | `#f0f4f8` | Page background |
| `--surface` | `#ffffff` | Cards, panels |
| `--surface-2` | `#e8edf3` | Footer background |
| `--panel` | `#f8fafc` | Section bands |
| `--line` | `rgba(15,23,42,0.08)` | Borders |
| `--line-strong` | `rgba(15,23,42,0.18)` | Input borders |
| `--shadow` | `rgba(15,23,42,0.06)` | Card shadows |

## Dark Mode (`html.dark`)

| Token | Hex | Usage |
|---|---|---|
| `--ink` | `#f0f4f8` | Primary text |
| `--muted` | `#94a3b8` | Secondary text |
| `--soft` | `#64748b` | Tertiary labels |
| `--paper` | `#0a0e14` | Page background |
| `--surface` | `#111827` | Cards, panels |
| `--surface-2` | `#1e293b` | Footer background |
| `--panel` | `#111827` | Section bands |
| `--line` | `rgba(148,163,184,0.12)` | Borders |
| `--line-strong` | `rgba(148,163,184,0.25)` | Input borders |
| `--shadow` | `rgba(0,0,0,0.35)` | Card shadows |

## Accent Colors (both modes)

| Token | Value | Usage |
|---|---|---|
| `--accent` | `#f59e0b` | CTA base |
| `--accent-deep` | `#d97706` | CTA shadow |
| `--brand-blue` | `#76A8CD` | Links, accents, focus rings |
| `--brand-blue-deep` | `#5A8DB5` | Hover states |
| `--brand-blue-glow` | `rgba(118,168,205,0.15)` | Focus outlines |

## Dark Mode Toggle

- Persistent via `localStorage` key `eliteconnect-theme`
- Class `dark` added to `<html>` element
- `color-scheme: dark` set on `html.dark`
- Logo swaps via JS `MutationObserver`

## Related

- [[02-Design-System/Tokens\|Design Tokens]]
- [[01-Overview/Brand-Identity\|Brand Identity]]
