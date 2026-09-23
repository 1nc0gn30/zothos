#!/usr/bin/env bash
# ZOTHOS Global Environment — loaded for all login shells
export ZOTHOS_VERSION="1.0-Azoth"
export ZOTHOS_AI_ENV="/opt/zothos-ai-env"
export ZOTHOS_HOME="/etc/zothos"

# ── PATH extensions ────────────────────────────────────────────────────────
export PATH="/usr/local/bin:${ZOTHOS_AI_ENV}/bin:${HOME}/.local/bin:${HOME}/.cargo/bin:${HOME}/go/bin:/usr/local/go/bin:/root/go/bin:${PATH}"
export PYTHONPATH="/opt/theHarvester:${ZOTHOS_AI_ENV}/lib/python3.13/site-packages:${ZOTHOS_AI_ENV}/lib/python3.11/site-packages:${PYTHONPATH:-}"
export NODE_PATH="/usr/local/lib/node_modules:${NODE_PATH:-}"
export GOPATH="${HOME}/go"

# ── AI API stubs (user sets real values in ~/.zoth-secrets) ───────────────
[[ -f "${HOME}/.zoth-secrets" ]] && source "${HOME}/.zoth-secrets"

# ── Display ZOTHOS banner on interactive terminal ─────────────────────────
if [[ $- == *i* ]] && [[ -x /usr/local/bin/zoth-fastfetch ]]; then
    /usr/local/bin/zoth-fastfetch 2>/dev/null || true
fi
