# Stripe Setup Guide for CreatorKit

## 1. Create a Stripe account

Go to https://stripe.com and create an account.

## 2. Create a product

Dashboard → Products → Add product
- Name: CreatorKit License
- Price: $49 one-time
- Copy the Price ID (looks like `price_...`)

## 3. Get secret key

Dashboard → Developers → API keys → copy Secret key (`sk_test_...` or `sk_live_...`)

## 4. Add to Netlify env

Set in Site settings → Environment variables:
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID`
- `SITE_URL`

## 5. Create webhook endpoint

Dashboard → Developers → Webhooks → Add endpoint
- Endpoint URL: `https://YOUR_SITE.netlify.app/api/stripe-webhook`
- Events: `checkout.session.completed`
- Copy signing secret (`whsec_...`)

Add `STRIPE_WEBHOOK_SECRET` to Netlify env.

## 6. Test

Use Stripe test card `4242 4242 4242 4242`, any future date, any CVC.
After payment, `/toolkit?session_id=...` should unlock the downloads.

## Local testing

Use Stripe CLI to forward webhooks locally:
```bash
stripe listen --forward-to localhost:3456/api/stripe-webhook
```
Copy the webhook signing secret it prints into `.env`.
