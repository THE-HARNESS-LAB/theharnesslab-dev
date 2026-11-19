// The Harness Lab (.dev) — showcase galleries, shared lightbox, War-Ledger tabs
// and the 27-build evolution ledger. Pure helpers are exported for
// tests/ledger.test.mjs; DOM wiring runs only in a browser.
// engineering.mjs (state machines + Perihelion cockpit) is intentionally untouched.

export const DAY_MS = 86400000;
export const AVG_MONTH_DAYS = 30.4375;
export const RAPID_SPRINT = '1 Month (Rapid Sprint)';

/** Whole months from first to latest commit, always rounded UP; < 1 month is a Rapid Sprint. */
export function wholeMonthLabel(startIso, endIso) {
  const start = Date.parse(startIso);
  const end = Date.parse(endIso);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    throw new RangeError(`invalid commit window ${startIso} → ${endIso}`);
  }
  const months = (end - start) / DAY_MS / AVG_MONTH_DAYS;
  if (months < 1) return RAPID_SPRINT;
  const n = Math.ceil(months);
  return n === 1 ? '1 Month' : `${n} Months`;
}

export const WHOLE_MONTH_PATTERN = /^(1 Month \(Rapid Sprint\)|1 Month|([2-9]|1[0-9]|2[0-4]) Months)$/;

export const LEDGER_FILTERS = Object.freeze([
  { id: 'all', label: (n) => `All ${n} Builds` },
  { id: 'flagship', label: () => 'Flagship Platforms' },
  { id: 'harness', label: () => 'Harnesses & Security' },
  { id: 'rapid', label: () => 'Rapid Sprints' },
]);

export function filterBuilds(builds, tier = 'all') {
  if (tier === 'all') return builds.slice();
  if (!LEDGER_FILTERS.some((f) => f.id === tier)) throw new RangeError(`unknown tier ${tier}`);
  return builds.filter((b) => b.tiers.includes(tier));
}

export const formatInt = (n) => Number(n).toLocaleString('en-US');

/** Outbound hosts theharnesslab.dev may link to from the showcase and ledger. */
export const DEV_LINK_HOSTS = Object.freeze([
  'theharnesslab.com',
  'theharnesslab.dev',
  'title-desk.com',
  'desktop.title-desk.com',
  'artificiallandman.io',
  'brandstream.my',
  'apex-build.dev',
  'www.cloudroom.dev',
  'the-harness-lab.github.io',
  'github.com',
  'fonts.googleapis.com',
]);
/** github.com is permitted only for the public THE-HARNESS-LAB/titledesk repository. */
export function isAllowedDevLink(href) {
  if (!/^https?:/i.test(href)) return true;
  const url = new URL(href);
  const host = url.hostname.toLowerCase();
  if (!DEV_LINK_HOSTS.includes(host)) return false;
  if (host === 'github.com') return /^\/THE-HARNESS-LAB\/titledesk(\/|$)/.test(url.pathname);
  return true;
}

/**
 * Geometry for the parallel-build timeline. Pure: same input → same SVG.
 * Returns one row per build with x/width in viewBox units, plus month ticks
 * and the peak number of builds in flight in any calendar month.
 */
export function timelineGeometry(builds, opts = {}) {
  const {
    start = '2025-07-01T00:00:00',
    end = '2026-12-01T00:00:00',
    width = 1200,
    labelWidth = 260,
    rowHeight = 22,
    top = 40,
    minBar = 6,
  } = opts;
  const t0 = Date.parse(start);
  const t1 = Date.parse(end);
  const span = t1 - t0;
  const chartWidth = width - labelWidth - 16;
  const x = (t) => labelWidth + ((Math.min(Math.max(t, t0), t1) - t0) / span) * chartWidth;
  const rows = builds.map((b, i) => {
    const a = Date.parse(b.firstCommitIso);
    const z = Date.parse(b.latestCommitIso);
    const x0 = x(a);
    const w = Math.max(minBar, x(z) - x0);
    return { slug: b.slug, y: top + i * rowHeight, x: +x0.toFixed(1), w: +w.toFixed(1) };
  });
  const ticks = [];
  const d = new Date(t0);
  while (d.getTime() <= t1) {
    ticks.push({ x: +x(d.getTime()).toFixed(1), month: d.getMonth(), year: d.getFullYear() });
    d.setMonth(d.getMonth() + 1);
  }
  let peak = { count: 0, label: '' };
  for (let i = 0; i < ticks.length - 1; i++) {
    const m0 = new Date(ticks[i].year, ticks[i].month, 1).getTime();
    const m1 = new Date(ticks[i].year, ticks[i].month + 1, 1).getTime();
    const count = builds.filter((b) => Date.parse(b.firstCommitIso) < m1 && Date.parse(b.latestCommitIso) >= m0).length;
    if (count >= peak.count) {
      peak = { count, label: new Date(m0).toLocaleString('en-US', { month: 'long', year: 'numeric' }) };
    }
  }
  return { rows, ticks, peak, height: top + builds.length * rowHeight + 18, width, labelWidth };
}

// ---------------------------------------------------------------------------
// Browser wiring
// ---------------------------------------------------------------------------

function createLightbox(doc) {
  const dialog = doc.getElementById('showcase-lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return null;
  const img = dialog.querySelector('[data-lightbox-img]');
  const title = dialog.querySelector('[data-lightbox-title]');
  const counter = dialog.querySelector('[data-lightbox-counter]');
  const caption = dialog.querySelector('[data-lightbox-caption]');
  const prev = dialog.querySelector('[data-lightbox-prev]');
  const next = dialog.querySelector('[data-lightbox-next]');
  let items = [];
  let index = 0;
  let trigger = null;
  let onIndex = null;
  const render = () => {
    const item = items[index];
    img.src = item.src;
    img.alt = item.alt || '';
    if (item.width) img.width = item.width;
    if (item.height) img.height = item.height;
    title.textContent = item.title || '';
    caption.textContent = item.caption || '';
    counter.textContent = `${index + 1} / ${items.length}`;
    const multi = items.length > 1;
    prev.hidden = !multi;
    next.hidden = !multi;
    onIndex?.(index);
  };
  const step = (dir) => {
    index = (index + dir + items.length) % items.length;
    render();
  };
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  dialog.querySelector('[data-lightbox-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', (e) => {
    if (items.length < 2) return;
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  dialog.addEventListener('close', () => {
    trigger?.focus?.();
    onIndex = null;
  });
  return {
    open(list, start, from, sync) {
      items = list;
      index = start;
      trigger = from;
      onIndex = sync || null;
      render();
      dialog.showModal();
    },
  };
}

function mountGalleries(doc, lightbox) {
  doc.querySelectorAll('[data-gallery]').forEach((root) => {
    const data = root.querySelector('script[type="application/json"][data-gallery-items]');
    if (!data) return;
    const items = JSON.parse(data.textContent);
    const tabs = [...root.querySelectorAll('[data-gallery-tab]')];
    const panel = root.querySelector('[data-gallery-panel]');
    const img = root.querySelector('[data-gallery-img]');
    const zoom = root.querySelector('[data-gallery-zoom]');
    const code = root.querySelector('[data-gallery-code]');
    const title = root.querySelector('[data-gallery-title]');
    const caption = root.querySelector('[data-gallery-caption]');
    let active = 0;
    const select = (i, focus = false) => {
      active = (i + items.length) % items.length;
      const item = items[active];
      tabs.forEach((tab, t) => {
        const on = t === active;
        tab.setAttribute('aria-selected', String(on));
        tab.classList.toggle('is-active', on);
        tab.tabIndex = on ? 0 : -1;
        if (on && focus) tab.focus();
      });
      if (panel && tabs[active]) panel.setAttribute('aria-labelledby', tabs[active].id);
      img.loading = 'eager';
      img.srcset = `${item.src640} 640w, ${item.src} ${item.width}w`;
      img.src = item.src;
      img.alt = item.alt;
      code.textContent = `${String(active + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')} · ${item.group}`;
      title.textContent = item.title;
      caption.textContent = item.caption;
      zoom.setAttribute('aria-label', `Inspect full-resolution screen: ${item.title}`);
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i));
      tab.addEventListener('keydown', (e) => {
        if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
        e.preventDefault();
        if (e.key === 'Home') select(0, true);
        else if (e.key === 'End') select(items.length - 1, true);
        else select(i + (e.key === 'ArrowRight' ? 1 : -1), true);
      });
    });
    zoom?.addEventListener('click', () => {
      lightbox?.open(items, active, zoom, (i) => select(i));
    });
  });
}

function mountSingleShots(doc, lightbox) {
  doc.querySelectorAll('[data-lightbox-src]').forEach((btn) => {
    btn.addEventListener('click', () => {
      lightbox?.open(
        [
          {
            src: btn.dataset.lightboxSrc,
            alt: btn.dataset.lightboxAlt,
            title: btn.dataset.lightboxTitle,
            caption: btn.dataset.lightboxCaption,
            width: Number(btn.dataset.lightboxWidth) || undefined,
            height: Number(btn.dataset.lightboxHeight) || undefined,
          },
        ],
        0,
        btn,
      );
    });
  });
}

function mountTabs(doc, tabSelector, panelSelector, key) {
  const tabs = [...doc.querySelectorAll(tabSelector)];
  const panels = [...doc.querySelectorAll(panelSelector)];
  if (!tabs.length) return;
  const select = (id, focus) => {
    tabs.forEach((tab) => {
      const on = tab.dataset[key] === id;
      tab.setAttribute('aria-selected', String(on));
      tab.classList.toggle('is-active', on);
      tab.tabIndex = on ? 0 : -1;
      if (on && focus) tab.focus();
    });
    panels.forEach((p) => {
      p.hidden = p.dataset[key] !== id;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab.dataset[key]));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      select(next.dataset[key], true);
    });
  });
}

function mountLedgerFilters(doc) {
  const buttons = [...doc.querySelectorAll('[data-ledger-filter]')];
  const cards = [...doc.querySelectorAll('[data-build-tiers]')];
  const bars = [...doc.querySelectorAll('[data-bar-tiers]')];
  const count = doc.querySelector('[data-ledger-count]');
  if (!buttons.length) return;
  const apply = (tier) => {
    let shown = 0;
    cards.forEach((card) => {
      const on = tier === 'all' || card.dataset.buildTiers.split(' ').includes(tier);
      card.hidden = !on;
      if (on) shown += 1;
    });
    bars.forEach((bar) => {
      const on = tier === 'all' || bar.dataset.barTiers.split(' ').includes(tier);
      bar.classList.toggle('is-dimmed', !on);
    });
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.ledgerFilter === tier)));
    if (count) count.textContent = `${shown} of ${cards.length} builds shown`;
  };
  buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.ledgerFilter)));
}

export function mountShowcase(doc = document) {
  const lightbox = createLightbox(doc);
  mountGalleries(doc, lightbox);
  mountSingleShots(doc, lightbox);
  mountTabs(doc, '[data-trench-tab]', '[data-trench-panel]', 'trench');
  mountLedgerFilters(doc);
}

if (typeof document !== 'undefined') mountShowcase(document);
