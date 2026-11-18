// Renders the data-driven parts of index.html (galleries, shared lightbox and
// the Chapter VII build ledger) as static, crawlable HTML between markers.
//   node scripts/render-showcase.mjs          rewrite index.html in place
//   node scripts/render-showcase.mjs --check  exit 1 if index.html is stale
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { LEDGER_BUILDS, LEDGER_ERAS, LEDGER_SUMMARY, TRENCH_CAMPAIGNS } from '../ledger-data.mjs';
import { GALLERIES } from '../showcase-data.mjs';
import { LEDGER_FILTERS, formatInt, timelineGeometry } from '../ledger.mjs';

const INDEX = fileURLToPath(new URL('../index.html', import.meta.url));

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
const jsonForScript = (v) => JSON.stringify(v).replace(/</g, '\\u003c');
const pad = (n) => String(n).padStart(2, '0');
const isExternal = (href) => /^https?:/i.test(href);
const link = (href, label, cls = 'text-link') =>
  `<a class="${cls}" href="${esc(href)}">${esc(label)} ${isExternal(href) ? '↗' : '→'}</a>`;

// ---------------------------------------------------------------- galleries
export function renderGallery(id) {
  const g = GALLERIES[id];
  if (!g) throw new Error(`unknown gallery ${id}`);
  const first = g.items[0];
  const tabs = g.items
    .map(
      (item, i) =>
        `<button class="cockpit-tab gallery-tab${i === 0 ? ' is-active' : ''}" id="gal-${id}-${i}" type="button" role="tab" aria-selected="${i === 0}" aria-controls="gal-${id}-panel"${i === 0 ? '' : ' tabindex="-1"'} data-gallery-tab="${i}">${esc(item.tab)}</button>`,
    )
    .join('\n          ');
  return `<div class="marquina-card showcase-gallery" data-gallery="${id}">
        <div class="gallery-tabs" role="tablist" aria-label="${esc(g.label)}">
          ${tabs}
        </div>
        <div class="cockpit-stage gallery-stage" id="gal-${id}-panel" role="tabpanel" aria-labelledby="gal-${id}-0" data-gallery-panel>
          <button class="bezel gallery-viewport" type="button" data-gallery-zoom aria-label="Inspect full-resolution screen: ${esc(first.title)}">
            <img data-gallery-img src="${first.src}" srcset="${first.src640} 640w, ${first.src} ${first.width}w" sizes="(min-width: 1180px) 760px, 92vw" width="${first.width}" height="${first.height}" loading="lazy" alt="${esc(first.alt)}">
            <span class="gallery-zoom-pill" aria-hidden="true">Inspect ⤢</span>
          </button>
          <div class="cockpit-meta" aria-live="polite">
            <span class="eyebrow" data-gallery-code>01 / ${pad(g.items.length)} · ${esc(first.group)}</span>
            <h4 data-gallery-title>${esc(first.title)}</h4>
            <p class="cockpit-caption" data-gallery-caption>${esc(first.caption)}</p>
          </div>
        </div>
        <script type="application/json" data-gallery-items>${jsonForScript(g.items)}</script>
      </div>`;
}

// ----------------------------------------------------------------- lightbox
export function renderLightbox() {
  return `<dialog class="image-dialog" id="showcase-lightbox" aria-label="Full-resolution screen viewer">
    <div class="dialog-toolbar">
      <div class="dialog-toolbar-meta">
        <span class="status-pill" data-lightbox-counter>1 / 1</span>
        <strong data-lightbox-title></strong>
      </div>
      <div class="dialog-actions">
        <button class="button small" type="button" data-lightbox-prev aria-label="Previous screen">← Prev</button>
        <button class="button small" type="button" data-lightbox-next aria-label="Next screen">Next →</button>
        <button class="button small" type="button" data-lightbox-close aria-label="Close screen viewer">Close ✕</button>
      </div>
    </div>
    <div class="dialog-well">
      <img data-lightbox-img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="1440" height="900" alt="">
    </div>
    <p class="dialog-caption" data-lightbox-caption></p>
  </dialog>`;
}

// ------------------------------------------------------------------- ledger
const ERA = Object.fromEntries(LEDGER_ERAS.map((e) => [e.id, e]));
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const primaryTier = (b) => (b.tiers.includes('flagship') ? 'flagship' : b.tiers.includes('harness') ? 'harness' : 'build');

function renderChart() {
  const geo = timelineGeometry(LEDGER_BUILDS);
  const ticks = geo.ticks
    .map((t, i) => {
      const major = t.month === 0 || i === 0;
      const label = `${MONTHS[t.month]}${major ? ` ’${String(t.year).slice(2)}` : ''}`;
      return `<g class="tl-tick${major ? ' is-major' : ''}"><line x1="${t.x}" x2="${t.x}" y1="26" y2="${geo.height - 10}"/>${i < geo.ticks.length - 1 ? `<text x="${t.x + 4}" y="20">${label}</text>` : ''}</g>`;
    })
    .join('');
  const rows = LEDGER_BUILDS.map((b, i) => {
    const r = geo.rows[i];
    const label = b.shortTitle.length > 34 ? `${b.shortTitle.slice(0, 32)}…` : b.shortTitle;
    return `<a class="tl-row" href="#build-${b.slug}" data-bar-tiers="${b.tiers.join(' ')}"><title>${esc(b.shortTitle)} · ${esc(b.monthsLabel)} · ${formatInt(b.commits)} commits · ${formatInt(b.latestLoc)} LOC</title><rect class="tl-hit" x="0" y="${r.y - 11}" width="${geo.width}" height="22"/><text class="tl-label" x="${geo.labelWidth - 12}" y="${r.y + 4}">${esc(label)}</text><rect class="tl-bar tl-bar--${primaryTier(b)}" x="${r.x}" y="${r.y - 6}" width="${r.w}" height="12" rx="2"/></a>`;
  }).join('\n          ');
  return {
    peak: geo.peak,
    svg: `<svg class="ledger-chart" viewBox="0 0 ${geo.width} ${geo.height}" role="img" aria-labelledby="ledger-chart-title ledger-chart-desc">
          <title id="ledger-chart-title">Parallel build timeline, July 2025 to November 2026</title>
          <desc id="ledger-chart-desc">Each bar runs from a build's first commit to its latest commit. Overlapping bars show builds engineered in parallel; at the peak, ${geo.peak.count} builds were in flight during ${geo.peak.label}.</desc>
          ${ticks}
          ${rows}
        </svg>`,
  };
}

function renderCampaigns() {
  const tabs = TRENCH_CAMPAIGNS.map(
    (c, i) =>
      `<button class="cockpit-tab trench-tab${i === 0 ? ' is-active' : ''}" id="trench-tab-${c.id}" type="button" role="tab" aria-selected="${i === 0}" aria-controls="trench-panel-${c.id}"${i === 0 ? '' : ' tabindex="-1"'} data-trench-tab data-trench="${c.id}"><strong>${esc(c.tab)}</strong><span>${esc(c.meta)}</span></button>`,
  ).join('\n          ');
  const panels = TRENCH_CAMPAIGNS.map(
    (c, i) => `<div class="trench-panel" id="trench-panel-${c.id}" role="tabpanel" aria-labelledby="trench-tab-${c.id}" data-trench-panel data-trench="${c.id}"${i === 0 ? '' : ' hidden'}>
          <h4 class="trench-headline">${esc(c.headline)}</h4>
          <p class="lead">${esc(c.summary)}</p>
          <dl class="trench-metrics">
            ${c.metrics.map(([v, l]) => `<div><dt>${esc(l)}</dt><dd>${esc(v)}</dd></div>`).join('\n            ')}
          </dl>
          <ol class="trench-walls">
            ${c.walls.map((w) => `<li><p class="trench-broke"><span class="eyebrow">What broke</span>${esc(w.broke)}</p><p class="trench-solved"><span class="eyebrow">How we engineered through it</span>${esc(w.solved)}</p></li>`).join('\n            ')}
          </ol>
          <details class="build-details trench-log">
            <summary>Verbatim git trail · ${c.gitLog.length} commits</summary>
            <ol class="git-trail">
              ${c.gitLog.map(([d, br, msg]) => `<li><time datetime="${d}">${d}</time><code>${esc(br)}</code><span>${esc(msg)}</span></li>`).join('\n              ')}
            </ol>
          </details>
          <p class="trench-links">${c.links.map(([href, label]) => link(href, label)).join(' ')}</p>
        </div>`,
  ).join('\n        ');
  return `<div class="marquina-card trench-ledger">
        <div class="trench-head">
          <p class="eyebrow">The War-Ledger · Three campaigns behind the flagships</p>
        </div>
        <div class="trench-tabs" role="tablist" aria-label="War-Ledger campaigns">
          ${tabs}
        </div>
        ${panels}
      </div>`;
}

function renderCard(b) {
  const era = ERA[b.eraId];
  const shot = b.shot
    ? `<button class="bezel build-shot" type="button" data-lightbox-src="${b.shot.src}" data-lightbox-width="${b.shot.width}" data-lightbox-height="${b.shot.height}" data-lightbox-title="${esc(b.shortTitle)}" data-lightbox-caption="${esc(b.shot.caption)}" data-lightbox-alt="${esc(b.shot.alt)}" aria-label="Inspect ${esc(b.shortTitle)} screenshot">
            <img src="${b.shot.src640}" width="640" height="400" loading="lazy" decoding="async" alt="${esc(b.shot.alt)}">
          </button>`
    : '';
  const ai = b.aiLandscape;
  const trail = [
    `<li><time datetime="${b.firstCommitIso}">${esc(b.firstCommitDisplay)}</time><code>${esc(b.firstCommitSha)}</code><span>First commit · ${formatInt(b.initialLoc)} LOC · ${formatInt(b.initialFiles)} files</span></li>`,
    ...b.gitTrail
      .slice()
      .reverse()
      .map((r) => `<li><time datetime="${r.date}">${r.date}</time><code>${esc(r.branch)}</code><span>${esc(r.message)}</span></li>`),
    `<li><time datetime="${b.latestCommitIso}">${esc(b.latestCommitDisplay)}</time><code>${esc(b.latestCommitSha)}</code><span>Latest commit · ${formatInt(b.latestLoc)} LOC · ${formatInt(b.latestFiles)} files</span></li>`,
  ].join('\n              ');
  const window = b.startMonthLabel === b.endMonthLabel ? b.startMonthLabel : `${b.startMonthLabel} – ${b.endMonthLabel}`;
  const langs = b.languages.length ? `<p class="build-langs">${b.languages.map((l) => `${esc(l.name)} ${l.pct}%`).join(' · ')}</p>` : '';
  return `<article class="marquina-card build-card build-card--${primaryTier(b)}" id="build-${b.slug}" data-build-tiers="${b.tiers.join(' ')}">
          <div class="build-card-top">
            <span class="build-index">#${pad(b.order)} · ${esc(era?.label || '')}</span>
            <span class="status-pill">${esc(b.monthsLabel)}</span>
          </div>
          <h4>${esc(b.shortTitle)}</h4>
          <p class="build-category">${esc(b.category)}</p>
          ${shot}
          <dl class="build-stats">
            <div><dt>Authored source LOC</dt><dd>${formatInt(b.initialLoc)} → ${formatInt(b.latestLoc)}</dd></div>
            <div><dt>Source files</dt><dd>${formatInt(b.latestFiles)}</dd></div>
            <div><dt>Commits</dt><dd>${formatInt(b.commits)}</dd></div>
            <div><dt>Window</dt><dd>${esc(window)}</dd></div>
          </dl>
          <p class="build-idea">${esc(b.idea)}</p>
          <details class="build-details">
            <summary>Architecture &amp; stack</summary>
            <p>${esc(b.architecture)}</p>
            ${langs}
          </details>
          <details class="build-details">
            <summary>AI Model Landscape at the Time</summary>
            <dl class="build-ai">
              <div><dt>OpenAI</dt><dd>${esc(ai.openai)}</dd></div>
              <div><dt>Anthropic</dt><dd>${esc(ai.anthropic)}</dd></div>
              <div><dt>Google</dt><dd>${esc(ai.google)}</dd></div>
            </dl>
          </details>
          <details class="build-details">
            <summary>Verbatim Git Trail</summary>
            <ol class="git-trail">
              ${trail}
            </ol>
            <p class="build-lineage">Lineage · ${esc(b.lineage)}</p>
          </details>
          ${b.liveUrl ? `<p class="build-live">${link(b.liveUrl, b.liveLabel)}</p>` : ''}
        </article>`;
}

export function renderLedger() {
  const chart = renderChart();
  const n = LEDGER_BUILDS.length;
  const filters = LEDGER_FILTERS.map(
    (f, i) => `<button class="cockpit-tab ledger-filter" type="button" aria-pressed="${i === 0}" data-ledger-filter="${f.id}">${esc(f.label(n))}</button>`,
  ).join('\n          ');
  return `<section class="section section-bordered" id="build-ledger" aria-labelledby="build-ledger-title">
    <div class="wrap">
      <div class="chapter-head">
        <p class="chapter-eyebrow"><span class="chapter-numeral">VII</span> The War-Ledger &amp; ${n}-Build Evolution Archive</p>
        <h2 id="build-ledger-title">Every build, from commit #1 to HEAD — <em>engineered in parallel.</em></h2>
        <p class="lead">Repository forensics across ${n} builds from July 2025 to November 2026: authored source lines at the first and latest commit (excluding dependencies, lockfiles, build output and vendor SDKs), source files, commits, the frontier models available at the time, and the verbatim git trail. Months are rounded up to whole months; anything shorter is a Rapid Sprint.</p>
        <p class="provenance-meta"><strong>Verification &amp; Scope Provenance ·</strong> Commit-pinned repository forensics as of 2026-11-18 across ${n} repositories (${formatInt(LEDGER_SUMMARY.authoredLoc)} deduplicated authored LOC; ${formatInt(LEDGER_SUMMARY.commits)} tracked default/release commits; 1,662 all-branch commits across the Aug–Nov 2026 Texas title campaign; ~16,732 shared engine lines between Title-Desk and Artificial Landman counted once).</p>
      </div>

      <div class="ledger-monuments" aria-label="Ledger totals">
        <div class="ledger-monument"><span class="telemetry-label">Builds</span><strong class="telemetry-value">${n} Verified Builds</strong><span class="telemetry-sub">Jul 2025 → Nov 2026</span></div>
        <div class="ledger-monument"><span class="telemetry-label">Authored Source LOC</span><strong class="telemetry-value">${formatInt(LEDGER_SUMMARY.authoredLoc)}</strong><span class="telemetry-sub">Deduplicated across shared trees</span></div>
        <div class="ledger-monument"><span class="telemetry-label">Verified Commits</span><strong class="telemetry-value">${formatInt(LEDGER_SUMMARY.commits)}</strong><span class="telemetry-sub">First &amp; latest SHA per build</span></div>
        <div class="ledger-monument"><span class="telemetry-label">Execution Model</span><strong class="telemetry-value">Parallel Multi-Harness Execution</strong><span class="telemetry-sub">Peak: ${chart.peak.count} builds in flight · ${esc(chart.peak.label)}</span></div>
      </div>

      ${renderCampaigns()}

      <figure class="marquina-card ledger-chart-card">
        <figcaption class="ledger-chart-head">
          <span class="eyebrow">Parallel build timeline · First → latest commit</span>
          <span class="ledger-legend"><i class="tl-key tl-key--flagship"></i>Flagship platform <i class="tl-key tl-key--harness"></i>Harness &amp; security <i class="tl-key tl-key--build"></i>Build &amp; rapid sprint</span>
        </figcaption>
        <div class="ledger-chart-scroll">
        ${chart.svg}
        </div>
      </figure>

      <div class="ledger-controls">
        <div class="ledger-filters" role="group" aria-label="Filter the build ledger">
          ${filters}
        </div>
        <p class="ledger-count" data-ledger-count aria-live="polite">${n} of ${n} builds shown</p>
      </div>

      <div class="build-grid">
        ${LEDGER_BUILDS.map(renderCard).join('\n        ')}
      </div>
    </div>
  </section>`;
}

// ------------------------------------------------------------------ assemble
function replaceBetween(html, name, content) {
  const start = `<!-- ${name}:START -->`;
  const end = `<!-- ${name}:END -->`;
  const a = html.indexOf(start);
  const b = html.indexOf(end);
  if (a < 0 || b < a) throw new Error(`missing markers for ${name}`);
  return `${html.slice(0, a + start.length)}\n  ${content}\n  ${html.slice(b)}`;
}

export function renderIndex(html) {
  let out = html;
  for (const id of Object.keys(GALLERIES)) out = replaceBetween(out, `GALLERY:${id}`, renderGallery(id));
  out = replaceBetween(out, 'SHOWCASE-LIGHTBOX', renderLightbox());
  out = replaceBetween(out, 'BUILD-LEDGER', renderLedger());
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const html = await readFile(INDEX, 'utf8');
  const next = renderIndex(html);
  if (process.argv.includes('--check')) {
    if (next !== html) {
      console.error('index.html is stale: run node scripts/render-showcase.mjs');
      process.exit(1);
    }
    console.log('index.html is in sync with ledger-data.mjs and showcase-data.mjs');
  } else {
    await writeFile(INDEX, next);
    console.log(`Rendered ${Object.keys(GALLERIES).length} galleries, the lightbox and ${LEDGER_BUILDS.length} ledger builds.`);
  }
}
