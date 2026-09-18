# Meanwhile Back in Queens — Decisions

Date: 2026-06-13

## Active Thesis

Meanwhile Back in Queens is a faceless, drop-based Queens lifestyle brand where the customer is the hero. The engagement is to install a compounding intelligence system so Imtiaz spends his brain on creative direction and campaign storytelling, and the system handles finance, admin, follow-up, and content operations.

## Decision 001 — Lead With Structure, Not AI

Decision: Always put a business structure (lean canvas / problem statement) on the screen before connecting any AI.

Why: AI without grounding produces "stupid answers." The structure is what makes the through-line legible and lets the model reason. It is also the cheapest way to build agreement with the client.

## Decision 002 — Keep It Faceless; Customer Is The Hero

Decision: Preserve the faceless brand decision. Every product and story makes the *buyer* the protagonist (wearable Queens), and every Queens story is sourced from the community, not a host's face.

Why: Faceless is a feature, not a gap. It gives the customer a chance to wear it and makes the merch a tribal signal. It also makes the Substack/blog model (community-submitted stories) coherent.

## Decision 003 — Segment By Probability, Not Personas

Decision: Use p50 / p95 / p99 spend segmentation instead of named demographic personas.

Why: The drop model produces a long-tail spend distribution. The p99 buyer (often someone with taste who works inside a brand and has budget) is a different business than the p50 single-item buyer. Probability framing surfaces the callable high-value cohort that generic personas hide. See `customer-probability-segments.md`.

## Decision 004 — Two Top-Of-Funnel Engines: Substack + AEO/SEO

Decision: Build *Queens Field Notes* on Substack as the always-on storytelling/discovery engine, and convert the Instagram archive into a searchable owned blog for SEO and AI-engine optimization.

Why: The brand is drop-dependent, so it has demand-generation spikes but no regular storytelling cadence. Substack gives a twice-weekly inbox relationship and a discovery/growth engine; the blog captures the research-grade content that already gets cited in research papers. See `substack-newsletter-strategy.md` and `instagram-archive-to-blog.md`.

## Decision 005 — Finance Lives In Shopify + Mercury, Not QuickBooks

Decision: Build the financial intelligence layer primarily against Shopify (store, bank, card) and Mercury, reconciling QuickBooks only where needed. Defer the Intuit/QuickBooks MCP server until there is a clear gap.

Why: Discovered live that there has been no service revenue for 2 years; almost all finance flows through Shopify and Mercury. A QuickBooks MCP integration (~2 hrs) is real work and was not the bottleneck. Finaloop is a possible future switch but not a blocker.

## Decision 006 — Stand Up CFO And COO Agents With Heavy Grounding And Guardrails

Decision: Build a CFO business agent (cash-flow leadership, lines of credit, forecasting) and a COO agent (admin, follow-up, ops) — but only after grounding on the three financial statements and explicit guardrails on bank access.

Why: A CFO agent is not "make the numbers add up." It requires historical statement-of-cash-flows analysis, a waterfall projection across scenarios, and reconciled P&L and balance sheet, attached to the drop/campaign business drivers. Bank-account access raises the risk profile and needs guardrails. See `compounding-intelligence-build.md`.

## Decision 007 — Codex Desktop On The Always-On Mac Mini First; On-Prem Later

Decision: Run the system on the office Mac mini (always on, lots of space) as the first operating node, tunnel in from anywhere, and graduate to dedicated on-prem only after repeated workflow pain. Use the Codex **Business** plan (privacy: not in training data), two seats (Imtiaz + Tamid).

Why: The immediate risk is validating the workflow, not infrastructure scale. The Mac mini is already always-on. A second seat means a family member / intern can do meaningful work and take the IG→blog and newsletter jobs off Imtiaz's plate.

## Decision 008 — Treat IP As A Licensable Asset (Future Balance-Sheet Lever)

Decision: Park, but document, the option to license Imtiaz's drop-style marketing IP (templates, playbooks) to partners (QEDC, Queens Chamber of Commerce, Coca-Cola, etc.) and to grow the balance sheet through liabilities (lines of credit, bricks-and-mortar / banking partner).

Why: He already has proven drop-marketing IP and no one has an "API for drop-style marketing." Selling what he already has avoids the trap of having to "learn everything about the Bronx" to grow. Cultural relationship with the banking system is a noted, unexploited edge. This is a later-stage move; do not let it distract from the integration.

## Decision 009 — Curate Aggressively; Throw Away ~30%

Decision: Treat roughly 30% of generated output as disposable. Steer and curate rather than accept. Validate every data claim (e.g. p99 LTV) against receipts before acting.

Why: Demonstrated live — some Substack ideas were nonsense, dashboards looked reactive but weren't. The human value is curation, steering, and asking the questions the model will not suggest.

## Decision 010 — Situational Awareness Is Part Of The System

Decision: Design the system around Imtiaz's energy and executive function: phone-to-desktop dispatch so he can fire off actions before a walk/workout and return to drafts ready to send or hand off.

Why: Metabolic/energy constraints and ADHD hyperfocus are real operating variables. "What's the first thing I work on next" after a draining call is a recurring failure mode the system should absorb. The goal is to get him outside more, not chain him to a computer.
