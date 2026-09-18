import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import path from 'node:path';

const CONFIG_HINT = '/home/neo/.hermes';

export async function handler(event, context) {
  const method = event.httpMethod;
  const rawPath = event.path; // e.g. /.netlify/functions/pets/circuit-pup/spritesheet.webp or /.netlify/functions/pets
  
  // Clean up function prefix to get relative request sub-path
  let subPath = rawPath.replace(/^\/\.netlify\/functions\/pets/, '');
  if (subPath.startsWith('/')) subPath = subPath.substring(1);

  // 1. GET /spritesheet.webp inside sub-path: e.g. "circuit-pup/spritesheet.webp"
  const spritesheetMatch = subPath.match(/^([a-zA-Z0-9_-]+)\/spritesheet\.webp$/);
  if (spritesheetMatch && method === 'GET') {
    const petId = spritesheetMatch[1];
    const petDir = path.join(CONFIG_HINT, 'pets', petId);
    const spritesheet = path.join(petDir, 'spritesheet.webp');
    try {
      const data = await readFile(spritesheet);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'image/webp',
          'Access-Control-Allow-Origin': '*',
        },
        body: data.toString('base64'),
        isBase64Encoded: true
      };
    } catch (err) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Spritesheet not found' })
      };
    }
  }

  // 2. POST /install or / (installing a pet)
  if (method === 'POST') {
    let payload = {};
    try {
      payload = JSON.parse(event.body || '{}');
    } catch (err) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Invalid JSON' })
      };
    }
    const slug = payload.slug || payload.name || '';
    if (!slug) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Slug is required' })
      };
    }

    try {
      const cmd = `/home/neo/.hermes/hermes-agent/hermes pets install ${JSON.stringify(slug)}`;
      execSync(cmd, { timeout: 45000 });
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ ok: true, message: `Pet ${slug} installed successfully.` })
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: `Failed to install pet: ${err.message}` })
      };
    }
  }

  // 3. GET / (list pets)
  if (method === 'GET') {
    const petsDir = path.join(CONFIG_HINT, 'pets');
    try {
      if (!existsSync(petsDir)) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ ok: true, pets: [] })
        };
      }
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
              image: `/.netlify/functions/pets/${petData.id}/spritesheet.webp`
            });
          }
        }
      }
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ ok: true, pets: installedPets })
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Failed to list pets', details: err.message })
      };
    }
  }

  return {
    statusCode: 405,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ error: 'Method not allowed' })
  };
}
