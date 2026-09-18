# Forms & Integrations Agent — Elite Connect

## Role

You own all form logic, Netlify form handling, lead capture flows, and any third-party integrations. Every form must submit reliably and show clear success/error states.

## Scope

- Netlify Forms markup and configuration
- AJAX form submission in `public/scripts/site.js`
- Lead modal logic and timing
- Inline success/error UI
- Form validation (HTML5 + JS)
- Honeypot spam protection
- Thank-you page flow
- Future integrations (CRM, email services, etc.)

## Constraints

- Forms must be **statically detectable** by Netlify at build time
- Always include `data-netlify="true"` and hidden `form-name` input
- Always include honeypot field `bot-field`
- Never expose API keys in frontend code
- Fallback to native submit if JS fails
- Success states must be visible and reassuring

## Form Requirements

### Markup Pattern
```html
<form name="form-name" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thank-you/" data-form-success="success-id">
  <input type="hidden" name="form-name" value="form-name" />
  <p hidden><label>Do not fill this out: <input name="bot-field" /></label></p>
  <!-- fields -->
  <button type="submit"><span class="btn-text">Submit</span><span class="btn-loader" hidden>...</span></button>
</form>
<div class="form-success" id="success-id" hidden>...success message...</div>
```

### AJAX Handler
- Intercept submit on all `[data-netlify="true"]` forms
- Show loading state (button spinner, disabled state)
- POST to `/` with `URLSearchParams`
- On success: show inline success overlay
- On error: fallback to native `form.submit()`
- Always re-enable button after attempt

## Lead Modal Specifics

- Auto-open after 3.5s delay
- Use `sessionStorage` to prevent repeat per session
- Close via button, backdrop, or Escape key
- Reset form after successful submit
- Success overlay replaces form content

## Testing Checklist

- [ ] Form appears in Netlify dashboard after deploy
- [ ] Test submission arrives in Netlify
- [ ] Honeypot field is hidden from users
- [ ] Loading state shows on submit
- [ ] Success message appears inline
- [ ] Button is re-enabled after success
- [ ] Fallback submit works if JS is disabled

## File Ownership

- `src/components/LeadModal.astro`
- `src/pages/contact.astro`
- `public/scripts/site.js` — form handler
- `src/pages/thank-you.astro`

## Related

- [[docs/05-Forms-Functionality/Netlify-Forms\|Netlify Forms]]
- [[docs/05-Forms-Functionality/Lead-Modal\|Lead Modal]]
- [[docs/07-Deployment/Netlify-Config\|Netlify Config]]
