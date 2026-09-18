import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { chromium } from 'playwright';

const liveBaseUrl = process.env.CLONE_LIVE_BASE_URL || 'https://nexia-agency.webflow.io';
const cloneBaseUrl = process.env.CLONE_BASE_URL || 'http://localhost:4323';
const threshold = Number(process.env.CLONE_MISMATCH_THRESHOLD || '0.02');
const outDir = path.join(process.cwd(), 'artifacts/fidelity/current');

const allRoutes = [
  '/',
  '/about',
  '/projects',
  '/blog',
  '/pricing',
  '/contact',
  '/projects/anantaraya',
  '/projects/aureva',
  '/projects/legolas',
  '/projects/morph',
  '/projects/steelcrest',
  '/blog-posts/why-strong-branding-matters-in-the-digital-era',
  '/blog-posts/the-role-of-user-experience-in-conversion-rates',
  '/blog-posts/harnessing-social-media-for-brand-awareness',
  '/blog-posts/the-importance-of-mobile-optimization',
  '/blog-posts/innovative-branding-strategies-for-startups',
  '/blog-posts/leveraging-social-media-for-brand-awareness',
  '/blog-posts/the-impact-of-consistent-messaging-across-platforms',
  '/blog-posts/the-role-of-user-experience-in-brand-loyalty',
  '/product/starter-plan',
  '/product/growth-plan',
  '/information-pages/style-guide',
  '/information-pages/license',
  '/information-pages/changelog',
  '/401',
  '/404',
  '/checkout',
];

const allViewports = [
  { name: 'desktop', width: 1440, height: 1100 },
  { name: 'mobile', width: 390, height: 1100 },
];

function envList(name) {
  return (process.env[name] || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

const routeFilter = envList('CLONE_ROUTES');
const viewportFilter = envList('CLONE_VIEWPORTS');
const routes = routeFilter.length ? allRoutes.filter((route) => routeFilter.includes(route)) : allRoutes;
const viewports = viewportFilter.length
  ? allViewports.filter((viewport) => viewportFilter.includes(viewport.name))
  : allViewports;

if (!routes.length) {
  throw new Error(`No routes matched CLONE_ROUTES=${process.env.CLONE_ROUTES}`);
}

if (!viewports.length) {
  throw new Error(`No viewports matched CLONE_VIEWPORTS=${process.env.CLONE_VIEWPORTS}`);
}

function routeId(route) {
  if (route === '/') return 'home';
  return route.replace(/^\//, '').replaceAll('/', '__');
}

async function capture(page, baseUrl, route, file) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await page.screenshot({ path: file, fullPage: true, animations: 'disabled' });
}

function comparePng(liveFile, cloneFile, diffFile) {
  const live = PNG.sync.read(fs.readFileSync(liveFile));
  const clone = PNG.sync.read(fs.readFileSync(cloneFile));
  const width = Math.min(live.width, clone.width);
  const height = Math.min(live.height, clone.height);
  const liveCrop = new PNG({ width, height });
  const cloneCrop = new PNG({ width, height });
  PNG.bitblt(live, liveCrop, 0, 0, width, height, 0, 0);
  PNG.bitblt(clone, cloneCrop, 0, 0, width, height, 0, 0);
  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(liveCrop.data, cloneCrop.data, diff.data, width, height, {
    threshold: 0.1,
    includeAA: false,
  });
  fs.writeFileSync(diffFile, PNG.sync.write(diff));
  const comparedPixels = width * height;
  return {
    mismatchRatio: Number((mismatched / comparedPixels).toFixed(4)),
    comparedPixels,
    liveSize: `${live.width}x${live.height}`,
    cloneSize: `${clone.width}x${clone.height}`,
  };
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const results = [];
const errors = [];

for (const route of routes) {
  for (const viewport of viewports) {
    console.log(`[clone-fidelity] ${route} ${viewport.name}`);
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const id = `${routeId(route)}__${viewport.name}`;
    const liveFile = path.join(outDir, `${id}__live.png`);
    const cloneFile = path.join(outDir, `${id}__clone.png`);
    const diffFile = path.join(outDir, `${id}__diff.png`);
    try {
      await capture(page, liveBaseUrl, route, liveFile);
      await capture(page, cloneBaseUrl, route, cloneFile);
      const result = comparePng(liveFile, cloneFile, diffFile);
      results.push({ route, viewport: viewport.name, ...result });
      if (result.mismatchRatio > threshold) {
        errors.push(`${route} ${viewport.name} mismatch ${result.mismatchRatio} > ${threshold}`);
      }
    } catch (error) {
      errors.push(`${route} ${viewport.name} failed: ${error.message}`);
    } finally {
      await context.close();
    }
  }
}

await browser.close();

const worst = [...results].sort((a, b) => b.mismatchRatio - a.mismatchRatio).slice(0, 12);
const summary = {
  ok: errors.length === 0,
  liveBaseUrl,
  cloneBaseUrl,
  threshold,
  checked: results.length,
  errors,
  worst,
  results,
};

fs.writeFileSync(path.join(outDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
if (errors.length) process.exit(1);
