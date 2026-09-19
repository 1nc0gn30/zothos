#!/usr/bin/env python3
"""
==============================================================================
 * NULLAI HEXSTRIKE AI ENGINE — STANDALONE BACKEND SERVER *
 High-performance FastAPI neural daemon for automated offensive security.
==============================================================================
"""

import sys
import os
import argparse
import signal

# Add backend directory to sys.path
CUR_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(CUR_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)
if CUR_DIR not in sys.path:
    sys.path.insert(0, CUR_DIR)

PID_FILE = os.path.expanduser("~/.hexstrike/run/backend.pid")


def parse_args():
    parser = argparse.ArgumentParser(description="HexStrike AI Neural Server")
    parser.add_argument("--host", default="127.0.0.1", help="Host IP to bind (default: 127.0.0.1)")
    parser.add_argument("--port", type=int, default=8000, help="Port to listen on (default: 8000)")
    parser.add_argument("--workers", type=int, default=1, help="Number of worker processes")
    parser.add_argument("--reload", action="store_true", help="Enable auto-reload")
    return parser.parse_args()


def write_pid():
    os.makedirs(os.path.dirname(PID_FILE), exist_ok=True)
    with open(PID_FILE, "w") as f:
        f.write(str(os.getpid()))


def remove_pid():
    if os.path.exists(PID_FILE):
        try:
            os.remove(PID_FILE)
        except Exception:
            pass


def main():
    args = parse_args()
    write_pid()

    def handle_exit(signum, frame):
        remove_pid()
        sys.exit(0)

    signal.signal(signal.SIGINT, handle_exit)
    signal.signal(signal.SIGTERM, handle_exit)

    print(f"[*] Starting NullAI HexStrike Neural Daemon on http://{args.host}:{args.port}")

    try:
        import uvicorn
        # Check backend app
        from backend.main import app
        uvicorn.run(app, host=args.host, port=args.port, log_level="warning")
    except ImportError:
        # Fallback to running directly via python
        from backend.main import app
        import uvicorn
        uvicorn.run(app, host=args.host, port=args.port)
    finally:
        remove_pid()


if __name__ == "__main__":
    main()
