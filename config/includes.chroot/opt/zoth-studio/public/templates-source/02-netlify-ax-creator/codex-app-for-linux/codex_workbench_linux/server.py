#!/usr/bin/env python3
"""Linux-first local Codex workbench.

This intentionally uses only the Python standard library. It gives Linux users a
desktop/browser UI around the Codex CLI without requiring Electron, npm, or a
platform-specific native app bundle.
"""

from __future__ import annotations

import argparse
import errno
import fcntl
import json
import os
import pty
import re
import select
import shutil
import signal
import socket
import struct
import subprocess
import termios
import threading
import time
import webbrowser
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlparse


APP_ROOT = Path(__file__).resolve().parent
STATIC_ROOT = APP_ROOT / "static"
DEFAULT_WORKSPACE = Path.home()
SHOWCASE_FILE_LIMIT = 12
MAX_FILE_PREVIEW_BYTES = 262_144
HIDDEN_DIRS = {
    ".git",
    ".hg",
    ".svn",
    ".cache",
    ".pytest_cache",
    "__pycache__",
    "dist",
    "build",
    "node_modules",
    "vendor",
    ".venv",
    "venv",
}
ANSI_RE = re.compile(
    r"(?:\x1B\][^\x07]*(?:\x07|\x1B\\)|\x1B\[[0-?]*[ -/]*[@-~]|\x1B[@-Z\\-_])"
)


def strip_ansi(value: str) -> str:
    return ANSI_RE.sub("", value)


def sanitize_terminal_text(value: str) -> str:
    """Return clean, browser-safe human-readable terminal text."""
    clean = strip_ansi(value).replace("\x00", "")
    clean = clean.replace("\u2028", "\n").replace("\u2029", "\n")
    clean = clean.replace("\ufffd", "")
    return "".join(
        char
        for char in clean
        if char in {"\n", "\r", "\t", "\b"} or ord(char) >= 32
    )


class TerminalBuffer:
    """Plain-text terminal snapshot for status-line heavy TUI output."""

    def __init__(self, max_chars: int = 160_000) -> None:
        self.text = ""
        self.max_chars = max_chars

    def feed(self, value: str) -> str:
        before = self.text
        clean = sanitize_terminal_text(value)
        index = 0
        while index < len(clean):
            char = clean[index]
            if char == "\r":
                if index + 1 < len(clean) and clean[index + 1] == "\n":
                    self.text += "\n"
                    index += 2
                    continue
                self._clear_current_line()
            elif char == "\n":
                self.text += "\n"
            elif char in {"\b", "\x7f"}:
                self._backspace()
            elif char == "\t":
                self.text += "\t"
            elif ord(char) >= 32:
                self.text += char
            index += 1

        if len(self.text) > self.max_chars:
            self.text = self.text[-self.max_chars :]
            newline = self.text.find("\n")
            if newline != -1:
                self.text = self.text[newline + 1 :]

        if self.text.startswith(before):
            return self.text[len(before) :]
        return self.text

    def append_line(self, value: str) -> str:
        return self.feed(f"\n{value}\n")

    def _clear_current_line(self) -> None:
        last_newline = self.text.rfind("\n")
        if last_newline == -1:
            self.text = ""
        else:
            self.text = self.text[: last_newline + 1]

    def _backspace(self) -> None:
        if not self.text:
            return
        if self.text[-1] != "\n":
            self.text = self.text[:-1]


class CodexSession:
    def __init__(
        self,
        session_id: int,
        command: list[str],
        cwd: Path,
        env: dict[str, str],
        initial_input: str = "",
        rows: int = 32,
        cols: int = 120,
    ) -> None:
        self.id = session_id
        self.command = command
        self.cwd = cwd
        self.created_at = time.time()
        self.updated_at = self.created_at
        self.output: list[str] = []
        self.terminal = TerminalBuffer()
        self.lock = threading.Lock()
        self.closed = False
        self.exit_code: int | None = None
        self.input_count = 0
        self.last_input_at: float | None = None

        master, slave = pty.openpty()
        self.master_fd = master
        self.slave_fd = slave
        self._resize(rows, cols)
        self.process = subprocess.Popen(
            command,
            cwd=str(cwd),
            env=env,
            stdin=slave,
            stdout=slave,
            stderr=slave,
            close_fds=True,
            start_new_session=True,
            text=False,
        )
        os.close(slave)
        self.reader = threading.Thread(target=self._read_loop, daemon=True)
        self.reader.start()
        if initial_input:
            self.initial_writer = threading.Thread(
                target=self._write_initial_input,
                args=(initial_input,),
                daemon=True,
            )
            self.initial_writer.start()

    def _resize(self, rows: int, cols: int) -> None:
        packed = struct.pack("HHHH", rows, cols, 0, 0)
        fcntl.ioctl(self.slave_fd, termios.TIOCSWINSZ, packed)

    def _append(self, text: str) -> None:
        if not text:
            return
        with self.lock:
            rendered = self.terminal.feed(text)
            self.updated_at = time.time()
            if not rendered:
                return
            self.output.append(rendered)
            if len(self.output) > 1200:
                self.output = self.output[-1200:]

    def _read_loop(self) -> None:
        try:
            while True:
                ready, _, _ = select.select([self.master_fd], [], [], 0.2)
                if ready:
                    try:
                        data = os.read(self.master_fd, 8192)
                    except OSError as exc:
                        if exc.errno == errno.EIO:
                            break
                        raise
                    if not data:
                        break
                    self._append(data.decode("utf-8", errors="replace"))

                code = self.process.poll()
                if code is not None:
                    self.exit_code = code
                    break
        finally:
            self.closed = True
            try:
                os.close(self.master_fd)
            except OSError:
                pass
            if self.exit_code is None:
                self.exit_code = self.process.poll()
            self._append(f"\n[session exited: {self.exit_code}]\n")

    def write(self, text: str) -> None:
        if self.closed:
            raise RuntimeError("session is closed")
        os.write(self.master_fd, text.encode("utf-8"))
        self.updated_at = time.time()

    def _write_initial_input(self, text: str) -> None:
        time.sleep(0.8)
        if self.closed:
            return
        try:
            self.submit_message(text)
        except OSError:
            return

    def submit_message(self, text: str) -> None:
        value = text.rstrip()
        if not value:
            return
        # Bracketed paste makes multi-character programmatic input reliable in
        # TUI line editors, then carriage return submits like a terminal Enter.
        self.write(f"\x1b[200~{value}\x1b[201~\r")
        with self.lock:
            self.input_count += 1
            self.last_input_at = time.time()

    def snapshot(self, after: int = 0) -> dict[str, Any]:
        with self.lock:
            chunks = self.output[after:]
            next_index = len(self.output)
            screen = self.terminal.text
        return {
            "id": self.id,
            "cwd": str(self.cwd),
            "command": self.command,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
            "closed": self.closed,
            "exitCode": self.exit_code,
            "inputCount": self.input_count,
            "lastInputAt": self.last_input_at,
            "output": chunks,
            "screen": screen,
            "next": next_index,
        }

    def stop(self) -> None:
        if self.closed:
            return
        try:
            os.killpg(self.process.pid, signal.SIGTERM)
        except ProcessLookupError:
            return


class SessionManager:
    def __init__(self, codex_bin: str, ollama_bin: str | None) -> None:
        self.codex_bin = codex_bin
        self.ollama_bin = ollama_bin
        self.lock = threading.Lock()
        self.next_id = 1
        self.sessions: dict[int, CodexSession] = {}

    def create(self, payload: dict[str, Any]) -> CodexSession:
        raw_workspace = str(payload.get("workspace") or "").strip()
        if not raw_workspace:
            raise ValueError("choose an existing folder or name a new folder before starting")
        workspace = Path(raw_workspace).expanduser().resolve()
        workspace_mode = str(payload.get("workspaceMode") or "existing")
        if workspace_mode == "create":
            workspace.mkdir(parents=True, exist_ok=True)
        elif workspace_mode != "existing":
            raise ValueError(f"unknown workspace mode: {workspace_mode}")
        if not workspace.exists() or not workspace.is_dir():
            raise ValueError(f"workspace does not exist: {workspace}")

        mode = payload.get("mode") or "new"
        prompt = str(payload.get("prompt") or "").strip()
        model = str(payload.get("model") or "").strip()
        launcher = str(payload.get("launcher") or "ollama-codex")
        sandbox = str(payload.get("sandbox") or "workspace-write")

        codex_args = ["--no-alt-screen", "--cd", str(workspace), "--sandbox", sandbox]
        if launcher == "codex-oss":
            codex_args.extend(["--oss", "--local-provider", "ollama"])
        if launcher in {"codex-cli", "codex-oss"} and model:
            codex_args.extend(["--model", model])
        initial_input = ""
        if mode == "resume-last":
            codex_args.extend(["resume", "--last"])
        elif prompt:
            initial_input = prompt

        if launcher == "ollama-codex":
            if not self.ollama_bin:
                raise ValueError("ollama executable was not found")
            if not model:
                raise ValueError("ollama launch codex requires a model")
            command = [self.ollama_bin, "launch", "codex", "--model", model, "--", *codex_args]
        elif launcher in {"codex-cli", "codex-oss"}:
            command = [self.codex_bin, *codex_args]
        else:
            raise ValueError(f"unknown launcher: {launcher}")

        env = os.environ.copy()
        env.setdefault("TERM", "xterm-256color")
        env.setdefault("COLORTERM", "truecolor")

        with self.lock:
            session_id = self.next_id
            self.next_id += 1
            session = CodexSession(session_id, command, workspace, env, initial_input=initial_input)
            self.sessions[session_id] = session
            return session

    def get(self, session_id: int) -> CodexSession:
        try:
            return self.sessions[session_id]
        except KeyError as exc:
            raise ValueError(f"unknown session: {session_id}") from exc

    def list(self) -> list[dict[str, Any]]:
        with self.lock:
            sessions = list(self.sessions.values())
        return [
            {
                "id": session.id,
                "cwd": str(session.cwd),
                "createdAt": session.created_at,
                "updatedAt": session.updated_at,
                "closed": session.closed,
                "exitCode": session.exit_code,
                "command": session.command,
            }
            for session in sorted(sessions, key=lambda item: item.updated_at, reverse=True)
        ]

    def resolve_session_path(self, session_id: int, raw_path: str | None) -> tuple[CodexSession, Path]:
        session = self.get(session_id)
        rel_path = raw_path or "."
        candidate = (session.cwd / rel_path).expanduser().resolve()
        if candidate != session.cwd and session.cwd not in candidate.parents:
            raise ValueError("path escapes the session workspace")
        return session, candidate

    def list_files(self, session_id: int, raw_path: str | None) -> dict[str, Any]:
        session, path = self.resolve_session_path(session_id, raw_path)
        if not path.exists():
            raise ValueError(f"path does not exist: {path}")
        if not path.is_dir():
            raise ValueError(f"path is not a directory: {path}")

        entries = []
        for child in sorted(path.iterdir(), key=lambda item: (not item.is_dir(), item.name.lower())):
            if child.name in HIDDEN_DIRS or child.name.startswith("."):
                continue
            try:
                stat = child.stat()
            except OSError:
                continue
            entries.append(
                {
                    "name": child.name,
                    "path": str(child.relative_to(session.cwd)),
                    "type": "directory" if child.is_dir() else "file",
                    "size": stat.st_size,
                    "modifiedAt": stat.st_mtime,
                }
            )

        parent = None
        if path != session.cwd:
            parent = str(path.parent.relative_to(session.cwd))
        return {
            "cwd": str(session.cwd),
            "path": "." if path == session.cwd else str(path.relative_to(session.cwd)),
            "parent": parent,
            "entries": entries,
        }

    def showcase(self, session_id: int) -> dict[str, Any]:
        session = self.get(session_id)
        root = session.cwd
        names = {child.name for child in root.iterdir() if child.name not in HIDDEN_DIRS}
        files = self._collect_showcase_files(root)
        kind = "workspace"
        summary = "Browse the files Codex is creating in this workspace."
        preview_hint = "Use the Preview tab after the agent starts a local dev server."
        if "package.json" in names:
            package = self._read_package_json(root / "package.json")
            deps = {**package.get("dependencies", {}), **package.get("devDependencies", {})}
            scripts = package.get("scripts", {})
            if "react" in deps or "vite" in deps or "next" in deps:
                kind = "react app" if "react" in deps else "node app"
                summary = "Live app workspace detected. Start the dev server, then open the detected URL in Preview."
                preview_hint = self._script_hint(scripts)
            else:
                kind = "node app"
                summary = "Node project detected with package scripts and generated source files."
                preview_hint = self._script_hint(scripts)
        elif "pyproject.toml" in names or "requirements.txt" in names or any(item.endswith(".py") for item in names):
            kind = "python app"
            summary = "Python workspace detected. Use Files to inspect modules while Codex builds."
            preview_hint = "If this is Streamlit/Flask/FastAPI, start its dev server and load the printed local URL."
        return {
            "cwd": str(root),
            "kind": kind,
            "summary": summary,
            "previewHint": preview_hint,
            "files": files,
        }

    def _collect_showcase_files(self, root: Path) -> list[dict[str, Any]]:
        priority = {
            "package.json",
            "pyproject.toml",
            "requirements.txt",
            "README.md",
            "index.html",
            "src/App.jsx",
            "src/App.tsx",
            "src/main.jsx",
            "src/main.tsx",
            "app.py",
            "main.py",
            "server.py",
        }
        found: list[Path] = []
        for rel in priority:
            path = root / rel
            if path.is_file():
                found.append(path)
        if len(found) < SHOWCASE_FILE_LIMIT:
            for path in root.rglob("*"):
                if len(found) >= SHOWCASE_FILE_LIMIT:
                    break
                if not path.is_file() or path in found:
                    continue
                if any(part in HIDDEN_DIRS or part.startswith(".") for part in path.relative_to(root).parts):
                    continue
                if path.suffix.lower() in {".py", ".js", ".jsx", ".ts", ".tsx", ".html", ".css", ".md", ".json"}:
                    found.append(path)
        files = []
        for path in found[:SHOWCASE_FILE_LIMIT]:
            stat = path.stat()
            files.append({
                "path": str(path.relative_to(root)),
                "size": stat.st_size,
                "modifiedAt": stat.st_mtime,
            })
        return files

    def _read_package_json(self, path: Path) -> dict[str, Any]:
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return {}

    def _script_hint(self, scripts: Any) -> str:
        if isinstance(scripts, dict):
            if "dev" in scripts:
                return "Run npm run dev and load the local URL Codex prints."
            if "start" in scripts:
                return "Run npm start and load the local URL Codex prints."
        return "Start the app's local dev server and load the printed URL."

    def read_file(self, session_id: int, raw_path: str | None) -> dict[str, Any]:
        session, path = self.resolve_session_path(session_id, raw_path)
        if not path.exists():
            raise ValueError(f"file does not exist: {path}")
        if not path.is_file():
            raise ValueError(f"path is not a file: {path}")
        size = path.stat().st_size
        if size > MAX_FILE_PREVIEW_BYTES:
            raise ValueError(f"file is too large to preview: {size} bytes")
        data = path.read_bytes()
        try:
            content = data.decode("utf-8")
        except UnicodeDecodeError as exc:
            raise ValueError("file is not valid UTF-8 text") from exc
        return {
            "cwd": str(session.cwd),
            "path": str(path.relative_to(session.cwd)),
            "size": size,
            "content": content,
        }


class CodexWorkbenchHandler(BaseHTTPRequestHandler):
    manager: SessionManager

    server_version = "CodexWorkbenchLinux/0.1"

    def log_message(self, format: str, *args: Any) -> None:
        print(f"[{self.log_date_time_string()}] {format % args}")

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        try:
            if parsed.path == "/":
                return self._send_static("index.html")
            if parsed.path == "/api/health":
                return self._json(
                    {
                        "ok": True,
                        "codex": self.manager.codex_bin,
                        "ollama": self.manager.ollama_bin,
                    }
                )
            if parsed.path == "/api/sessions":
                return self._json({"sessions": self.manager.list()})
            if parsed.path.startswith("/api/sessions/"):
                return self._session_get(parsed)
            if parsed.path.startswith("/static/"):
                return self._send_static(parsed.path.removeprefix("/static/"))
            self.send_error(HTTPStatus.NOT_FOUND)
        except ValueError as exc:
            return self._json({"error": str(exc)}, HTTPStatus.BAD_REQUEST)

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        try:
            if parsed.path == "/api/sessions":
                payload = self._read_json()
                session = self.manager.create(payload)
                return self._json(session.snapshot())
            if parsed.path.startswith("/api/sessions/"):
                return self._session_action(parsed)
        except ValueError as exc:
            return self._json({"error": str(exc)}, HTTPStatus.BAD_REQUEST)
        except RuntimeError as exc:
            return self._json({"error": str(exc)}, HTTPStatus.CONFLICT)
        self.send_error(HTTPStatus.NOT_FOUND)

    def _session_get(self, parsed: Any) -> None:
        parts = parsed.path.strip("/").split("/")
        if len(parts) == 3:
            return self._session_snapshot(parsed, parts)
        if len(parts) == 4 and parts[3] == "files":
            query = parse_qs(parsed.query)
            payload = self.manager.list_files(int(parts[2]), query.get("path", ["."])[0])
            return self._json(payload)
        if len(parts) == 4 and parts[3] == "file":
            query = parse_qs(parsed.query)
            payload = self.manager.read_file(int(parts[2]), query.get("path", [""])[0])
            return self._json(payload)
        if len(parts) == 4 and parts[3] == "showcase":
            return self._json(self.manager.showcase(int(parts[2])))
        raise ValueError("invalid session path")

    def _session_snapshot(self, parsed: Any, parts: list[str] | None = None) -> None:
        if parts is None:
            parts = parsed.path.strip("/").split("/")
        if len(parts) != 3:
            raise ValueError("invalid session path")
        session = self.manager.get(int(parts[2]))
        query = parse_qs(parsed.query)
        after = int(query.get("after", ["0"])[0])
        self._json(session.snapshot(after=after))

    def _session_action(self, parsed: Any) -> None:
        parts = parsed.path.strip("/").split("/")
        if len(parts) != 4:
            raise ValueError("invalid session action path")
        session = self.manager.get(int(parts[2]))
        action = parts[3]
        payload = self._read_json()
        if action == "input":
            text = str(payload.get("text") or "")
            if payload.get("enter", True):
                session.submit_message(text)
            else:
                session.write(text)
            return self._json(
                {
                    "ok": True,
                    "sessionId": session.id,
                    "closed": session.closed,
                    "inputCount": session.input_count,
                    "lastInputAt": session.last_input_at,
                }
            )
        if action == "stop":
            session.stop()
            return self._json({"ok": True})
        raise ValueError(f"unknown action: {action}")

    def _read_json(self) -> dict[str, Any]:
        length = int(self.headers.get("content-length", "0"))
        if length <= 0:
            return {}
        body = self.rfile.read(length)
        return json.loads(body.decode("utf-8"))

    def _json(self, payload: dict[str, Any], status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("cache-control", "no-store")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_static(self, name: str) -> None:
        safe_name = name.lstrip("/")
        path = (STATIC_ROOT / safe_name).resolve()
        if STATIC_ROOT not in path.parents and path != STATIC_ROOT:
            self.send_error(HTTPStatus.FORBIDDEN)
            return
        if not path.exists() or not path.is_file():
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        content_type = "text/plain; charset=utf-8"
        if path.suffix == ".html":
            content_type = "text/html; charset=utf-8"
        elif path.suffix == ".css":
            content_type = "text/css; charset=utf-8"
        elif path.suffix == ".js":
            content_type = "text/javascript; charset=utf-8"
        body = path.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("content-type", content_type)
        self.send_header("cache-control", "no-store")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def main() -> int:
    parser = argparse.ArgumentParser(description="Run Codex Workbench Linux.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=0)
    parser.add_argument("--no-browser", action="store_true")
    parser.add_argument("--codex-bin", default=shutil.which("codex") or "/bin/codex")
    parser.add_argument("--ollama-bin", default=shutil.which("ollama"))
    args = parser.parse_args()

    codex_bin = shutil.which(args.codex_bin) or args.codex_bin
    if not Path(codex_bin).exists():
        print(f"Codex CLI not found: {codex_bin}", flush=True)
        return 1

    port = args.port or free_port()
    ollama_bin = shutil.which(args.ollama_bin) if args.ollama_bin else None
    if args.ollama_bin and not ollama_bin and Path(args.ollama_bin).exists():
        ollama_bin = args.ollama_bin

    CodexWorkbenchHandler.manager = SessionManager(codex_bin, ollama_bin)
    server = ThreadingHTTPServer((args.host, port), CodexWorkbenchHandler)
    url = f"http://{args.host}:{port}"
    print(f"Codex Workbench Linux running at {url}", flush=True)
    if not args.no_browser:
        threading.Timer(0.3, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Codex Workbench Linux", flush=True)
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
