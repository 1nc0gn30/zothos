# Netlify Forms

## How It Works

1. Astro compiles forms to static HTML at build time
2. Netlify parses the HTML and registers each form by `name`
3. Submissions go to Netlify dashboard → Forms
4. AJAX handler in `site.js` intercepts submit for smooth UX
5. Fallback: native form submit if JS fails

## Form Definitions

### `lead-capture` (Lead Modal)
- **Fields:** name, phone, email, customer-type, service
- **Honeypot:** `bot-field`
- **Success:** Inline overlay inside modal
- **Redirect:** `/thank-you/` (fallback)

### `consultation` (Contact Page)
- **Fields:** name, email, phone, city, customer-type, service, urgency, message
- **Honeypot:** `bot-field`
- **Success:** Inline overlay inside form wrapper
- **Redirect:** `/thank-you/` (fallback)

## Required Markup

```html
<form name="form-name" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thank-you/">
  <input type="hidden" name="form-name" value="form-name" />
  <p hidden><label>Do not fill this out: <input name="bot-field" /></label></p>
  <!-- fields -->
</form>
```

## AJAX Handler

In `public/scripts/site.js`:
- Intercepts `submit` on all `[data-netlify="true"]` forms
- `fetch('/', { method: 'POST', body: URLSearchParams })`
- Shows loading state (button spinner)
- Shows inline success if `data-form-success` attribute set
- Falls back to `form.submit()` on error

## Testing

Submit a test entry after each deploy. Check Netlify dashboard > Forms > form-name > Submissions.

## Related

- [[05-Forms-Functionality/Lead-Modal\|Lead Modal]]
- [[07-Deployment/Netlify-Config\|Netlify Config]]
