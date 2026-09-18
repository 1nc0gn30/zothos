import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const targets = ['src/pages', 'dist'];
const ignored = [
  'dist/assets/js',
  'dist/assets/webflow-bundle',
  'dist/aplus-bindings.js',
  'dist/aplus-overrides.css',
];

const blockers = [
  /w-commerce/i,
  /data-wf-cart/i,
  /__WEBFLOW_CURRENCY_SETTINGS/,
  /data-commerce-sku-id/i,
  /add to cart/i,
  /buy now/i,
  /checkout is disabled/i,
  /continue to checkout/i,
  /before you purchase/i,
  /onixtheme/i,
  /nexia\.contact@gmail\.com/i,
  /subject=nexia\.contact%40gmail\.com/i,
  /tel:\+4321234567/i,
  /Webflow Ecommerce website template/i,
  /end-to-end digital services/i,
  /comprehensive digital services/i,
  /mobile app development/i,
  /Customize Template/i,
  /Unlock 200\+ Template/i,
];

const knownDebt = [
  /Aureva|Morph|Legolas|Anantaraya|Steelcrest/,
  /Why Strong Branding Matters|Harnessing Social Media|Leveraging Social Media|Mobile Optimization|Brand Loyalty|User Experience/,
  /Style guide|Changelog|Password|License/,
  /Top Rated Agency|Trusted Digital Growth Partner|creative digital agency/i,
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const relative = path.relative(root, full);
    if (ignored.some((prefix) => relative.startsWith(prefix))) continue;
    if (entry.isDirectory()) files.push(...walk(full));
    else if (/\.(astro|html|js|css)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function findMatches(patterns) {
  const matches = [];
  for (const target of targets) {
    for (const file of walk(path.join(root, target))) {
      const text = fs.readFileSync(file, 'utf8');
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          matches.push({
            file: path.relative(root, file),
            pattern: pattern.source,
          });
        }
      }
    }
  }
  return matches;
}

const blockerMatches = findMatches(blockers);
const debtMatches = findMatches(knownDebt);
const config = fs.readFileSync(path.join(root, 'public/aplus-config.js'), 'utf8');
const placeholderWarnings = ['REPLACE_COLLECTIVE_197', 'REPLACE_FACTORY_RETAINER_3000_QTR', 'REPLACE_APLUS_ACTIVE']
  .filter((placeholder) => config.includes(placeholder));

const summary = {
  ok: blockerMatches.length === 0,
  blockers: blockerMatches,
  warnings: [
    ...placeholderWarnings.map((placeholder) => `Integration placeholder still present: ${placeholder}`),
    ...debtMatches.map((match) => `Known template/content debt: ${match.file} :: ${match.pattern}`),
  ],
};

fs.mkdirSync(path.join(root, 'artifacts'), { recursive: true });
fs.writeFileSync(path.join(root, 'artifacts/verify-aplus-source.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
if (!summary.ok) process.exit(1);
