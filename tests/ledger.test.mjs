import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { LEDGER_BUILDS, LEDGER_SUMMARY, TRENCH_CAMPAIGNS } from '../ledger-data.mjs';
import { GALLERIES } from '../showcase-data.mjs';
import {
  RAPID_SPRINT,
  WHOLE_MONTH_PATTERN,
  filterBuilds,
  isAllowedDevLink,
  timelineGeometry,
  wholeMonthLabel,
} from '../ledger.mjs';
import { renderIndex } from '../scripts/render-showcase.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const html = readFileSync(join(root, 'index.html'), 'utf8');
const sources = {
  'index.html': html,
  'ledger-data.mjs': readFileSync(join(root, 'ledger-data.mjs'), 'utf8'),
  'showcase-data.mjs': readFileSync(join(root, 'showcase-data.mjs'), 'utf8'),
  'ledger.mjs': readFileSync(join(root, 'ledger.mjs'), 'utf8'),
};

test('ledger holds exactly 27 builds with unique slugs and retired builds removed', () => {
  assert.equal(LEDGER_BUILDS.length, 27);
  assert.equal(LEDGER_SUMMARY.builds, 27);
  assert.equal(new Set(LEDGER_BUILDS.map((b) => b.slug)).size, 27);
  for (const b of LEDGER_BUILDS) assert.doesNotMatch(b.shortTitle, /…|\.\.\./, `${b.slug} title is truncated`);
  for (const [name, text] of Object.entries(sources)) {
    assert.doesNotMatch(text, /happy[\s-]?homes|charlie|screen[\s-]?saver|HarnessLabSaver/i, `${name} still references a retired build`);
  }
  for (const dir of ['happy-homes-texas', 'charlie-computer', 'harnesslab-screensaver']) {
    assert.equal(existsSync(join(root, 'assets/showcase', dir)), false);
  }
});

test('ledger monuments use the deduplicated totals', () => {
  assert.equal(LEDGER_SUMMARY.authoredLoc, 1031828);
  assert.equal(LEDGER_SUMMARY.commits, 3922);
  assert.match(html, /1,031,828/);
  assert.match(html, /3,922/);
  assert.match(html, /27 Verified Builds/);
  assert.match(html, /Parallel Multi-Harness Execution/);
});

test('every build carries a whole, rounded-up month label derived from its commit window', () => {
  for (const b of LEDGER_BUILDS) {
    assert.match(b.monthsLabel, WHOLE_MONTH_PATTERN, b.slug);
    assert.equal(b.monthsLabel, wholeMonthLabel(b.firstCommitIso, b.latestCommitIso), b.slug);
    assert.equal('durationLabel' in b, false, `${b.slug} must not ship decimal durations`);
  }
  const bySlug = Object.fromEntries(LEDGER_BUILDS.map((b) => [b.slug, b.monthsLabel]));
  assert.equal(bySlug.brandstreams, '14 Months');
  assert.equal(bySlug['the-harness-lab'], '6 Months');
  assert.equal(bySlug['apex-build'], '5 Months');
  assert.equal(bySlug.titledesk, '4 Months');
  assert.equal(bySlug['claude-estate'], '2 Months');
  for (const slug of ['rogue-agents', 'karpathy-loop-harness', 'spencers-agent-os', 'artificial-landman', 'titledesk-hosted']) {
    assert.equal(bySlug[slug], RAPID_SPRINT, slug);
  }
  for (const c of TRENCH_CAMPAIGNS) assert.doesNotMatch(c.meta, /\d\.\d/, c.id);
  assert.match(TRENCH_CAMPAIGNS[0].meta, /^4 Months\b.*1,662 Commits/);
  assert.match(TRENCH_CAMPAIGNS[1].meta, /^14 Months · 9 Generations · 1,364 Commits/);
  assert.match(TRENCH_CAMPAIGNS[2].meta, /^5 Months · 1,064 APEX Commits/);
});

test('month rounding: under a month is a rapid sprint, anything over rounds up', () => {
  assert.equal(wholeMonthLabel('2026-11-01T00:00:00', '2026-11-01T00:00:00'), RAPID_SPRINT);
  assert.equal(wholeMonthLabel('2026-10-01T00:00:00', '2026-10-30T00:00:00'), RAPID_SPRINT);
  assert.equal(wholeMonthLabel('2026-01-01T00:00:00', '2026-02-01T00:00:00'), '2 Months');
  assert.equal(wholeMonthLabel('2025-07-27T16:46:56', '2026-08-27T20:00:21'), '14 Months');
  assert.throws(() => wholeMonthLabel('2026-02-01', '2026-01-01'), RangeError);
});

test('no "5.5"-style fractional month labels anywhere on the page', () => {
  assert.doesNotMatch(html, /\b\d+\.\d+\s*(mo\b|mos\b|months?\b)/i);
  assert.doesNotMatch(html, /\d+\.\d+\s*months/i);
});

test('every local asset referenced by the page and the data exists on disk', () => {
  const refs = new Set();
  const collect = (text) => {
    for (const m of text.matchAll(/\/assets\/[A-Za-z0-9._\/-]+\.(?:webp|png|jpg|svg)/g)) refs.add(m[0]);
  };
  Object.values(sources).forEach(collect);
  assert.ok(refs.size > 60, `expected many asset references, found ${refs.size}`);
  const missing = [...refs].filter((r) => !existsSync(join(root, r)));
  assert.deepEqual(missing, []);
  for (const b of LEDGER_BUILDS.filter((x) => x.shot)) {
    assert.ok(existsSync(join(root, b.shot.src)), b.shot.src);
    assert.ok(existsSync(join(root, b.shot.src640)), b.shot.src640);
  }
});

test('every internal #anchor resolves to an element id on the page', () => {
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const broken = [...html.matchAll(/href="#([^"]*)"/g)].map((m) => m[1]).filter((id) => id && !ids.has(id));
  assert.deepEqual(broken, []);
  for (const b of LEDGER_BUILDS) assert.ok(ids.has(`build-${b.slug}`), b.slug);
  for (const id of ['perihelion-loop', 'harness-vitrine', 'title-engines', 'architecture', 'execution-lab', 'systems', 'verification-kit', 'field-notes', 'build-ledger', 'contact']) {
    assert.ok(ids.has(id), id);
  }
});

test('chapter order: harnesses, title engines, foundry chapters, ledger, then contact', () => {
  const order = ['perihelion-loop', 'title-engines', 'architecture', 'execution-lab', 'systems', 'verification-kit', 'field-notes', 'build-ledger', 'contact'];
  const pos = order.map((id) => html.indexOf(`id="${id}"`));
  assert.ok(pos.every((p) => p > 0));
  assert.deepEqual([...pos].sort((a, b) => a - b), pos);
});

test('outbound links stay on the .dev allowlist and the private repos are never linked', () => {
  const anchorHrefs = (text) => [...text.matchAll(/<a\b[^>]*\bhref="(https?:[^"]+)"/g)].map((m) => m[1]);
  const slice = (from, to) => html.slice(html.indexOf(from), html.indexOf(to));
  // Strict allowlist on the build cards and every new/updated showcase surface.
  const strict = [
    slice('id="harness-vitrine"', 'id="architecture"'),
    slice('id="systems"', 'id="verification-kit"'),
    slice('id="build-ledger"', 'id="contact"'),
  ].flatMap(anchorHrefs);
  assert.ok(strict.length >= 15, `expected live links in the showcase, found ${strict.length}`);
  assert.deepEqual(strict.filter((h) => !isAllowedDevLink(h)), []);
  // Page-wide: anything else must be one of the field-note standards citations.
  const citations = new Set(['aws.amazon.com', 'www.w3.org', 'slsa.dev', 'opentelemetry.io']);
  const fieldNotes = anchorHrefs(slice('id="field-notes"', 'id="build-ledger"'));
  const hrefs = anchorHrefs(html);
  const bad = hrefs.filter((h) => !isAllowedDevLink(h) && !(citations.has(new URL(h).hostname) && fieldNotes.includes(h)));
  assert.deepEqual(bad, []);
  assert.doesNotMatch(html, /github\.com\/spencerandtheteagues/);
  assert.doesNotMatch(html, /https?:\/\/(?:www\.)?brandstream\.my/i);
  for (const live of ['https://title-desk.com/', 'https://desktop.title-desk.com/', 'https://artificiallandman.io/', 'https://apex-build.dev/', 'https://theharnesslab.com/']) {
    assert.ok(hrefs.includes(live), live);
  }
  assert.equal(isAllowedDevLink('https://brandstream.my/'), false);
  assert.equal(isAllowedDevLink('https://github.com/spencerandtheteagues/apex-build-platform'), false);
  assert.equal(isAllowedDevLink('https://github.com/THE-HARNESS-LAB/titledesk'), true);
  assert.equal(isAllowedDevLink('https://example.com/'), false);
});

test('professional tone: banned phrasings are absent and required ones present', () => {
  const all = Object.values(sources).join('\n');
  for (const re of [/five-account/i, /three Gemini accounts/i, /session[- ]lock/i, /bypass\w*[^.]{0,40}(OAuth|CASA)/i, /\bCASA\b/, /All-Account/, /multi-account/i]) {
    assert.doesNotMatch(all, re, String(re));
  }
  assert.match(html, /multi-provider failover/i);
  assert.match(html, /landman-authenticated county accounts/i);
  assert.match(html, /no-copy reverse-engineering/i);
});

test('green PASS styling is reserved for verified states and the hazard tape stays on #contact', () => {
  const passTexts = [...html.matchAll(/class="[^"]*\bis-pass\b[^"]*"[^>]*>([^<]*)</g)].map((m) => m[1]);
  assert.ok(passTexts.length >= 8);
  for (const t of passTexts) assert.match(t, /PASS|VERIFIED|KEEP|COMPLETED/, t);
  assert.equal((html.match(/contact-hazard-tape/g) || []).length, 1);
});

test('galleries ship the required screens and copy every image into assets/', () => {
  assert.equal(GALLERIES['rogue-agents'].items.length, 4);
  assert.equal(GALLERIES['titledesk-web'].items.length, 5);
  assert.equal(GALLERIES['titledesk-desktop'].items.length, 8);
  assert.equal(GALLERIES['artificial-landman'].items.length, 5);
  for (const g of Object.values(GALLERIES)) {
    for (const item of g.items) {
      assert.ok(existsSync(join(root, item.src)), item.src);
      assert.ok(existsSync(join(root, item.src640)), item.src640);
    }
  }
  assert.deepEqual(readdirSync(join(root, 'assets/showcase/rogue-agents')).filter((f) => !f.includes('-640')).sort(), [
    '01-command-center-overview.webp',
    '02-connections-models-setup.webp',
    '03-council-workspace-debate.webp',
    '04-voice-brainstorm-final-report.webp',
  ]);
});

test('filters partition the ledger and the timeline geometry stays inside the chart', () => {
  assert.equal(filterBuilds(LEDGER_BUILDS, 'all').length, 27);
  const flagship = filterBuilds(LEDGER_BUILDS, 'flagship');
  const harness = filterBuilds(LEDGER_BUILDS, 'harness');
  const rapid = filterBuilds(LEDGER_BUILDS, 'rapid');
  assert.ok(flagship.length >= 6 && harness.length >= 6 && rapid.length >= 10);
  assert.ok(rapid.every((b) => b.monthsLabel === RAPID_SPRINT));
  assert.throws(() => filterBuilds(LEDGER_BUILDS, 'nope'), RangeError);
  const geo = timelineGeometry(LEDGER_BUILDS);
  assert.equal(geo.rows.length, 27);
  for (const r of geo.rows) {
    assert.ok(r.x >= geo.labelWidth && r.x + r.w <= geo.width, r.slug);
  }
  assert.ok(geo.peak.count >= 5, `peak concurrency ${geo.peak.count}`);
});

test('index.html is in sync with the data modules (run scripts/render-showcase.mjs)', () => {
  assert.equal(renderIndex(html), html);
});

test('SEO, AI-engine discovery files, JSON-LD graphs, and subpage parity stay valid', () => {
  const pages = [
    ['index.html', html],
    ['landman-title-systems/index.html', readFileSync(join(root, 'landman-title-systems/index.html'), 'utf8')],
    ['workflow-automation-engineering/index.html', readFileSync(join(root, 'workflow-automation-engineering/index.html'), 'utf8')],
    ['business-software-engineering/index.html', readFileSync(join(root, 'business-software-engineering/index.html'), 'utf8')],
  ];
  for (const [name, doc] of pages) {
    assert.match(doc, /rel="manifest"\s+href="\/manifest\.webmanifest"/, name);
    assert.match(doc, /rel="alternate"\s+type="text\/plain"\s+href="\/llms\.txt"/, name);
    assert.match(doc, /max-snippet:-1,max-video-preview:-1/, name);
    assert.match(doc, /property="og:image:width"\s+content="1200"/, name);
    assert.match(doc, /property="og:image:height"\s+content="630"/, name);
    assert.doesNotMatch(doc, /https?:\/\/(?:www\.)?brandstream\.my/i, `${name} must not link brandstream.my while DNS is locked`);
    assert.doesNotMatch(doc, /happy[\s-]?homes|charlie|screen[\s-]?saver|HarnessLabSaver/i, name);

    const imgs = [...doc.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
    assert.ok(imgs.length >= 2, name);
    for (const tag of imgs) {
      assert.match(tag, /\bwidth="\d+"/, `${name} img missing width: ${tag}`);
      assert.match(tag, /\bheight="\d+"/, `${name} img missing height: ${tag}`);
    }

    const ldMatch = doc.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
    assert.ok(ldMatch, `${name} JSON-LD`);
    const ld = JSON.parse(ldMatch[1]);
    assert.ok(Array.isArray(ld['@graph']), name);
    const types = ld['@graph'].map((node) => node['@type']);
    assert.ok(types.includes('FAQPage'), `${name} FAQPage`);
    assert.match(JSON.stringify(ld), /"dateModified":"2026-11-18"/, `${name} dateModified`);
  }

  for (const [name, doc] of pages.slice(1)) {
    assert.match(doc, /href="\/#perihelion-loop"><span class="nav-num">I<\/span> Harnesses/, name);
    assert.match(doc, /href="\/#title-engines"><span class="nav-num">II<\/span> Title Engines/, name);
    assert.match(doc, /href="\/#architecture"><span class="nav-num">III<\/span> Architecture/, name);
    assert.match(doc, /href="\/#execution-lab"><span class="nav-num">IV<\/span> Labs/, name);
    assert.match(doc, /https:\/\/title-desk\.com\//, name);
    assert.match(doc, /https:\/\/artificiallandman\.io\//, name);
  }

  const stageTag = html.match(/<div class="medallion-stage"[^>]*>/)?.[0] || '';
  assert.doesNotMatch(stageTag, /\brole=|\btabindex=/);

  const robots = readFileSync(join(root, 'robots.txt'), 'utf8');
  for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'Claude-SearchBot', 'Claude-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended']) {
    assert.match(robots, new RegExp(`User-agent:\\s*${bot}`), bot);
  }
  const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
  assert.equal((sitemap.match(/<lastmod>2026-11-18<\/lastmod>/g) || []).length, 4);

  const manifest = JSON.parse(readFileSync(join(root, 'manifest.webmanifest'), 'utf8'));
  assert.equal(manifest.start_url, '/');
  assert.ok(manifest.icons.length >= 4);

  assert.equal(readFileSync(join(root, 'd379420ff0a7ca5d7bada98549699bc2.txt'), 'utf8').trim(), 'd379420ff0a7ca5d7bada98549699bc2');

  for (const llmFile of ['llms.txt', 'llms-full.txt']) {
    const content = readFileSync(join(root, llmFile), 'utf8');
    assert.match(content, /Perihelion Loop/);
    assert.match(content, /1,031,828/);
    assert.match(content, /3,922/);
    assert.doesNotMatch(content, /New Mexico/i, llmFile);
    assert.doesNotMatch(content, /brandstream\.my/i, llmFile);
    assert.doesNotMatch(content, /happy[\s-]?homes|charlie|screen[\s-]?saver|HarnessLabSaver/i, llmFile);
  }
});

test('SHARED-FACTS naming, legal entity, OPSEC scrub, security.txt, and accessibility hygiene hold across all .dev files', () => {
  const checkedFiles = {
    'index.html': html,
    'engineering.mjs': readFileSync(join(root, 'engineering.mjs'), 'utf8'),
    'ledger-data.mjs': sources['ledger-data.mjs'],
    'showcase-data.mjs': sources['showcase-data.mjs'],
    'llms.txt': readFileSync(join(root, 'llms.txt'), 'utf8'),
    'llms-full.txt': readFileSync(join(root, 'llms-full.txt'), 'utf8'),
    'landman-title-systems/index.html': readFileSync(join(root, 'landman-title-systems/index.html'), 'utf8'),
    'workflow-automation-engineering/index.html': readFileSync(join(root, 'workflow-automation-engineering/index.html'), 'utf8'),
    'business-software-engineering/index.html': readFileSync(join(root, 'business-software-engineering/index.html'), 'utf8'),
  };

  const bannedPatterns = [
    /28-build/i,
    /Title-Desk/,
    /TITLE-DESK/,
    /(?<!https:\/\/)(?<!https:\/\/desktop\.)\btitle-desk\b(?!\.com)/i,
    /\bTitle Desk\b/i,
    /Title-?Desk Web/i,
    /TitleDesk Desktop/,
    /TitleDesk Desktop Agent/i,
    /TitleDesk Agent Desktop/i,
    /New Mexico/i,
    /written only when all three agree/i,
    /three-way consensus/i,
    /triple-check/i,
    /\bsame day\b/i,
    /\b15 minutes\b/i,
    /zero working hours/i,
    /week's pay/i,
    /every step[^.\n]{0,40}automated/i,
    /fully automated/i,
    /signed workbook/i,
    /tenant-isolated/i,
    /\bguaranteed\b/i,
    /\b282\b/,
    /Jake Powers/i,
    /Ubuntu Omen/i,
    /\bOmen\b/,
    /omenctl/i,
    /MacBook Air/i,
    /Hostinger/i,
    /PAM change-guard/i,
    /change-guard/i,
    /settings_sentinel/i,
    /events\.jsonl/i,
    /\b(?:ui|risk|broker|watcher|ctl)\.py\b/i,
    /secfeat/i,
    /sudoers/i,
    /\bEXAMINE\b/,
    /BODY\.PEEK/i,
    /test_eval_and_redteam/i,
    /GOLD002TX/i,
    /gte002tx/i,
    /rogue-tools/i,
    /brandstream\.my/i,
    /\/Users\/spencerteague/i,
    /\/home\/spencer/i,
    /Nero Marquina/i,
    /Obverse face/i,
    /Reverse face/i,
    /Copper\s*(?:&|&amp;|and)\s*(?:White\s*)?Carrara/i,
    /2027 cinema/i,
    /existing subscription/i,
    /subscription sign-in/i,
    /studio subscription/i,
    /free-tier/i,
    /free tier/i,
    /\$0/,
    /vendor spend/i,
    /Vendor Overrun/i,
    /security@theharnesslab/i,
    /support@theharnesslab/i,
    /licenses@theharnesslab/i,
  ];

  for (const [name, content] of Object.entries(checkedFiles)) {
    for (const re of bannedPatterns) {
      assert.doesNotMatch(content, re, `${name} matched banned pattern ${re}`);
    }
  }

  // Legal entity & 27-Build footer parity across HTML pages
  for (const pageName of [
    'index.html',
    'landman-title-systems/index.html',
    'workflow-automation-engineering/index.html',
    'business-software-engineering/index.html',
  ]) {
    const doc = checkedFiles[pageName];
    assert.match(doc, /© 2026 The Harness Lab LLC, a Texas limited liability company \(Texas SOS File No\. 806765129\)/, pageName);
    assert.match(doc, /Tom Green County, Texas/, pageName);
    assert.match(doc, /Verification &amp; Scope Provenance/, pageName);
    if (pageName !== 'index.html') {
      assert.match(doc, /VII · 27-Build Ledger/, `${pageName} footer must link 27-Build Ledger`);
    }
  }

  assert.match(checkedFiles['ledger-data.mjs'], /private investor Jayson Powers/);
  assert.match(html, /Verifiable autonomous harnesses <br>&amp; deterministic <em>state machines\.<\/em>/);
  assert.match(html, /<pre tabindex="0" aria-label="Executable step contract TypeScript definition">/);
  assert.match(html, /<button[^>]*data-cockpit-stage-zoom[^>]*>[\s\S]*?<img[\s\S]*?data-cockpit-img/);

  // .nojekyll + .well-known/security.txt
  assert.equal(existsSync(join(root, '.nojekyll')), true);
  assert.equal(existsSync(join(root, '.well-known/security.txt')), true);
  const secTxt = readFileSync(join(root, '.well-known/security.txt'), 'utf8');
  assert.equal(
    secTxt.trim(),
    [
      'Contact: mailto:sales@theharnesslab.com',
      'Expires: 2027-11-18T00:00:00Z',
      'Preferred-Languages: en',
      'Canonical: https://theharnesslab.dev/.well-known/security.txt',
    ].join('\n'),
  );

  // Unreferenced root images removed; core brand assets retained
  assert.equal(existsSync(join(root, 'advancedhermes-hero-round.png')), false);
  assert.equal(existsSync(join(root, 'harness-lab-emblem-hero.webp')), false);
  for (const keep of ['social-card.png', 'favicon.png', 'hermes-mark.png', 'harness-lab-emblem-512.png']) {
    assert.equal(existsSync(join(root, keep)), true, keep);
  }
});
