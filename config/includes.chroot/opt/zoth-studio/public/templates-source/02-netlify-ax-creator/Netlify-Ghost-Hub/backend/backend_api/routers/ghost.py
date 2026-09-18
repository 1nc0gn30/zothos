import os
import subprocess

from fastapi import APIRouter, HTTPException

from ..state import BASE_CLONE_DIR, active_containers
from ..utils import ensure_podman_service, get_free_port

router = APIRouter()


def _resolve_repo_path(repo_name: str) -> str:
    direct = os.path.join(BASE_CLONE_DIR, repo_name)
    if os.path.isdir(direct):
        return direct

    for root, dirs, _ in os.walk(BASE_CLONE_DIR):
        if repo_name in dirs:
            return os.path.join(root, repo_name)
    return ""


@router.post("/api/ghost/start/{repo_name}")
async def start_container(repo_name: str):
    ensure_podman_service()
    repo_path = _resolve_repo_path(repo_name)
    if not os.path.exists(repo_path):
        raise HTTPException(status_code=404, detail="Repo not cloned.")

    port = get_free_port()
    container_name = f"ghost_{repo_name.lower().replace('.', '_')}"
    subprocess.run(["podman", "rm", "-f", container_name], capture_output=True)

    is_node = os.path.exists(os.path.join(repo_path, "package.json"))
    cmd = [
        "podman",
        "run",
        "-d",
        "--name",
        container_name,
        "-p",
        f"{port}:3000",
        "--memory",
        "4g",
        "-v",
        f"{repo_path}:/app:Z",
        "-w",
        "/app",
    ]
    if is_node:
        cmd += ["node:slim", "sh", "-c", "npm install && npm run dev -- --host 0.0.0.0 --port 3000"]
    else:
        cmd += ["python:3.9-slim", "python", "-m", "http.server", "3000"]

    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        active_containers[repo_name] = {"name": container_name, "port": port}
        return {"status": "started", "port": port}
    raise HTTPException(status_code=500, detail=res.stderr)


@router.get("/api/ghost/logs/{repo_name}")
def get_container_logs(repo_name: str):
    container_name = f"ghost_{repo_name.lower().replace('.', '_')}"
    res = subprocess.run(["podman", "logs", "--tail", "50", container_name], capture_output=True, text=True)
    return {"logs": res.stdout + res.stderr}


@router.post("/api/ghost/stop/{repo_name}")
def stop_container(repo_name: str):
    container_name = f"ghost_{repo_name.lower().replace('.', '_')}"
    subprocess.run(["podman", "stop", container_name], capture_output=True)
    if repo_name in active_containers:
        del active_containers[repo_name]
    return {"status": "stopped"}
