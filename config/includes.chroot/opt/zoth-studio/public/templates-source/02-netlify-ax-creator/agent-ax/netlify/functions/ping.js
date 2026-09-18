export async function handler(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      status: 'ok',
      service: 'agent-ax',
      timestamp: new Date().toISOString(),
      path: event.path,
      message: 'Agent AX functions are live.',
    }),
  };
}
