#!/usr/bin/env python3
"""
Generic pipeline: add any X handle as a CreatorPlaybooks creator.

Usage:
  python3 scripts/add-creator.py @maddiedreese
  python3 scripts/add-creator.py maddiedreese --category netlify-shippers

What it does:
  1. Scrapes public X profile for avatar, banner, bio, followers, posts count.
  2. Downloads recent media/tweet images.
  3. Writes assets to public/creators/<id>/.
  4. Updates public/creators/manifest.json.
  5. Updates src/lib/mediaManifest.ts.
  6. Appends a starter CreatorProfile to src/lib/creators.ts with status='draft'.

Playbook content (plays, hooks, pillars) is intentionally left as starter placeholders
because real playbooks must be manually sourced to keep data honest.
"""

import argparse, asyncio, json, re, os, sys, time
from pathlib import Path
from typing import Optional

import requests
from playwright.async_api import async_playwright
from playwright_stealth import Stealth

stealth = Stealth()

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_CREATORS = ROOT / "public" / "creators"
MANIFEST_PATH = PUBLIC_CREATORS / "manifest.json"
MEDIA_MANIFEST_PATH = ROOT / "src" / "lib" / "mediaManifest.ts"
CREATORS_PATH = ROOT / "src" / "lib" / "creators.ts"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}


def to_id(handle: str) -> str:
    return re.sub(r"[^a-z0-9_]", "", handle.lower().replace("@", "").replace("-", "_"))[:24]


def safe_filename(url: str) -> str:
    base = re.sub(r"\?.*$", "", url)
    name = Path(base).name or "asset"
    name = re.sub(r"[^a-zA-Z0-9._-]", "_", name)
    return name


def read_manifest() -> list:
    if MANIFEST_PATH.exists():
        return json.loads(MANIFEST_PATH.read_text()).get("creators", [])
    return []


def write_manifest(creators: list):
    MANIFEST_PATH.write_text(json.dumps({"creators": creators, "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}, indent=2))


def load_creators_ts() -> str:
    return CREATORS_PATH.read_text()


def save_creators_ts(content: str):
    CREATORS_PATH.write_text(content)


def load_media_manifest() -> str:
    return MEDIA_MANIFEST_PATH.read_text()


def save_media_manifest(content: str):
    MEDIA_MANIFEST_PATH.write_text(content)


def infer_category(handle: str, fallback: str) -> str:
    known = {
        "maddiedreese": "netlify-shippers",
        "clarklab": "netlify-shippers",
        "rasaljaya": "netlify-shippers",
        "nealfraziertech": "netlify-shippers",
    }
    return known.get(handle.replace("@", ""), fallback)


def extract_follower_count(text: str) -> int:
    m = re.search(r"([\d,.]+)\s*([KMB]?)\s*Followers", text, re.I)
    if not m:
        return 0
    num = m.group(1).replace(",", "")
    mult = {"K": 1_000, "M": 1_000_000, "B": 1_000_000_000, "": 1}.get(m.group(2).upper(), 1)
    try:
        return int(float(num) * mult)
    except ValueError:
        return 0


def followers_str(n: int) -> str:
    if n >= 1_000_000:
        return f"{n/1_000_000:.1f}M".rstrip("0").rstrip(".") + "+"
    if n >= 1_000:
        return f"{n/1_000:.1f}K".rstrip("0").rstrip(".") + "+"
    return f"{n}+"


def download(url: str, dest: Path) -> bool:
    try:
        r = requests.get(url, headers=HEADERS, timeout=20)
        r.raise_for_status()
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(r.content)
        return True
    except Exception as e:
        print(f"  ⚠️ download failed {url}: {e}")
        return False


async def scrape_profile(handle: str) -> dict:
    handle = handle.replace("@", "")
    url = f"https://x.com/{handle}"
    result = {
        "handle": handle,
        "name": handle,
        "bio": "",
        "followers": 0,
        "followersStr": "0",
        "posts": 0,
        "avatar_url": None,
        "banner_url": None,
        "media_urls": [],
    }
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 900}, user_agent=HEADERS["User-Agent"])
        page = await context.new_page()
        await stealth.apply_stealth_async(page)
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=20000)
            await asyncio.sleep(5)

            title = await page.title()
            name_match = re.search(r"^(.+?)\s+\(@", title)
            if name_match:
                result["name"] = name_match.group(1).strip()

            metas = await page.locator('meta[name="description"]').all()
            for m in metas:
                desc = await m.get_attribute("content")
                if desc and handle.lower() in desc.lower():
                    clean = re.sub(r"^The latest posts from @\w+\.?\s*", "", desc).strip()
                    if clean:
                        result["bio"] = clean
                    break

            page_text = await page.locator("body").inner_text()
            result["followers"] = extract_follower_count(page_text)
            result["followersStr"] = followers_str(result["followers"])

            imgs = await page.locator("img").all()
            for img in imgs:
                src = await img.get_attribute("src")
                w = await img.evaluate("el => el.naturalWidth") or 0
                if src and "profile_images" in src and w >= 100:
                    result["avatar_url"] = src.replace("_normal", "_400x400")
                    break

            for img in imgs:
                src = await img.get_attribute("src")
                w = await img.evaluate("el => el.naturalWidth") or 0
                if src and "profile_banners" in src and w >= 500:
                    result["banner_url"] = src
                    break

            seen = set()
            for img in imgs:
                src = await img.get_attribute("src")
                if src and "/media/" in src and src not in seen:
                    seen.add(src)
                    result["media_urls"].append(src)
            result["media_urls"] = result["media_urls"][:6]

        except Exception as e:
            print(f"  ⚠️ scrape error: {e}")
        finally:
            await browser.close()
    return result


def update_media_manifest(cid: str, avatar: str, banner: str, media: list):
    content = load_media_manifest()
    pattern = re.compile(rf"^\s+{cid}: \{{[^}}]+\}},?\n", re.M)
    content = pattern.sub("", content)
    media_entries = ", ".join([f'"{m}"' for m in media]) or ""
    line = f'  {cid}: {{ avatar: "{avatar}", banner: "{banner}", media: [{media_entries}] }},\n'
    insert_at = content.rfind("};")
    if insert_at == -1:
        insert_at = len(content)
    content = content[:insert_at] + line + content[insert_at:]
    save_media_manifest(content)


def update_creators_ts(cid: str, handle: str, x_handle: str, name: str, bio: str,
                       followers: int, followers_str: str, avatar: str, banner: str,
                       media: list, category: str) -> bool:
    content = load_creators_ts()
    if f"id: '{cid}'" in content:
        print(f"  ⚠️ creator '{cid}' already exists in creators.ts; skipping append")
        return False

    safe_name = name.replace("'", "\\'")
    safe_bio = bio.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")

    template = f"""
  {{
    id: '{cid}',
    handle: '@{x_handle}',
    xHandle: '{x_handle}',
    status: 'draft',
    name: '{safe_name}',
    emoji: '🚀',
    avatar: CREATOR_MEDIA.{cid}.avatar || '',
    banner: CREATOR_MEDIA.{cid}.banner || '',
    followers: {followers},
    followersStr: '{followers_str}',
    bio: '{safe_bio}',
    products: [],
    pillars: [],
    milestones: [
      {{ label: 'Followers', value: '{followers_str}' }},
      {{ label: 'Projects', value: '—' }},
    ],
    media: CREATOR_MEDIA.{cid}.media,
    category: '{category}',
    theme: {{ primary: '#22d3ee', secondary: '#8b5cf6', accent: '#ec4899' }},
    plays: [],
    hooks: [],
    angles: [],
    tags: [],
  }},
"""
    array_end = content.rfind("];\n")
    if array_end == -1:
        print("  ⚠️ could not find CREATORS array end")
        return False
    content = content[:array_end] + template + content[array_end:]
    save_creators_ts(content)
    return True


def update_api_mjs(cid: str, handle: str, x_handle: str, name: str, bio: str,
                   followers: int, followers_str: str, avatar: str, banner: str,
                   media: list, category: str):
    api_path = ROOT / "netlify" / "functions" / "api.mjs"
    if not api_path.exists():
        return
    content = api_path.read_text()
    if f"id: '{cid}'" in content:
        return
    safe_name = name.replace("'", "\\'")
    safe_bio = bio.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
    media_str = ",\n      ".join([f'"{m}"' for m in media]) or ""
    template = f"""
  {{
    id: '{cid}',
    handle: '@{x_handle}',
    xHandle: '{x_handle}',
    status: 'draft',
    name: '{safe_name}',
    emoji: '🚀',
    avatar: '{avatar}',
    banner: '{banner}',
    followers: {followers},
    followersStr: '{followers_str}',
    bio: '{safe_bio}',
    products: [],
    pillars: [],
    milestones: [{{ label: 'Followers', value: '{followers_str}' }}],
    media: [{media_str}],
    category: '{category}',
    theme: {{ primary: '#22d3ee', secondary: '#8b5cf6', accent: '#ec4899' }},
    plays: [],
    hooks: [],
    angles: [],
    tags: [],
  }},
"""
    # Insert before the BASE_CREATORS array close (the first '];' that follows the array and precedes function generateIdeas)
    array_end = content.find("];\n\nfunction generateIdeas")
    if array_end == -1:
        return
    content = content[:array_end] + template + content[array_end:]
    api_path.write_text(content)


def main():
    parser = argparse.ArgumentParser(description="Add an X profile as a CreatorPlaybooks creator")
    parser.add_argument("handle", help="X handle, with or without @")
    parser.add_argument("--category", default="indie-hackers", help="Category slug")
    parser.add_argument("--name", default=None, help="Override display name")
    parser.add_argument("--no-media", action="store_true", help="Skip media download")
    args = parser.parse_args()

    handle = args.handle.replace("@", "")
    cid = to_id(handle)
    category = infer_category(handle, args.category)

    print(f"🔍 Scraping @{handle} as id '{cid}'...")
    profile = asyncio.run(scrape_profile(handle))

    name = args.name or profile["name"] or handle
    bio = profile["bio"] or f"AI Shipper building in public on X as @{handle}. Real playbook coming soon."

    out_dir = PUBLIC_CREATORS / cid
    out_dir.mkdir(parents=True, exist_ok=True)

    avatar_path = f"/creators/{cid}/avatar.jpg"
    if profile["avatar_url"]:
        ext = Path(profile["avatar_url"].split("?")[0]).suffix or ".jpg"
        dest = out_dir / f"avatar{ext}"
        if download(profile["avatar_url"], dest):
            avatar_path = f"/creators/{cid}/avatar{ext}"
            print(f"  ✅ avatar -> {avatar_path}")
        else:
            avatar_path = f"https://unavatar.io/x/{handle}"
            print(f"  ⚠️ using unavatar fallback")

    banner_path = f"/creators/{cid}/cover.png"
    if profile["banner_url"]:
        dest = out_dir / "cover.png"
        if download(profile["banner_url"], dest):
            print(f"  ✅ banner -> {banner_path}")
        else:
            banner_path = ""
    else:
        banner_path = ""

    media_paths = []
    if not args.no_media:
        for i, u in enumerate(profile["media_urls"], 1):
            ext = Path(u.split("?")[0]).suffix or ".jpg"
            if ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif"]:
                ext = ".jpg"
            dest = out_dir / f"media-{i}{ext}"
            if download(u, dest):
                media_paths.append(f"/creators/{cid}/media-{i}{ext}")
                print(f"  ✅ media-{i}")

    creators = read_manifest()
    creators = [c for c in creators if c["id"] != cid]
    creators.append({
        "id": cid,
        "avatar": avatar_path,
        "banner": banner_path,
        "media": media_paths,
    })
    write_manifest(creators)

    update_media_manifest(cid, avatar_path, banner_path, media_paths)

    added = update_creators_ts(
        cid=cid, handle=handle, x_handle=handle, name=name, bio=bio,
        followers=profile["followers"], followers_str=profile["followersStr"],
        avatar=avatar_path, banner=banner_path, media=media_paths, category=category
    )

    if added:
        update_api_mjs(
            cid=cid, handle=handle, x_handle=handle, name=name, bio=bio,
            followers=profile["followers"], followers_str=profile["followersStr"],
            avatar=avatar_path, banner=banner_path, media=media_paths, category=category
        )
        print(f"🚀 Added '{name}' (@{handle}) as draft creator in category '{category}'")
        print(f"   Next: open src/lib/creators.ts and source real plays/products/pillars for '{cid}'")
    else:
        print(f"⚠️ Did not append to creators.ts (already present)")


if __name__ == "__main__":
    main()
