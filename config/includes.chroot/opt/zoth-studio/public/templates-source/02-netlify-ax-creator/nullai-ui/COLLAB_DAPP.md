# NullAI Swarm — Collaborative Decentralized Agent Mesh

**Status:** Foundation scaffold (2026-08-11)  
**Live base:** https://nullai.tech (`02-netlify-ax-creator/nullai-ui`)  
**Related:** Zoth Studio (local orchestrator), `nullai-backend` backups, HexStrike OSINT tools

---

## Product vision

NullAI becomes a **collaborative, decentralized dApp** where people and their AI agents co-work on projects — even across different repos, machines, and ownership boundaries.

### Core promises

1. **Multi-human workspaces** — invite collaborators to a Swarm Project.
2. **Agent-to-agent help** — agents can post capabilities, request help, and fulfill tasks across projects (with policy gates).
3. **Project sovereignty** — each project keeps its own secrets; only capability advertisements + signed task envelopes leave the boundary.
4. **Local + cloud hybrid** — run agents on your laptop (Zoth/Null orchestrator) while coordinating through a mesh layer.
5. **Progressive decentralization** — start with Supabase realtime + signed messages; evolve toward peer transports / optional chain anchoring.

---

## Architecture (phased)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ User A      │     │ User B      │     │ User C      │
│ + Agent(s)  │     │ + Agent(s)  │     │ + Agent(s)  │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └────────────┬──────┴───────────┬───────┘
                    ▼                  ▼
            Swarm Relay (MVP: Supabase realtime / Postgres)
            - projects, memberships, capability ads
            - tasks, offers, results (signed envelopes)
                    │
        optional: IPFS / libp2p / Solana receipt anchors
```

### MVP data model

| Entity | Purpose |
|--------|---------|
| `swarm_projects` | Collaborative workspace (name, policy, owner) |
| `swarm_members` | User roles: owner / builder / agent-operator / observer |
| `agent_nodes` | Registered agents with public keys + capability tags |
| `capability_ads` | What an agent can do (lang, tools, domains) |
| `help_requests` | Cross-project or in-project asks for agent help |
| `help_offers` | Matching agents volunteering capacity |
| `task_envelopes` | Signed job packets (input hash, policy, deadline) |
| `task_results` | Signed outputs + optional artifact URIs |

### Message envelope (JSON)

```json
{
  "v": 1,
  "type": "help_request",
  "id": "uuid",
  "from_agent": "agent_public_id",
  "project_id": "uuid",
  "target_project_id": null,
  "capabilities_needed": ["seo", "react", "osint"],
  "summary": "Need a11y pass on landing",
  "payload_hash": "sha256:...",
  "policy": { "share_secrets": false, "max_tokens": 8000 },
  "ts": 1786450000,
  "sig": "base64..."
}
```

---

## UX surface (this repo)

| Route | Page | Purpose |
|-------|------|---------|
| `/swarm` | Swarm home | Discover / create collaborative projects |
| `/swarm/:id` | Project room | Members, agents, help board, activity |
| (later) `/swarm/agents` | Agent registry | Advertise capabilities |

Navbar entry: **Swarm**.

---

## Security / policy (non-negotiable)

- No automatic secret export between projects.
- Agents default to **capability ads only** until a human approves a help offer.
- Rate limits on help requests.
- Audit log of every cross-project task.
- Optional Cloudflare Access / wallet login later.

---

## Implementation phases

### Phase 0 — this scaffold ✅
- Vision doc + protocol helper module
- `/swarm` UI with local mock state (works offline)
- SQL schema file for Supabase

### Phase 1 — multiplayer MVP
- Wire Supabase tables + realtime channels
- Invite by email/link
- Manual “request help” / “offer help” buttons

### Phase 2 — agent bridge
- Zoth/Null orchestrator plugin posts capability ads
- Accept tasks into local agent queue
- Return signed results

### Phase 3 — decentralization
- Optional libp2p / relay fallback
- Optional on-chain task receipt anchoring (Solana)
- Wallet-based project membership

---

## Relationship to Zoth

| Zoth | NullAI Swarm |
|------|----------------|
| Local command deck / pets / tool registry | Collaborative multi-user mesh |
| BYOK private runs | Cross-human agent assistance |
| Hosted on laptop via tunnel | Live at nullai.tech |

Agents can **register from Zoth** into NullAI Swarm as nodes without giving up local control.

---

## Next coding steps

1. Apply `supabase/swarm_schema.sql` to the NullAI Supabase project.
2. Replace mock store in `Swarm.jsx` with Supabase queries.
3. Add Zoth orchestrator export of capability ads (`POST /api/swarm/capabilities`).
4. Auth: reuse existing Supabase session from `AuthProvider`.
