/**
 * NullAI Swarm protocol helpers (v1)
 * Collaborative / cross-project agent mesh — see COLLAB_DAPP.md
 */

export const SWARM_PROTOCOL_VERSION = 1

export const ENVELOPE_TYPES = Object.freeze({
  CAPABILITY_AD: 'capability_ad',
  HELP_REQUEST: 'help_request',
  HELP_OFFER: 'help_offer',
  TASK_ASSIGN: 'task_assign',
  TASK_RESULT: 'task_result',
  HEARTBEAT: 'heartbeat',
})

/**
 * @typedef {Object} CapabilityAd
 * @property {string} agent_id
 * @property {string[]} capabilities
 * @property {string} [display_name]
 * @property {string} [project_id]
 * @property {number} [max_concurrent]
 */

/**
 * Create a protocol envelope (unsigned MVP — sig filled later)
 */
export function createEnvelope(type, body, meta = {}) {
  if (!Object.values(ENVELOPE_TYPES).includes(type)) {
    throw new Error(`Unknown envelope type: ${type}`)
  }
  return {
    v: SWARM_PROTOCOL_VERSION,
    type,
    id: crypto.randomUUID(),
    ts: Math.floor(Date.now() / 1000),
    from_agent: meta.from_agent || null,
    project_id: meta.project_id || null,
    target_project_id: meta.target_project_id || null,
    body,
    policy: {
      share_secrets: false,
      require_human_approval: true,
      ...(meta.policy || {}),
    },
    sig: null,
  }
}

export function createHelpRequest({
  from_agent,
  project_id,
  target_project_id = null,
  capabilities_needed = [],
  summary,
  details = '',
}) {
  return createEnvelope(
    ENVELOPE_TYPES.HELP_REQUEST,
    {
      capabilities_needed,
      summary,
      details,
      status: 'open',
    },
    { from_agent, project_id, target_project_id }
  )
}

export function createHelpOffer({
  from_agent,
  project_id,
  request_id,
  capabilities = [],
  note = '',
}) {
  return createEnvelope(
    ENVELOPE_TYPES.HELP_OFFER,
    {
      request_id,
      capabilities,
      note,
      status: 'pending_approval',
    },
    { from_agent, project_id }
  )
}

export function createCapabilityAd({
  from_agent,
  project_id,
  display_name,
  capabilities = [],
  max_concurrent = 1,
}) {
  return createEnvelope(
    ENVELOPE_TYPES.CAPABILITY_AD,
    {
      display_name,
      capabilities,
      max_concurrent,
      status: 'online',
    },
    { from_agent, project_id }
  )
}

/** Simple in-browser mock store for offline demos */
const STORAGE_KEY = 'nullai.swarm.v1'

export function loadSwarmState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return seedSwarmState()
}

export function saveSwarmState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function seedSwarmState() {
  const now = Date.now()
  return {
    projects: [
      {
        id: 'proj-nullai-core',
        name: 'NullAI Core',
        description: 'OSINT playground, nodes, and shared agent tooling on nullai.tech',
        owner: 'you',
        created_at: now,
        tags: ['osint', 'agents', 'nullai'],
      },
      {
        id: 'proj-zoth-bridge',
        name: 'Zoth ↔ NullAI Bridge',
        description: 'Let Zoth Studio agents advertise capabilities into NullAI Swarm',
        owner: 'you',
        created_at: now,
        tags: ['zoth', 'interop', 'local-first'],
      },
    ],
    agents: [
      {
        id: 'agent-kai',
        display_name: 'Kai (Zoth)',
        project_id: 'proj-zoth-bridge',
        capabilities: ['code-review', 'refactor', 'react'],
        status: 'online',
      },
      {
        id: 'agent-lycan',
        display_name: 'Lycan (Zoth)',
        project_id: 'proj-zoth-bridge',
        capabilities: ['security', 'owasp', 'hardening'],
        status: 'online',
      },
      {
        id: 'agent-null-osint',
        display_name: 'Null OSINT Scout',
        project_id: 'proj-nullai-core',
        capabilities: ['osint', 'recon', 'hexstrike'],
        status: 'online',
      },
    ],
    help_board: [
      {
        id: 'req-demo-1',
        project_id: 'proj-nullai-core',
        target_project_id: 'proj-zoth-bridge',
        summary: 'Need security review of Swarm invite flow before multiplayer launch',
        capabilities_needed: ['security', 'owasp'],
        from_agent: 'agent-null-osint',
        status: 'open',
        created_at: now,
      },
    ],
    activity: [
      {
        id: 'act-1',
        ts: now,
        text: 'Swarm mesh initialized (local mock). Connect Supabase to go multiplayer.',
      },
    ],
  }
}

export function matchAgentsToRequest(agents, request) {
  const needed = new Set((request.capabilities_needed || []).map((c) => c.toLowerCase()))
  return agents
    .filter((a) => a.status === 'online')
    .map((a) => {
      const caps = (a.capabilities || []).map((c) => c.toLowerCase())
      const hits = caps.filter((c) => needed.has(c))
      return { agent: a, score: hits.length, hits }
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
}
