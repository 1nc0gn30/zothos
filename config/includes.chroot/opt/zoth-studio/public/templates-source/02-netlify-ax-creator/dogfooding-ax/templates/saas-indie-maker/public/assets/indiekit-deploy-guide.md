# Deploy Guide — IndieKit (SaaS Indie Maker Template)

## Pre-flight

- [ ] Netlify account connected
- [ ] GitHub repo created and linked
- [ ] Environment variables set in Netlify dashboard
- [ ] Domain configured or Netlify subdomain noted

## Newsletter (beehiiv)

- [ ] beehiiv publication created
- [ ] API key generated with write access
- [ ] Publication ID copied
- [ ] Test signup via landing page form

## Payments (LemonSqueezy)

- [ ] LemonSqueezy account created
- [ ] Product created (one-time, lifetime deal)
- [ ] Variant ID copied
- [ ] Store ID copied
- [ ] API key generated
- [ ] Test purchase — checkout redirect works
- [ ] `/deal?success=true` unlocks after payment

## Booking (Cal.com)

- [ ] Cal.com account created
- [ ] Event type set to 30 min
- [ ] Username added as `VITE_CAL_USERNAME`
- [ ] Test booking from landing page

## AX API

- [ ] CreatorKit boilerplate deployed (serves AX endpoints)
- [ ] `VITE_AX_API_URL` set to boilerplate URL
- [ ] AX badge shows green "Live" status on home page

## Build-in-public

- [ ] `VITE_BUILD_LOG_URL` set to your build log / changelog URL
- [ ] "Build Log" link appears in header nav

## Launch

- [ ] Production deploy passes
- [ ] Landing page renders correctly on mobile
- [ ] Newsletter signup succeeds
- [ ] LemonSqueezy test purchase unlocks deal page
- [ ] Cal.com iframe loads
- [ ] AX badge shows connected status
- [ ] Build Log link works
- [ ] README updated with live URLs