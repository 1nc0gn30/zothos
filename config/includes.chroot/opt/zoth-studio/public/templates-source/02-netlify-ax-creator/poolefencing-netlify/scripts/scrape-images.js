const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const url = 'https://app.gohighlevel.com/v2/preview/rEjNUgerTgeMWUkCIVhD?notrack=true';
  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  
  await page.evaluate(async () => {
    for (let i = 0; i < 10; i++) {
      window.scrollBy(0, window.innerHeight);
      await new Promise(r => setTimeout(r, 500));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(2000);
  
  const imageData = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.map(img => ({
      src: img.src,
      alt: img.alt,
      width: img.naturalWidth,
      height: img.naturalHeight,
      className: img.className,
      id: img.id
    }));
  });
  
  const bgImages = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll('*').forEach(el => {
      const style = window.getComputedStyle(el);
      const bg = style.backgroundImage;
      if (bg && bg !== 'none' && bg.includes('url(')) {
        const match = bg.match(/url(["']?([^"')]+)["']?)/);
        if (match) results.push(match[1]);
      }
    });
    document.querySelectorAll('[style]').forEach(el => {
      const match = el.getAttribute('style').match(/url(["']?([^"')]+)["']?)/);
      if (match && !results.includes(match[1])) results.push(match[1]);
    });
    return [...new Set(results)];
  });
  
  const logoData = await page.evaluate(() => {
    const selectors = [
      'header img', '.navbar img', '.nav img', '[class*="logo"] img',
      'img[class*="logo"]', 'a[href="/"] img', 'a[href="#"] img',
      '.brand img', '.site-branding img', '#logo img', 'img[alt*="logo" i]',
      'img[src*="logo" i]', '[class*="header"] img'
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.src) return { src: el.src, alt: el.alt, selector: sel };
    }
    const header = document.querySelector('header, .header, [class*="header"]');
    if (header) {
      const img = header.querySelector('img');
      if (img) return { src: img.src, alt: img.alt, selector: 'header-first-img' };
    }
    return null;
  });
  
  console.log('--- IMAGES ---');
  console.log(JSON.stringify(imageData, null, 2));
  console.log('--- BG IMAGES ---');
  console.log(JSON.stringify(bgImages, null, 2));
  console.log('--- LOGO ---');
  console.log(JSON.stringify(logoData, null, 2));
  
  await browser.close();
})();
