---
name: ghl-form-embed
description: Embed GoHighLevel (LeadConnector) inline contact/quote forms safely in Astro, HTML, or React projects. Use when Codex needs to (1) add a GoHighLevel form to a page, (2) fix a GHL form that disappears, reloads, or fails to stay loaded, (3) refactor an existing GHL embed that has skeleton loaders, custom postMessage handlers, or duplicate-ID issues.
---

# GoHighLevel Form Embed

## Overview

Embed GoHighLevel inline forms using only the official iframe + `form_embed.js`. Avoid the common failure modes that break GHL forms: duplicate element IDs, conflicting postMessage handlers, lazy-loaded iframes that get suspended, and skeleton overlays that race with the embed script.

## Quick Start

For Astro projects, copy `assets/GoHighLevelForm.astro` into `src/components/`, set the `formId` and `formName` props, and use it on any page.

For vanilla HTML, use the same iframe attributes and include `<script src="https://link.msgsndr.com/js/form_embed.js"></script>` once per page.

## Rules

### 1. One iframe per form instance; unique IDs

GHL `form_embed.js` looks up iframes by `id` and `data-layout-iframe-id`. Duplicate IDs on the same page cause the script to bind to the first one only, leaving the second form broken.

- Generate a unique `id` per component instance (counter, timestamp, or UUID suffix).
- Set `id` and `data-layout-iframe-id` to the same value.

### 2. Never use `loading="lazy"` on the iframe

Browsers defer lazy iframes until they enter the viewport, and under memory pressure may suspend or reload them. This wipes form state and causes the form to "disappear."

- Always use `loading="eager"`.
- Add `fetchpriority="high"` when the form is the primary CTA.

### 3. Do not intercept GHL postMessage events

The official embed script already handles `setHeight`, `formEmbedLoaded`, and resize messages. Custom `window.addEventListener("message", ...)` handlers race with GHL's logic, resize the iframe at the wrong time, or hide the form prematurely.

- Remove any custom `postMessage` listeners for `setHeight` / `formEmbedLoaded` / `formLoaded`.
- Remove skeleton loaders that depend on those messages.
- Let `form_embed.js` manage height and visibility.

### 4. Inject `form_embed.js` once per page

If the same component is rendered multiple times on one page, only include the script tag once.

Pattern for deduped injection:

```js
(function () {
  var src = "https://link.msgsndr.com/js/form_embed.js";
  if (!document.querySelector('script[src="' + src + '"]')) {
    var s = document.createElement("script");
    s.src = src;
    s.async = true;
    document.body.appendChild(s);
  }
})();
```

For Astro, use a client-side script block with this dedup logic instead of `<script is:inline src="...">` when the component may appear more than once per page.

### 5. No custom skeleton or fallback overlays

Skeleton loaders and fallback timers fight the embed script. They add visual flash, break accessibility, and their removal logic is fragile.

- Remove `.ghl-form-skeleton`, `.ghl-form-fallback`, and any related CSS.
- If the form loads slowly, the user sees a blank white box briefly — that is acceptable and safer than a broken overlay.

### 6. Required iframe attributes

```html
<iframe
  src="https://api.leadconnectorhq.com/widget/form/{FORM_ID}"
  style="width:100%;border:none;border-radius:8px;height:{HEIGHT}px"
  id="{UNIQUE_INLINE_ID}"
  data-layout="{'id':'INLINE'}"
  data-trigger-type="alwaysShow"
  data-trigger-value=""
  data-activation-type="alwaysActivated"
  data-activation-value=""
  data-deactivation-type="neverDeactivate"
  data-deactivation-value=""
  data-form-name="{FORM_NAME}"
  data-height="{HEIGHT}"
  data-layout-iframe-id="{UNIQUE_INLINE_ID}"
  data-form-id="{FORM_ID}"
  title="{FORM_NAME}"
  loading="eager"
  fetchpriority="high"
></iframe>
```

### 7. CSS wrapper only

Keep the wrapper minimal:

```css
.ghl-form-wrapper {
  background: var(--white, #fff);
  border-radius: 4px;
  box-shadow: 0 12px 40px rgba(14, 37, 15, 0.18);
}
```

Do not set `position: relative`, `min-height`, or `overflow: hidden` unless the design specifically requires it. Those properties can clip the iframe after GHL resizes it.

## Anti-Patterns to Remove

If auditing an existing embed, delete these patterns:

- `loading="lazy"` on the GHL iframe
- Duplicate `id="inline-..."` when the form appears twice on one page
- Custom `message` event listeners for `setHeight` / `formEmbedLoaded`
- Skeleton loaders with `opacity`/`remove` timers
- `setTimeout` fallbacks that show "Form not loading?" links
- `includeScript` Astro props that toggle script injection per instance
- `client:visible` or `client:idle` Astro directives on the form component

## Troubleshooting Checklist

1. Check browser console for `id` collisions (`document.querySelectorAll('[id^=inline-]')`).
2. Check Network tab: `form_embed.js` should load once, and the iframe src should return 200.
3. In DevTools Elements panel, confirm the iframe `id` and `data-layout-iframe-id` match.
4. Test on mobile or with low memory — lazy loading is the most common cause of "disappearing" forms.
5. If GHL form still fails after following this skill, the issue is server-side (GHL widget downtime, rate limit, or account config) — not frontend code.

## Resources

- `assets/GoHighLevelForm.astro` — Astro component template following all rules above.
