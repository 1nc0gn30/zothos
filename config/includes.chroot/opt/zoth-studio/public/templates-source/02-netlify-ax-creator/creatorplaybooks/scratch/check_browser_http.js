import { URL } from 'url';

async function main() {
  const wsUrlStr = process.env.AGY_BROWSER_WS_URL;
  if (!wsUrlStr) {
    console.error("AGY_BROWSER_WS_URL not found in env");
    return;
  }
  console.log(`Extracting port from WS URL: ${wsUrlStr}`);
  try {
    const wsUrl = new URL(wsUrlStr);
    const port = wsUrl.port;
    const httpUrl = `http://127.0.0.1:${port}/json/list`;
    console.log(`Fetching tabs from ${httpUrl}...`);
    const res = await fetch(httpUrl);
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    const tabs = await res.json();
    console.log("Open Tabs:");
    for (const tab of tabs) {
      console.log(`- Title: "${tab.title}"\n  URL: ${tab.url}\n  Type: ${tab.type}`);
    }
  } catch (err) {
    console.error(`Failed to get tabs: ${err.message}`);
  }
}

main();
