import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

let Database;
try {
  Database = require('better-sqlite3');
} catch (e) {
  console.warn('better-sqlite3 not available, using stub DB');
  Database = class {
    constructor() {}
    prepare() { return { all: () => [] }; }
  };
}


const CONFIG_HINT = '/home/neo/.hermes';

function queryDb(dbPath, sql, params = []) {
  try {
    if (!existsSync(dbPath)) return [];
    const db = new Database(dbPath);
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  } catch (err) {
    console.error(`DB query error for ${dbPath}:`, err);
    return [];
  }
}

export async function handler(event, context) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  let gatewayActive = false;
  let gatewayPid = null;
  let gatewayState = null;
  let activePlatforms = {};

  try {
    const statePath = path.join(CONFIG_HINT, 'gateway_state.json');
    if (existsSync(statePath)) {
      const stateData = JSON.parse(readFileSync(statePath, 'utf-8'));
      gatewayPid = stateData.pid;
      gatewayState = stateData.gateway_state;
      activePlatforms = stateData.platforms || {};
      if (gatewayPid) {
        process.kill(gatewayPid, 0); // Check if process runs
        gatewayActive = true;
      }
    }
  } catch (err) {
    gatewayActive = false;
  }

  const dbPath = path.join(CONFIG_HINT, 'state.db');
  let totalMessages = 0;
  let totalSessions = 0;
  let totalToolCalls = 0;
  try {
    const msgRows = queryDb(dbPath, 'SELECT count(*) as count FROM messages');
    totalMessages = msgRows[0]?.count || 0;

    const sessRows = queryDb(dbPath, 'SELECT count(*) as count, SUM(tool_call_count) as tools FROM sessions');
    totalSessions = sessRows[0]?.count || 0;
    totalToolCalls = sessRows[0]?.tools || 0;
  } catch (err) {
    console.error(err);
  }

  let totalSkills = 0;
  try {
    const skillsDir = path.join(CONFIG_HINT, 'hermes-agent', 'skills');
    if (existsSync(skillsDir)) {
      const files = readdirSync(skillsDir);
      for (const file of files) {
        if (statSync(path.join(skillsDir, file)).isDirectory() && !file.startsWith('.') && !file.startsWith('_')) {
          totalSkills++;
        }
      }
    }
  } catch (err) {
    totalSkills = 0;
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      ok: true,
      gateway: {
        active: gatewayActive,
        pid: gatewayPid,
        state: gatewayState,
        platforms: activePlatforms
      },
      stats: {
        messages: totalMessages,
        sessions: totalSessions,
        toolCalls: totalToolCalls,
        skills: totalSkills
      },
      timestamp: new Date().toISOString()
    })
  };
}
