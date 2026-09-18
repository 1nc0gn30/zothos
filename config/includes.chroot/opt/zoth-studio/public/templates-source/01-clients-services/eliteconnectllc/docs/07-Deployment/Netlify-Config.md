# Netlify Config

## Build Settings

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

## Forms Detection

Netlify automatically detects forms with `data-netlify="true"` at build time. No function needed for basic form handling.

## Redirects

`public/_redirects`:
```
/thank-you    /thank-you/    301
/client-portal  /client-portal/  301
```

## Headers

Recommended additions to `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## Domain Setup

- Primary: `eliteconnectva.com`
- Redirect `www` → apex
- SSL: Auto-provisioned by Netlify

## Post-Deploy Checklist

1. [ ] Build completes without errors
2. [ ] All pages render (no 404s)
3. [ ] Forms appear in Netlify dashboard
4. [ ] Submit test form → check inbox
5. [ ] Dark mode toggle persists
6. [ ] Logo swaps correctly in both modes
7. [ ] Mobile nav opens/closes
8. [ ] Page loader animates on first load

## Related

- [[05-Forms-Functionality/Netlify-Forms\|Netlify Forms]]
- [[01-Overview/Project-Architecture\|Project Architecture]]
