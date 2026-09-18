// Netlify Function: Node Mesh Locking & Regional Peer Storage
exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { nodeName, sector, operatorHandle } = data;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'SUCCESS',
        message: `Locked into sector ${sector} (${nodeName})`,
        operator: operatorHandle || 'Operator-757',
        timestamp: new Date().toISOString(),
        meshNodesOnline: 15,
        ghostByteSignal: 'ACTIVE'
      }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
