# Zoth Glass Wall Tool Registry

> The sovereign, high-density index of 298+ offline tools, daemons, archetypes, and utilities powering the Zoth Studio autonomous agent ecosystem.

---

## ⚡ Overview

The **Zoth Glass Wall Registry** provides a transparent, zero-egress catalog of all tools, scripts, background daemons, and microservices available to the operator and sovereign agent swarms.

Every tool in the registry adheres to deterministic interface contracts, strict local-first execution semantics, and offline mock fallbacks. The registry UI allows sub-millisecond fuzzy search, capability-based taxonomy filtering, instant CLI command copying, runtime badge inspection, and client-side bookmark persistence.

```
┌──────────────────────────────────────────────────────────┐
│              Zoth Studio Operator & Swarm                │
│       (@antigravity · @grok · @hermes · ollama)          │
└────────────────────────────┬─────────────────────────────┘
                             │
                  Queries & Invokes Tools
                             ▼
┌──────────────────────────────────────────────────────────┐
│              Glass Wall Registry Engine                  │
│  ┌───────────────────────┐   ┌────────────────────────┐  │
│  │   298+ Tool Catalog   │   │   Taxonomy Filter Bar  │  │
│  ├───────────────────────┤   ├────────────────────────┤  │
│  │   Offline Caching     │   │   CLI Copy Contracts   │  │
│  ├───────────────────────┤   ├────────────────────────┤  │
│  │   Argon2id Keyrings   │   │   4-Theme Token Matrix │  │
│  └───────────────────────┘   └────────────────────────┘  │
└────────────────────────────┬─────────────────────────────┘
                             │
                  Local POSIX Execution
                             ▼
┌──────────────────────────────────────────────────────────┐
│                  Loopback Daemons (:8484 / :8787)        │
│          Python AST · Rust Daemon · Node / WASM          │
└──────────────────────────────────────────────────────────┘
```

---

## 📋 Schema Specification (`zoth-public-registry/v1`)

The registry catalog is defined in [`tools.json`](./tools.json) using the standardized `zoth-public-registry/v1` schema contract:

```json
{
  "$schema": "https://zoth.nullai.tech/schemas/registry-v1.json",
  "version": "1.2.0",
  "generatedAt": "2026-09-15T00:00:00Z",
  "totalTools": 298,
  "categories": [
    "AI & Multi-Agent",
    "Security & Cryptography",
    "Creative & 3D WebGL",
    "DevOps & Edge Deployment",
    "Fintech & Web3",
    "OSINT & Reconnaissance",
    "Hardware & IoT",
    "Data & Knowledge Graph"
  ],
  "tools": [
    {
      "id": "tool-ast-validator",
      "name": "Python AST Syntax Validator",
      "category": "AI & Multi-Agent",
      "runtime": "python3",
      "version": "3.11+",
      "entrypoint": "scripts/ast_validator.py",
      "runCommand": "python3 scripts/ast_validator.py --strict",
      "tags": ["ast", "python", "static-analysis", "consensus"],
      "description": "Validates syntactical correctness of generated Python scripts prior to swarm execution.",
      "securityTier": "Airgapped",
      "loopbackPort": null
    }
  ]
}
```

### Key Tool Attributes

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique alphanumeric identifier for tool invocation. |
| `name` | `string` | Human-readable title displayed on the registry card. |
| `category` | `string` | High-level taxonomy category matching navigation filters. |
| `runtime` | `string` | Execution environment (`python3`, `node`, `rust-bin`, `wasm`, `sh`). |
| `runCommand` | `string` | Shell command executed via copy button or local terminal bridge. |
| `tags` | `array[string]` | Granular tags for real-time fuzzy filtering and capability clustering. |
| `securityTier` | `string` | Isolation level (`Airgapped`, `BYOK Vault`, `Local Daemon`, `Edge Relay`). |
| `loopbackPort` | `number \| null` | Dedicated local TCP port for HTTP/SSE/WebSocket daemons. |

---

## 🎨 4-Theme Design System Matrix

The registry supports 4 contrast-compliant visual archetypes:

| Theme | Selector | Background | Accent / Ink | Border / Line |
|---|---|---|---|---|
| **Dark Void** | `[data-theme="dark"]` | `#050508` / `#0a0e1a` | `#00f0ff` (Cyan) / `#fff` | `rgba(255,255,255,0.08)` |
| **Light Sovereign** | `[data-theme="light"]` | `#f7f9fc` / `#ffffff` | `#92400e` / `#111827` | `rgba(17,24,39,0.12)` |
| **Matrix Terminal** | `[data-theme="matrix"]` | `#020804` / `#031008` | `#00ff66` (Phosphor) | `rgba(0,255,102,0.25)` |
| **Alchemical Gold** | `[data-theme="gold"]` | `#0d0903` / `#160f02` | `#fbbf24` (Amber Gold) | `rgba(251,191,36,0.25)` |

All typography adheres to WCAG AAA contrast ratios, with interactive hover elevations, 44px minimum tap target sizes, and vector SVG iconography.

---

## 🔒 Offline Durability & Zero Egress

1. **Local-First Assets**: The registry bundle is entirely self-contained with no external CDN dependencies.
2. **Deterministic Caching**: LocalStorage caches star bookmarks, search history, and drawer view preferences.
3. **No Phoning Home**: Zero external analytics, tracking pixels, or cloud metrics.
4. **Airgap Execution**: All tools run within isolated local subshells or loopback daemons.

---

## 📁 File Manifest

- [`index.html`](./index.html): Interactive high-density Glass Wall Registry browser.
- [`registry.js`](./registry.js): Fast client-side search, filtering, bookmarking, and drawer controller.
- [`registry.css`](./registry.css): Foundational card grid, filter chip, and drawer styles.
- [`registry-poster.css`](./registry-poster.css): Editorial layout, typography hierarchy, and 4-theme token overrides.
- [`tools.json`](./tools.json): Standardized JSON registry database containing all 298+ tool contracts.
