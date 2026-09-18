import json
import os
import re
import shlex
import subprocess
import time
from html import unescape
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

from fastapi import APIRouter, HTTPException

from ..state import BASE_CLONE_DIR, NEW_SITES_DIR, active_containers
from ..utils import command_exists, get_config

router = APIRouter()

MEDIA_EXTENSIONS = {
    ".png": "image",
    ".jpg": "image",
    ".jpeg": "image",
    ".gif": "image",
    ".webp": "image",
    ".svg": "image",
    ".avif": "image",
    ".mp4": "video",
    ".webm": "video",
    ".mov": "video",
    ".mkv": "video",
    ".mp3": "audio",
    ".wav": "audio",
    ".ogg": "audio",
    ".m4a": "audio",
}
IGNORE_DIRS = {"node_modules", ".git", "dist", "build", ".next", ".cache", "__pycache__"}
META_CACHE_TTL_SECONDS = 900
SITE_META_CACHE = {}
LOCAL_SITE_PREFIX = "local:"


def _safe_slug(value: str) -> str:
    return "".join(ch.lower() if ch.isalnum() else "-" for ch in (value or "")).strip("-")


def _repo_name_from_url(repo_url: str) -> str:
    if not repo_url:
        return ""
    return repo_url.rstrip("/").split("/")[-1].replace(".git", "")


def _is_git_repo(repo_path: Path) -> bool:
    return repo_path.exists() and repo_path.is_dir() and (repo_path / ".git").exists()


def _candidate_repo_paths(site: dict, repo_url: str) -> list[Path]:
    candidates = []
    repo_name = _repo_name_from_url(repo_url)
    if repo_name:
        candidates.append(Path(BASE_CLONE_DIR) / repo_name)
        candidates.append(Path(NEW_SITES_DIR) / repo_name)

    site_name_slug = _safe_slug(site.get("name", ""))
    if site_name_slug:
        candidates.append(Path(BASE_CLONE_DIR) / site_name_slug)
        candidates.append(Path(NEW_SITES_DIR) / site_name_slug)

    site_id_slug = _safe_slug(site.get("id", ""))
    if site_id_slug:
        candidates.append(Path(BASE_CLONE_DIR) / site_id_slug)
        candidates.append(Path(NEW_SITES_DIR) / site_id_slug)

    deduped = []
    seen = set()
    for candidate in candidates:
        key = str(candidate.resolve()) if candidate.exists() else str(candidate)
        if key not in seen:
            deduped.append(candidate)
            seen.add(key)
    return deduped


def _resolve_site_repo(site: dict) -> dict:
    repo_url = site.get("build_settings", {}).get("repo_url") or ""
    has_github_repo = bool(repo_url)
    candidates = _candidate_repo_paths(site, repo_url)
    existing_repo = next((path for path in candidates if _is_git_repo(path)), None)

    expected_repo = candidates[0] if candidates else None
    repo_path = existing_repo or (expected_repo if has_github_repo else None)
    is_cloned = existing_repo is not None

    if not has_github_repo:
        clone_status = "no_github_repo_available"
    elif is_cloned:
        clone_status = "cloned"
    else:
        clone_status = "not_cloned"

    repo_name = existing_repo.name if existing_repo else (expected_repo.name if expected_repo else "")
    return {
        "repo_url": repo_url,
        "repo_name": repo_name,
        "repo_path": str(repo_path.resolve()) if repo_path else "",
        "is_cloned": is_cloned,
        "has_github_repo": has_github_repo,
        "clone_status": clone_status,
    }


def _get_running_port(repo_name: str):
    if not repo_name:
        return None
    container_name = f"ghost_{repo_name.lower().replace('.', '_')}"
    check = subprocess.run(["podman", "inspect", "-f", "{{.State.Running}}", container_name], capture_output=True, text=True)
    if check.stdout.strip() == "true":
        return active_containers.get(repo_name, {}).get("port")
    return None


def _build_local_site(repo_path: Path) -> dict:
    repo_name = repo_path.name
    meta_path = repo_path / "site.meta.json"
    meta = {}
    if meta_path.exists():
        try:
            meta = json.loads(meta_path.read_text(encoding="utf-8"))
        except Exception:
            meta = {}

    site_title = (meta.get("site_title") or repo_name).strip()
    description = (meta.get("description") or "").strip()
    author = (meta.get("author") or "").strip()
    template = (meta.get("template") or "").strip()
    port = _get_running_port(repo_name)
    local_url = f"http://localhost:{port}" if port else ""
    favicon_url = _local_favicon_from_repo(repo_path)
    return {
        "id": f"{LOCAL_SITE_PREFIX}{repo_name}",
        "name": site_title,
        "url": local_url,
        "ssl_url": local_url,
        "admin_url": "",
        "deploy_url": "",
        "repo": "",
        "repo_name": repo_name,
        "is_cloned": True,
        "repo_path": str(repo_path.resolve()),
        "has_github_repo": False,
        "clone_status": "cloned",
        "is_running": bool(port),
        "port": port,
        "can_clone": False,
        "favicon_url": favicon_url,
        "live_meta": {
            "base_url": local_url,
            "domain": f"localhost:{port}" if port else "localhost",
            "ok": bool(port),
            "status_code": 200 if port else None,
            "title": site_title,
            "description": description,
            "og_title": site_title,
            "og_description": description,
            "og_image": "",
            "og_site_name": site_title,
            "canonical_url": local_url,
            "theme_color": "",
            "favicon_url": favicon_url,
        },
        "contacts": [],
        "site_type": "local_generated",
        "site_author": author,
        "site_template": template,
    }


def _list_local_sites() -> list[dict]:
    base = Path(NEW_SITES_DIR).resolve()
    if not base.exists():
        return []
    local_sites = []
    for candidate in base.iterdir():
        if not candidate.is_dir():
            continue
        if not _is_git_repo(candidate):
            continue
        local_sites.append(_build_local_site(candidate))
    local_sites.sort(key=lambda item: (item.get("name") or "").lower())
    return local_sites


def _list_netlify_sites() -> list[dict]:
    if not command_exists("netlify"):
        return []
    res = subprocess.run(["netlify", "sites:list", "--json"], capture_output=True, text=True)
    if res.returncode != 0:
        return []
    try:
        return json.loads(res.stdout or "[]")
    except json.JSONDecodeError:
        return []


def _find_site_by_id(site_id: str) -> dict:
    if site_id.startswith(LOCAL_SITE_PREFIX):
        site = next((item for item in _list_local_sites() if item.get("id") == site_id), None)
        if not site:
            raise HTTPException(status_code=404, detail="Local site not found")
        return site

    site = next((item for item in _list_netlify_sites() if item.get("id") == site_id), None)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    return site


def _local_favicon_from_repo(repo_path: Path) -> str:
    if not repo_path or not repo_path.exists():
        return ""
    for candidate in [
        repo_path / "favicon.ico",
        repo_path / "public" / "favicon.ico",
        repo_path / "src" / "assets" / "favicon.ico",
        repo_path / "public" / "favicon.png",
        repo_path / "src" / "assets" / "favicon.png",
    ]:
        if candidate.exists() and candidate.is_file():
            rel = candidate.relative_to(Path(BASE_CLONE_DIR)).as_posix()
            return f"/repos/{rel}"
    return ""


def _extract_title(html_text: str) -> str:
    match = re.search(r"<title[^>]*>(.*?)</title>", html_text, flags=re.IGNORECASE | re.DOTALL)
    if not match:
        return ""
    return unescape(re.sub(r"\s+", " ", match.group(1)).strip())


def _extract_meta_map(html_text: str) -> dict:
    meta = {}
    for attrs in re.findall(r"<meta\s+([^>]+)>", html_text, flags=re.IGNORECASE):
        attrs_map = dict(re.findall(r'([a-zA-Z:_-]+)\s*=\s*["\']([^"\']*)["\']', attrs))
        key = (attrs_map.get("property") or attrs_map.get("name") or "").strip().lower()
        value = (attrs_map.get("content") or "").strip()
        if key and value and key not in meta:
            meta[key] = unescape(value)
    return meta


def _extract_icon_candidates(html_text: str, base_url: str) -> list[str]:
    icons = []
    for attrs in re.findall(r"<link\s+([^>]+)>", html_text, flags=re.IGNORECASE):
        attrs_map = dict(re.findall(r'([a-zA-Z:_-]+)\s*=\s*["\']([^"\']*)["\']', attrs))
        rel = (attrs_map.get("rel") or "").lower()
        href = (attrs_map.get("href") or "").strip()
        if not href:
            continue
        if "icon" in rel:
            icons.append(urljoin(base_url, href))
    icons.append(urljoin(base_url, "/favicon.ico"))
    deduped = []
    seen = set()
    for icon in icons:
        if icon not in seen:
            deduped.append(icon)
            seen.add(icon)
    return deduped


def _fetch_live_metadata(site: dict) -> dict:
    base_url = (site.get("ssl_url") or site.get("url") or site.get("deploy_url") or "").strip()
    if not base_url:
        return {"base_url": "", "ok": False}

    if not base_url.startswith("http://") and not base_url.startswith("https://"):
        base_url = f"https://{base_url.lstrip('/')}"

    cache_key = site.get("id") or base_url
    cached = SITE_META_CACHE.get(cache_key)
    now = time.time()
    if cached and now - cached.get("ts", 0) < META_CACHE_TTL_SECONDS:
        return cached.get("data", {})

    result = {
        "base_url": base_url,
        "domain": (urlparse(base_url).netloc or "").lower(),
        "ok": False,
        "status_code": None,
        "title": "",
        "description": "",
        "og_title": "",
        "og_description": "",
        "og_image": "",
        "og_site_name": "",
        "canonical_url": "",
        "theme_color": "",
        "favicon_url": urljoin(base_url, "/favicon.ico"),
    }
    try:
        req = Request(
            base_url,
            headers={
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) NetlifyGhostHub/1.0",
                "Accept": "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
            },
        )
        with urlopen(req, timeout=2.5) as response:
            status_code = getattr(response, "status", None) or response.getcode()
            html_text = response.read(300_000).decode("utf-8", errors="ignore")
            meta = _extract_meta_map(html_text)
            icon_candidates = _extract_icon_candidates(html_text, base_url)

            canonical_match = re.search(
                r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']',
                html_text,
                flags=re.IGNORECASE,
            )
            canonical_url = urljoin(base_url, canonical_match.group(1).strip()) if canonical_match else ""

            result.update(
                {
                    "ok": True,
                    "status_code": status_code,
                    "title": _extract_title(html_text),
                    "description": meta.get("description", ""),
                    "og_title": meta.get("og:title", ""),
                    "og_description": meta.get("og:description", ""),
                    "og_image": urljoin(base_url, meta.get("og:image", "")) if meta.get("og:image") else "",
                    "og_site_name": meta.get("og:site_name", ""),
                    "canonical_url": canonical_url,
                    "theme_color": meta.get("theme-color", ""),
                    "favicon_url": icon_candidates[0] if icon_candidates else result["favicon_url"],
                }
            )
    except Exception:
        pass

    SITE_META_CACHE[cache_key] = {"ts": now, "data": result}
    return result


@router.get("/api/sites")
def get_sites():
    config = get_config()
    contacts = config.get("site_contacts", {})
    sites = _list_netlify_sites()
    processed = []
    for site in sites:
        repo_meta = _resolve_site_repo(site)
        repo_name = repo_meta["repo_name"]
        port = _get_running_port(repo_name)
        is_running = port is not None
        live_meta = _fetch_live_metadata(site)
        favicon_url = live_meta.get("favicon_url") or ""
        processed.append(
            {
                "id": site.get("id"),
                "name": site.get("name"),
                "url": site.get("url"),
                "ssl_url": site.get("ssl_url"),
                "admin_url": site.get("admin_url"),
                "deploy_url": site.get("deploy_url"),
                "repo": repo_meta["repo_url"],
                "repo_name": repo_name,
                "is_cloned": repo_meta["is_cloned"],
                "repo_path": repo_meta["repo_path"],
                "has_github_repo": repo_meta["has_github_repo"],
                "clone_status": repo_meta["clone_status"],
                "is_running": is_running,
                "port": port,
                "can_clone": repo_meta["has_github_repo"] and not repo_meta["is_cloned"],
                "favicon_url": favicon_url,
                "live_meta": live_meta,
                "contacts": contacts.get(site.get("id"), []),
            }
        )

    netlify_repo_paths = {item.get("repo_path") for item in processed if item.get("repo_path")}
    for local_site in _list_local_sites():
        if local_site.get("repo_path") in netlify_repo_paths:
            continue
        processed.append(local_site)
    return processed


@router.post("/api/clone")
def clone_repo(repo_url: str):
    repo_name = repo_url.split("/")[-1].replace(".git", "")
    target_path = os.path.join(BASE_CLONE_DIR, repo_name)
    if os.path.exists(target_path):
        return {"status": "exists"}
    res = subprocess.run(["git", "clone", repo_url, target_path], capture_output=True, text=True)
    return {"status": "success" if res.returncode == 0 else "error"}


@router.get("/api/sites/{site_id}/metadata")
def get_site_metadata(site_id: str, force_refresh: bool = False):
    site = _find_site_by_id(site_id)
    if site_id.startswith(LOCAL_SITE_PREFIX):
        return site.get("live_meta") or {"base_url": "", "ok": False}
    if force_refresh:
        SITE_META_CACHE.pop(site.get("id") or "", None)
    return _fetch_live_metadata(site)


@router.get("/api/sites/{site_id}/assets")
def get_site_assets(site_id: str):
    site = _find_site_by_id(site_id)
    if site_id.startswith(LOCAL_SITE_PREFIX):
        repo_path = Path(site.get("repo_path") or "").resolve()
        if not _is_git_repo(repo_path):
            raise HTTPException(status_code=404, detail="No local git repo available for this site")
    else:
        repo_meta = _resolve_site_repo(site)
        if not repo_meta["is_cloned"] or not repo_meta["repo_path"]:
            raise HTTPException(status_code=404, detail="No local repo clone available for this site")
        repo_path = Path(repo_meta["repo_path"]).resolve()

    base_dir = Path(BASE_CLONE_DIR).resolve()
    if base_dir not in repo_path.parents and repo_path != base_dir:
        raise HTTPException(status_code=400, detail="Invalid repo path")

    assets = []
    for root, dirs, files in os.walk(repo_path):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for file_name in files:
            file_path = Path(root) / file_name
            ext = file_path.suffix.lower()
            media_type = MEDIA_EXTENSIONS.get(ext)
            if not media_type:
                continue
            rel_path = file_path.relative_to(base_dir).as_posix()
            assets.append(
                {
                    "name": file_name,
                    "type": media_type,
                    "ext": ext,
                    "rel_path": file_path.relative_to(repo_path).as_posix(),
                    "url": f"/repos/{rel_path}",
                }
            )

    assets.sort(key=lambda item: item["rel_path"])
    favicon_url = _local_favicon_from_repo(repo_path)
    return {"site_id": site_id, "repo_path": str(repo_path), "favicon_url": favicon_url, "media_assets": assets[:250]}


@router.post("/api/codex/open")
def open_codex(data: dict):
    payload = data or {}
    raw_repo_path = (payload.get("repo_path") or "").strip()
    if not raw_repo_path:
        raise HTTPException(status_code=400, detail="repo_path is required")

    repo_path = Path(raw_repo_path).resolve()
    base_dir = Path(BASE_CLONE_DIR).resolve()
    if base_dir not in repo_path.parents and repo_path != base_dir:
        raise HTTPException(status_code=400, detail="repo_path must be inside clone directory")
    if not _is_git_repo(repo_path):
        raise HTTPException(status_code=404, detail="Local git repo not found")
    if not command_exists("codex"):
        raise HTTPException(status_code=400, detail="codex command is not available in PATH")

    allowed_profiles = {
        "frontend": "Frontend developer focused on UI, accessibility, and polished UX implementation.",
        "backend": "Backend developer focused on APIs, data flows, reliability, and performance.",
        "seo_marketing": "SEO and marketing specialist focused on discoverability, conversion, and content quality.",
        "architect": "Software architect focused on system design, maintainability, and long-term scalability.",
    }
    requested_profiles = payload.get("profiles") or []
    if isinstance(requested_profiles, str):
        requested_profiles = [requested_profiles]
    if not isinstance(requested_profiles, list):
        raise HTTPException(status_code=400, detail="profiles must be a list")

    unique_profiles = []
    seen = set()
    for profile in requested_profiles:
        key = str(profile).strip().lower()
        if not key or key in seen:
            continue
        if key not in allowed_profiles:
            raise HTTPException(status_code=400, detail=f"Invalid codex profile: {profile}")
        unique_profiles.append(key)
        seen.add(key)
    if not unique_profiles:
        unique_profiles = ["architect"]
    if len(unique_profiles) > 4:
        raise HTTPException(status_code=400, detail="Maximum 4 codex instances are allowed")

    launchers = [
        ("x-terminal-emulator", lambda cmd: ["x-terminal-emulator", "-e", "bash", "-lc", cmd]),
        ("gnome-terminal", lambda cmd: ["gnome-terminal", "--", "bash", "-lc", cmd]),
        ("konsole", lambda cmd: ["konsole", "-e", "bash", "-lc", cmd]),
        ("xfce4-terminal", lambda cmd: ["xfce4-terminal", "--command", f"bash -lc {shlex.quote(cmd)}"]),
        ("alacritty", lambda cmd: ["alacritty", "-e", "bash", "-lc", cmd]),
    ]

    launcher_factory = None
    for launcher_name, factory in launchers:
        if command_exists(launcher_name):
            launcher_factory = factory
            break
    if launcher_factory is None:
        raise HTTPException(
            status_code=503,
            detail=f"No supported terminal launcher found. Run manually: cd {repo_path} && codex",
        )

    launched = []
    for profile in unique_profiles:
        role_note = allowed_profiles.get(profile, "")
        role_message = f"\n[Codex Role] {profile}\n{role_note}\n\n"
        command = (
            f"cd {shlex.quote(str(repo_path))} && "
            f"printf %s {shlex.quote(role_message)} && "
            f"CODEX_ROLE={shlex.quote(profile)} codex"
        )
        try:
            subprocess.Popen(launcher_factory(command))
            launched.append(profile)
        except Exception:
            continue

    if not launched:
        raise HTTPException(status_code=500, detail="Failed to launch codex terminal instances")

    return {
        "status": "ok",
        "message": f"Launched {len(launched)} codex instance(s) at {repo_path}",
        "profiles": launched,
    }
