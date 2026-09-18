const FIXED_PACKAGES = [20, 40, 100];

const defaultLinks = {
  20: 'https://buy.stripe.com/dRm5kC9Ah49OfpSdkIfw405',
  40: 'https://buy.stripe.com/bJedR8h2J6hWfpSbcAfw406',
  100: 'https://buy.stripe.com/28E28q7s99u8b9CdkIfw407',
};

const envLinks = {
  20: process.env.STRIPE_LINK_20 || defaultLinks[20],
  40: process.env.STRIPE_LINK_40 || defaultLinks[40],
  100: process.env.STRIPE_LINK_100 || defaultLinks[100],
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { Allow: 'GET' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const userId = event.queryStringParameters?.userId?.trim();

  const packages = FIXED_PACKAGES.map((amount) => {
    const baseHref = envLinks[amount];
    const href = userId
      ? `${baseHref}?client_reference_id=${encodeURIComponent(userId)}`
      : baseHref;

    return {
      amount,
      href,
      isPlaceholder: !userId,
    };
  });

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify({ packages }),
  };
};
