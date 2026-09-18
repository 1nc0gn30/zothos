const baseUrl = process.env.APLUS_BASE_URL || 'http://localhost:4322';
const routes = [
  '/',
  '/about',
  '/projects',
  '/blog',
  '/pricing',
  '/contact',
  '/masterclass',
  '/healthcare-engineers',
  '/wiki',
  '/wiki/workflow',
  '/wiki/ui',
  '/wiki/managed-service',
  '/wiki/custom-cluster',
  '/case-studies/pneumonia-discharge-memory',
  '/case-studies/phi-scrubber',
  '/resources',
  '/product/starter-plan',
  '/product/growth-plan',
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
  '/information-pages/style-guide',
  '/information-pages/license',
  '/information-pages/changelog',
  '/401',
  '/404',
];

const failures = [];

for (const route of routes) {
  const response = await fetch(`${baseUrl}${route}`);
  if (response.status !== 200) {
    failures.push({ route, status: response.status });
  }
}

const summary = {
  ok: failures.length === 0,
  checked: routes.length,
  baseUrl,
  failures,
};

console.log(JSON.stringify(summary, null, 2));
if (failures.length) process.exit(1);
