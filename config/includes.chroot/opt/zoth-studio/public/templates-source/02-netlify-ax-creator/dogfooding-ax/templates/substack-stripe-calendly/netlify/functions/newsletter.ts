const CORS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const handler = async (event: any) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  let body: { email?: string } = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const email = body.email?.trim();
  if (!email) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Email is required' }) };
  }

  const substackUrl = process.env.SUBSTACK_NEWSLETTER_URL;
  if (!substackUrl) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'Newsletter not configured. Set SUBSTACK_NEWSLETTER_URL in Netlify env.' }),
    };
  }

  const base = substackUrl.replace(/\/$/, '');
  const redirectUrl = `${base}/subscribe?email=${encodeURIComponent(email)}`;

  return {
    statusCode: 200,
    headers: CORS,
    body: JSON.stringify({
      success: true,
      message: 'Redirecting to Substack…',
      url: redirectUrl,
    }),
  };
};