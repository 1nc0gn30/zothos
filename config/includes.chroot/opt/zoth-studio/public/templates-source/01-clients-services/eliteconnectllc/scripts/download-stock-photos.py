#!/usr/bin/env python3
"""
Download free stock photos for Elite Connect website.
Uses Pexels API (free, 200 requests/hour).
Get your API key at: https://www.pexels.com/api/
"""

import urllib.request
import urllib.parse
import json
import os
import sys

PEXELS_API_KEY = os.environ.get("PEXELS_API_KEY", "YOUR_PEXELS_API_KEY_HERE")

QUERIES = {
    # filename: search query
    "cctv-security-camera.jpg": "security camera installation commercial",
    "alarm-system.jpg": "alarm system panel commercial building",
    "access-control.jpg": "access control card reader door",
    "structured-cabling.jpg": "structured network cabling server room",
    "audio-visual.jpg": "audio visual conference room setup",
    "msp-server-rack.jpg": "server rack data center managed it",
    "voip-phone.jpg": "business phone system voip office",
    "low-voltage-wiring.jpg": "low voltage wiring commercial electrician",
    "surveillance-monitor.jpg": "cctv monitor control room security",
    "doorbell-camera.jpg": "smart doorbell camera residential",
    "network-switch.jpg": "network switch ethernet cables",
    "fiber-optic.jpg": "fiber optic cable splice",
    "security-installation.jpg": "security technician installing camera",
    "commercial-building-tech.jpg": "commercial building technology infrastructure",
    "home-security.jpg": "home security system smart home",
}

OUTDIR = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "gallery-hd")

HEADERS = {
    "Authorization": PEXELS_API_KEY,
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
}


def download_photo(query, filename):
    url = f"https://api.pexels.com/v1/search?query={urllib.parse.quote(query)}&per_page=1&orientation=landscape"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        resp = urllib.request.urlopen(req, timeout=20)
        data = json.loads(resp.read())
        photos = data.get("photos", [])
        if not photos:
            print(f"  No results for: {query}")
            return False
        src = photos[0]["src"]["large2x"]  # 2x large = ~1600-2000px wide
        img_req = urllib.request.Request(src, headers={"User-Agent": HEADERS["User-Agent"]})
        img_resp = urllib.request.urlopen(img_req, timeout=30)
        outpath = os.path.join(OUTDIR, filename)
        with open(outpath, "wb") as f:
            f.write(img_resp.read())
        size = os.path.getsize(outpath)
        print(f"  OK {filename} ({size//1024}KB)")
        return True
    except Exception as e:
        print(f"  ERROR {filename}: {e}")
        return False


def main():
    if PEXELS_API_KEY == "YOUR_PEXELS_API_KEY_HERE":
        print("=" * 60)
        print("SET YOUR PEXELS API KEY FIRST:")
        print("  export PEXELS_API_KEY='your_key_here'")
        print("Get one free at: https://www.pexels.com/api/")
        print("=" * 60)
        sys.exit(1)

    os.makedirs(OUTDIR, exist_ok=True)
    print(f"Downloading to: {OUTDIR}\n")

    ok = 0
    for filename, query in QUERIES.items():
        print(f"[{filename}]")
        print(f"  Query: {query}")
        if download_photo(query, filename):
            ok += 1
        print()

    print(f"Done. Downloaded {ok}/{len(QUERIES)} photos.")
    print(f"\nNext steps:")
    print(f"  1. Check {OUTDIR}/ for downloaded images")
    print(f"  2. Manually review and remove any that don't fit")
    print(f"  3. Run: npm run build")


if __name__ == "__main__":
    main()
