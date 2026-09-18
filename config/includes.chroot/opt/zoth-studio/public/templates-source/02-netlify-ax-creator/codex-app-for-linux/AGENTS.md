# AGENTS.md

## Project Identity

This repo is **Codex Workbench Linux**, a Linux-native local web workbench for running Codex CLI sessions. It is a small Python standard-library app with static HTML/CSS/JS. It is not an Electron app, not a React app, and not a hosted SaaS product.

## Core Flow

1. `./codex-workbench-linux` executes `codex_workbench_linux/server.py`.
2. `server.py` starts a `ThreadingHTTPServer` on `127.0.0.1` by default.
3. The server serves `codex_workbench_linux/static/index.html`.
4. The browser UI posts a session payload to `/api/sessions`.
5. `SessionManager` builds the selected Codex/Ollama command.
6. `CodexSession` starts the command inside a PTY and streams output.
7. If an initial prompt was supplied, the server sends it through the PTY after startup instead of appending it as a one-shot CLI argument.
8. The UI polls `/api/sessions/{id}`, sends input through `/input`, lists files through `/files`, and previews one UTF-8 file through `/file`.

## Files That Matter

- `codex-workbench-linux`: executable wrapper.
- `codex_workbench_linux/server.py`: backend, API routing, PTY lifecycle, file browsing.
- `codex_workbench_linux/static/app.js`: command builder, API client, polling, tabs, file browser, preview URL detection.
- `codex_workbench_linux/static/index.html`: semantic app shell.
- `codex_workbench_linux/static/styles.css`: responsive visual system.
- `install-desktop-entry.sh`: installs the local `.desktop` launcher.
- `packaging/codex-workbench-linux.desktop`: desktop launcher template.
- `README.md`: user-facing setup, architecture, and publish guide.

## Engineering Rules

- Keep the app dependency-free unless the user explicitly approves a new dependency.
- Keep the default listener local-only.
- Do not convert this to Next.js, Electron, or a bundled frontend stack unless the user explicitly requests that direction.
- Prefer minimal, readable Python over clever abstractions.
- Preserve workspace path containment in file APIs.
- Preserve PTY behavior for Codex sessions.
- Do not expose secrets in frontend code.
- Do not invent model availability or validation results.
- Update README whenever commands, endpoints, launch modes, or setup steps change.

## Validation

Run the smallest relevant validation after edits:

```bash
python3 -m py_compile codex_workbench_linux/server.py
```

For launch/API changes:

```bash
./codex-workbench-linux --no-browser --port 8765
curl -L http://127.0.0.1:8765/api/health
```

For UI behavior changes, run the server and manually smoke the affected browser flow when possible.

## Known Repository Quirk

This workspace currently has an empty `.git` directory, so normal Git commands may fail until the repo is reinitialized or republished cleanly. Do not assume Git history is available.
