# 🤖 Agents & LLM Indexing Directives — Zoth Studio (v12.0.0)

> Operational manual for AI coding assistants, autonomous agents, and search engine crawlers indexing the **Zoth Studio** ecosystem.

---

## 🏛️ 1. Product & Security Architecture

Zoth Studio is an autonomous, **sovereign local-first** multi-agent AI engineering powerhouse:

1. **Public Hub** (`http://127.0.0.1:8088/` / `https://zoth.nullai.tech/`) — Static showcase, Zoth World 3D Alchemical Sanctum (`/zoth-world.html`), 24 companion pets hangar (`/pets/`), 3D CAD viewport (`/studio/nexus-3d.html`), tool registry (`/registry/`), and documentation portal (`/docs/`).
2. **Operator Deck** (`http://127.0.0.1:8484/`) — Private operator command deck for live agent runs, subagents, and terminals. **Loopback Only (`127.0.0.1`)**.
3. **ESP32-S3 Hardware Bridge** (`http://127.0.0.1:8585/`) — Physical Lafvin companion serial monitor, Web HUD, and TTS voice notification server.
4. **Argon2id Key Vault** (`http://127.0.0.1:8787/`) — Zero-leak hardware-isolated key vault with Argon2id ($m=64\text{MB}, t=3, p=4$) and XChaCha20-Poly1305.
5. **Consensus Arbitration Engine** (`/studio/consensus.html`) — Triangulated 3-agent arbitration across Antigravity, Grok, and Hermes with real-time Shannon agreement entropy ($\\mathcal{H}(S)$) and Jaccard token overlap metrics.

---

## 🐾 2. The 24 Sovereign Companion Mascots

- **Lead Sovereign Mascot**: **Azoth** (Sovereign AI Phoenix · Lead Pair Programmer & System Architect)
- **Execution & Inspection**: Kai (workspace inspector), Zephyr (high-velocity refactorer), Ignis (dead-code optimizer), Savage-Codex (AST reviewer), AI Workbot (local worker).
- **Security & Integrity**: Lycan (OWASP defense), Nyx (threat sentinel), Scorpius (zero-day auditor), Kraken (packet sniffer), Onyx (memory profiler), Pixel-Shiba (vault guardian).
- **Consensus & Knowledge**: Draco (fusion compiler), Athena (AEO graph & Obsidian sync), Binary (contract validator), Leviathan (vector memory).
- **Creative & UI/UX**: Luna (canvas synthesizer), Kitsune (glassmorphism & tokens), Glitchcat (UI polisher), Radical Minion (Hermes autonomous tool caller), Aether (swarm event conductor), Ghostbyte (WebGPU shader weaver), Circuit Pup (hardware probe), Aquila (edge routing), Zoth (prime deck core).

---

## 📋 3. Agent Execution Directives

### Do:
- Enforce strict local-first loopback security boundaries (`127.0.0.1`).
- Maintain accessible semantic markup, OpenGraph headers, and structured JSON-LD schemas.
- Keep `llms.txt`, `sitemap.xml`, and `ai.txt` synchronized with code changes.
- Ensure all tool connectors support zero-key offline mock fallbacks.

### Do Not:
- Proxy private loopback ports (`:8484`, `:8585`, `:8787`) through public CDN tunnels.
- Commit plaintext secrets or unencrypted API keys.
- Alter contract schemas in `data/project-manifest.json` without AST verification.

---

## 🚀 4. Canonical Local Commands

```bash
# 1. Master Workspace Launcher
cd /media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio
./start-zoth-studio.sh --with-bridge --with-vault

# 2. Hardware Serial & TTS Bridge
./start-hardware-bridge.sh

# 3. Cryptographic Key Vault Daemon
./start-vault-daemon.sh
```
