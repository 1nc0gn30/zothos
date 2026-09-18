# GHL Form Tracking with GA4 + Netlify Functions

This document describes how form submissions from the GoHighLevel (GHL) iframe on poolefencingllc.com are tracked and attributed in GA4.

## Overview

There are two independent conversion signals working together:

1. **Client-side DataLayer event** (`src/components/GhlForm.astro`)
   - Passes `gclid`, UTMs, `ga_client_id`, `page_location`, `page_referrer`, and `form_source` into the GHL iframe URL.
   - Listens for GHL iframe `postMessage` success events and pushes `ghl_form_submit` to `dataLayer`.
   - Fires a GA4 event via GTM.
   - This fixes the prior issue where gtag could not see submissions inside the cross-origin GHL iframe.

2. **Thank-you page fallback** (`src/pages/thank-you.astro`)
   - If the GHL form redirects to `/thank-you`, the page pushes `ghl_form_submit` to `dataLayer`.
   - Reads the last form name/source from `sessionStorage` so homepage and contact-page conversions are distinguishable.

## Required Environment Variables

No server-side secrets are required for this client-side-only setup.

## Local Development

Run the site normally with Astro:

```bash
npm run dev
```

## GHL Form Configuration

Both the homepage form and the contact page form use the **same GHL form ID** (`QFFPj4gAUExW0PGozOoj`). Tracking distinguishes them by `page_location` and `form_source`.

1. Open the form `QFFPj4gAUExW0PGozOoj` in GHL.
2. Add **hidden fields** that read from URL parameters:
   - `gclid`
   - `ga_client_id`
   - `utm_source`
   - `utm_medium`
   - `utm_campaign`
   - `utm_term`
   - `utm_content`
   - `page_location`
   - `page_referrer`
   - `form_source`
3. Set the form submission redirect to: `https://poolefencingllc.com/thank-you`

## GTM Configuration

### Trigger

- Type: **Custom Event**
- Event name: `ghl_form_submit`
- Fires on: All custom events

### Tag

- Type: **Google Analytics: GA4 Event**
- Event name: `generate_lead`
- Parameters:
  - `gclid` → Data Layer Variable `gclid`
  - `page_location` → Data Layer Variable `page_location`
  - `form_id` → Data Layer Variable `form_id`
- Fires on the `ghl_form_submit` trigger.

Then mark `generate_lead` as a conversion in GA4.

## Verification Checklist

- [ ] Visit `/contact-us?gclid=test_gclid_123&utm_source=google&utm_medium=cpc` in an incognito window.
- [ ] Visit the homepage with `/?gclid=test_gclid_123&utm_source=google&utm_medium=cpc` and verify the same parameters are passed into the homepage iframe.
- [ ] Confirm the `_gclid` first-party cookie is set.
- [ ] Confirm the GHL iframe `src` includes `gclid=test_gclid_123` and `ga_client_id`.
- [ ] Submit the form and check GTM Preview for the `ghl_form_submit` event.
- [ ] Check GA4 DebugView for `generate_lead` with the correct parameters.
- [ ] Submit a test lead and confirm the GHL contact record contains `gclid` and UTM values.
- [ ] Confirm the `/thank-you` page fallback also fires `ghl_form_submit` if the form redirects there.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| No `ghl_form_submit` in GTM Preview | GHL iframe is not emitting postMessage | Make sure the GHL form redirects to `/thank-you`; that fallback will fire the conversion. |
| GA4 shows event but no Ads attribution | `gclid` not captured in GHL hidden field | Add the `gclid` hidden field in GHL and verify the iframe URL contains it. |
