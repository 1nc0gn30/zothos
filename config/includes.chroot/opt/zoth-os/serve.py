#!/usr/bin/env python3
"""Zoth OS desk. Localhost only. Live metrics, real tool presence, resident micro-model."""

from __future__ import annotations

import argparse
import glob
import json
import os
import re
import shutil
import socket
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

DESK = Path(__file__).resolve().parent
CHROOT = DESK.parents[1]
BIN_DIR = CHROOT / "usr" / "local" / "bin"
HOST = "127.0.0.1"
PORT = 8770
PKG_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9+._:@/-]{0,120}$")
ROOM_RE = re.compile(r"^/[A-Za-z0-9_./-]{0,180}$")

os.environ["PATH"] = os.pathsep.join(
    [str(BIN_DIR), str(Path.home() / ".local" / "bin"), "/usr/local/bin", os.environ.get("PATH", "")]
)

# id, name, group, blurb, bins, argv, term, install kind, package
# kind: apt | pip | npm | hint | none
RAW = [
    ("zoth-doctor", "System doctor", "desk", "Audit what is actually on the path.", ["zoth-doctor"], ["zoth-doctor"], True, "none", ""),
    ("zoth-fastfetch", "Fastfetch", "desk", "Kernel, CPU, and desktop in one screen.", ["zoth-fastfetch"], ["zoth-fastfetch"], True, "none", ""),
    ("zoth-sec", "Security menu", "desk", "The existing Kali and Parrot launcher.", ["zoth-sec"], ["zoth-sec"], True, "none", ""),
    ("zoth-cockpit", "Terminal cockpit", "desk", "Full-screen curses board.", ["zoth-cockpit"], ["zoth-cockpit"], True, "none", ""),
    ("zoth-netkill", "Network killswitch", "privacy", "Drop outbound traffic until you lift it.", ["zoth-netkill"], ["zoth-netkill"], True, "none", ""),
    ("nmap", "Nmap", "recon", "Host and port discovery.", ["nmap"], ["nmap"], True, "apt", "nmap"),
    ("masscan", "Masscan", "recon", "Wide, fast port sweep.", ["masscan"], ["masscan"], True, "apt", "masscan"),
    ("amass", "Amass", "recon", "DNS and surface mapping.", ["amass"], ["amass"], True, "apt", "amass"),
    ("dnsrecon", "dnsrecon", "recon", "DNS enumeration.", ["dnsrecon"], ["dnsrecon"], True, "apt", "dnsrecon"),
    ("theharvester", "theHarvester", "recon", "Public email and host names.", ["theharvester"], ["theharvester"], True, "apt", "theharvester"),
    ("recon-ng", "recon-ng", "recon", "OSINT workspace.", ["recon-ng"], ["recon-ng"], True, "apt", "recon-ng"),
    ("nuclei", "Nuclei", "recon", "Template checks against a host you specify.", ["nuclei"], ["nuclei"], True, "apt", "nuclei"),
    ("gobuster", "Gobuster", "web", "Directory and vhost wordlists.", ["gobuster"], ["gobuster"], True, "apt", "gobuster"),
    ("ffuf", "ffuf", "web", "Fast web fuzzer.", ["ffuf"], ["ffuf"], True, "apt", "ffuf"),
    ("feroxbuster", "Feroxbuster", "web", "Recursive content discovery.", ["feroxbuster"], ["feroxbuster"], True, "apt", "feroxbuster"),
    ("nikto", "Nikto", "web", "Web server checks.", ["nikto"], ["nikto"], True, "apt", "nikto"),
    ("sqlmap", "sqlmap", "web", "SQL injection testing.", ["sqlmap"], ["sqlmap"], True, "apt", "sqlmap"),
    ("wpscan", "WPScan", "web", "WordPress enumeration.", ["wpscan"], ["wpscan"], True, "apt", "wpscan"),
    ("burpsuite", "Burp Suite", "web", "Intercepting proxy.", ["burpsuite"], ["burpsuite"], False, "apt", "burpsuite"),
    ("zaproxy", "OWASP ZAP", "web", "Web app scanner.", ["zaproxy"], ["zaproxy"], False, "apt", "zaproxy"),
    ("caido", "Caido", "web", "Lightweight intercepting proxy.", ["caido"], ["caido"], False, "hint", "Install Caido from its upstream package, then reopen this row."),
    ("msfconsole", "Metasploit", "exploit", "Exploitation framework console.", ["msfconsole"], ["msfconsole"], True, "apt", "metasploit-framework"),
    ("searchsploit", "Searchsploit", "exploit", "Local exploit-db lookup.", ["searchsploit"], ["searchsploit"], True, "apt", "exploitdb"),
    ("netexec", "NetExec", "exploit", "Network protocol enumeration.", ["netexec", "nxc"], ["netexec"], True, "apt", "netexec"),
    ("aircrack-ng", "Aircrack-ng", "wireless", "802.11 capture and audit.", ["aircrack-ng"], ["aircrack-ng"], True, "apt", "aircrack-ng"),
    ("wifite", "Wifite", "wireless", "Wireless audit wrapper.", ["wifite"], ["wifite"], True, "apt", "wifite"),
    ("kismet", "Kismet", "wireless", "Wireless detector.", ["kismet"], ["kismet"], True, "apt", "kismet"),
    ("reaver", "Reaver", "wireless", "WPS audit.", ["reaver"], ["reaver"], True, "apt", "reaver"),
    ("hashcat", "Hashcat", "passwords", "GPU and CPU hash recovery.", ["hashcat"], ["hashcat"], True, "apt", "hashcat"),
    ("john", "John the Ripper", "passwords", "Password hash cracking.", ["john"], ["john"], True, "apt", "john"),
    ("hydra", "Hydra", "passwords", "Online login guessing.", ["hydra"], ["hydra"], True, "apt", "hydra"),
    ("medusa", "Medusa", "passwords", "Parallel login guessing.", ["medusa"], ["medusa"], True, "apt", "medusa"),
    ("wireshark", "Wireshark", "packets", "Packet capture.", ["wireshark"], ["wireshark"], False, "apt", "wireshark"),
    ("tshark", "TShark", "packets", "Terminal packet capture.", ["tshark"], ["tshark"], True, "apt", "tshark"),
    ("bettercap", "Bettercap", "packets", "Network reconnaissance and MITM toolkit.", ["bettercap"], ["bettercap"], True, "apt", "bettercap"),
    ("ghidra", "Ghidra", "reverse", "Disassembler and decompiler.", ["ghidra"], ["ghidra"], False, "apt", "ghidra"),
    ("radare2", "radare2", "reverse", "Command-line reverse engineering.", ["r2"], ["r2"], True, "apt", "radare2"),
    ("gdb", "GDB", "reverse", "Debugger.", ["gdb"], ["gdb"], True, "apt", "gdb"),
    ("binwalk", "Binwalk", "reverse", "Firmware and file carving.", ["binwalk"], ["binwalk"], True, "apt", "binwalk"),
    ("sleuthkit", "Sleuth Kit", "forensics", "Disk and filesystem timeline tools.", ["fls"], ["fls"], True, "apt", "sleuthkit"),
    ("lynis", "Lynis", "forensics", "Host hardening audit.", ["lynis"], ["lynis"], True, "apt", "lynis"),
    ("volatility3", "Volatility 3", "forensics", "Memory image analysis.", ["vol", "volatility3"], ["vol"], True, "pip", "volatility3"),
    ("tor", "Tor", "privacy", "Local SOCKS proxy on port 9050.", ["tor"], ["tor"], True, "apt", "tor"),
    ("torsocks", "torsocks", "privacy", "Force one command through Tor.", ["torsocks"], ["torsocks", "--help"], True, "apt", "torsocks"),
    ("macchanger", "macchanger", "privacy", "Change an interface MAC address.", ["macchanger"], ["macchanger", "--help"], True, "apt", "macchanger"),
    ("hermes", "Hermes", "mind", "Nous Research agent harness.", ["hermes"], ["hermes"], True, "1liner", "curl -fsSL https://hermes.nousresearch.com/install.sh | bash"),
    ("grok", "Grok CLI", "mind", "xAI Grok command line.", ["grok"], ["grok"], True, "1liner", "curl -fsSL https://grok.x.ai/install.sh | bash"),
    ("codex", "Codex", "mind", "OpenAI Codex coding agent.", ["codex"], ["codex"], True, "1liner", "curl -fsSL https://raw.githubusercontent.com/openai/codex/main/install.sh | bash || (mkdir -p ~/.local && npm install -g --prefix ~/.local @openai/codex)"),
    ("claude", "Claude Code", "mind", "Anthropic coding agent.", ["claude"], ["claude"], True, "1liner", "curl -fsSL https://claude.ai/install.sh | bash"),
    ("opencode", "OpenCode", "mind", "Open-source coding agent.", ["opencode"], ["opencode"], True, "1liner", "curl -fsSL https://opencode.ai/install.sh | bash || (mkdir -p ~/.local && npm install -g --prefix ~/.local opencode-ai)"),
    ("agy", "AGY CLI", "mind", "Google Antigravity SDK harness.", ["agy"], ["agy"], True, "1liner", "curl -fsSL https://antigravity.google/install.sh | bash || (mkdir -p ~/.local && npm install -g --prefix ~/.local @google/antigravity-sdk)"),
    ("gemini", "Gemini CLI", "mind", "Google Gemini terminal agent.", ["gemini"], ["gemini"], True, "npm", "@google/gemini-cli"),
    ("aider", "Aider", "mind", "Git-aware pair programmer.", ["aider"], ["aider"], True, "pip", "aider-chat"),
    ("goose", "Goose", "mind", "Block open-source agent.", ["goose"], ["goose"], True, "hint", "Install Goose from block.github.io/goose, then reopen this row."),
    ("open-interpreter", "Open Interpreter", "mind", "Local code-executing agent.", ["interpreter"], ["interpreter"], True, "pip", "open-interpreter"),
    ("browser-use", "browser-use", "mind", "Browser driving agent.", ["browser-use"], ["browser-use"], True, "pip", "browser-use"),
    ("garak", "Garak", "mind", "LLM vulnerability scanner.", ["garak"], ["garak", "--help"], True, "pip", "garak"),
    ("pyrit", "PyRIT", "mind", "Microsoft AI red-team orchestrator.", ["pyrit"], ["pyrit"], True, "pip", "pyrit"),
    ("promptfoo", "promptfoo", "mind", "Prompt and model eval harness.", ["promptfoo"], ["promptfoo"], True, "npm", "promptfoo"),
    ("inspect", "Inspect AI", "mind", "UK AISI evaluation harness.", ["inspect"], ["inspect"], True, "pip", "inspect-ai"),
    ("hexstrike", "HexStrike", "mind", "Local HexStrike terminal.", ["hexstrike"], ["hexstrike"], True, "none", ""),
    ("litellm", "LiteLLM", "mind", "One proxy in front of many models.", ["litellm"], ["litellm", "--help"], True, "pip", "litellm"),
    ("fastmcp", "FastMCP", "mind", "Python MCP server toolkit.", ["fastmcp"], ["fastmcp"], True, "pip", "fastmcp"),
    ("zoth-mcp", "Zoth MCP", "mind", "MCP registry that ships with the OS.", ["zoth-mcp"], ["zoth-mcp"], True, "none", ""),
    ("zoth-bridge", "Zoth bridge", "mind", "Local model gateway.", ["zoth-bridge"], ["zoth-bridge"], True, "none", ""),
    ("zoth-agent-os", "Agent OS", "mind", "L0–L4 supervisor that ships with the OS.", ["zoth-agent-os"], ["zoth-agent-os"], True, "none", ""),
    ("ollama", "Ollama", "silicon", "Local model runtime. Already the silicon backend.", ["ollama"], ["ollama", "list"], True, "hint", "curl -fsSL https://ollama.com/install.sh | sh"),
    ("zoth-mode-matrix", "Matrix reality", "reality", "Emerald hermetic desktop profile.", ["zoth-mode"], ["zoth-mode", "matrix"], True, "none", ""),
    ("zoth-mode-ghost", "Ghost reality", "reality", "Tor-cloaked, amnesic desktop profile.", ["zoth-mode"], ["zoth-mode", "ghost"], True, "none", ""),
    ("zoth-mode-gold", "Gold reality", "reality", "Azoth gold desktop profile.", ["zoth-mode"], ["zoth-mode", "gold"], True, "none", ""),
    ("zoth-mode-incognito", "Incognito reality", "reality", "Windows 11 chameleon profile.", ["zoth-mode"], ["zoth-mode", "incognito"], True, "none", ""),
]

GROUPS = {
    "desk": "Desk",
    "recon": "Recon",
    "web": "Web",
    "exploit": "Frameworks",
    "wireless": "Wireless",
    "passwords": "Passwords",
    "packets": "Packets",
    "reverse": "Reverse",
    "forensics": "Forensics",
    "privacy": "Privacy",
    "mind": "Harnesses",
    "silicon": "Silicon",
    "reality": "Reality",
}

ARMS = ["recon", "web", "exploit", "wireless", "passwords", "packets", "reverse", "forensics", "privacy"]
MICRO = (
    "gemma3:270m",
    "gemma4:e2b",
    "qwen3.5:0.8b",
    "qwen2.5-coder:1.5b",
    "llama3.2:1b",
    "zoth-ai-micro:latest",
    "smollm2:360m",
)
ROOMS = [
    ("Hub", "/index.html"),
    ("Agents", "/agents/index.html"),
    ("Registry", "/registry/index.html"),
    ("Pets", "/pets/index.html"),
    ("Memory", "/memory/index.html"),
    ("Blueprints", "/blueprints/index.html"),
    ("Signal", "/signal/index.html"),
    ("Docs", "/docs/index.html"),
]

journal_lines: list[dict] = []
journal_lock = threading.Lock()
sentinel = {"status": "idle", "model": "", "error": "", "armed_at": 0}
sample = {"cpu": None, "net": None, "stamp": 0.0}
studio_server = {"httpd": None, "port": 0}
webgpu = {"ok": False, "name": "", "ms": None, "features": 0, "note": "Not probed in this window yet."}


def journal(line: str) -> None:
    text = str(line).rstrip()
    if not text:
        return
    with journal_lock:
        journal_lines.append({"t": time.strftime("%H:%M:%S"), "line": text[:500]})
        del journal_lines[:-200]


def resolve_bin(name: str) -> str:
    """Prefer a real install over the chroot banner scripts that shadow it."""
    overlay = BIN_DIR.resolve()
    hits: list[Path] = []
    for directory in os.environ.get("PATH", "").split(os.pathsep):
        if not directory:
            continue
        candidate = Path(directory) / name
        if candidate.is_file() and os.access(candidate, os.X_OK):
            hits.append(candidate.resolve())
    outside = [hit for hit in hits if hit.parent != overlay]
    if outside:
        return str(outside[0])
    if hits and (name.startswith("zoth-") or name == "hexstrike"):
        return str(hits[0])
    return ""


def catalog() -> list[dict]:
    items = []
    for id_, name, group, blurb, bins, argv, term, kind, pkg in RAW:
        path = ""
        for b in bins:
            found = resolve_bin(b)
            if found:
                path = found
                break
        items.append({
            "id": id_,
            "name": name,
            "group": group,
            "group_label": GROUPS.get(group, group),
            "blurb": blurb,
            "bins": bins,
            "argv": argv,
            "term": term,
            "install": {"kind": kind, "pkg": pkg} if kind != "none" else None,
            "installed": bool(path),
            "path": path,
        })
    return items


def by_id(item_id: str) -> dict | None:
    for item in catalog():
        if item["id"] == item_id:
            return item
    return None


def read_text(path: str, limit: int = 256) -> str:
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as fh:
            return fh.read(limit)
    except OSError:
        return ""


def cpu_percent(retry: bool = True) -> tuple[float, str, int, float]:
    model = ""
    mhz = 0.0
    cores = 0
    try:
        info = read_text("/proc/cpuinfo", 20000)
        m = re.search(r"model name\s*:\s*(.+)", info)
        model = m.group(1).strip() if m else ""
        cores = info.count("processor\t") or os.cpu_count() or 1
        mhz_m = re.search(r"cpu MHz\s*:\s*([\d.]+)", info)
        mhz = float(mhz_m.group(1)) if mhz_m else 0.0
    except Exception:
        cores = os.cpu_count() or 1
    pct = 0.0
    try:
        parts = [float(x) for x in read_text("/proc/stat", 200).splitlines()[0].split()[1:8]]
        idle = parts[3] + parts[4]
        total = sum(parts)
        prev = sample["cpu"]
        if prev is None and retry:
            sample["cpu"] = (total, idle)
            time.sleep(0.12)
            return cpu_percent(retry=False)
        if prev and total > prev[0]:
            d_total = total - prev[0]
            d_idle = idle - prev[1]
            pct = max(0.0, min(100.0, 100.0 * (1.0 - d_idle / d_total)))
        sample["cpu"] = (total, idle)
    except Exception:
        pass
    return pct, model, cores, mhz


def mem() -> dict:
    data = {}
    for line in read_text("/proc/meminfo", 4000).splitlines():
        if ":" in line:
            key, rest = line.split(":", 1)
            data[key] = int(rest.split()[0])
    total = data.get("MemTotal", 1)
    avail = data.get("MemAvailable", data.get("MemFree", 0))
    used = max(0, total - avail)
    swap_total = data.get("SwapTotal", 0)
    swap_free = data.get("SwapFree", 0)
    return {
        "used_gb": round(used / 1024 / 1024, 2),
        "total_gb": round(total / 1024 / 1024, 2),
        "pct": round(100.0 * used / total, 1) if total else 0,
        "swap_pct": round(100.0 * (swap_total - swap_free) / swap_total, 1) if swap_total else 0,
    }


def disk() -> dict:
    usage = shutil.disk_usage("/")
    return {
        "used_gb": round(usage.used / 1024**3, 1),
        "total_gb": round(usage.total / 1024**3, 1),
        "pct": round(100.0 * usage.used / usage.total, 1) if usage.total else 0,
    }


def net(retry: bool = True) -> dict:
    rx = tx = 0
    iface = ""
    best = -1
    try:
        for line in read_text("/proc/net/dev", 8000).splitlines()[2:]:
            if ":" not in line:
                continue
            name, rest = line.split(":", 1)
            name = name.strip()
            if name == "lo" or name.startswith(("docker", "veth", "br-", "virbr", "tun", "wg")):
                continue
            parts = rest.split()
            if len(parts) < 9:
                continue
            r, t = int(parts[0]), int(parts[8])
            rx += r
            tx += t
            if r > best:
                best = r
                iface = name
    except Exception:
        pass
    now = time.time()
    rx_bps = tx_bps = 0.0
    prev = sample["net"]
    if prev is None and retry:
        sample["net"] = (now, rx, tx)
        time.sleep(0.12)
        return net(retry=False)
    if prev and now > prev[0]:
        dt = now - prev[0]
        rx_bps = max(0.0, (rx - prev[1]) / dt)
        tx_bps = max(0.0, (tx - prev[2]) / dt)
    sample["net"] = (now, rx, tx)
    return {"iface": iface or "—", "rx_bps": int(rx_bps), "tx_bps": int(tx_bps)}


def temperature() -> float | None:
    ranked: list[tuple[int, float]] = []
    for path in glob.glob("/sys/class/thermal/thermal_zone*/temp"):
        raw = read_text(path, 32).strip()
        if not raw.lstrip("-").isdigit():
            continue
        value = int(raw)
        celsius = value / 1000.0 if abs(value) > 200 else float(value)
        if not 1 < celsius < 120:
            continue
        kind = read_text(os.path.join(os.path.dirname(path), "type"), 64).strip()
        priority = 0
        if kind == "x86_pkg_temp":
            priority = 3
        elif kind in ("acpitz", "pch_cannonlake"):
            priority = 2
        ranked.append((priority, celsius))
    if not ranked:
        return None
    ranked.sort()
    return round(ranked[-1][1], 1)


def gpus() -> list[dict]:
    found = []
    if shutil.which("lspci"):
        try:
            out = subprocess.run(["lspci", "-mm"], capture_output=True, text=True, timeout=2).stdout
            for line in out.splitlines():
                if not any(token in line for token in ("VGA", "3D", "Display")):
                    continue
                parts = re.findall(r'"([^"]*)"', line)
                if len(parts) < 3:
                    continue
                if parts[0] not in ("VGA compatible controller", "3D controller", "Display controller"):
                    continue
                found.append({"vendor": parts[1], "name": parts[2]})
        except Exception:
            pass
    drivers = []
    for path in glob.glob("/sys/class/drm/card[0-9]/device/driver"):
        drivers.append(os.path.basename(os.path.realpath(path)))
    if not found and drivers:
        found = [{"vendor": d, "name": d} for d in drivers]
    elif found and drivers:
        for i, gpu in enumerate(found):
            if i < len(drivers):
                gpu["driver"] = drivers[i]
    return found


def port_open(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.15)
        return sock.connect_ex((HOST, port)) == 0


def listeners() -> list[dict]:
    known = [
        (11434, "ollama"),
        (8080, "open-webui"),
        (8188, "comfyui"),
        (8088, "studio"),
        (8091, "studio"),
        (9050, "tor"),
        (PORT, "desk"),
    ]
    return [{"port": p, "name": n} for p, n in known if port_open(p)]


def os_release() -> str:
    text = read_text("/etc/os-release", 2000)
    m = re.search(r'PRETTY_NAME="([^"]+)"', text)
    return m.group(1) if m else "Linux"


def uptime() -> int:
    try:
        return int(float(read_text("/proc/uptime", 64).split()[0]))
    except Exception:
        return 0


def ollama_json(path: str, payload: dict | None = None, timeout: float = 3):
    data = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(
        "http://127.0.0.1:11434" + path,
        data=data,
        headers={"Content-Type": "application/json"} if data else {},
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode())


def model_rows() -> list[dict]:
    try:
        tags = ollama_json("/api/tags", timeout=1.5)
        ps = ollama_json("/api/ps", timeout=1.5)
    except Exception:
        return []
    resident = {m.get("name"): m for m in ps.get("models", [])}
    rows = []
    for model in tags.get("models", []):
        name = model.get("name", "")
        details = model.get("details") or {}
        size = int(model.get("size") or 0)
        live = resident.get(name)
        rows.append({
            "name": name,
            "size_gb": round(size / 1024**3, 2),
            "family": details.get("family") or "",
            "params": details.get("parameter_size") or "",
            "quant": details.get("quantization_level") or "",
            "local": size > 100_000,
            "caps": model.get("capabilities") or [],
            "resident": bool(live),
            "vram": int((live or {}).get("size_vram") or 0),
            "expires": (live or {}).get("expires_at") or "",
        })
    rows.sort(key=lambda r: (not r["resident"], not r["local"], r["size_gb"]))
    return rows


def studio_public() -> Path | None:
    candidates = [
        Path("/opt/zoth-studio/public"),
        CHROOT / "opt" / "zoth-studio" / "public",
        Path.home() / "zoth-studio" / "public",
    ]
    for path in candidates:
        if (path / "index.html").is_file():
            return path
    return None


def pulse() -> dict:
    cpu, model, cores, mhz = cpu_percent()
    load = list(os.getloadavg()) if hasattr(os, "getloadavg") else [0, 0, 0]
    items = catalog()
    mode_file = Path.home() / ".config" / "zothos" / "current_mode"
    mode = mode_file.read_text(encoding="utf-8").strip() if mode_file.is_file() else "unset"
    try:
        kernel = os.uname().release
        host = os.uname().nodename
    except Exception:
        kernel, host = "", socket.gethostname()
    return {
        "host": host,
        "os": os_release(),
        "kernel": kernel,
        "mode": mode,
        "uptime_s": uptime(),
        "cpu": {"pct": round(cpu, 1), "model": model, "cores": cores, "mhz": round(mhz), "load": [round(x, 2) for x in load]},
        "mem": mem(),
        "disk": disk(),
        "net": net(),
        "temp_c": temperature(),
        "gpus": gpus(),
        "listeners": listeners(),
        "models": model_rows(),
        "sentinel": dict(sentinel),
        "webgpu": dict(webgpu),
        "studio": {"present": studio_public() is not None, "port": studio_server["port"]},
        "counts": {
            "ready": sum(1 for i in items if i["installed"]),
            "missing": sum(1 for i in items if not i["installed"]),
            "arms": sum(1 for i in items if i["group"] in ARMS and i["installed"]),
            "mind": sum(1 for i in items if i["group"] == "mind" and i["installed"]),
        },
        "clock": time.strftime("%H:%M:%S"),
    }


def arm_sentinel() -> None:
    sentinel["status"] = "arming"
    sentinel["error"] = ""
    try:
        tags = ollama_json("/api/tags", timeout=2)
    except Exception as exc:
        sentinel["status"] = "offline"
        sentinel["error"] = "Ollama is not answering on port 11434."
        journal(f"sentinel: {exc}")
        return
    names = [m.get("name") for m in tags.get("models", [])]
    pick = next((c for c in MICRO if c in names), "")
    if not pick:
        sentinel["status"] = "no-micro"
        sentinel["error"] = "No lightweight local model is pulled."
        return
    sentinel["model"] = pick
    try:
        ps = ollama_json("/api/ps", timeout=2)
        if any(m.get("name") == pick for m in ps.get("models", [])):
            sentinel["status"] = "resident"
            sentinel["armed_at"] = int(time.time())
            return
    except Exception:
        pass
    journal(f"sentinel warming {pick}")
    try:
        ollama_json("/api/generate", {
            "model": pick,
            "prompt": "ready",
            "stream": False,
            "keep_alive": "12h",
            "options": {"num_predict": 8, "temperature": 0},
        }, timeout=180)
        sentinel["status"] = "resident"
        sentinel["armed_at"] = int(time.time())
        journal(f"sentinel resident: {pick}")
    except Exception as exc:
        sentinel["status"] = "failed"
        sentinel["error"] = str(exc)[:240]
        journal(f"sentinel failed: {exc}")


def open_browser(url: str) -> bool:
    commands = []
    if shutil.which("firefox-esr"):
        commands.append(["firefox-esr", "--new-window", url])
    if shutil.which("firefox"):
        commands.append(["firefox", "--new-window", url])
    if shutil.which("chromium"):
        commands.append(["chromium", f"--app={url}", "--class=zoth-os", "--start-maximized"])
    if shutil.which("google-chrome"):
        commands.append(["google-chrome", f"--app={url}", "--class=zoth-os", "--start-maximized"])
    if shutil.which("xdg-open"):
        commands.append(["xdg-open", url])
    for cmd in commands:
        try:
            subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
            return True
        except OSError:
            continue
    return False


def open_terminal(argv: list[str]) -> str:
    quoted = " ".join(shlex_quote(a) for a in argv)
    hold = quoted + "; printf '\\npress enter to close\\n'; read -r _"
    options = []
    if shutil.which("konsole"):
        options.append(["konsole", "--hold", "--command", quoted])
    if shutil.which("gnome-terminal"):
        options.append(["gnome-terminal", "--", "bash", "-lc", hold])
    if shutil.which("kitty"):
        options.append(["kitty", "bash", "-lc", hold])
    if shutil.which("konsole"):
        options.append(["konsole", "--hold", "-e", "bash", "-lc", hold])
    if shutil.which("x-terminal-emulator"):
        options.append(["x-terminal-emulator", "-e", "bash", "-lc", hold])
    if shutil.which("xterm"):
        options.append(["xterm", "-hold", "-e", "bash", "-lc", hold])
    if not options:
        return "No terminal emulator is installed."
    if not os.environ.get("DISPLAY") and not os.environ.get("WAYLAND_DISPLAY"):
        return "No graphical session, so the terminal was not opened. Command: " + quoted
    subprocess.Popen(options[0], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
    return ""


def shlex_quote(text: str) -> str:
    return "'" + text.replace("'", "'\"'\"'") + "'"


def spawn_logged(argv: list[str], label: str) -> None:
    journal("$ " + " ".join(argv))
    proc = subprocess.Popen(argv, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, start_new_session=True)

    def pump() -> None:
        assert proc.stdout is not None
        for line in proc.stdout:
            journal(line.rstrip())
        journal(f"[{label}] exit {proc.wait()}")

    threading.Thread(target=pump, daemon=True).start()


def sudo_ok() -> bool:
    try:
        return subprocess.run(["sudo", "-n", "true"], capture_output=True, timeout=2).returncode == 0
    except Exception:
        return False


def do_install(item: dict) -> str:
    spec = item.get("install") or {}
    kind = spec.get("kind")
    pkg = spec.get("pkg") or ""
    if kind == "hint":
        journal(item["name"] + ": " + pkg)
        return pkg
    if kind == "1liner":
        journal("Executing 1-liner installer for " + item["name"] + ": " + pkg)
        err = open_terminal(["bash", "-c", f"{pkg}; echo ''; echo 'Installer finished. Press Enter to close...'; read"])
        if err:
            spawn_logged(["bash", "-c", pkg], item["name"])
            return f"Installing {item['name']} in background..."
        return f"Installing {item['name']} in terminal window..."
    if kind not in ("apt", "pip", "npm") or not PKG_RE.match(pkg):
        return "This row has no installer."
    if kind == "apt":
        argv = ["sudo", "apt-get", "install", "-y", pkg]
        if sudo_ok():
            spawn_logged(["sudo", "-n", *argv[1:]], item["name"])
            return "Installing " + pkg
        err = open_terminal(argv)
        return err or "Install opened in a terminal so you can approve it."
    if kind == "pip":
        exe = shutil.which("pip3") or shutil.which("pip")
        if not exe:
            return "pip is not installed."
        spawn_logged([exe, "install", "--user", pkg], item["name"])
        return "Installing " + pkg + " for this user."
    exe = shutil.which("npm")
    if not exe:
        return "npm is not installed."
    spawn_logged([exe, "install", "-g", pkg], item["name"])
    return "Installing " + pkg


def do_open(item: dict) -> str:
    argv = list(item.get("argv") or [])
    if not argv or argv[0] not in set(item.get("bins") or []):
        return "Nothing to launch."
    exe = resolve_bin(argv[0])
    if not exe:
        return item["name"] + " is not on the path."
    argv[0] = exe
    if item.get("term"):
        err = open_terminal(argv)
        return err or "Opened " + item["name"]
    if not os.environ.get("DISPLAY") and not os.environ.get("WAYLAND_DISPLAY"):
        return "No graphical session for " + item["name"]
    subprocess.Popen(argv, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
    return "Opened " + item["name"]


def ensure_studio() -> int:
    if studio_server["port"] and port_open(studio_server["port"]):
        return studio_server["port"]
    public = studio_public()
    if public is None:
        raise FileNotFoundError("Zoth Studio public hub is not on disk.")
    from functools import partial
    from http.server import SimpleHTTPRequestHandler

    class Quiet(SimpleHTTPRequestHandler):
        def log_message(self, fmt: str, *args) -> None:
            return

    for port in (8091, 8092, 8093, 8094):
        try:
            httpd = ThreadingHTTPServer((HOST, port), partial(Quiet, directory=str(public)))
        except OSError:
            continue
        threading.Thread(target=httpd.serve_forever, daemon=True).start()
        studio_server["httpd"] = httpd
        studio_server["port"] = port
        journal(f"studio hub on {port} from {public}")
        return port
    raise OSError("No free port for Zoth Studio.")


def open_room(room: str) -> str:
    if not ROOM_RE.match(room) or ".." in room:
        return "That studio path is not allowed."
    try:
        port = ensure_studio()
    except Exception as exc:
        return str(exc)
    url = f"http://{HOST}:{port}{room}"
    if open_browser(url):
        return "Studio opened."
    return url


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt: str, *args) -> None:
        return

    def send_json(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def send_file(self, path: Path) -> None:
        if not path.is_file():
            self.send_error(404)
            return
        data = path.read_bytes()
        kind = "text/plain; charset=utf-8"
        if path.suffix == ".html":
            kind = "text/html; charset=utf-8"
        elif path.suffix == ".css":
            kind = "text/css; charset=utf-8"
        elif path.suffix == ".js":
            kind = "text/javascript; charset=utf-8"
        elif path.suffix == ".svg":
            kind = "image/svg+xml"
        self.send_response(200)
        self.send_header("Content-Type", kind)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self) -> None:
        path = unquote(urlparse(self.path).path)
        if path == "/api/pulse":
            self.send_json(pulse())
            return
        if path == "/api/board":
            self.send_json({"items": catalog(), "rooms": [{"name": n, "path": p} for n, p in ROOMS]})
            return
        if path == "/api/journal":
            with journal_lock:
                lines = list(journal_lines)
            self.send_json({"lines": lines})
            return
        if path == "/":
            path = "/index.html"
        rel = path.lstrip("/")
        if not re.fullmatch(r"[A-Za-z0-9._-]+", rel):
            self.send_error(404)
            return
        target = (DESK / rel).resolve()
        if DESK not in target.parents and target != DESK:
            self.send_error(404)
            return
        self.send_file(target)

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        length = int(self.headers.get("Content-Length") or 0)
        if length > 8192:
            self.send_json({"ok": False, "error": "body too large"}, 400)
            return
        try:
            body = json.loads(self.rfile.read(length).decode() or "{}")
        except json.JSONDecodeError:
            self.send_json({"ok": False, "error": "bad json"}, 400)
            return
        if path == "/api/webgpu":
            webgpu["ok"] = bool(body.get("ok"))
            webgpu["name"] = str(body.get("name") or "")[:160]
            webgpu["ms"] = body.get("ms")
            webgpu["features"] = int(body.get("features") or 0)
            webgpu["note"] = str(body.get("note") or "")[:240]
            self.send_json({"ok": True})
            return
        if path != "/api/act":
            self.send_json({"ok": False, "error": "unknown"}, 404)
            return
        op = str(body.get("op") or "")
        item_id = str(body.get("id") or "")
        if op == "arm":
            threading.Thread(target=arm_sentinel, daemon=True).start()
            self.send_json({"ok": True, "message": "Warming the lightweight model."})
            return
        if op == "room":
            self.send_json({"ok": True, "message": open_room(item_id)})
            return
        item = by_id(item_id)
        if item is None or op not in ("open", "install"):
            self.send_json({"ok": False, "error": "unknown action"}, 400)
            return
        message = do_open(item) if op == "open" else do_install(item)
        ok = not message.lower().startswith(("no ", "this row", "pip ", "npm "))
        self.send_json({"ok": ok or message.startswith(("Opened", "Installing", "Install opened", "Studio")), "message": message})


def main() -> int:
    global PORT
    parser = argparse.ArgumentParser(description="Zoth OS desk")
    parser.add_argument("--port", type=int, default=PORT)
    parser.add_argument("--no-open", action="store_true")
    parser.add_argument("--no-sentinel", action="store_true")
    args = parser.parse_args()
    PORT = args.port
    if port_open(PORT):
        try:
            with urllib.request.urlopen(f"http://{HOST}:{PORT}/api/pulse", timeout=1) as resp:
                if b'"counts"' in resp.read(400):
                    if not args.no_open:
                        open_browser(f"http://{HOST}:{PORT}/")
                    print(f"Zoth OS desk already live at http://{HOST}:{PORT}/")
                    return 0
        except Exception:
            print(f"Port {PORT} is taken by something else.", file=sys.stderr)
            return 1
    if not args.no_sentinel:
        threading.Thread(target=arm_sentinel, daemon=True).start()
    httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    url = f"http://{HOST}:{PORT}/"
    print(f"Zoth OS desk at {url}")
    if not args.no_open:
        threading.Timer(0.4, lambda: open_browser(url)).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        return 0
    return 0


if __name__ == "__main__":
    sys.exit(main())
