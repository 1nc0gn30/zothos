# LemonSqueezy Setup Guide for CreatorKit

## 1. Create a LemonSqueezy account

Go to https://lemonsqueezy.com and create an account.

## 2. Create a product and variant

Dashboard → Products → Add product
- Name: CreatorKit License
- Price: $49 one-time
- Create a variant
- Copy the Variant ID

## 3. Get your Store ID

Dashboard → Settings → Store
- Copy the Store ID

## 4. Generate an API key

Dashboard → Settings → API → Create API key
- Copy the key

## 5. Add to Netlify env

Set in Site settings → Environment variables:
- `LS_API_KEY`
- `LS_STORE_ID`
- `LS_VARIANT_ID`
- `SITE_URL`

## 6. Test

Click "Buy with LemonSqueezy" on your landing page.
You should be redirected to LemonSqueezy checkout.
After payment, you'll be redirected back to `/toolkit`.

## Why LemonSqueezy over Stripe?

- Automatic VAT/tax handling for global sales
- No need to configure Stripe Tax separately
- Merchant of record — LemonSqueezy handles compliance
- Better for creators selling to EU/UK customers

## Local testing

LemonSqueezy doesn't have a test mode like Stripe.
Use a small price (e.g. $1) for testing, then update to your real price.