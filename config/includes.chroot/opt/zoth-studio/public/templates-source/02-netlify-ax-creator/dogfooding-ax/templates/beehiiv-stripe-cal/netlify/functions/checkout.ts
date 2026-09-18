const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export const handler = async (event: any) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  const provider = event.queryStringParameters?.provider || 'stripe';
  let body: { return_path?: string } = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    // ignore empty body
  }

  const returnUrl = `${process.env.SITE_URL || 'http://localhost:3456'}${body.return_path || '/toolkit'}`;

  try {
    if (provider === 'stripe') {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
        success_url: `${process.env.SITE_URL || 'http://localhost:3456'}/?success=true`,
        cancel_url: `${process.env.SITE_URL || 'http://localhost:3456'}/?canceled=true`,
        automatic_tax: { enabled: false },
        metadata: { return_path: body.return_path || '/toolkit' },
      });
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ url: session.url }),
      };
    }

    if (provider === 'lemonsqueezy') {
      const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          Authorization: `Bearer ${process.env.LS_API_KEY}`,
        },
        body: JSON.stringify({
          data: {
            type: 'checkouts',
            attributes: {
              checkout_data: { redirect_url: returnUrl },
            },
            relationships: {
              store: { data: { type: 'stores', id: process.env.LS_STORE_ID } },
              variant: { data: { type: 'variants', id: process.env.LS_VARIANT_ID } },
            },
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.[0]?.detail || 'LemonSqueezy checkout failed');
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ url: data.data.attributes.url }),
      };
    }

    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Unknown provider' }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: err.message || 'Checkout error' }),
    };
  }
};
