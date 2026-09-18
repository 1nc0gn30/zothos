#!/usr/bin/env python3
"""
Self-healing X/Twitter profile scraper for CreatorPlaybooks.

What it does:
  - Reads a list of creator handles from environment or defaults
  - For each handle, attempts to fetch the public /username page via Playwright+stealth
  - Extracts: bio, follower count, following count, posts count, recent tweets
  - Falls back through 3 stealth strategies, then returns cached/empty data
  - Pushes normalized profile + posts to Netlify Blobs

Env vars:
  NETLIFY_SITE_ID       required — Netlify site id
  NETLIFY_ACCESS_TOKEN  required — personal access token
  HANDLES               optional — comma-separated X handles (no @)
  BLOB_STORE            default 'creator-sync'

Run locally or schedule 3x/day with cron.
"""
import asyncio
import json
import os
import random
import re
import sys
import time
from datetime import datetime, timezone
from typing import Any

import requests
from playwright.async_api import async_playwright, Page, Browser, BrowserContext
from playwright_stealth import Stealth

stealth = Stealth()

OUTPUT_DIR = os.environ.get('OUTPUT_DIR', 'dist/sync-output')
SITE_ID = os.environ.get('NETLIFY_SITE_ID')
TOKEN = os.environ.get('NETLIFY_ACCESS_TOKEN')
BLOB_STORE = os.environ.get('BLOB_STORE', 'creator-sync')
DEFAULT_HANDLES = [
    'buildwithmaya',
    'thisiskp_',
    'zeng_wt',
    'halfmage',
    'ChaiWithJai',
    'NealFrazierTech',
]
HANDLES = [h.strip().lstrip('@') for h in os.environ.get('HANDLES', '').split(',') if h.strip()] or DEFAULT_HANDLES


def log(msg: str):
    print(f"[{datetime.now(timezone.utc).isoformat()}] {msg}", flush=True)


def netlify_blob_put(handle: str, data: dict) -> bool:
    """Write JSON to local file for later Netlify CLI upload."""
    try:
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        path = os.path.join(OUTPUT_DIR, f"{handle}.json")
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        log(f"Wrote {handle} to {path}")
        return True
    except Exception as e:
        log(f"Failed to write {handle}: {e}")
        return False


def parse_count(text: str | None) -> int:
    if not text:
        return 0
    text = text.replace(',', '').strip()
    multipliers = {'K': 1_000, 'M': 1_000_000, 'B': 1_000_000_000}
    match = re.match(r"([0-9.]+)\s*([KMB]?)", text, re.I)
    if not match:
        return 0
    num, suffix = match.groups()
    try:
        val = float(num)
    except ValueError:
        return 0
    return int(val * multipliers.get(suffix.upper(), 1))


def sleep_jitter(min_sec: float = 2.0, max_sec: float = 5.0):
    time.sleep(random.uniform(min_sec, max_sec))


async def block_resources(page: Page):
    """Block heavy assets to speed up loads and reduce fingerprint noise."""
    await page.route(
        "**/*",
        lambda route, request: route.abort() if request.resource_type in {"image", "media", "font", "stylesheet"} else route.continue_(),
    )


async def extract_profile(page: Page, handle: str) -> dict:
    """Extract public profile fields from an X profile page."""
    data = {
        "handle": handle,
        "xUrl": f"https://x.com/{handle}",
        "scrapedAt": datetime.now(timezone.utc).isoformat(),
        "source": "playwright-stealth",
        "bio": "",
        "displayName": "",
        "followers": 0,
        "following": 0,
        "posts": 0,
        "joined": "",
        "location": "",
        "website": "",
        "verified": False,
        "avatar": f"https://unavatar.io/twitter/{handle}?fallback=false",
        "banner": "",
        "recentTweets": [],
        "ok": False,
        "error": None,
    }

    try:
        await page.goto(f"https://x.com/{handle}", wait_until="domcontentloaded", timeout=15000)
        await page.wait_for_load_state("networkidle", timeout=8000)
    except Exception as e:
        log(f"Goto/networkidle error for {handle}: {e}")
        data["error"] = str(e)
        return data

    await asyncio.sleep(random.uniform(1, 2))

    # Detect login wall / rate limit quickly
    body_text = (await page.inner_text("body")).lower()
    if "rate limit" in body_text or "verify" in body_text:
        log(f"X served gate for {handle}: {body_text[:120]}")
        data["error"] = "X rate-limit wall"
        return data
    # Note: X often renders public profile data alongside a "log in" CTA, so we keep scraping.
    try:
        data["displayName"] = await page.locator("h1").first.inner_text(timeout=3000)
    except Exception:
        pass

    # Bio
    try:
        bio_el = page.locator("[data-testid='UserDescription']")
        if await bio_el.count() > 0:
            data["bio"] = (await bio_el.inner_text()).strip()
    except Exception:
        pass

    # Followers / following from tab labels
    try:
        tabs = await page.locator("a[href*='following'], a[href*='followers']").all_inner_texts()
        for tab in tabs:
            tab = tab.replace('\n', ' ')
            m = re.search(r"([0-9.,]+[KMB]?)\s+Following", tab, re.I)
            if m:
                data["following"] = parse_count(m.group(1))
            m = re.search(r"([0-9.,]+[KMB]?)\s+Followers", tab, re.I)
            if m:
                data["followers"] = parse_count(m.group(1))
    except Exception as e:
        log(f"Follower extraction error for {handle}: {e}")

    # Posts count
    try:
        posts_text = await page.locator("h2").first.inner_text(timeout=3000)
        m = re.search(r"([0-9.,]+[KMB]?)\s+post", posts_text, re.I)
        if m:
            data["posts"] = parse_count(m.group(1))
    except Exception:
        pass

    # Recent tweets
    tweets = []
    try:
        tweet_cells = await page.locator("article[data-testid='tweet']").all()
        for cell in tweet_cells[:8]:
            try:
                text = await cell.locator("[data-testid='tweetText']").inner_text(timeout=1500)
                time_el = cell.locator("time").first
                created_at = await time_el.get_attribute("datetime") if await time_el.count() else None
                tweets.append({"text": text.strip(), "createdAt": created_at})
            except Exception:
                continue
    except Exception as e:
        log(f"Tweet extraction error for {handle}: {e}")

    data["recentTweets"] = tweets
    data["ok"] = bool(data["bio"] or data["followers"] or tweets or data["displayName"])
    return data


async def scrape_with_strategy(handle: str, strategy: dict) -> dict:
    """One attempt with a specific browser context configuration."""
    data = {"handle": handle, "ok": False}
    browser: Browser | None = None
    context: BrowserContext | None = None

    async with async_playwright() as p:
        try:
            browser = await p.chromium.launch(
                headless=True,
                args=[
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-blink-features=AutomationControlled",
                ],
            )
            context = await browser.new_context(
                viewport={"width": strategy["width"], "height": strategy["height"]},
                user_agent=strategy["ua"],
                locale=strategy["locale"],
                timezone_id=strategy["timezone"],
            )
            page = await context.new_page()
            await stealth.apply_stealth_async(page)
            await block_resources(page)
            data = await extract_profile(page, handle)
        except Exception as e:
            log(f"Strategy error for {handle}: {e}")
            data["error"] = str(e)
        finally:
            if context:
                await context.close()
            if browser:
                await browser.close()

    return data


async def scrape_profile(handle: str) -> dict:
    """Try multiple stealth strategies, return best result."""
    strategies = [
        {"width": 1280, "height": 800, "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36", "locale": "en-US", "timezone": "America/New_York"},
        {"width": 1440, "height": 900, "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36", "locale": "en-GB", "timezone": "Europe/London"},
        {"width": 1920, "height": 1080, "ua": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "locale": "en-US", "timezone": "America/Los_Angeles"},
    ]

    best: dict = {"handle": handle, "ok": False}
    for i, strategy in enumerate(strategies, 1):
        log(f"Strategy {i}/3 for {handle}")
        result = await scrape_with_strategy(handle, strategy)
        if result.get("ok"):
            return result
        if not best.get("bio"):
            best = result
        sleep_jitter(3, 8)

    return best


async def main():
    log(f"Starting sync for {len(HANDLES)} handles")
    successes = 0
    for handle in HANDLES:
        try:
            result = await scrape_profile(handle)
            if netlify_blob_put(handle, result):
                successes += 1
            sleep_jitter(5, 12)
        except Exception as e:
            log(f"Fatal error for {handle}: {e}")

    log(f"Done. Wrote {successes}/{len(HANDLES)} profiles to {OUTPUT_DIR}")
    if successes > 0:
        log("Next: run ./scripts/push-to-blobs.sh to upload via Netlify CLI")


if __name__ == "__main__":
    asyncio.run(main())
