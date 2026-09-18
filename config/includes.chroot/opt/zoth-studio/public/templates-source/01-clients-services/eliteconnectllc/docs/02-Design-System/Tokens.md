# Design Tokens

All tokens live in `src/styles/global.css` under `:root` and `html.dark`.

## Font Stack

```css
--font-display: "JetBrains Mono", "SF Mono", ui-monospace, monospace;
--font-body: "DM Sans", ui-sans-serif, system-ui, -apple-system, sans-serif;
```

## Spacing Scale

| Token | Value |
|---|---|
| Section padding | `5rem 1.25rem` (desktop) / `3rem 1rem` (mobile) |
| Card padding | `1.25rem` |
| Grid gap | `1.25rem` (cards) / `1rem` (value grid) |
| Button padding | `0.85rem 1.5rem` |

## Border Radius

| Token | Value |
|---|---|
| `--radius-sm` | `4px` |
| `--radius-md` | `8px` |
| `--radius-lg` | `12px` |

## Shadows

```css
--shadow: rgba(15, 23, 42, 0.06);   /* light */
--shadow: rgba(0, 0, 0, 0.35);      /* dark */
```

Card hover: `0 12px 32px var(--shadow)`

## Z-Index

| Layer | Z |
|---|---|
| Page loader | `9999` |
| Lead modal | `100` |
| Mobile drawer | `95` |
| Mobile backdrop | `90` |
| Header | `80` |
| Theme toggle | `50` |

## Max Width

```css
--max: 1200px;
```

## Related

- [[02-Design-System/Color-Palette\|Color Palette]]
- [[03-Components/Component-Inventory\|Component Inventory]]
