# Codex Workbench Linux

## One-Line Product Definition

Codex Workbench Linux is a Linux-native local browser workbench for running Codex CLI sessions with a terminal stream, workspace file browser, and live app preview pane.

## Positioning

This project should be presented as a practical Linux companion for Codex CLI workflows, not as a clone of the private macOS/Windows Codex App and not as an OpenAI-owned product.

Recommended language:

- "Linux-native local workbench for the Codex CLI"
- "Terminal, files, and preview in one local interface"
- "Runs without Electron, npm, or a frontend build step"
- "Independent community tool for local Codex workflows"

Avoid:

- implying official OpenAI ownership
- calling it the official Codex App
- promising feature parity with private platform-specific apps
- describing it as hosted, remote, or cloud-managed

## Why It Exists

Linux users can already run `codex` in a terminal, but agent work often needs a more durable control surface:

- readable session output without full-screen TUI constraints
- follow-up input from a browser UI
- quick workspace file inspection
- embedded preview for the app being built
- launcher choices for direct Codex CLI, Codex OSS, and Ollama cloud flows
- `.desktop` launcher support for normal Linux app menus

The project is intentionally small and local-first so it is easy to inspect, publish, fork, and adapt.

## Current Repository Identity

- Product name: `Codex Workbench Linux`
- Executable: `./codex-workbench-linux`
- Python package folder: `codex_workbench_linux/`
- Desktop file: `packaging/codex-workbench-linux.desktop`
- Main backend: `codex_workbench_linux/server.py`
- Static UI: `codex_workbench_linux/static/`

If renaming again, update all of these together:

- executable filename
- Python package path in executable
- desktop entry template and installer
- HTML title and H1
- browser localStorage keys if persistence identity should change
- README
- AGENTS.md
- Obsidian notes

## Core Flow

1. User runs `./codex-workbench-linux`.
2. The shell wrapper executes `python3 codex_workbench_linux/server.py`.
3. The Python server binds locally, normally to `127.0.0.1`.
4. The server serves the static UI from `codex_workbench_linux/static`.
5. The user chooses workspace, launcher, model, sandbox, and optional initial prompt.
6. The browser posts to `POST /api/sessions`.
7. `SessionManager` validates the workspace and builds the selected Codex command.
8. `CodexSession` starts the command in a Linux PTY.
9. The UI polls `GET /api/sessions/{id}` for terminal output.
10. The UI can post follow-up text to `POST /api/sessions/{id}/input`.
11. The UI can browse workspace files through `/files` and `/file`.
12. The preview pane can load manually entered or detected URLs.

## Default Workspace Behavior

Backend fallback:

```python
DEFAULT_WORKSPACE = Path.home()
```

Frontend initial field:

```javascript
window.localStorage.getItem("codex-workbench-workspace") || "~"
```

On this machine, `~` resolves to:

```text
/home/neo
```

That means a fresh browser session starts agents in `/home/neo` unless the workspace field has been changed or localStorage already has a saved value.

## Launcher Modes

### Ollama Launch Codex

Default product path:

```bash
ollama launch codex --model deepseek-v4-pro:cloud -- --no-alt-screen --cd ~/project --sandbox workspace-write
```

Use when the user wants Ollama to launch Codex with an Ollama cloud model.

### Original Codex CLI

```bash
codex --no-alt-screen --cd ~/project --sandbox workspace-write
```

Use when the user wants their normal Codex CLI auth/config/model path.

### Codex CLI + Ollama OSS

```bash
codex --no-alt-screen --cd ~/project --sandbox workspace-write --oss --local-provider ollama
```

Use when the user wants local OSS provider behavior through Codex.

## API Surface

Local UI endpoints:

```text
GET  /
GET  /static/{file}
GET  /api/health
GET  /api/sessions
POST /api/sessions
GET  /api/sessions/{id}
POST /api/sessions/{id}/input
POST /api/sessions/{id}/stop
GET  /api/sessions/{id}/files?path=.
GET  /api/sessions/{id}/file?path=README.md
```

The API is intentionally small and local. If this is ever exposed beyond localhost, authentication and stricter process/file controls become mandatory.

## Security Model

Treat this app like a browser surface attached to a local terminal:

- It can start Codex in user-selected workspaces.
- It can send text into the running process.
- It can preview files under the active workspace.
- It should not be exposed to untrusted networks.

Current safety boundaries:

- default host is local
- file browsing is scoped to the active session workspace
- hidden/heavy folders are skipped in the file browser
- file preview is UTF-8 only and size-limited
- no secrets are needed by the workbench itself

Future hardening ideas:

- explicit auth token if binding to anything other than `127.0.0.1`
- CSRF protection for local POST endpoints
- visible warning when `--host 0.0.0.0` is used
- stronger audit logs for session start, input, stop, and file reads

## Design Direction

The app should feel like a capable Linux workbench:

- dense but calm
- dark-mode friendly
- terminal-forward
- fast to scan
- practical rather than marketing-heavy
- no decorative bloat
- no unnecessary dependencies

The UI should preserve:

- responsive two-pane layout on desktop
- stacked mobile layout
- semantic form controls
- visible command preview
- clear session state
- accessible labels and focus states

## Current Layout Direction

The UI now uses a workbench shell instead of two floating panels:

- top product bar with identity, tool health, capability chips, and theme toggle
- desktop workspace grid with a compact setup rail and a larger workbench surface
- terminal-first workbench with tabs for Terminal, Files, and Preview
- mobile single-column flow with a sticky top bar, full-width controls, and non-squished three-column tabs
- desktop height is constrained to the viewport so terminal/files/preview panes scroll internally
- mobile height is allowed to grow naturally so forms and terminal input do not fight for vertical space

Keep future UI changes aligned with this direction. Avoid returning to a generic card grid or making mobile controls stack into oversized pill lists.

## Known Issue: Follow-Up Input

The current product goal is a persistent interactive Codex conversation from the browser input below the terminal.

Observed user report:

- initial prompt appears to work
- follow-up text in the message box below the terminal does not continue the conversation
- terminal output can include noisy control text

Recent mitigation:

- initial prompt is sent through the PTY after startup instead of appended as a one-shot CLI argument
- follow-up input is routed through `submit_message`
- `submit_message` uses bracketed paste plus carriage return
- API receipts include `inputCount` so the UI can show whether the backend received the message

Important debugging distinction:

- If the UI header increments `N sent`, browser-to-backend delivery is working.
- If `N sent` increments but Codex does not respond, the issue is PTY/TUI input semantics or Codex readiness state.
- If `N sent` does not increment, the issue is frontend submit/API delivery.

Do not claim this is fully solved until the user confirms the browser flow continues a real Codex conversation.

## Validation Notes

Preferred lightweight checks:

```bash
python3 -m py_compile codex_workbench_linux/server.py
```

When the sandbox allows local sockets, also check:

```bash
./codex-workbench-linux --no-browser --port 8765
curl -L http://127.0.0.1:8765/api/health
```

Current environment caveat:

- local socket creation can fail in the sandbox with `PermissionError: [Errno 1] Operation not permitted`
- do not repeatedly attempt server smoke tests in that sandbox after this failure mode is known
- if the user is actively testing in their browser, prefer code inspection and targeted changes unless they ask for another live smoke test

## Publish Checklist

Before publishing:

- confirm executable bit on `codex-workbench-linux`
- confirm no `__pycache__` folders
- confirm `.codex/` and `.agents/` are ignored
- confirm README describes independent/community status
- confirm AGENTS.md documents the flow
- confirm desktop launcher points to `codex-workbench-linux`
- initialize or repair Git, because this workspace previously had an empty `.git` folder

Suggested first commit message:

```text
Initial Codex Workbench Linux release
```
