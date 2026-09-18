// DePay payment links for 757 Gas Shop
const DEPAY_LINKS = {
  40: 'https://link.depay.com/5GQUJPqh74C73RcTJxCGKi',
  100: 'https://link.depay.com/1EdlpJvblIBqN9c0PHHSBF'
};

const FIXED_PACKAGES = [40, 100];

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
    const baseUrl = DEPAY_LINKS[amount];
    const reference = userId ? `user_${userId}_${Date.now()}` : '';
    
    const url = new URL(baseUrl);
    
    // Only add amount/currency params for generic integrate URL
    if (baseUrl.includes('integrate.depay.com')) {
      url.searchParams.set('amount', amount.toString());
      url.searchParams.set('currency', 'USDC');
    }
    
    if (reference) {
      url.searchParams.set('reference', reference);
    }

    return {
      amount,
      href: url.toString(),
      isPlaceholder: !userId,
      type: 'depay'
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
