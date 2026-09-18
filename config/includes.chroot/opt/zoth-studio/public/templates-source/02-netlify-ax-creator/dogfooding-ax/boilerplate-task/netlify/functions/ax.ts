import { PLAYBOOKS, INTEGRATIONS, TEMPLATES, META, getOverview, queryKnowledge } from './ax-knowledge';
import { INTEGRATION_PATTERNS, configure, ConfigureRequest } from './ax-patterns';

const CORS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

function json(statusCode: number, body: any) {
  return { statusCode, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

export const handler = async (event: any) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  const path = event.path || '';
  // Extract the ax sub-path: /api/ax → "", /api/ax/overview → "overview"
  // Only strip the /api/ax/ prefix, not any /ax/ inside playbook IDs
  const axPath = path.replace(/^.*\/api\/ax\/?/, '');

  // If no sub-path, return overview
  if (!axPath || axPath === '' || axPath === '/') {
    return json(200, getOverview());
  }

  // Route: overview
  if (axPath === 'overview') {
    return json(200, getOverview());
  }

  // Route: playbooks
  if (axPath === 'playbooks') {
    return json(200, { playbooks: PLAYBOOKS });
  }

  // Route: playbooks/:id
  const playbookMatch = axPath.match(/^playbooks\/(.+)$/);
  if (playbookMatch) {
    const pb = PLAYBOOKS.find((p) => p.id === playbookMatch[1]);
    if (!pb) return json(404, { error: 'Playbook not found', id: playbookMatch[1] });
    return json(200, pb);
  }

  // Route: integrations
  if (axPath === 'integrations') {
    return json(200, { integrations: INTEGRATIONS });
  }

  // Route: integrations/:id
  const integrationMatch = axPath.match(/^integrations\/(.+)$/);
  if (integrationMatch) {
    const integ = INTEGRATIONS.find((i) => i.id === integrationMatch[1]);
    if (!integ) return json(404, { error: 'Integration not found', id: integrationMatch[1] });
    return json(200, integ);
  }

  // Route: env-vars
  if (axPath === 'env-vars') {
    const allVars: { key: string; required: boolean; description: string; integration: string }[] = [];
    for (const integ of INTEGRATIONS) {
      for (const v of integ.envVars) {
        allVars.push({ key: v.key, required: v.required, description: v.description, integration: integ.name });
      }
    }
    return json(200, { envVars: allVars });
  }

  // Route: templates
  if (axPath === 'templates') {
    return json(200, { templates: TEMPLATES });
  }

  // Route: templates/:slug
  const templateMatch = axPath.match(/^templates\/(.+)$/);
  if (templateMatch) {
    const tmpl = TEMPLATES.find((t) => t.slug === templateMatch[1]);
    if (!tmpl) return json(404, { error: 'Template not found', slug: templateMatch[1] });
    return json(200, tmpl);
  }

  // Route: query (POST)
  if (axPath === 'query') {
    if (event.httpMethod !== 'POST') {
      return json(405, { error: 'POST required for /api/ax/query' });
    }
    let body: { topic?: string } = {};
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return json(400, { error: 'Invalid JSON body' });
    }
    if (!body.topic) {
      return json(400, { error: 'topic is required in body. Example: { "topic": "stripe" }' });
    }
    return json(200, queryKnowledge(body.topic));
  }

  // Route: patterns (all integration patterns)
  if (axPath === 'patterns') {
    return json(200, { patterns: INTEGRATION_PATTERNS });
  }

  // Route: patterns/:id
  const patternMatch = axPath.match(/^patterns\/(.+)$/);
  if (patternMatch) {
    const pat = INTEGRATION_PATTERNS.find((p) => p.id === patternMatch[1]);
    if (!pat) return json(404, { error: 'Pattern not found', id: patternMatch[1] });
    return json(200, pat);
  }

  // Route: configure (POST) — the universal configurator
  if (axPath === 'configure') {
    if (event.httpMethod !== 'POST') {
      return json(405, { error: 'POST required for /api/ax/configure' });
    }
    let body: ConfigureRequest;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return json(400, { error: 'Invalid JSON body' });
    }
    if (!body.framework) {
      return json(400, { error: 'framework is required. Example: { "framework": "next.js", "integrations": ["stripe", "beehiiv", "calcom"] }' });
    }
    if (!body.integrations || !Array.isArray(body.integrations) || body.integrations.length === 0) {
      return json(400, { error: 'integrations array is required. Example: ["stripe", "beehiiv", "calcom"]' });
    }
    return json(200, configure(body));
  }

  // Route: meta
  if (axPath === 'meta') {
    return json(200, META);
  }

  return json(404, { error: 'Unknown AX endpoint', path: axPath, available: META.endpoints });
};