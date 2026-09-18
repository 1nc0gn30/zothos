import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const sourceFiles = [
  ...fs.readdirSync('src/pages', { recursive: true }).filter((file) => String(file).endsWith('.astro')).map((file) => path.join('src/pages', file)),
  'public/assets/webflow-bundle/c36a0562fb6b95e9.css',
];
const text = sourceFiles.map((file) => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '').join('\n');
const urls = new Set();
for (const m of text.matchAll(/https:\/\/cdn\.prod\.website-files\.com\/[^"'<>\s]+/g)) {
  let url = m[0].replace(/&amp;/g, '&');
  url = url.replace(/[),.;]+$/, '');
  if (/\.(svg|webp|png|jpg|jpeg|json|riv)(\?|$)/i.test(url)) urls.add(url);
}
const outDir = path.resolve('public/assets/cdn');
fs.mkdirSync(outDir, { recursive: true });
const previous = fs.existsSync(path.join(outDir, 'manifest.json')) ? JSON.parse(fs.readFileSync(path.join(outDir, 'manifest.json'), 'utf8')).assets || {} : {};
const manifest = { ...previous };
function filenameFor(url) {
  const u = new URL(url);
  const raw = decodeURIComponent(path.basename(u.pathname));
  const safe = raw.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  const prefix = u.pathname.split('/').filter(Boolean).slice(-2, -1)[0].slice(0, 8);
  return `${prefix}-${safe}`;
}
function download(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return resolve({ ok: true, skipped: true });
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close(() => fs.unlink(dest, () => {}));
        return resolve(download(new URL(res.headers.location, url).href, dest));
      }
      if (res.statusCode !== 200) {
        file.close(() => fs.unlink(dest, () => {}));
        return resolve({ ok: false, status: res.statusCode });
      }
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve({ ok: true })));
    }).on('error', (err) => {
      file.close(() => fs.unlink(dest, () => {}));
      resolve({ ok: false, error: err.message });
    });
  });
}
const failures = [];
for (const url of urls) {
  const name = filenameFor(url);
  const dest = path.join(outDir, name);
  const result = await download(url, dest);
  if (result.ok) manifest[url] = `/assets/cdn/${name}`;
  else failures.push({ url, result });
}
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify({ downloadedAt: new Date().toISOString(), assets: manifest, failures }, null, 2));
console.log(JSON.stringify({ requested: urls.size, available: Object.keys(manifest).length, failed: failures.length, failures }, null, 2));
