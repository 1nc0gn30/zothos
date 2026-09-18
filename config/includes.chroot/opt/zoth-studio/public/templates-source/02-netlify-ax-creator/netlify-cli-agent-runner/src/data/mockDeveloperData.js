export const developerProjects = [
  {
    name: 'Marketing Site',
    status: 'Guarded',
    approval: 'Human approval required',
    access: 'Preview + controlled prod',
  },
  {
    name: 'Docs',
    status: 'Stable',
    approval: 'Agent-only presets',
    access: 'Preview only',
  },
  {
    name: 'Landing Experiments',
    status: 'Live experiment',
    approval: 'Fast track with safeguards',
    access: 'Prod canary at 10%',
  },
]

export const requestQueue = [
  {
    id: 'q1',
    client: 'Aster Studio',
    request: 'Approve localized hero rollout to 25%',
    risk: 'Low',
    eta: 'Waiting on you',
  },
  {
    id: 'q2',
    client: 'Foundry Labs',
    request: 'Allow security scan against production lockfile',
    risk: 'Medium',
    eta: 'Agent ready',
  },
]

export const guardrails = [
  { id: 'g1', name: 'Human approval required', active: true, detail: 'Agents pause before touching prod.' },
  { id: 'g2', name: 'Prod deploy lock (Fri 4p-9p)', active: true, detail: 'Protecting live event traffic.' },
  { id: 'g3', name: 'Preview-only tokens for clients', active: false, detail: 'Allow limited dry runs.' },
  { id: 'g4', name: 'Auto-publish safe presets', active: true, detail: 'Ship reusable actions instantly.' },
]
