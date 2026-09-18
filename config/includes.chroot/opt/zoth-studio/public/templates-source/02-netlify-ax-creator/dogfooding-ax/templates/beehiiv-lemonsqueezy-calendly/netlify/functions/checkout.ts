const CORS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export const handler = async (event: any) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  let body: { return_path?: string } = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    // ignore empty body
  }

  const returnUrl = `${process.env.SITE_URL || 'http://localhost:3461'}${body.return_path || '/toolkit'}`;

  try {
    if (!process.env.LS_API_KEY || !process.env.LS_STORE_ID || !process.env.LS_VARIANT_ID) {
      return {
        statusCode: 500,
        headers: CORS,
        body: JSON.stringify({ error: 'LemonSqueezy not configured. Set LS_API_KEY, LS_STORE_ID, and LS_VARIANT_ID in Netlify env.' }),
      };
    }

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
      headers: CORS,
      body: JSON.stringify({ url: data.data.attributes.url }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: err.message || 'Checkout error' }),
    };
  }
};