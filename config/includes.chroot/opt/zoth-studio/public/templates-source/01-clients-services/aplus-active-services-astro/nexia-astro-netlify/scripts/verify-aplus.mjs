import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const requiredRoutes = [
  'index.html',
  'about/index.html',
  'pricing/index.html',
  'contact/index.html',
  'masterclass/index.html',
  'healthcare-engineers/index.html',
  'projects/index.html',
  'blog/index.html',
  'wiki/index.html',
  'resources/index.html',
  'checkout/index.html',
  'product/starter-plan/index.html',
  'product/growth-plan/index.html',
  'case-studies/pneumonia-discharge-memory/index.html',
  'case-studies/phi-scrubber/index.html',
  'wiki/workflow/index.html',
  'wiki/ui/index.html',
  'wiki/managed-service/index.html',
  'wiki/custom-cluster/index.html',
  'projects/anantaraya/index.html',
  'projects/aureva/index.html',
  'projects/legolas/index.html',
  'projects/morph/index.html',
  'projects/steelcrest/index.html',
  'blog-posts/why-strong-branding-matters-in-the-digital-era/index.html',
  'blog-posts/the-role-of-user-experience-in-conversion-rates/index.html',
  'blog-posts/harnessing-social-media-for-brand-awareness/index.html',
  'blog-posts/the-importance-of-mobile-optimization/index.html',
  'blog-posts/innovative-branding-strategies-for-startups/index.html',
  'blog-posts/leveraging-social-media-for-brand-awareness/index.html',
  'blog-posts/the-impact-of-consistent-messaging-across-platforms/index.html',
  'blog-posts/the-role-of-user-experience-in-brand-loyalty/index.html',
  'information-pages/style-guide/index.html',
  'information-pages/license/index.html',
  'information-pages/changelog/index.html',
  '401/index.html',
  '404.html',
];

const requiredText = [
  'Healthcare Hackathon Heroes',
  'Healthcare Software Factory',
  'compound intelligence',
  'natural intelligence',
  'AI Practice Audit',
  'means, motivation',
  'worked examples',
  'LinkedIn',
  'YouTube',
  'Slack',
  'Substack',
  'Twitter/X',
  'private-practice',
  'documentation burden',
  'staffing',
  'implementation friction',
  'Podcast Guest Launch',
  'Designed by Healthcare Engineers',
  'Proof of humanity',
];

const routeRequiredText = {
  'projects/index.html': [
    'Proof strategy',
    'Worked examples',
    'Demo discipline',
  ],
  'blog/index.html': [
    'Field-note acquisition strategy',
    'Content flywheel',
    'Retainer path',
    'Medication Reconciliation Copilot',
    'Documentation Assistant For After-Hours Charting',
    'Digital Health Podcast',
  ],
  'checkout/index.html': [
    'Choose by current state',
    'DIY / DWY / DFY',
    'Community purchase',
    'Event calendar',
    'Book with us',
  ],
  'product/starter-plan/index.html': [
    'Worked example library',
    'Small wins compound',
    'Healthcare Engineers',
    'Strategy games',
  ],
  'product/growth-plan/index.html': [
    'Discovery, demo, ROI',
    'Workflow audit',
    'Managed LinkedIn',
  ],
  'case-studies/phi-scrubber/index.html': [
    'Synthetic examples',
    'Demo-safe artifacts',
    'Slack handoff',
  ],
  'wiki/workflow/index.html': [
    'Discovery hierarchy',
    'Small win',
  ],
  'wiki/ui/index.html': [
    'Metacognition steering',
    'recommendation, evidence, safety note, and next action',
    'Mobile conversion',
  ],
  'wiki/managed-service/index.html': [
    'DWY before DFY',
    'When to productize',
    'Forms',
  ],
  'wiki/custom-cluster/index.html': [
    'Current stack first',
    'Source of truth',
    'Last-mile plan',
  ],
  'projects/anantaraya/index.html': [
    'Slug compatibility',
    'proof routers',
    'Discovery handoff',
  ],
  'projects/aureva/index.html': [
    'Slug compatibility',
    'proof routers',
    'Discovery handoff',
  ],
  'projects/legolas/index.html': [
    'Slug compatibility',
    'proof routers',
    'Discovery handoff',
  ],
  'projects/morph/index.html': [
    'Slug compatibility',
    'proof routers',
    'Discovery handoff',
  ],
  'projects/steelcrest/index.html': [
    'Slug compatibility',
    'proof routers',
    'Discovery handoff',
  ],
  'blog-posts/why-strong-branding-matters-in-the-digital-era/index.html': [
    'Content flywheel',
    'Retainer path',
    'Every field note should come from a worked example',
    'Medication Reconciliation Copilot',
    'Mini quest',
  ],
  'blog-posts/the-role-of-user-experience-in-conversion-rates/index.html': [
    'Content flywheel',
    'Retainer path',
    'Every field note should come from a worked example',
  ],
  'blog-posts/harnessing-social-media-for-brand-awareness/index.html': [
    'Content flywheel',
    'Retainer path',
    'Every field note should come from a worked example',
  ],
  'blog-posts/the-importance-of-mobile-optimization/index.html': [
    'Content flywheel',
    'Retainer path',
    'Every field note should come from a worked example',
  ],
  'blog-posts/innovative-branding-strategies-for-startups/index.html': [
    'Content flywheel',
    'Retainer path',
    'Every field note should come from a worked example',
  ],
  'blog-posts/leveraging-social-media-for-brand-awareness/index.html': [
    'Content flywheel',
    'Retainer path',
    'Every field note should come from a worked example',
  ],
  'blog-posts/the-impact-of-consistent-messaging-across-platforms/index.html': [
    'Content flywheel',
    'Retainer path',
    'Every field note should come from a worked example',
  ],
  'blog-posts/the-role-of-user-experience-in-brand-loyalty/index.html': [
    'Content flywheel',
    'Retainer path',
    'Every field note should come from a worked example',
  ],
  'information-pages/style-guide/index.html': [
    'Compatibility route',
    'Substack',
    'Stripe',
    'Cal.com',
  ],
  'information-pages/license/index.html': [
    'Compatibility route',
    'Substack',
    'Stripe',
    'Cal.com',
  ],
  'information-pages/changelog/index.html': [
    'Compatibility route',
    'Substack',
    'Stripe',
    'Cal.com',
  ],
  '401/index.html': [
    'Private access',
    'Back-office handoff',
    'Slack onboarding',
  ],
  '404.html': [
    'Fallback path',
    'weekly events',
    'LinkedIn streams',
  ],
};

const routeRequiredStructure = {
  'projects/index.html': [
    'section projects-hero',
    'collection-list showcase',
    'blog-item w-inline-block',
  ],
  'blog/index.html': [
    'section blog-hero',
    'blog-list-wrapper',
    'insight-item w-inline-block',
  ],
  'projects/anantaraya/index.html': [
    'wrapper project-single',
    'project-banner',
    'related-projects',
  ],
  'projects/aureva/index.html': [
    'wrapper project-single',
    'project-banner',
    'related-projects',
  ],
  'projects/legolas/index.html': [
    'wrapper project-single',
    'project-banner',
    'related-projects',
  ],
  'projects/morph/index.html': [
    'wrapper project-single',
    'project-banner',
    'related-projects',
  ],
  'projects/steelcrest/index.html': [
    'wrapper project-single',
    'project-banner',
    'related-projects',
  ],
};

for (const route of requiredRoutes) {
  if (route.startsWith('blog-posts/')) {
    routeRequiredStructure[route] = [
      'blog-banner',
      'blog-details w-richtext',
      'blog-list-wrapper blogs-related',
    ];
  }
}

const forbiddenVisible = [
  'NEXA',
  'NEXIA',
  'Webflow Ecommerce website template',
  'premium Webflow template',
  'Customize Template',
  'Unlock 200+ Template',
  'nexia.contact@gmail.com',
  '75, rue Pacifique',
];

const warnings = [];
const failures = [];

function readDist(relativePath) {
  const file = path.join(dist, relativePath);
  if (!fs.existsSync(file)) {
    failures.push(`Missing built route: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

for (const route of requiredRoutes) {
  const html = readDist(route);
  if (!html) continue;
  const normalizedHtml = html.toLowerCase();
  for (const text of requiredText) {
    if (!normalizedHtml.includes(text.toLowerCase())) failures.push(`${route} missing required text: ${text}`);
  }
  for (const text of routeRequiredText[route] || []) {
    if (!normalizedHtml.includes(text.toLowerCase())) failures.push(`${route} missing route-specific text: ${text}`);
  }
  for (const text of routeRequiredStructure[route] || []) {
    if (!html.includes(text)) failures.push(`${route} missing preserved Webflow structure: ${text}`);
  }
  for (const text of forbiddenVisible) {
    if (html.includes(text)) failures.push(`${route} still contains forbidden residue: ${text}`);
  }
}

const config = fs.readFileSync(path.join(root, 'public/aplus-config.js'), 'utf8');
for (const placeholder of ['REPLACE_COLLECTIVE_197', 'REPLACE_FACTORY_RETAINER_3000_QTR', 'REPLACE_APLUS_ACTIVE']) {
  if (config.includes(placeholder)) warnings.push(`Integration placeholder still present in public/aplus-config.js: ${placeholder}`);
}

for (const key of ['trio', 'imageUrl', 'calendarUrl']) {
  if (!config.includes(key)) failures.push(`public/aplus-config.js missing team/proof config key: ${key}`);
}

const summary = {
  ok: failures.length === 0,
  failures,
  warnings,
  checkedRoutes: requiredRoutes.length,
};

const outDir = path.join(root, 'artifacts');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'verify-aplus.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
if (failures.length) process.exit(1);
