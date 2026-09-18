const FIXED_PACKAGES = [20, 40, 100];

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
    // Generate DePay payment URL with reference
    const baseUrl = "https://link.depay.com/5GQUJPqh74C73RcTJxCGKi";
    const reference = userId ? `user_${userId}_${Date.now()}` : '';
    
    const url = new URL(baseUrl);
    url.searchParams.set('amount', amount.toString());
    url.searchParams.set('currency', 'USDC');
    
    if (reference) {
      url.searchParams.set('reference', reference);
    }

    return {
      amount,
      href: url.toString(),
      isPlaceholder: !userId,
      type: 'depay' // Differentiate from old Stripe links
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
