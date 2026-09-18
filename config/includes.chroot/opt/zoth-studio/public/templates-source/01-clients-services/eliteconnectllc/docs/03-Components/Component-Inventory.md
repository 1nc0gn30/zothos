# Component Inventory

All components are `.astro` files in `src/components/`.

## Layout

### BaseLayout.astro
- Wraps every page
- Imports `global.css`
- Handles SEO meta, OG tags, schema.org JSON-LD
- Includes [[Header]], [[Footer]], [[ThemeToggle]], page loader

## Navigation

### Header.astro
- Sticky header with backdrop blur
- Scroll-aware hide/show
- Desktop nav + mobile drawer
- Logo with light/dark swap

### ThemeToggle.astro
- Fixed bottom-right button
- Sun / moon SVG swap
- `localStorage` persistence

## Content

### HeroSection.astro
| Prop | Type | Required |
|---|---|---|
| `variant` | `"home" \| "page"` | no |
| `eyebrow` | string | no |
| `title` | string | yes |
| `lead` | string | no |
| `ctas` | `{label,href,variant?}[]` | no |
| `stats` | `{value,label}[]` | no |
| `imageDesc` | string | yes |

SVG watermark with stroke-draw animation on load.

### ServiceGrid.astro
- Consumes `services` from `src/data/site.ts`
- 3-col grid desktop, 2-col tablet, 1-col mobile
- Card hover: lift + shadow increase

### FaqList.astro
- Consumes `faqs` from `src/data/site.ts`
- Simple accordion behavior

### GoogleReviews.astro
- Static review cards (not live API)
- Clean brand-blue styling

### LeadModal.astro
- Auto-opens after 3.5s on first visit (sessionStorage)
- Backdrop blur, panel slide-in
- Close via button, backdrop click, or Escape
- Inline success state after Netlify form submit

### MediaPlaceholder.astro
- Dashed border placeholder for all images
- Props: `description`, `aspect`, `label`

## Related

- [[04-Pages/Page-Routes\|Page Routes]]
- [[05-Forms-Functionality/Lead-Modal\|Lead Modal]]
