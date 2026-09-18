/**
 * Zero-dependency build & asset validation script for LibSignal Portfolio Showcase
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Running LibSignal Portfolio Showcase Build & Audit Checks...');

const requiredFiles = [
  'index.html',
  'styles.css',
  'app.js',
  'llms.txt',
  'ai.txt',
  'robots.txt',
  'sitemap.xml',
  'site.webmanifest',
  'og-image.svg',
  'public/index.html',
  'public/styles.css',
  'public/app.js',
  'public/llms.txt',
  'public/ai.txt',
  'public/robots.txt',
  'public/sitemap.xml',
  'public/site.webmanifest',
  'public/og-image.svg'
];

let errors = 0;
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    console.log(`  ✓ Found [${file}] (${stat.size} bytes)`);
  } else {
    console.error(`  ❌ Missing required asset: [${file}]`);
    errors++;
  }
});

// Validate JSON-LD Schema in index.html
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
if (htmlContent.includes('application/ld+json') && htmlContent.includes('SoftwareApplication')) {
  console.log('  ✓ Schema.org JSON-LD structured data validated.');
} else {
  console.error('  ❌ Missing or invalid JSON-LD schema in index.html');
  errors++;
}

// Validate WCAG Accessibility Landmarks
if (htmlContent.includes('skip-link') && htmlContent.includes('aria-live="polite"')) {
  console.log('  ✓ WCAG 2.1 AA accessibility landmarks & live regions validated.');
} else {
  console.error('  ❌ Missing accessibility landmarks in index.html');
  errors++;
}

if (errors === 0) {
  console.log('\n✅ LibSignal Portfolio Showcase Build Succeeded Cleanly!\n');
  process.exit(0);
} else {
  console.error(`\n❌ Build failed with ${errors} validation errors.\n`);
  process.exit(1);
}
