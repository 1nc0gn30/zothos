# Deploy Checklist for CreatorKit

## Pre-flight

- [ ] Netlify account connected
- [ ] GitHub repo created and linked
- [ ] Environment variables set in Netlify dashboard
- [ ] Domain configured or Netlify subdomain noted

## Newsletter

- [ ] beehiiv publication created
- [ ] API key generated with write access
- [ ] Publication ID copied
- [ ] Test signup via landing page form

## Payments

- [ ] Stripe product + price created
- [ ] Stripe secret key + price ID added to Netlify env
- [ ] Webhook endpoint created: `https://YOUR_SITE/api/stripe-webhook`
- [ ] Webhook secret added to Netlify env
- [ ] Test purchase in Stripe test mode
- [ ] `/toolkit?session_id=...` unlocks after payment

## Booking

- [ ] Cal.com account created and event type set to 30 min
- [ ] Username added as `VITE_CAL_USERNAME`
- [ ] Or Calendly URL added as `VITE_CALDLY_URL`
- [ ] Test booking from landing page

## Launch

- [ ] Production deploy passes
- [ ] Landing page renders correctly on mobile
- [ ] Newsletter signup succeeds
- [ ] Stripe test purchase unlocks toolkit
- [ ] Booking iframe loads
- [ ] README updated with live URLs
