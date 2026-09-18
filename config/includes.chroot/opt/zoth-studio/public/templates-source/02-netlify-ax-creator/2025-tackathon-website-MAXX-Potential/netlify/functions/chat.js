const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type'
}

const messages = [
  {
    id: 1,
    name: 'Elf Moderator',
    message: 'Welcome to the retro hotline! Drop your updates and 90s hype here.',
    timestamp: new Date().toISOString()
  }
]

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers }
  }

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    }
  }

  if (event.httpMethod === 'POST') {
    const payload = JSON.parse(event.body || '{}')
    const entry = {
      id: Date.now(),
      name: payload.name?.slice(0, 40) || 'Mystery Elf',
      message: payload.message?.slice(0, 240) || '',
      timestamp: new Date().toISOString()
    }

    if (!entry.message) {
      return { statusCode: 400, headers, body: 'Message required' }
    }

    messages.push(entry)
    if (messages.length > 50) {
      messages.splice(0, messages.length - 50)
    }

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    }
  }

  return { statusCode: 405, headers, body: 'Method Not Allowed' }
}
