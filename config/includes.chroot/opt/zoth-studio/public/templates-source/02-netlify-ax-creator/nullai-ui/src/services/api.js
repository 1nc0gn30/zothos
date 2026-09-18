const API_BASE_URL = '/api';

/**
 * Core request wrapper for standard JSON calls
 */
async function request(path, options = {}, accessToken = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`; // Required by backend auth.py
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'Request failed');
  }

  return res.status === 204 ? null : res.json();
}

/**
 * Stream implementation for SSE
 */
export async function streamChat(accessToken, payload, onChunk, onDone, onError) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) throw new Error(await res.text())

    const contentType = res.headers.get('content-type') || ''

    // NON-STREAM JSON (fallback)
    if (contentType.includes('application/json')) {
      const json = await res.json()
      const text =
        json?.choices?.[0]?.message?.content ||
        json?.choices?.[0]?.delta?.content ||
        ''

      if (text) onChunk(text)
      onDone()
      return
    }

    // STREAMING SSE
    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // Split on SSE event boundaries
      const parts = buffer.split('\n\n')
      buffer = parts.pop() // keep incomplete chunk

      for (const part of parts) {
        for (const line of part.split('\n')) {
          if (!line.startsWith('data: ')) continue

          const raw = line.slice(6).trim()

          if (raw === '[DONE]') {
            onDone()
            return
          }

          let json
          try {
            json = JSON.parse(raw)
          } catch {
            continue
          }

          const token = json?.choices?.[0]?.delta?.content
          if (token) onChunk(token)
        }
      }
    }

    onDone()
  } catch (err) {
    onError(err.message || String(err))
  }
}

export function fetchModels() {
  return request('/models');
}

export const api = {
  async post(path, body, token) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    })

    // ✅ SUCCESS
    if (res.ok) {
      return res.status === 204 ? null : await res.json()
    }

    // ✅ ERROR — PRESERVE BACKEND RESPONSE
    let payload = null
    const contentType = res.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      payload = await res.json()
    } else {
      payload = { detail: await res.text() }
    }

    // 🔑 Attach metadata so UI can read it
    throw {
      __isApiError: true,
      status: res.status,
      data: payload,
    }
  },
}

// services/tts.js
export async function fetchTTS(text, accessToken) {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ text }),
  })

  if (!res.ok) {
    throw new Error('TTS failed')
  }

  return await res.blob() // audio/wav
}

/**
 * Run a HexStrike tool (non-streaming)
 */
export async function runHexStrike(payload, accessToken) {
  const res = await fetch(`${API_BASE_URL}/hexstrike/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: JSON.stringify(payload),
  })

  // ✅ SUCCESS
  if (res.ok) {
    return await res.json()
  }

  // ✅ ERROR — preserve backend response
  let data = null
  const contentType = res.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    data = await res.json()
  } else {
    data = { detail: await res.text() }
  }

  throw {
    __isApiError: true,
    status: res.status,
    data,
  }
}

export function fetchProfile(token) {
  return api.get('/profile', token)
}