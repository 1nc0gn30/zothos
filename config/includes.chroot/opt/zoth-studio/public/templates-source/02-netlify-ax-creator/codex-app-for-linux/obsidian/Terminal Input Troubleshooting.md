# Terminal Input Troubleshooting

## Problem Statement

User report:

- initial prompt responds
- message input below the terminal does not continue the conversation
- terminal output has noisy text during the first reply

This note tracks the real debugging path so future agents do not repeat blind fixes.

## Current Theory

There are three separate paths that can fail:

1. Browser form submit does not call `POST /api/sessions/{id}/input`.
2. Backend receives the input but does not write it correctly into the PTY.
3. PTY receives bytes, but Codex TUI is not in a state where those bytes submit a prompt.

The current code adds backend receipts so these cases can be separated.

## Current Implementation

Relevant files:

- `codex_workbench_linux/static/app.js`
- `codex_workbench_linux/server.py`

Frontend send flow:

```javascript
POST /api/sessions/{state.sessionId}/input
body: { text, enter: true }
```

Backend action:

```python
if action == "input":
    text = str(payload.get("text") or "")
    if payload.get("enter", True):
        session.submit_message(text)
    else:
        session.write(text)
```

Submit behavior:

```python
self.write(f"\x1b[200~{value}\x1b[201~\r")
```

That sends bracketed paste start, message text, bracketed paste end, and carriage return.

## How To Interpret The UI

The session header now shows:

```text
Session {id} in {cwd} · {N} sent
```

Interpretation:

- `N` increments: browser and backend accepted the message.
- `N` does not increment: frontend submit or API route is broken.
- `N` increments but Codex does not respond: PTY/TUI input handling is still wrong or Codex is not ready for another prompt.

## Things Already Tried

Tried:

- appending initial prompt directly as a CLI argument
- sending initial prompt after startup through the PTY
- using `\n`
- using `\r`
- using bracketed paste plus `\r`
- exposing `inputCount` in snapshots and input receipts

Do not keep cycling these without observing which failure bucket applies.

## Likely Next Fixes

If `N sent` does not increment:

- inspect browser console
- verify `state.sessionId`
- verify the form is not blocked by disabled controls
- verify `/api/sessions/{id}/input` returns JSON

If `N sent` increments but Codex ignores the message:

- inspect raw bytes expected by current Codex TUI
- test whether Codex requires focus/control sequence before input
- consider implementing a real terminal emulator using xterm.js
- consider using Codex experimental `app-server` or `remote-control` instead of scraping/driving the TUI
- consider using non-interactive `codex exec` per message with explicit conversation/session storage if true TUI driving is unreliable

If terminal output remains noisy:

- improve ANSI/control-sequence parsing
- stop trying to represent a TUI with plain `<pre>`
- use xterm.js for rendering if dependencies become acceptable

## Preferred Product Direction

Best long-term solution:

- avoid driving a rich TUI through ad hoc text parsing if Codex exposes a better app-server or remote-control interface
- if TUI remains the only path, use a real terminal renderer and send keystrokes through a terminal-compatible layer

Short-term solution:

- make delivery observable
- keep UI honest about session state
- avoid claiming follow-up chat is solved until verified in browser

## Sandbox Note

The assistant environment may block local socket creation. When that is already known, do not repeatedly run local server smoke tests. Ask the user for the visible UI state, especially whether the `N sent` counter increments.
