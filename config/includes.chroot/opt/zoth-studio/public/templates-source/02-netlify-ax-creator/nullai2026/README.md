# ⚡ NullAI 2026 Platform & MCP AI Agent Studio

[![Status](https://img.shields.io/badge/Status-Production_Ready-00ff87?style=for-the-badge)](https://nullai.tech)
[![Stack](https://img.shields.io/badge/Stack-React_19_|_Vite_|_MUI_v7_|_Supabase-00f0ff?style=for-the-badge)](https://nullai.tech)
[![MCP](https://img.shields.io/badge/MCP-Model_Context_Protocol_Active-a855f7?style=for-the-badge)](https://nullai.tech)
[![ZOTH Studio](https://img.shields.io/badge/ZOTH_Studio-Obsidian_Linked-ff007f?style=for-the-badge)](https://nullai.tech)

> **NullAI 2026** is the flagship AI Agent Studio, MCP (Model Context Protocol) Bridge, and Global Node Mesh platform integrated into **ZOTH Studio**.

---

## ⚡ Key Capabilities & Architecture

### 1. 🤖 Interactive MCP AI Agent Studio (`/tools`)
- **Multi-Model Orchestration:** Stream & interact with models including `Hermes Nous`, `GhostByte AI Mascot 👻`, `Gemini Flash 3.6`, and `NullAI Security Agent`.
- **🔌 Model Context Protocol (MCP) Server Connector:**
  - Connect to local or cloud MCP servers via endpoint URL and API token.
  - Supports **HexStrike Local MCP** (`http://localhost:8420/mcp`), **FastMCP/Ollama** (`http://localhost:8000/mcp`), and custom MCP providers.
  - **Tool Discovery & Dispatch:** Automatically discovers available MCP tools (`hexstrike_nmap_scan`, `ast_code_audit`, `owasp_headers_check`, `zero_knowledge_verifier`) for active execution.
- **Real-Time Telemetry Log Console:** Live streaming log console for execution metrics and stdout.

### 2. 👻 GhostByte — The NullAI Mascot Pet
- **Global AI Companion:** Floating interactive mascot (`GhostBytePet.jsx`) present across all platform pages.
- **Interactive Moods & Reactions:** Reacts with floating animations, quote updates, and sector pings.

### 3. 🌐 Global Node Mesh & Regional Locking (`/nodes`)
- **Interactive Sector Lock-in:** Lock operator identity into regional nodes (*Virginia Beach*, *London*, *Tokyo*, *Frankfurt*, *Singapore*, *São Paulo*, etc.).
- **Active Peer Mesh:** View and connect with online operators broadcasting in each sector.
- **Netlify Primitives & Functions:** Powered by `netlify/functions/node-lock.js` and serverless Netlify Blobs/Identity configurations.

### 4. 🛡️ Security & Performance
- **OWASP Hardening:** Strict CSP policies, X-Frame-Options DENY, X-Content-Type-Options nosniff, and HSTS headers.
- **Offline PWA Support:** Service worker (`sw.js`) and web app manifest (`manifest.json`) via `vite-plugin-pwa`.
- **AI Engine Optimization (AEO):** Machine-readable discovery files (`public/llms.txt`, `public/ai.txt`, `sitemap.xml`).

---

## 🗺️ Project Structure

```text
nullai2026/
├── netlify/
│   └── functions/
│       └── node-lock.js          # Netlify serverless node lock & peer mesh API
├── public/
│   ├── DarkMode-NullAI-Icon.png  # GhostByte mascot icon
│   ├── llms.txt                  # AEO search crawler discovery
│   └── manifest.json             # PWA web manifest
├── src/
│   ├── app/
│   │   ├── App.jsx               # Global layout wrapper with GhostByte & Sonner toasts
│   │   └── router.jsx            # App page routes (/tools, /nodes, /feed, /profile)
│   ├── components/
│   │   ├── GhostBytePet.jsx      # GhostByte AI mascot pet companion
│   │   └── FooterBar.jsx
│   ├── pages/
│   │   ├── Tools.jsx             # AI Agent Studio & MCP Server Connector
│   │   ├── Nodes.jsx             # Global Node Mesh & Sector Locking Map
│   │   ├── Feed.jsx              # Signal Broadcast Feed
│   │   └── Profile.jsx           # Local Operator Profile
│   └── services/
│       └── api.js                # Core API, SSE stream, and HexStrike execution bridge
├── netlify.toml                  # Netlify build, dev server (port 4321), and security headers
├── package.json
└── vite.config.js
```

---

## 🚀 Quickstart & Setup

### 1. Navigate to Project
```bash
cd "/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/02-netlify-ax-creator/nullai2026"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
# Launches Vite dev server at http://localhost:4321
```

### 4. Build for Production
```bash
npm run build
# Compiles PWA & static assets to dist/
```

### 5. Launch Netlify Dev (with Functions & Primitives)
```bash
npx netlify dev
```

---

## 🔌 MCP Integration Quick Guide

To connect your own MCP server (HexStrike, Ollama, or custom FastMCP):

1. Open **AI Agent Studio** (`/tools`).
2. Click **`🔌 MCP: CONNECTED`** in the top right header.
3. Select a preset or enter your **MCP Server URL** (e.g. `http://localhost:8420/mcp`) and **API Bearer Token**.
4. Click **`TEST HANDSHAKE`** to discover available MCP tools, then click **`CONNECT & SAVE MCP`**.

---

## 🔗 Obsidian Knowledge Graph

- **Master Category Hub:** [[Category-Netlify-and-Creator-Tools]]
- **Parent Framework:** [[Zoth-Studio-Master-Index]]
- **Security Engine:** [[HexStrike-AI-Terminal]]