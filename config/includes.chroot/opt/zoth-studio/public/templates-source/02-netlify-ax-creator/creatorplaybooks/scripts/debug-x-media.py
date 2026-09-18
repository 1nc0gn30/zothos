#!/usr/bin/env python3
"""Debug script: inspect what data is available on X profile pages via Playwright."""
import asyncio
from playwright.async_api import async_playwright
from playwright_stealth import Stealth

stealth = Stealth()

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 900})
        page = await context.new_page()
        await stealth.apply_stealth_async(page)

        await page.goto("https://x.com/buildwithmaya", wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(4)

        # Try to find banner in computed styles
        banner = await page.evaluate("""
            () => {
                const all = Array.from(document.querySelectorAll('*'));
                const found = all.map(el => {
                    const bg = window.getComputedStyle(el).backgroundImage;
                    return bg && bg.includes('profile_banners') ? bg : null;
                }).filter(Boolean);
                return found.slice(0, 3);
            }
        """)
        print("banner bg:", banner)

        # Try window initial state
        init = await page.evaluate("() => { try { return window.__INITIAL_STATE__; } catch { return null; } }")
        if init and isinstance(init, dict):
            print("has initial state keys:", list(init.keys())[:10])
        else:
            print("initial state type:", type(init))

        # Network interception would be ideal, but just check img tags for media
        media = await page.evaluate("""
            () => Array.from(document.querySelectorAll('img[src*=\"pbs.twimg.com/media\"]')).map(i => i.src).slice(0, 5)
        """)
        print("media:", media)

        await browser.close()

asyncio.run(main())
