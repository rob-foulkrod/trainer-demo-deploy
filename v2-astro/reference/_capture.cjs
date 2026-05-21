// Capture reference screenshots for the v2-astro spec.
// Writes into spec/v2-astro/reference/.
// Run with the spike dev server live at http://localhost:4321.

const path = require('path');
const playwrightDir = 'C:\\Users\\robfoulkrod\\AppData\\Roaming\\npm\\node_modules\\playwright';
const { chromium } = require(playwrightDir);

const OUT = (name) => path.resolve(__dirname, name);

(async () => {
  const browser = await chromium.launch();

  // 1) Nine OPX carousel frames at the home page (light mode, 990x800)
  {
    const ctx = await browser.newContext({
      viewport: { width: 990, height: 800 },
      deviceScaleFactor: 1,
      reducedMotion: 'no-preference',
    });
    const page = await ctx.newPage();
    await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const frames = [
      { name: 'home-azure-start',  waitAfter: 500   },
      { name: 'home-azure-mid',    waitAfter: 15000 },
      { name: 'home-azure-end',    waitAfter: 12000 },
      { name: 'home-cps-start',    waitAfter: 6000  },
      { name: 'home-cps-mid',      waitAfter: 18000 },
      { name: 'home-cps-end',      waitAfter: 14000 },
      { name: 'home-stress-start', waitAfter: 6000  },
      { name: 'home-stress-mid',   waitAfter: 18000 },
      { name: 'home-stress-end',   waitAfter: 15000 },
    ];
    for (let i = 0; i < frames.length; i++) {
      if (i > 0) await page.waitForTimeout(frames[i].waitAfter);
      const out = OUT(`${frames[i].name}.png`);
      await page.screenshot({ path: out });
      console.log('saved', frames[i].name);
    }
    await ctx.close();
  }

  // 2) Home full-page tall (990x1200)
  {
    const ctx = await browser.newContext({ viewport: { width: 990, height: 1200 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: OUT('home-full.png'), fullPage: true });
    console.log('saved home-full');
    await ctx.close();
  }

  // 3) Home dark mode (force .dark via localStorage and class)
  {
    const ctx = await browser.newContext({
      viewport: { width: 990, height: 800 },
      deviceScaleFactor: 1,
      colorScheme: 'dark',
    });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      try { localStorage.setItem('theme', 'dark'); } catch (e) {}
    });
    await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(800);
    await page.screenshot({ path: OUT('home-dark.png') });
    console.log('saved home-dark');
    await ctx.close();
  }

  // 4) Gallery
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto('http://localhost:4321/gallery', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: OUT('gallery.png') });
    console.log('saved gallery');
    await ctx.close();
  }

  // 5) BYOD Azure
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto('http://localhost:4321/byod-azure', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: OUT('byod-azure.png'), fullPage: true });
    console.log('saved byod-azure');
    await ctx.close();
  }

  // 6) BYOD Copilot Studio
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto('http://localhost:4321/byod-copilot-studio', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: OUT('byod-copilot-studio.png'), fullPage: true });
    console.log('saved byod-copilot-studio');
    await ctx.close();
  }

  await browser.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
