import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const sourceBaseUrl = process.env.SOURCE_BASE_URL || 'https://nexia-agency.webflow.io';
const targetBaseUrl = process.env.APLUS_BASE_URL || 'http://localhost:4323';
const outDir = path.join(process.cwd(), 'artifacts/screen-inventory');

const webflowRoutes = [
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

const fullCloneRoutes = new Set([
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
]);

const routeMarkers = {
  '/projects': ['section.projects-hero', '.collection-list.showcase', '.blog-item'],
  '/blog': ['section.blog-hero', '.blog-list-wrapper', '.insight-item'],
  '/product/starter-plan': ['section.pricing-single', '.wrapper.pricing-single', '.pricing-block', '.pricing-infos', '.pricing-3'],
  '/product/growth-plan': ['section.pricing-single', '.wrapper.pricing-single', '.pricing-block', '.pricing-infos', '.pricing-3'],
  '/projects/anantaraya': ['.wrapper.project-single', '.project-banner', '.related-projects'],
  '/projects/aureva': ['.wrapper.project-single', '.project-banner', '.related-projects'],
  '/projects/legolas': ['.wrapper.project-single', '.project-banner', '.related-projects'],
  '/projects/morph': ['.wrapper.project-single', '.project-banner', '.related-projects'],
  '/projects/steelcrest': ['.wrapper.project-single', '.project-banner', '.related-projects'],
};

for (const route of webflowRoutes) {
  if (route.startsWith('/blog-posts/')) {
    routeMarkers[route] = ['.blog-banner', '.blog-details', '.blog-list-wrapper.blogs-related'];
  }
}

function routeId(route) {
  return route === '/' ? 'home' : route.replace(/^\//, '').replaceAll('/', '__');
}

async function inspect(page, baseUrl, route, markers) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(800);
  return page.evaluate(({ markerSelectors }) => {
    const count = (selector) => document.querySelectorAll(selector).length;
    const text = document.body?.innerText || '';
    return {
      title: document.title,
      sections: count('section'),
      images: count('img'),
      links: count('a'),
      buttons: count('.primary-button'),
      dynLists: count('.w-dyn-list'),
      dynItems: count('.w-dyn-item'),
      webflowNavs: count('.w-nav'),
      pageWrappers: count('.page-wrapper'),
      mainWrappers: count('.main-wrapper'),
      offerPanels: count('.aplus-offer-panel'),
      routeLayers: count('.aplus-screen-stack'),
      markers: Object.fromEntries(markerSelectors.map((selector) => [selector, count(selector)])),
      hasAplusOffer: text.includes('Healthcare Software Factory') && text.includes('Healthcare Hackathon Heroes'),
      hasForbiddenResidue: /NEXIA|NEXA|nexia\.contact@gmail\.com|Customize Template|Unlock 200\+ Template/.test(text),
    };
  }, { markerSelectors: markers });
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const results = [];
const failures = [];

for (const route of webflowRoutes) {
  const markers = routeMarkers[route] || ['.page-wrapper', '.main-wrapper'];
  const sourcePage = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
  const targetPage = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
  try {
    console.log(`[screen-inventory] ${route}`);
    const source = await inspect(sourcePage, sourceBaseUrl, route, markers);
    const target = await inspect(targetPage, targetBaseUrl, route, markers);
    const result = {
      route,
      mode: fullCloneRoutes.has(route) ? 'webflow-preserved' : 'customized-compatible',
      source,
      target,
    };
    results.push(result);

    if (fullCloneRoutes.has(route)) {
      if (!target.pageWrappers || !target.mainWrappers) failures.push(`${route} missing Webflow page/main wrappers`);
      if (target.sections < Math.max(1, source.sections - 1)) failures.push(`${route} lost too many sections: source ${source.sections}, target ${target.sections}`);
      if (target.images < Math.floor(source.images * 0.7)) failures.push(`${route} lost too many images: source ${source.images}, target ${target.images}`);
      if (target.dynLists < Math.max(0, source.dynLists - 1)) failures.push(`${route} lost dynamic list structure: source ${source.dynLists}, target ${target.dynLists}`);
      for (const [selector, count] of Object.entries(target.markers)) {
        if (!count) failures.push(`${route} missing marker ${selector}`);
      }
    }

    if (!target.hasAplusOffer) failures.push(`${route} missing A+ offer ladder language`);
    if (target.hasForbiddenResidue) failures.push(`${route} has forbidden visible residue`);
  } catch (error) {
    failures.push(`${route} inspection failed: ${error.message}`);
  } finally {
    await sourcePage.close();
    await targetPage.close();
  }
}

await browser.close();

const summary = {
  ok: failures.length === 0,
  sourceBaseUrl,
  targetBaseUrl,
  checked: results.length,
  failures,
  results,
};

fs.writeFileSync(path.join(outDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);

const markdown = [
  '# Screen Inventory Verification',
  '',
  `Source: ${sourceBaseUrl}`,
  `Target: ${targetBaseUrl}`,
  `Checked: ${results.length}`,
  `Status: ${summary.ok ? 'PASS' : 'FAIL'}`,
  '',
  '| Route | Mode | Source sections/images/lists | Target sections/images/lists | Markers |',
  '| --- | --- | --- | --- | --- |',
  ...results.map((result) => {
    const markers = Object.entries(result.target.markers)
      .map(([selector, count]) => `${selector}:${count}`)
      .join('<br>');
    return `| \`${result.route}\` | ${result.mode} | ${result.source.sections}/${result.source.images}/${result.source.dynLists} | ${result.target.sections}/${result.target.images}/${result.target.dynLists} | ${markers || '-'} |`;
  }),
  '',
  ...(failures.length ? ['## Failures', '', ...failures.map((failure) => `- ${failure}`)] : []),
  '',
].join('\n');

fs.writeFileSync(path.join(outDir, 'summary.md'), markdown);
console.log(JSON.stringify({ ok: summary.ok, checked: summary.checked, failures: summary.failures }, null, 2));
if (failures.length) process.exit(1);
