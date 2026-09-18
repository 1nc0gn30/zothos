#!/usr/bin/env python3
"""Full media scraper using Playwright + stealth to extract real X banners, avatars, and posts.

Downloads into public/creators/<id>/ and writes a manifest.json.
"""

import asyncio
import json
import os
import re
import sys
import time
from pathlib import Path
from urllib.parse import urlparse

import requests
from playwright.async_api import async_playwright, Page
from playwright_stealth import Stealth

stealth = Stealth()

BASE_DIR = Path(__file__).resolve().parent.parent
PUBLIC_DIR = BASE_DIR / "public" / "creators"
MAX_MEDIA = 6

CREATORS = [
    {"id": "maya", "xHandle": "buildwithmaya"},
    {"id": "kp", "xHandle": "thisiskp_"},
    {"id": "gerrit", "xHandle": "halfmage"},
    {"id": "lynnzeng", "xHandle": "zeng_wt"},
    {"id": "jaibhagat", "xHandle": "ChaiWithJai"},
    {"id": "nealfrazier", "xHandle": "NealFrazierTech"},
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
}

def log(msg):
    print(f"[media] {msg}")

def download(url: str, dest: Path) -> bool:
    try:
        dest.parent.mkdir(parents=True, exist_ok=True)
        r = requests.get(url, headers=HEADERS, timeout=25, stream=True)
        r.raise_for_status()
        with open(dest, "wb") as f:
            for chunk in r.iter_content(8192):
                f.write(chunk)
        return True
    except Exception as e:
        log(f"download failed: {url} -> {e}")
        return False

def clean_avatar(url: str) -> str:
    """Prefer 400x400 avatar variant."""
    if not url:
        return url
    url = url.replace("\\/", "/")
    if "_normal" in url:
        return url.replace("_normal", "_400x400")
    if "_bigger" in url:
        return url.replace("_bigger", "_400x400")
    if "_200x200" in url:
        return url.replace("_200x200", "_400x400")
    return url

def clean_banner(url: str) -> str:
    """Banner usually returns as 600x200; try 1500x500 if possible."""
    if not url:
        return url
    url = url.replace("\\/", "/")
    # X banner format: .../{user_id}/{timestamp}/600x200 or /1500x500
    if "/600x200" in url:
        return url.replace("/600x200", "/1500x500")
    if "/300x100" in url:
        return url.replace("/300x100", "/1500x500")
    # If no size suffix, append 1500x500
    base = re.sub(r"\?.*$", "", url)
    if not re.search(r"/\d+x\d+(\.|$)", base):
        return base.rstrip("/") + "/1500x500"
    return url

def clean_media(url: str) -> str:
    if not url:
        return url
    url = url.replace("\\/", "/")
    base = re.sub(r"\?.*$", "", url)
    return base + "?name=orig"

async def extract_media(page: Page) -> dict:
    """Extract avatar, banner, and media image URLs from a loaded X profile page."""
    # Wait a moment for hydration
    await asyncio.sleep(3)

    avatar = await page.evaluate("""
        () => {
            const img = document.querySelector('img[src*="profile_images"]');
            return img ? img.src : null;
        }
    """)

    banner = await page.evaluate("""
        () => {
            // X uses a div with background-image for the banner
            const divs = Array.from(document.querySelectorAll('div'));
            const bannerDiv = divs.find(d => {
                const bg = window.getComputedStyle(d).backgroundImage;
                return bg.includes('profile_banners');
            });
            if (bannerDiv) {
                const m = window.getComputedStyle(bannerDiv).backgroundImage.match(/url\\(["']?([^"')]+)["']?\\)/);
                return m ? m[1] : null;
            }
            // Fallback: search stylesheets / all elements
            for (const el of document.querySelectorAll('[style*="profile_banners"]')) {
                const m = el.getAttribute('style').match(/url\\(["']?([^"')]+)["']?\\)/);
                if (m) return m[1];
            }
            return null;
        }
    """)

    media = await page.evaluate("""
        () => {
            const imgs = Array.from(document.querySelectorAll('img[src*="pbs.twimg.com/media"]'));
            return imgs.map(i => i.src).filter(Boolean);
        }
    """)

    return {
        "avatar": clean_avatar(avatar),
        "banner": clean_banner(banner),
        "media": [clean_media(u) for u in list(dict.fromkeys(media))[:MAX_MEDIA]],
    }

async def scrape_creator(creator: dict, page: Page) -> dict:
    handle = creator["xHandle"]
    cid = creator["id"]
    out_dir = PUBLIC_DIR / cid
    manifest = {"id": cid, "avatar": None, "banner": None, "media": []}

    log(f"scraping {handle} ...")
    try:
        await page.goto(f"https://x.com/{handle}", wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(4)
        extracted = await extract_media(page)
    except Exception as e:
        log(f"failed for {handle}: {e}")
        return manifest

    if extracted["avatar"]:
        ext = Path(urlparse(extracted["avatar"]).path).suffix or ".jpg"
        dest = out_dir / f"avatar{ext}"
        if download(extracted["avatar"], dest):
            manifest["avatar"] = f"/creators/{cid}/avatar{ext}"

    if extracted["banner"]:
        ext = Path(urlparse(extracted["banner"]).path).suffix or ".jpg"
        dest = out_dir / f"banner{ext}"
        if download(extracted["banner"], dest):
            manifest["banner"] = f"/creators/{cid}/banner{ext}"

    # Fallback: screenshot the top of the X profile as a real cover image
    cover_dest = out_dir / "cover.png"
    try:
        await page.screenshot(path=str(cover_dest), clip={"x": 0, "y": 0, "width": 1280, "height": 420})
        manifest["banner"] = f"/creators/{cid}/cover.png"
        log(f"cover screenshot saved for {cid}")
    except Exception as e:
        log(f"cover screenshot failed for {cid}: {e}")

    for i, media_url in enumerate(extracted["media"], 1):
        ext = Path(urlparse(media_url).path).suffix or ".jpg"
        dest = out_dir / f"media-{i}{ext}"
        if download(media_url, dest):
            manifest["media"].append(f"/creators/{cid}/media-{i}{ext}")

    return manifest

async def main():
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    results = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 900},
            user_agent=HEADERS["User-Agent"],
        )
        page = await context.new_page()
        await stealth.apply_stealth_async(page)

        for creator in CREATORS:
            result = await scrape_creator(creator, page)
            results.append(result)
            log(f"{creator['id']}: avatar={bool(result['avatar'])}, banner={bool(result['banner'])}, media={len(result['media'])}")
            await asyncio.sleep(2)

        await browser.close()

    manifest_path = PUBLIC_DIR / "manifest.json"
    with open(manifest_path, "w") as f:
        json.dump({"creators": results, "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}, f, indent=2)
    log(f"manifest written: {manifest_path}")

    # Also generate a TS module so the app can import local media at build time
    ts_path = BASE_DIR / "src" / "lib" / "mediaManifest.ts"
    entries = []
    for r in results:
        entries.append(f"  {r['id']}: {{ avatar: {json.dumps(r['avatar'])}, banner: {json.dumps(r['banner'])}, media: {json.dumps(r['media'])} }}")
    ts_content = "export const CREATOR_MEDIA: Record<string, { avatar: string | null; banner: string | null; media: string[] }> = {\n" + ",\n".join(entries) + "\n};\n"
    with open(ts_path, "w") as f:
        f.write(ts_content)
    log(f"TS manifest written: {ts_path}")

if __name__ == "__main__":
    asyncio.run(main())
