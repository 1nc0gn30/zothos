import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const baseUrl = process.env.APLUS_BASE_URL || 'http://localhost:4322';
const routes = [
  '/',
  '/pricing',
  '/masterclass',
  '/healthcare-engineers',
  '/resources',
  '/projects',
  '/blog',
  '/checkout',
  '/product/starter-plan',
  '/product/growth-plan',
  '/case-studies/phi-scrubber',
  '/wiki/ui',
  '/wiki/managed-service',
  '/wiki/custom-cluster',
  '/projects/anantaraya',
  '/blog-posts/why-strong-branding-matters-in-the-digital-era',
  '/information-pages/style-guide',
  '/401',
  '/404',
];
const viewports = [
  { name: 'desktop', width: 1440, height: 1100 },
  { name: 'mobile', width: 390, height: 1100 },
];

const requiredVisible = [
  'Healthcare Hackathon Heroes',
  'Healthcare Software Factory',
  'AI Practice Audit',
  'worked examples',
  'LinkedIn',
  'YouTube',
  'Substack',
  'private-practice',
  'documentation burden',
  'Podcast Guest Launch',
  'Proof of humanity',
  'Designed by Healthcare Engineers',
];

const routeRequiredVisible = {
  '/projects': [
    'Worked examples',
    'Demo discipline',
    'Proof should show the route',
  ],
  '/blog': [
    'Content flywheel',
    'Retainer path',
    'Every field note should come from a worked example',
  ],
  '/checkout': [
    'Choose by current state',
    'DIY / DWY / DFY',
    'Community purchase',
    'Event calendar',
    'Book with us',
  ],
  '/product/starter-plan': [
    'Worked example library',
    'Small wins compound',
    'Healthcare Engineers',
  ],
  '/product/growth-plan': [
    'Discovery, demo, ROI',
    'Workflow audit',
    'Managed LinkedIn',
  ],
  '/case-studies/phi-scrubber': [
    'Synthetic examples',
    'Demo-safe artifacts',
    'Slack handoff',
  ],
  '/wiki/ui': [
    'Metacognition steering',
    'recommendation, evidence, safety note, and next action',
    'Mobile conversion',
  ],
  '/wiki/managed-service': [
    'DWY before DFY',
    'When to productize',
    'Forms',
  ],
  '/wiki/custom-cluster': [
    'Current stack first',
    'Source of truth',
    'Last-mile plan',
  ],
  '/projects/anantaraya': [
    'Slug compatibility',
    'proof routers',
    'Discovery handoff',
  ],
  '/blog-posts/why-strong-branding-matters-in-the-digital-era': [
    'Content flywheel',
    'Retainer path',
    'Every field note should come from a worked example',
  ],
  '/information-pages/style-guide': [
    'Compatibility route',
    'Substack',
    'Stripe',
    'Cal.com',
  ],
  '/401': [
    'Private access',
    'Back-office handoff',
    'Slack onboarding',
  ],
  '/404': [
    'Fallback path',
    'weekly events',
    'LinkedIn streams',
  ],
};

const forbiddenVisible = [
  'NEXIA',
  'NEXA',
  'Customize Template',
  'Unlock 200+ Template',
  'nexia.contact@gmail.com',
];

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const failures = [];
const results = [];

for (const route of routes) {
  for (const viewport of viewports) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });
    const url = `${baseUrl}${route}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(700);

    const text = await page.locator('body').innerText();
    const normalizedText = text.toLowerCase();
    const hrefs = await page.locator('[data-aplus-link]').evaluateAll((links) =>
      links.map((link) => ({
        key: link.getAttribute('data-aplus-link'),
        href: link.getAttribute('href'),
        text: link.textContent?.trim() || '',
      })),
    );

    for (const needle of requiredVisible) {
      if (!normalizedText.includes(needle.toLowerCase())) failures.push(`${route} ${viewport.name} missing visible text: ${needle}`);
    }
    for (const needle of routeRequiredVisible[route] || []) {
      if (!normalizedText.includes(needle.toLowerCase())) failures.push(`${route} ${viewport.name} missing route-specific visible text: ${needle}`);
    }
    for (const residue of forbiddenVisible) {
      if (normalizedText.includes(residue.toLowerCase())) failures.push(`${route} ${viewport.name} contains forbidden visible text: ${residue}`);
    }

    const keys = new Set(hrefs.map((item) => item.key));
    for (const key of ['collective', 'retainer', 'newsletter', 'calendar', 'podcast']) {
      if (!keys.has(key)) failures.push(`${route} ${viewport.name} missing rendered CTA key: ${key}`);
    }

    results.push({
      route,
      viewport: viewport.name,
      title: await page.title(),
      ctas: hrefs,
    });
    await page.close();
  }
}

await browser.close();

const summary = {
  ok: failures.length === 0,
  failures,
  checked: results.length,
  results,
};

const outDir = path.join(process.cwd(), 'artifacts');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'verify-aplus-browser.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
if (failures.length) process.exit(1);
