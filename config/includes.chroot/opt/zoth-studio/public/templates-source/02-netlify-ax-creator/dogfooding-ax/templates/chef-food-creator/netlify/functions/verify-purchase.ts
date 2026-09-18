const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export const handler = async (event: any) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  const sessionId = event.queryStringParameters?.session_id;
  if (!sessionId) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'session_id required' }) };
  }

  try {
    const { Blobs } = await import('@netlify/blobs');
    const blob = new Blobs({
      authentication: { contextURL: process.env.NETLIFY_BLOBS_CONTEXT_URL, token: process.env.NETLIFY_BLOBS_TOKEN },
      siteID: process.env.NETLIFY_SITE_ID || 'local',
    });
    await blob.setStore({ name: 'orders' });
    const order = await blob.get(sessionId, { type: 'json' });
    if (!order) throw new Error('Order not found');
    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ valid: true, ...order }) };
  } catch (err: any) {
    // Fallback: verify live with Stripe if blob missing (e.g. first deploy)
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === 'paid') {
        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            valid: true,
            customer_email: session.customer_details?.email,
            amount_total: session.amount_total,
            currency: session.currency,
            created: session.created,
          }),
        };
      }
    } catch {
      // ignore
    }
    return { statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ valid: false, error: err.message }) };
  }
};