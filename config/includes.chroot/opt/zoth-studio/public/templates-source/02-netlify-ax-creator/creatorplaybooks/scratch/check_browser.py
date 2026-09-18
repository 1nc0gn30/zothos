import asyncio
import os
from playwright.async_api import async_playwright

async def main():
    ws_url = os.environ.get("AGY_BROWSER_WS_URL")
    if not ws_url:
        print("AGY_BROWSER_WS_URL not found in env")
        return
    print(f"Connecting to browser at {ws_url}...")
    try:
        async with async_playwright() as p:
            browser = await p.chromium.connect_over_cdp(ws_url)
            print("Connected successfully.")
            for i, context in enumerate(browser.contexts):
                print(f"Context {i}:")
                for j, page in enumerate(context.pages):
                    print(f"  Page {j}: {page.url} - {await page.title()}")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())
