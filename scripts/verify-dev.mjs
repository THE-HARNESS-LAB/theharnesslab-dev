// Headless browser gate for theharnesslab.dev (desktop + mobile + monographs + security.txt).
//   python3 -m http.server 4180 --bind 127.0.0.1   (from the repo root)
//   PLAYWRIGHT_MODULE=… CHROMIUM_PATH=/usr/bin/google-chrome-stable node scripts/verify-dev.mjs
// Deliberately outside tests/ so `node --test tests/*.test.mjs` stays pure.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = (process.env.DEV_URL || 'http://127.0.0.1:4180/').replace(/\/?$/, '/');
const out = process.env.VERIFY_OUTPUT || '.verify-output';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}),
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
});
const results = [];
const errors = [];
const failed = [];

// Elements whose right edge escapes the viewport (scroll containers and closed
// dialogs excluded). body uses overflow-x: clip, so page scrollWidth alone
// would hide real overflow.
const overflowing = (page) =>
  page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const bad = [];
    for (const el of document.querySelectorAll('header *, main *, footer *')) {
      if (el.closest('.ledger-chart-scroll, dialog:not([open]), .skip, [hidden]')) continue;
      let clipped = false;
      for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
        if (getComputedStyle(n).overflowX !== 'visible') {
          clipped = true;
          break;
        }
      }
      if (clipped) continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (r.right > vw + 1 || r.left < -1) {
        bad.push(`${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}.${[...el.classList].join('.')} (${Math.round(r.left)}→${Math.round(r.right)})`);
        if (bad.length > 8) break;
      }
    }
    return bad;
  });

const checkA11yNames = (page) =>
  page.evaluate(() => ({
    buttonsNoName: [...document.querySelectorAll('button')].filter(
      (b) => !(b.innerText.trim() || b.getAttribute('aria-label') || b.title),
    ).length,
    imgsNoAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
    focusablePreNoLabel: [...document.querySelectorAll('pre[tabindex]')].filter(
      (p) => !p.getAttribute('aria-label'),
    ).length,
  }));

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`${m.text()} @ ${m.location()?.url || page.url()}`);
  });
  page.on('response', (r) => {
    if (r.url().startsWith(base) && r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });

  // 1. Verify /.well-known/security.txt (RFC 9116 text/plain endpoint)
  const secRes = await page.request.get(new URL('.well-known/security.txt', base).href);
  assert.equal(secRes.status(), 200, 'security.txt HTTP 200');
  assert.match(secRes.headers()['content-type'] || '', /text\/plain/i, 'security.txt text/plain content-type');
  const secBody = (await secRes.text()).trim();
  assert.match(secBody, /^Contact:\s*mailto:sales@theharnesslab\.com$/m);
  assert.match(secBody, /^Expires:\s*2027-11-18T00:00:00Z$/m);
  assert.match(secBody, /^Preferred-Languages:\s*en$/m);
  assert.match(secBody, /^Canonical:\s*https:\/\/theharnesslab\.dev\/\.well-known\/security\.txt$/m);
  results.push('/.well-known/security.txt returns HTTP 200 (text/plain) with exact SHARED-FACTS §9 fields.');

  // 2. Main Foundry page (/) at desktop 1440x900
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base, { waitUntil: 'networkidle' });
  assert.match(await page.title(), /Harness Lab/);
  assert.equal(await page.locator('h1').count(), 1);
  assert.deepEqual(await checkA11yNames(page), { buttonsNoName: 0, imgsNoAlt: 0, focusablePreNoLabel: 0 });
  for (const id of ['perihelion-loop', 'harness-vitrine', 'title-engines', 'architecture', 'execution-lab', 'systems', 'verification-kit', 'field-notes', 'build-ledger', 'contact']) {
    assert.equal(await page.locator(`#${id}`).count(), 1, id);
  }
  assert.equal(await page.locator('.contact-hazard-tape').count(), 1);
  assert.equal(await page.locator('#contact .contact-hazard-tape').count(), 1);
  results.push('All chapters present in order-critical ids; single H1; zero unnamed buttons/images/focusable code blocks; hazard tape only on #contact.');

  // Perihelion cockpit tabs + interactive button wrapper + ArrowLeft/ArrowRight lightbox keyboard navigation
  await page.locator('#cockpit-tab-1').click();
  assert.match(await page.locator('[data-cockpit-title]').innerText(), /Typed Execution Graph/);
  await page.locator('#cockpit-tab-0').click();
  const cockpitStageZoom = page.locator('button[data-cockpit-stage-zoom]');
  assert.equal(await cockpitStageZoom.count(), 1);
  await cockpitStageZoom.click();
  const periDialog = page.locator('#perihelion-lightbox');
  assert.equal(await periDialog.evaluate((d) => d.open), true);
  assert.equal(await periDialog.locator('[data-lightbox-counter]').textContent(), '1 / 5');
  await page.keyboard.press('ArrowRight');
  assert.equal(await periDialog.locator('[data-lightbox-counter]').textContent(), '2 / 5');
  await page.keyboard.press('ArrowLeft');
  assert.equal(await periDialog.locator('[data-lightbox-counter]').textContent(), '1 / 5');
  await page.keyboard.press('Escape');
  assert.equal(await periDialog.evaluate((d) => d.open), false);
  assert.ok(await cockpitStageZoom.evaluate((el) => el === document.activeElement), 'cockpit stage button focus restored');
  results.push('Perihelion cockpit stage button opens #perihelion-lightbox, steps via ArrowRight/ArrowLeft, and restores focus on Escape.');

  // Galleries: every tab swaps the stage; zoom opens the shared lightbox with
  // working prev/next; Escape closes and focus returns to the zoom button.
  for (const id of ['rogue-agents', 'titledesk-web', 'titledesk-desktop', 'artificial-landman']) {
    const g = page.locator(`[data-gallery="${id}"]`);
    await g.scrollIntoViewIfNeeded();
    const tabs = g.locator('[data-gallery-tab]');
    const n = await tabs.count();
    const seen = new Set();
    for (let i = 0; i < n; i++) {
      await tabs.nth(i).click();
      assert.equal(await tabs.nth(i).getAttribute('aria-selected'), 'true');
      const img = g.locator('[data-gallery-img]');
      await img.evaluate((el) => el.decode());
      seen.add(await img.getAttribute('src'));
    }
    assert.equal(seen.size, n, `${id}: each tab shows a distinct screen`);
    const zoom = g.locator('[data-gallery-zoom]');
    await zoom.click();
    const dialog = page.locator('#showcase-lightbox');
    assert.equal(await dialog.evaluate((d) => d.open), true);
    const before = await dialog.locator('[data-lightbox-img]').getAttribute('src');
    await dialog.locator('[data-lightbox-next]').click();
    assert.notEqual(await dialog.locator('[data-lightbox-img]').getAttribute('src'), before);
    await dialog.locator('[data-lightbox-img]').evaluate((el) => el.decode());
    await page.keyboard.press('Escape');
    assert.equal(await dialog.evaluate((d) => d.open), false);
    assert.ok(await zoom.evaluate((el) => el === document.activeElement), `${id}: focus restored`);
  }
  results.push('Rogue Agents (4), TitleDesk (5), TitleDesk Agent (8) and Artificial Landman (5) galleries switch, zoom, page and close with focus restored.');

  // Single screenshot buttons (harness card + every build card that has one).
  const shots = page.locator('[data-lightbox-src]');
  const shotCount = await shots.count();
  assert.ok(shotCount >= 22, `expected ≥22 screenshot buttons, found ${shotCount}`);
  for (let i = 0; i < shotCount; i++) {
    await shots.nth(i).click();
    const dialog = page.locator('#showcase-lightbox');
    assert.equal(await dialog.evaluate((d) => d.open), true);
    await dialog.locator('[data-lightbox-img]').evaluate((el) => el.decode());
    await page.keyboard.press('Escape');
    assert.equal(await dialog.evaluate((d) => d.open), false);
  }
  results.push(`All ${shotCount} build/harness screenshots open full-resolution in the lightbox, decode, and close on Escape.`);

  // War-Ledger campaign tabs.
  for (const id of ['brandstreams', 'foundry', 'titledesk']) {
    await page.locator(`#trench-tab-${id}`).click();
    assert.equal(await page.locator(`#trench-panel-${id}`).isVisible(), true);
    assert.equal(await page.locator('[data-trench-panel]:visible').count(), 1);
  }
  results.push('War-Ledger campaign tabs show exactly one campaign at a time.');

  // Ledger filters + details toggles.
  const count = page.locator('[data-ledger-count]');
  const visibleCards = () => page.locator('[data-build-tiers]:visible').count();
  assert.equal(await visibleCards(), 27);
  for (const [label, check] of [
    ['Flagship Platforms', (n) => n >= 6 && n < 27],
    ['Harnesses & Security', (n) => n >= 6 && n < 27],
    ['Rapid Sprints', (n) => n >= 10 && n < 27],
    ['All 27 Builds', (n) => n === 27],
  ]) {
    await page.getByRole('button', { name: label, exact: true }).click();
    const n = await visibleCards();
    assert.ok(check(n), `${label}: ${n}`);
    assert.equal(await count.textContent(), `${n} of 27 builds shown`);
  }
  const firstCard = page.locator('#build-titledesk');
  for (const summary of ['Architecture & stack', 'AI Model Landscape at the Time', 'Verbatim Git Trail']) {
    await firstCard.locator('summary', { hasText: summary }).click();
  }
  assert.equal(await firstCard.locator('details[open]').count(), 3);
  assert.match(await firstCard.innerText(), /exact|instrument/i);
  await page.locator('a.tl-row[href="#build-rogue-agents"]').click();
  assert.equal(new URL(page.url()).hash, '#build-rogue-agents');
  results.push('Tier filters partition the 27 builds with a live count; dossier toggles open; timeline bars jump to their build cards.');

  // Every rendered image decodes (lazy ones are scrolled into view first).
  await page.goto(base, { waitUntil: 'networkidle' });
  for (const img of await page.locator('main img:not(dialog img)').all()) {
    if (!(await img.isVisible())) continue;
    await img.scrollIntoViewIfNeeded();
    await img.evaluate((el) => el.decode());
  }
  results.push('Every visible image on the Foundry home page decodes.');

  // Overflow sweep + navigation + mobile 390px H1 spacing check.
  for (const width of [320, 390, 768, 1024, 1180, 1200, 1440, 1920]) {
    const height = width === 390 ? 844 : 900;
    await page.setViewportSize({ width, height });
    await page.evaluate(() => window.scrollTo(0, 0));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `page overflow at ${width}`);
    const bad = await overflowing(page);
    assert.deepEqual(bad, [], `elements overflow at ${width}px`);
    if (width === 390) {
      const h1Text = await page.locator('h1').innerText();
      assert.match(h1Text.replace(/\n/g, ' '), /harnesses\s+&\s+deterministic/i, `mobile H1 must separate 'harnesses &' at 390px: got ${JSON.stringify(h1Text)}`);
      assert.doesNotMatch(h1Text, /harnesses&/i);
    }
    if (width <= 1180) {
      const toggle = page.locator('[data-nav-toggle]');
      await toggle.click();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
      await page.locator('#main-nav').getByRole('link', { name: 'VII Build Ledger' }).click();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      assert.equal(new URL(page.url()).hash, '#build-ledger');
    }
  }
  results.push('No element overflows at 320..1920 px; mobile H1 preserves space in "harnesses &"; mobile navigation opens, jumps and closes.');

  // Save desktop (1440x900) and mobile (390x844) hero + section screenshots
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${out}/desktop-hero.png` });
  for (const id of ['harness-vitrine', 'title-engines', 'build-ledger']) {
    await page.locator(`#${id}`).screenshot({ path: `${out}/desktop-${id}.png`, style: '.site-header, .skip { visibility: hidden !important; }' });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${out}/mobile-hero.png` });
  for (const id of ['title-engines', 'build-ledger']) {
    await page.locator(`#${id}`).screenshot({ path: `${out}/mobile-${id}.png`, style: '.site-header, .skip { visibility: hidden !important; }' });
  }

  // 3. Crawl all 3 Monographs at desktop (1440x900) and mobile (390x844)
  const monographs = [
    'landman-title-systems/',
    'workflow-automation-engineering/',
    'business-software-engineering/',
  ];
  for (const sub of monographs) {
    const url = new URL(sub, base).href;
    for (const vp of [
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'mobile', width: 390, height: 844 },
    ]) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const res = await page.goto(url, { waitUntil: 'networkidle' });
      assert.equal(res?.status(), 200, `${sub} HTTP 200`);
      assert.equal(await page.locator('h1').count(), 1, `${sub} single H1`);
      assert.deepEqual(await checkA11yNames(page), { buttonsNoName: 0, imgsNoAlt: 0, focusablePreNoLabel: 0 }, `${sub} a11y names`);
      for (const img of await page.locator('main img').all()) {
        if (!(await img.isVisible())) continue;
        await img.scrollIntoViewIfNeeded();
        await img.evaluate((el) => el.decode());
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${sub} scrollWidth overflow at ${vp.width}px`);
      assert.deepEqual(await overflowing(page), [], `${sub} element overflow at ${vp.width}px`);
      if (vp.name === 'mobile') {
        const toggle = page.locator('[data-nav-toggle]');
        await toggle.click();
        assert.equal(await toggle.getAttribute('aria-expanded'), 'true', `${sub} mobile nav open`);
        await page.keyboard.press('Escape');
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false', `${sub} mobile nav close`);
      }
    }
  }
  results.push('All 3 monographs (/landman-title-systems/, /workflow-automation-engineering/, /business-software-engineering/) verified at 1440x900 and 390x844 with zero overflow, decoded images, and working mobile nav.');

  assert.deepEqual(failed, []);
  assert.deepEqual(errors, []);
  results.push('Zero JavaScript/console errors and zero failed local assets across all routes; desktop and mobile screenshots saved.');
  const report = { checkedAt: new Date().toISOString(), base, results, errors, failed };
  await writeFile(`${out}/verification.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
