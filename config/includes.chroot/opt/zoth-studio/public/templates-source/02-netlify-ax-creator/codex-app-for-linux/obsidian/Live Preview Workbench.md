# Live Preview Workbench

## Goal

Let users see the app Codex is building without leaving Codex Workbench Linux.

The preview pane should reduce context switching during coding-agent work. Users should be able to start a dev server in the terminal, click the detected URL, and inspect the running app beside the session.

## Workbench Views

### Terminal

Purpose:

- stream Codex PTY output
- send follow-up prompts or approval answers
- detect local and deployed URLs in output

Current limitation:

- rendering is plain text, not a full terminal emulator
- complex TUI layouts can create noisy output
- follow-up input path still needs real browser-session confirmation

### Files

Purpose:

- browse files inside the active session workspace
- preview small UTF-8 files
- help users inspect what the agent is editing without leaving the app

Safety behavior:

- paths are resolved under the session workspace
- attempts to escape the workspace are rejected
- heavy/hidden folders are omitted from listing
- large files and non-UTF-8 files are rejected

### Preview

Purpose:

- load a local dev server or deployed URL in an iframe
- keep the preview URL saved locally
- provide an Open button for URLs that block iframe embedding
- surface detected URLs as chips

Useful defaults:

```text
Vite          http://localhost:5173
Astro         http://localhost:4321
Streamlit     http://localhost:8501
Netlify Dev   http://localhost:8888
```

## URL Detection

The frontend scans terminal output for HTTP URLs and adds each unique URL as a chip.

Supported examples:

```text
http://localhost:5173
http://127.0.0.1:4321
http://0.0.0.0:8501
https://example.netlify.app
```

Important normalization behavior:

- manually entered `localhost:5173` becomes `http://localhost:5173`
- manually entered `127.0.0.1:4321` becomes `http://127.0.0.1:4321`
- full `http://` and `https://` URLs are preserved

## Iframe Constraints

Some targets will not render inside the preview iframe.

Common causes:

- `X-Frame-Options: DENY`
- `X-Frame-Options: SAMEORIGIN`
- restrictive `Content-Security-Policy frame-ancestors`
- auth redirects that block embedding
- mixed-content restrictions

Expected UX:

- iframe may show blank or browser error
- saved URL should remain available
- Open button should still launch the URL in a normal tab

Do not treat all iframe failures as workbench bugs. First check whether the target allows embedding.

## Preview Security

The iframe currently uses a sandbox attribute with practical allowances for modern dev apps:

```html
sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts"
```

This is a tradeoff:

- enough capability for real app previews
- still framed inside a local operator tool
- not a substitute for reviewing untrusted websites

If previewing untrusted URLs becomes a first-class feature, add a warning and consider stricter sandbox profiles.

## Desired Future Improvements

High-value improvements:

- show detected URL source line or timestamp
- one-click common preview buttons for Vite/Astro/Streamlit/Netlify
- preview status indicator for loaded, blocked, or failed
- remember preview URL per workspace instead of globally
- allow split resizing between terminal/files/preview
- add screenshot capture of preview state for agent handoff

Avoid:

- turning preview into a full browser replacement
- adding heavy dependencies only for preview chrome
- assuming deployed hosts will always allow iframe rendering

## Testing Notes

Manual test flow when local sockets/browser are available:

1. Start Codex Workbench Linux.
2. Start a simple local server from a Codex session or separate terminal.
3. Confirm the terminal detects the URL.
4. Click the detected URL chip.
5. Confirm iframe loads or Open button works.
6. Refresh preview.
7. Change tabs and confirm preview URL persists.

Known environment caveat:

- this assistant sandbox may block local server sockets
- do not repeatedly perform local server smoke tests after that failure is known
- rely on user browser feedback for final preview behavior when needed
