import json
import re
import shutil
import socket
import subprocess
from pathlib import Path

from fastapi import HTTPException

from .state import CONFIG_FILE, DOWNLOADS_DIR


def sanitize_repo_name(name: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9._-]", "-", (name or "").strip())
    cleaned = cleaned.strip(".-")
    if not cleaned:
        raise HTTPException(status_code=400, detail="Invalid repository name")
    return cleaned


def command_exists(cmd: str) -> bool:
    return shutil.which(cmd) is not None


def resolve_input_path(raw_path: str) -> Path:
    if not raw_path:
        raise HTTPException(status_code=400, detail="input_path is required")
    candidate = Path(raw_path).expanduser()
    if not candidate.is_absolute():
        candidate = Path(DOWNLOADS_DIR) / candidate
    candidate = candidate.resolve()
    if not candidate.exists() or not candidate.is_file():
        raise HTTPException(status_code=404, detail=f"Input file not found: {candidate}")
    return candidate


def save_config(data):
    with open(CONFIG_FILE, "w") as f:
        json.dump(data, f)


def get_config():
    if Path(CONFIG_FILE).exists():
        with open(CONFIG_FILE, "r") as f:
            return json.load(f)
    return {"smtp": {}, "site_contacts": {}}


def get_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("", 0))
        return sock.getsockname()[1]


def ensure_podman_service():
    check = subprocess.run(["podman", "info"], capture_output=True, text=True)
    if check.returncode == 0:
        return
    attempts = [
        ["systemctl", "--user", "start", "podman.socket"],
        ["systemctl", "--user", "start", "podman"],
    ]
    for cmd in attempts:
        subprocess.run(cmd, capture_output=True, text=True)
        retry = subprocess.run(["podman", "info"], capture_output=True, text=True)
        if retry.returncode == 0:
            return
    raise HTTPException(status_code=503, detail="Podman service unavailable.")
