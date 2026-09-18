#!/usr/bin/env python3
"""Scrape creator cover images and recent media from public X pages.

Downloads into public/creators/<id>/ so assets ship with the site.
No API keys needed — uses public X HTML + common user agents.
"""

import os
import re
import json
import sys
import time
import hashlib
from urllib.parse import urlparse
from pathlib import Path

import requests

# List matches src/lib/creators.ts
CREATORS = [
    {"id": "maya", "xHandle": "buildwithmaya"},
    {"id": "kp", "xHandle": "thisiskp_"},
    {"id": "gerrit", "xHandle": "halfmage"},
    {"id": "lynnzeng", "xHandle": "zeng_wt"},
    {"id": "jaibhagat", "xHandle": "ChaiWithJai"},
    {"id": "nealfrazier", "xHandle": "NealFrazierTech"},
]

BASE_DIR = Path(__file__).resolve().parent.parent
PUBLIC_DIR = BASE_DIR / "public" / "creators"
MAX_MEDIA_PER_CREATOR = 6

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    "DNT": "1",
    "Connection": "keep-alive",
}

def log(msg):
    print(f"[media] {msg}")

def download(url: str, dest: Path) -> bool:
    try:
        dest.parent.mkdir(parents=True, exist_ok=True)
        r = requests.get(url, headers=HEADERS, timeout=20, stream=True)
        r.raise_for_status()
        with open(dest, "wb") as f:
            for chunk in r.iter_content(8192):
                f.write(chunk)
        return True
    except Exception as e:
        log(f"download failed: {url} -> {e}")
        return False

def extract_image_urls(html: str) -> dict:
    """Extract avatar, banner, and media URLs from raw X HTML."""
    urls = set(re.findall(r'https://[^\s"<>]+\.(?:jpg|jpeg|png|webp)', html))

    avatar = None
    banner = None
    media = []

    # Prefer larger avatar variants
    avatar_urls = [u for u in urls if "pbs.twimg.com/profile_images/" in u]
    if avatar_urls:
        # Prefer 400x400 if present, else 200x200, else bigger, else normal
        for variant in ["400x400", "200x200", "bigger", "x96", "normal"]:
            for u in avatar_urls:
                if variant in u:
                    avatar = u
                    break
            if avatar:
                break

    # Banner URL pattern
    banner_match = re.search(r'(https://pbs\.twimg\.com/profile_banners/[^\s"<>]+\.(?:jpg|png|webp))', html)
    if banner_match:
        banner = banner_match.group(1)

    # Media (strip _normal / _small variants when possible)
    media_urls = sorted([u for u in urls if "pbs.twimg.com/media/" in u])
    seen = set()
    for u in media_urls:
        base = re.sub(r"\?.*$", "", u)
        # Strip _400x400 style suffix if present, keep extension via capture group
        base = re.sub(r"_\d+x\d+(\.(?:jpg|png|webp))?$", r"\1", base)
        key = hashlib.md5(base.encode()).hexdigest()[:12]
        if key in seen:
            continue
        seen.add(key)
        # Ask for original resolution if it is a pbs.twimg media URL
        large = base + "?name=orig" if "pbs.twimg.com/media/" in base else base
        media.append(large)
        if len(media) >= MAX_MEDIA_PER_CREATOR:
            break

    return {
        "avatar": avatar,
        "banner": banner,
        "media": media,
    }

def scrape_creator(creator: dict) -> dict:
    handle = creator["xHandle"]
    out_dir = PUBLIC_DIR / creator["id"]
    url = f"https://x.com/{handle}"

    log(f"scraping {handle} ...")
    try:
        r = requests.get(url, headers=HEADERS, timeout=25)
        r.raise_for_status()
        html = r.text
    except Exception as e:
        log(f"fetch failed for {handle}: {e}")
        return {"id": creator["id"], "avatar": None, "banner": None, "media": []}

    extracted = extract_image_urls(html)

    manifest = {"id": creator["id"], "avatar": None, "banner": None, "media": []}

    if extracted["avatar"]:
        ext = Path(urlparse(extracted["avatar"]).path).suffix or ".jpg"
        dest = out_dir / f"avatar{ext}"
        if download(extracted["avatar"], dest):
            manifest["avatar"] = f"/creators/{creator['id']}/avatar{ext}"

    if extracted["banner"]:
        ext = Path(urlparse(extracted["banner"]).path).suffix or ".jpg"
        dest = out_dir / f"banner{ext}"
        if download(extracted["banner"], dest):
            manifest["banner"] = f"/creators/{creator['id']}/banner{ext}"

    for i, media_url in enumerate(extracted["media"], 1):
        ext = Path(urlparse(media_url).path).suffix or ".jpg"
        dest = out_dir / f"media-{i}{ext}"
        if download(media_url, dest):
            manifest["media"].append(f"/creators/{creator['id']}/media-{i}{ext}")

    time.sleep(1.5)
    return manifest

def main():
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    results = []
    for creator in CREATORS:
        result = scrape_creator(creator)
        results.append(result)
        log(f"{creator['id']}: avatar={bool(result['avatar'])}, banner={bool(result['banner'])}, media={len(result['media'])}")

    manifest_path = PUBLIC_DIR / "manifest.json"
    with open(manifest_path, "w") as f:
        json.dump({"creators": results, "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}, f, indent=2)

    log(f"manifest written: {manifest_path}")

if __name__ == "__main__":
    main()
