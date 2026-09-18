import { existsSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

const CONFIG_HINT = '/home/neo/.hermes';

function queryDb(dbPath, sql, params = []) {
  try {
    if (!existsSync(dbPath)) return [];
    const db = new DatabaseSync(dbPath);
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  } catch (err) {
    console.error(`DB query error for ${dbPath}:`, err);
    return [];
  }
}

export async function handler(event, context) {
  const method = event.httpMethod;
  const rawPath = event.path; // e.g. /.netlify/functions/sessions/123/messages or /.netlify/functions/sessions
  
  if (method !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  let subPath = rawPath.replace(/^\/\.netlify\/functions\/sessions/, '');
  if (subPath.startsWith('/')) subPath = subPath.substring(1);

  const dbPath = path.join(CONFIG_HINT, 'state.db');

  // 1. GET /:id/messages (Fetch messages for a specific session)
  const messagesMatch = subPath.match(/^([a-zA-Z0-9_-]+)\/messages$/);
  if (messagesMatch) {
    const sessionId = messagesMatch[1];
    const rows = queryDb(dbPath, 'SELECT role, content, timestamp, reasoning_content FROM messages WHERE session_id = ? AND active = 1 ORDER BY id ASC', [sessionId]);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ ok: true, messages: rows })
    };
  }

  // 2. GET / (List sessions)
  // Get limit from query parameters
  const params = event.queryStringParameters || {};
  const limit = parseInt(params.limit || '10');

  const rows = queryDb(dbPath, 'SELECT id, title, started_at, message_count, tool_call_count, estimated_cost_usd FROM sessions ORDER BY started_at DESC LIMIT ?', [limit]);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ ok: true, sessions: rows })
  };
}
