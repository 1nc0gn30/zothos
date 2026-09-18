# Meanwhile Back in Queens — Compounding Intelligence Build Plan

Date: 2026-06-13

The system build for this engagement. This is the delivery side of the $500 setup + $85/hr offer, specific to Imtiaz.

## Operating Node

- **Primary node:** office Mac mini (always on, ample storage). Tunnel in from anywhere.
- **Harness:** Codex Business plan (~$200/mo, privacy = not in training data), **two seats** (Imtiaz + Tamid).
- **Secondary AIs (as needed):** Fable (creative direction), Devin (CTO-grade builds), Antigravity (Google labs), local SLMs for private image/text. Codex is the runner/producer; others strap in for specific jobs.
- **On-prem:** defer until repeated workflow pain justifies it.

## Phase 1 — Connect The Data (the $500 setup)

| System | Action | Status |
|---|---|---|
| Shopify (store, bank, card) | Codex Shopify plugin; pull analytics, customers, finance | Done in-session |
| Google — Email (Gmail) | Connect for follow-up drafting + triage | Pending (4:30 session) |
| Google — Calendar | Connect for scheduling + situational awareness | Pending (4:30 session) |
| Google — Drive / Docs | Connect existing document set as grounding | Pending (4:30 session) |
| Mercury | Surface the Mets payout + banking flows | To confirm |
| QuickBooks / Intuit | Reconcile only where Shopify/Mercury leave gaps; MCP server ~2 hrs if needed | Deferred (Decision 005) |
| "Community" SMS list | Look for a connector; review any third-party plugin code before installing | Backlog |
| Instagram | Computer-use (Chrome) for analytics export (90-day retention) + archive | Partially set up |

Grounding documents to load as core context: `differentiated-messaging.md`, `roi-drivers.md`, `lean-business-model-canvas.md`.

## Phase 2 — Stand Up The Agents

### CFO Agent (heavy grounding required — Decision 006)
Not "make the numbers add up." Cash-flow leadership for a campaign/drop business.
1. Historical statement-of-cash-flows analysis.
2. Waterfall projection across scenarios.
3. Reconcile P&L. Reconcile balance sheet.
4. Attach the three statements to business drivers (drops, campaigns, manufacturing, lines of credit).
5. Then: runway, burn rate, line-of-credit utilization, liquidity vs. overhead, Q4 planning.

Guardrails: bank-account access is the danger zone. Start read-only. Human approval before any money movement. (Jai runs read-only Chase access on his own setup as the model.)

### COO Agent
- Email follow-up drafts (70% there; Imtiaz sends or hands off).
- "What's the first thing to work on next" after a draining call (executive-function support).
- Custom business-intelligence reporting on a schedule, with monitoring.
- Opportunity scanner: weekly scan for brand social-enterprise programs / grants / collaborations (Uber, MasterCard, Visa, Coca-Cola, SBA).

## Phase 3 — Content & Growth Jobs (run continuously, hand off to seat 2)

- **IG archive → blog (goal mode):** see `instagram-archive-to-blog.md`. Persistent memory includes "people cite us in research papers."
- **Queens Field Notes (Substack):** see `substack-newsletter-strategy.md`.
- Both are designed to be steered by Imtiaz, then handed to Tamid / an intern on the second seat.

## Situational-Awareness Layer (Decision 010)

- Phone-to-desktop dispatch: before a walk/workout, dictate actions; return to drafts ready to send.
- Calendar + energy awareness: protect creative time; absorb admin around it.
- Explicit goal: get Imtiaz outside more, not chained to the Mac.

## Guardrails & Hygiene

- **Babysit permissions** until trust is built; do NOT enable dangerous auto-accept yet (Jai does on his own machine, but recommended against here until a managed-service comfort level exists).
- Review any non-OpenAI plugin's code before installing (someone else wrote it).
- Validate every action-triggering number against receipts.
- Throw away ~30% of output; curate and steer.

## Known Issues

- iPhone ↔ Mac control broke on a Codex version mismatch in-session. Deferred. Revisit after a Codex update.
- HTML dashboards are read surfaces, not reactive BI.

## Definition Of Done For The $500 Setup

- Shopify + Gmail + Calendar + Drive connected and queryable from the Mac mini.
- Core context docs loaded (messaging, ROI, BMC).
- One working follow-up-draft flow, one scheduled BI report, and the IG→blog + Substack jobs running.
- Two seats provisioned; Tamid able to take a hand-off job.
- A booked next step on the calendar.
