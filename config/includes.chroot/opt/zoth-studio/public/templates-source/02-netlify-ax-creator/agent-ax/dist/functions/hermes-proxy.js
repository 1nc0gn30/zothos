export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Method Not Allowed',
        message: 'Use POST to dispatch requests through Hermes.',
      }),
    };
  }

  let payload = {};
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Bad Request',
        message: 'Request body must be valid JSON.',
        hint: '{ "question": "Ask Hermes something..." }',
      }),
    };
  }

  const question = typeof payload === 'string' ? payload : String(payload.question || '');

  const response = {
    status: 'received',
    service: 'agent-ax',
    timestamp: new Date().toISOString(),
    question,
    note: 'Replace this stub with real Hermes API dispatch using process.env.HERMES_URL / HERMES_API_KEY.',
  };

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(response, null, 2),
  };
}
