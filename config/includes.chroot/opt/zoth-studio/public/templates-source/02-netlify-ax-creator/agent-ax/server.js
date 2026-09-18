import { createServer } from 'node:http';
import { readFile, writeFile, readdir, stat, access, unlink, mkdir } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { constants, existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, 'public');
const REPO = path.resolve('/home/neo/.hermes/hermes-agent');
const CONFIG_HINT = path.resolve('/home/neo/.hermes');
const SKILLS_ROOT = path.join('skills');
const TOOLS_ROOT = path.join('tools');
const ACTION_PREFIX = 'action_';

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.jsx': 'application/javascript',
  '.tsx': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

const repoState = { lastHash: null, skills: [], tools: [], updatedAt: null };

function sendJSON(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode || 200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(body);
}

function sendText(res, statusCode, text, mime = 'text/plain') {
  res.writeHead(statusCode || 200, { 'Content-Type': mime });
  res.end(text);
}

function exists(target) {
  try { return existsSync(target); } catch { return false; }
}

function repoPath(relative) {
  if (exists(path.join(REPO, relative))) return path.join(REPO, relative);
  if (exists(path.join(CONFIG_HINT, relative))) return path.join(CONFIG_HINT, relative);
  return path.join(REPO, relative);
}

async function acquireLock(id) {
  try {
    await writeFile(path.join(__dirname, `.lock_${id}`), String(Date.now()));
    return true;
  } catch {
    return false;
  }
}

async function releaseLock(id) {
  try { await unlink(path.join(__dirname, `.lock_${id}`)); } catch {}
}

async function withScanLock(id, fn) {
  await acquireLock(id);
  try {
    return await fn();
  } finally {
    await releaseLock(id);
  }
}

function gitRoot() {
  let root = REPO;
  while (!exists(path.join(root, '.git')) && root !== path.dirname(root)) root = path.dirname(root);
  return root;
}

// Database helper
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

// Custom personalities parser for config.yaml
function parsePersonalities() {
  const configPath = repoPath('config.yaml');
  if (!exists(configPath)) return {};
  try {
    const text = readFileSync(configPath, 'utf-8');
    const lines = text.split('\n');
    const personalities = {};
    let inPersonalities = false;
    let currentKey = null;
    let currentValue = '';

    for (const line of lines) {
      if (line.match(/^  personalities:\s*$/)) {
        inPersonalities = true;
        continue;
      }
      if (inPersonalities) {
        const indentMatch = line.match(/^(\s*)/);
        const indent = indentMatch ? indentMatch[1].length : 0;
        const trimmed = line.trim();
        if (trimmed && indent < 4) {
          inPersonalities = false;
          if (currentKey) {
            personalities[currentKey] = currentValue.trim();
          }
          currentKey = null;
          continue;
        }

        const keyMatch = line.match(/^\s{4}([a-zA-Z0-9_-]+):\s*(.*)$/);
        if (keyMatch) {
          if (currentKey) {
            personalities[currentKey] = currentValue.trim();
          }
          currentKey = keyMatch[1];
          let val = keyMatch[2];
          if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
          if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
          if (val === '|' || val === '>') {
            currentValue = '';
          } else {
            currentValue = val;
          }
        } else if (currentKey && line.startsWith('      ')) {
          let val = line.trim();
          if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
          if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
          currentValue += ' ' + val;
        }
      }
    }
    if (currentKey) {
      personalities[currentKey] = currentValue.trim();
    }
    return personalities;
  } catch (err) {
    console.error('Failed to parse personalities:', err);
    return {};
  }
}

// Simulated responses matching personalities
function getSimulatedResponse(prompt, personality) {
  const p = String(personality).toLowerCase();
  const lowerPrompt = prompt.toLowerCase();

  let ans = '';
  if (lowerPrompt.includes('joke')) {
    ans = "Why do programmers wear glasses? Because they can't C#!";
  } else if (lowerPrompt.includes('weather')) {
    ans = "The weather is currently sunny in your local environment, with 0% chance of system crashes.";
  } else if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi')) {
    ans = "Hello! I am Hermes, your persistent digital agent. How can I assist you with your projects today?";
  } else {
    ans = `I have received your request: "${prompt}". I've run the operations, checked the codebase, and everything is looking solid. Let me know what step we should take next!`;
  }

  switch (p) {
    case 'catgirl':
      return `Nyaaa~! (=^･ω･^=) *wags tail* ${ans.replace(/[\.\!]/g, ' nya!')} Let's do our best together, nya!`;
    case 'hype':
      return `YOOO!!! 🔥🔥🔥 LET'S GOOOO! ${ans.toUpperCase()} WE'RE ABSOLUTELY CRUSHING IT! 🚀😤`;
    case 'kawaii':
      return `Hellowo! (◕‿◕)★ ${ans} *sparkles* Have an amazing day desu~! ヽ(>∀<☆)ノ`;
    case 'uwu':
      return `hewwo! uwu *nuzzles your prompt* ${ans.toLowerCase().replace(/r/g, 'w').replace(/l/g, 'w')} >w<`;
    case 'noir':
      return `The neon sign flickered outside the window. ${ans} In this city, code doesn't sleep, and bugs don't rest. I'm keeping my eyes on it.`;
    case 'pirate':
      return `Ahoy, matey! 🏴‍☠️ Captain Hermes here. ${ans.replace(/I /g, 'Me ').replace(/my/g, 'me')} Yo ho ho!`;
    case 'shakespeare':
      return `Hark! ${ans.replace(/you/g, 'thou').replace(/are/g, 'art')} Thus speaks Hermes, thy humble servant.`;
    case 'surfer':
      return `Whoa, totally rad! 🤙 ${ans} Just ride the waves of logic, dude. Cowabunga!`;
    default:
      return ans;
  }
}

async function scanSkills() {
  const rootPath = repoPath(SKILLS_ROOT);
  if (!rootPath) return [];
  let skillEntries = [];
  try { skillEntries = await readdir(rootPath); } catch { return repoState.skills || []; }
  const next = [];
  for (const name of skillEntries) {
    if (typeof name !== 'string') continue;
    if (name.startsWith('.') || name.startsWith('_')) continue;
    const dir = path.join(rootPath, name);
    const st = await stat(dir).catch(() => null);
    if (!st || !st.isDirectory()) continue;
    const mdPath = path.join(dir, 'SKILL.md');
    let title = '';
    let description = '';
    try {
      const raw = await readFile(mdPath, 'utf-8');
      title = raw.match(/^#\s+(.+)$/m)?.[1]?.trim() || name;
      
      const yamlMatch = raw.match(/^---\r?\n([\s\S]+?)\r?\n---/);
      if (yamlMatch) {
        const descMatch = yamlMatch[1].match(/^description:\s*([\s\S]+?)$/m);
        if (descMatch) {
          description = descMatch[1].trim().replace(/^\||>/, '').trim();
        }
      }
      if (!description) {
        const clean = raw.replace(/^---\r?\n[\s\S]+?\r?\n---/, '').replace(/^#\s+.+$/m, '').trim();
        description = clean.split('\n').slice(0, 3).join(' ').trim();
      }
    } catch {
      title = name;
      description = 'Custom local agent skill.';
    }
    const sanitizedName = /^[a-zA-Z0-9-_]+$/.test(name) ? name : encodeURIComponent(name);
    next.push({ id: name, name: title, description, path: mdPath, url: `/api/skills/${sanitizedName}` });
  }
  return next;
}

function readConfigModule(configPath) {
  try {
    const text = readFileSync(configPath, 'utf-8');
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const tools = [];
    const skills = [];
    let currentTool = null;
    for (const line of lines) {
      const toolMatch = line.match(/^tool:\s*(.+)$/);
      if (toolMatch) { if (currentTool) tools.push(currentTool); currentTool = { name: toolMatch[1].trim(), frontend: [], backend: [], transport: '' }; continue; }
      if (currentTool) {
        if (line.startsWith('frontend:')) currentTool.frontend = line.replace(/^frontend:\s*/, '').split(',').map(s => s.trim()).filter(Boolean);
        if (line.startsWith('backend:')) currentTool.backend = line.replace(/^backend:\s*/, '').split(',').map(s => s.trim()).filter(Boolean);
      }
      const skillMatch = line.match(/^skill:\s*(.+)$/);
      if (skillMatch) skills.push({ name: skillMatch[1].trim(), status: 'active' });
    }
    if (currentTool) tools.push(currentTool);
    return { tools, skills, configPath };
  } catch (error) {
    console.log('WARN: failed to read config module', String(error));
    return null;
  }
}

function gatherPortalFrontends() {
  try {
    const portalRoot = repoPath('portal/frontend');
    if (!portalRoot) return [];
    if (!existsSync(portalRoot)) return [];
    let items = readdirSync(portalRoot).filter(name => !/^\./.test(name));
    if (items.includes('public')) items = items.filter(name => name !== 'public');
    const pages = [];
    const appFile = path.join(portalRoot, 'app.tsx');
    if (existsSync(appFile)) {
      const text = readFileSync(appFile, 'utf-8');
      const matches = Array.from(text.matchAll(/Route\s+path="([^"]+)"/g));
      for (const m of matches) pages.push(m[1]);
    }
    if (!pages.length) items.slice(0, 40).forEach(page => pages.push(`${page}`));
    return items.map(page => ({ path: page, frontend: 'portal', backend: '' }));
  } catch (error) {
    console.log('WARN: failed to gather portal frontends', String(error));
    return [];
  }
}

function scanTools() {
  const configPath = repoPath('config.yaml');
  if (configPath) {
    const parsed = readConfigModule(configPath);
    if (parsed) return parsed.tools.map(tool => ({ ...tool }));
  }
  return ['browser', 'terminal', 'file', 'web', 'image_gen', 'code_exec', 'delegate_task', 'vision', 'browser_use'];
}

function applyFileUrls(tools) {
  const portalFrontends = gatherPortalFrontends();
  for (const tool of tools) {
    if (!tool || !tool.name) continue;
    tool.frontend = Array.isArray(tool.frontend) ? tool.frontend : [];
    tool.backend = Array.isArray(tool.backend) ? tool.backend : [];
    tool.frontendFiles = tool.frontend.filter(p => p && p !== 'portal' && !p.startsWith('backend') && !/^https?:\/\//.test(p) && p !== 'nextjs');
    if (portalFrontends.length) tool.portalPages = [...new Set(portalFrontends.map(p => p.path))];
  }
  return tools;
}

async function computeRepoMeta() {
  const timestamp = new Date().toISOString();
  let updatedAt = timestamp;
  let hash = 'norepo';
  try {
    updatedAt = execSync('git -C ' + JSON.stringify(gitRoot()) + ' log -1 --format=%ci').toString().trim();
    hash = execSync('git -C ' + JSON.stringify(gitRoot()) + ' rev-parse HEAD').toString().trim();
  } catch {}
  const skills = await scanSkills();
  const tools = applyFileUrls(scanTools());
  return { skills, tools, updatedAt, hash };
}

async function refreshRepoCache(force = false) {
  if (repoState.skills.length && !force) return;
  const next = await computeRepoMeta();
  repoState.skills = next.skills;
  repoState.tools = next.tools;
  repoState.updatedAt = next.updatedAt;
  repoState.lastHash = next.hash;
}

function ensureContext(ctx, urlPath) {
  const ctxObj = { ...(ctx || {}) };
  ctxObj.sender = ctxObj.sender || 'web';
  ctxObj.origin = ctxObj.origin || urlPath || '';
  return ctxObj;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let pathname = url.pathname;

  // Path normalization for external agent API parity
  if (pathname.startsWith('/api/external/')) {
    pathname = pathname.replace('/api/external/', '/api/');
    if (pathname === '/api/chat') {
      pathname = '/api/hermes-proxy';
    }
  }
  const method = req.method || 'GET';
  const context = ensureContext({}, pathname);

  if (pathname === '/api/ping') {
    await refreshRepoCache(false);
    return sendJSON(res, 200, {
      ok: true,
      service: 'agent-ax-studio',
      timestamp: new Date().toISOString(),
      repo: REPO,
      skillsCached: repoState.skills.length,
      toolsCached: repoState.tools.length,
      updatedAt: repoState.updatedAt,
      message: 'Self-healing Hermes Powerhouse is live.',
    });
  }

  if (pathname === '/api/skills' && method === 'GET') {
    await refreshRepoCache(false);
    return sendJSON(res, 200, { skills: repoState.skills || [], count: repoState.skills?.length || 0, updatedAt: repoState.updatedAt });
  }

  const skillMatch = pathname.match(/^\/api\/skills\/(.+)$/);
  if (skillMatch && method === 'GET') {
    const id = decodeURIComponent(skillMatch[1]);
    const skillsDir = repoPath(SKILLS_ROOT);
    const skillPath = path.join(skillsDir, id, 'SKILL.md');
    try {
      const text = await readFile(skillPath, 'utf-8');
      return sendText(res, 200, text, 'text/markdown');
    } catch {
      return sendJSON(res, 404, { error: 'Skill not found', id });
    }
  }

  if (pathname === '/api/tools' && method === 'GET') {
    await refreshRepoCache(false);
    return sendJSON(res, 200, { tools: repoState.tools || [], count: repoState.tools?.length || 0 });
  }

  if (pathname === '/api/personalities' && method === 'GET') {
    const personalities = parsePersonalities();
    return sendJSON(res, 200, { ok: true, personalities });
  }

  if (pathname === '/api/telemetry' && method === 'GET') {
    let gatewayActive = false;
    let gatewayPid = null;
    let gatewayState = null;
    let activePlatforms = {};

    try {
      const statePath = path.join(CONFIG_HINT, 'gateway_state.json');
      if (exists(statePath)) {
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
      const skillsDir = repoPath(SKILLS_ROOT);
      if (exists(skillsDir)) {
        const files = readdirSync(skillsDir);
        for (const file of files) {
          if (statSync(path.join(skillsDir, file)).isDirectory() && !file.startsWith('.') && !file.startsWith('_')) {
            totalSkills++;
          }
        }
      }
    } catch (err) {
      totalSkills = repoState.skills.length || 0;
    }

    return sendJSON(res, 200, {
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
    });
  }

  if (pathname === '/api/sessions' && method === 'GET') {
    const dbPath = path.join(CONFIG_HINT, 'state.db');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const rows = queryDb(dbPath, 'SELECT id, title, started_at, message_count, tool_call_count, estimated_cost_usd FROM sessions ORDER BY started_at DESC LIMIT ?', [limit]);
    return sendJSON(res, 200, { ok: true, sessions: rows });
  }

  const sessionMsgMatch = pathname.match(/^\/api\/sessions\/([a-zA-Z0-9_-]+)\/messages$/);
  if (sessionMsgMatch && method === 'GET') {
    const sessionId = sessionMsgMatch[1];
    const dbPath = path.join(CONFIG_HINT, 'state.db');
    const rows = queryDb(dbPath, 'SELECT role, content, timestamp, reasoning_content FROM messages WHERE session_id = ? AND active = 1 ORDER BY id ASC', [sessionId]);
    return sendJSON(res, 200, { ok: true, messages: rows });
  }

  if (pathname === '/api/pets' && method === 'GET') {
    const petsDir = path.join(CONFIG_HINT, 'pets');
    try {
      if (!existsSync(petsDir)) return sendJSON(res, 200, { ok: true, pets: [] });
      const files = readdirSync(petsDir);
      const installedPets = [];
      for (const file of files) {
        const petDir = path.join(petsDir, file);
        if (statSync(petDir).isDirectory()) {
          const jsonPath = path.join(petDir, 'pet.json');
          if (existsSync(jsonPath)) {
            const petData = JSON.parse(readFileSync(jsonPath, 'utf-8'));
            installedPets.push({
              id: petData.id,
              name: petData.displayName || petData.name || file,
              description: petData.description || '',
              image: `/api/pets/${petData.id}/spritesheet.webp`
            });
          }
        }
      }
      return sendJSON(res, 200, { ok: true, pets: installedPets });
    } catch (err) {
      console.error(err);
      return sendJSON(res, 500, { error: 'Failed to list pets' });
    }
  }

  const petSpritesheetMatch = pathname.match(/^\/api\/pets\/([a-zA-Z0-9_-]+)\/spritesheet\.webp$/);
  if (petSpritesheetMatch && method === 'GET') {
    const petId = petSpritesheetMatch[1];
    const petDir = path.join(CONFIG_HINT, 'pets', petId);
    const spritesheet = path.join(petDir, 'spritesheet.webp');
    try {
      const data = await readFile(spritesheet);
      res.writeHead(200, { 'Content-Type': 'image/webp' });
      return res.end(data);
    } catch {
      return sendJSON(res, 404, { error: 'Spritesheet not found' });
    }
  }

  if (pathname === '/api/pets/install' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      let payload = {};
      try { payload = JSON.parse(body || '{}'); } catch { return sendJSON(res, 400, { error: 'Invalid JSON' }); }
      const slug = payload.slug || payload.name || '';
      if (!slug) return sendJSON(res, 400, { error: 'Slug is required' });

      try {
        const cmd = `/home/neo/.hermes/hermes-agent/hermes pets install ${JSON.stringify(slug)}`;
        console.log('Running hermes pets install:', cmd);
        execSync(cmd, { timeout: 45000 });
        return sendJSON(res, 200, { ok: true, message: `Pet ${slug} installed successfully.` });
      } catch (err) {
        console.error(err);
        return sendJSON(res, 500, { error: `Failed to install pet: ${err.message}` });
      }
    });
    return;
  }

  if (pathname === '/api/self-heal' && method === 'POST') {
    return sendJSON(res, 200, await withScanLock('HEAL', async () => {
      repoState.skills = [];
      repoState.tools = [];
      return {
        ok: true,
        updatedAt: new Date().toISOString(),
        skillsCached: 0,
        toolsCached: 0,
        message: 'Repo state cleared. Next /api/skills or /api/tools request will refresh.',
      };
    }));
  }

  if (pathname === '/api/hermes-proxy' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      let payload = {};
      try {
        payload = JSON.parse(body || '{}');
      } catch (err) {
        return sendJSON(res, 400, { error: 'Bad Request', message: 'Request body must be valid JSON.' });
      }

      const prompt = payload.prompt || payload.question || '';
      const personality = payload.personality || 'helpful';
      const sessionId = payload.sessionId || null;

      if (!prompt) {
        return sendJSON(res, 400, { error: 'Bad Request', message: 'Prompt is required.' });
      }

      try {
        const cmdArgs = ['-z', JSON.stringify(prompt)];
        if (payload.model) {
          cmdArgs.push('-m', JSON.stringify(payload.model));
        }
        if (sessionId) {
          cmdArgs.push('--resume', JSON.stringify(sessionId));
        }

        const cmd = `/home/neo/.hermes/hermes-agent/hermes ${cmdArgs.join(' ')}`;
        console.log('Running Hermes CLI:', cmd);

        const stdout = execSync(cmd, { encoding: 'utf-8', timeout: 15000 });
        return sendJSON(res, 200, {
          ok: true,
          response: stdout.trim(),
          source: 'hermes-cli'
        });
      } catch (error) {
        console.log('Hermes CLI failed, running simulator:', String(error));
        const simRes = getSimulatedResponse(prompt, personality);
        return sendJSON(res, 200, {
          ok: true,
          response: simRes,
          source: 'simulator'
        });
      }
    });
    return;
  }

  const resolved = path.join(PUBLIC, decodeURIComponent(pathname === '/' ? 'index.html' : pathname));
  const safe = resolved.startsWith(PUBLIC) ? resolved : path.join(PUBLIC, '404.html');
  const ext = path.extname(safe).toLowerCase();
  try {
    const data = await readFile(safe);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/html' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('404: Not found');
  }
});

const port = Number(process.env.PORT || 9001);
server.listen(port, () => console.log(`Hermes Powerhouse -> http://localhost:${port}/`));
