import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
const sourceFiles = fs.readdirSync('src/pages', { recursive: true }).filter((file) => String(file).endsWith('.astro')).map((file) => path.join('src/pages', file));
const text = sourceFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const urls = [...new Set([...text.matchAll(/https:\/\/[^"'<>\s]+\.js(?:\?[^"'<>\s]*)?/g)].map((m) => m[0].replace(/&amp;/g, '&')))];
const outDir = path.resolve('public/assets/js');
fs.mkdirSync(outDir, { recursive: true });
const previous = fs.existsSync(path.join(outDir, 'manifest.json')) ? JSON.parse(fs.readFileSync(path.join(outDir, 'manifest.json'), 'utf8')).assets || {} : {};
const manifest = { ...previous };
function safeName(url) { return decodeURIComponent(new URL(url).pathname.split('/').pop()).replace(/[^a-zA-Z0-9._-]+/g, '-'); }
function download(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return resolve({ ok: true, skipped: true });
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) { file.close(() => fs.unlink(dest,()=>{})); return resolve({ ok:false, status:res.statusCode }); }
      res.pipe(file); file.on('finish', () => file.close(() => resolve({ ok:true })));
    }).on('error', err => { file.close(() => fs.unlink(dest,()=>{})); resolve({ ok:false, error:err.message }); });
  });
}
const failures = [];
for (const url of urls) {
  const dest = path.join(outDir, safeName(url));
  const result = await download(url, dest);
  if (result.ok) manifest[url] = `/assets/js/${safeName(url)}`; else failures.push({ url, result });
}
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify({ assets: manifest, failures }, null, 2));
console.log(JSON.stringify({ requested: urls.length, available: Object.keys(manifest).length, failed: failures.length, failures }, null, 2));
