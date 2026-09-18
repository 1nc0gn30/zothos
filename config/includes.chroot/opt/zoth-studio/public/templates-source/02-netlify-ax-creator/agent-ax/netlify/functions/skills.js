import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const CONFIG_HINT = '/home/neo/.hermes';
const SKILLS_ROOT = 'hermes-agent/skills';

export async function handler(event, context) {
  const method = event.httpMethod;
  const rawPath = event.path; // e.g. /.netlify/functions/skills/apple or /.netlify/functions/skills
  
  if (method !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  let subPath = rawPath.replace(/^\/\.netlify\/functions\/skills/, '');
  if (!subPath && rawPath.startsWith('/api/')) {
    subPath = rawPath.replace(/^\/api\/skills/, '');
  }
  if (subPath.startsWith('/')) subPath = subPath.substring(1);

  const skillsDir = path.join(CONFIG_HINT, SKILLS_ROOT);

  // 1. GET /:id (Fetch specific skill manual)
  if (subPath) {
    const id = decodeURIComponent(subPath);
    const skillPath = path.join(skillsDir, id, 'SKILL.md');
    try {
      const text = await readFile(skillPath, 'utf-8');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/markdown',
          'Access-Control-Allow-Origin': '*',
        },
        body: text
      };
    } catch (err) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Skill not found', id })
      };
    }
  }

  // 2. GET / (List all skills)
  try {
    if (!existsSync(skillsDir)) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ skills: [], count: 0 })
      };
    }
    
    const skillEntries = readdirSync(skillsDir);
    const skills = [];
    for (const name of skillEntries) {
      if (name.startsWith('.') || name.startsWith('_')) continue;
      const dir = path.join(skillsDir, name);
      if (statSync(dir).isDirectory()) {
        const mdPath = path.join(dir, 'SKILL.md');
        let title = '';
        let description = '';
        try {
          const raw = readFileSync(mdPath, 'utf-8');
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
        skills.push({
          id: name,
          name: title,
          description,
          path: mdPath,
          url: `/.netlify/functions/skills/${encodeURIComponent(name)}`
        });
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ skills, count: skills.length })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to list skills', details: err.message })
    };
  }
}
