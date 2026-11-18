// Deterministic teaching models & instrument controllers for theharnesslab.dev.
// Pure state machines execute with zero I/O, persistence, credentials, or external effects.

export const SCENARIOS = Object.freeze(['normal', 'timeout', 'evidence', 'policy', 'mutation']);
const scenarios = new Set(SCENARIOS);
const activeStates = new Set(['CREATED', 'VALIDATED', 'PREPARED', 'ATTEMPTING']);

export function createRun(scenario = 'normal') {
  if (!scenarios.has(scenario)) throw new RangeError('Unknown simulation scenario');
  const message = 'The input envelope exists. Step forward to evaluate the execution contract.';
  return {
    scenario,
    state: 'CREATED',
    revision: 0,
    operation: 'delivery/demo-01',
    destination: scenario === 'policy' ? 'unapproved/demo' : 'approved/demo',
    artifact: 'artifact/v1',
    evidencePresent: scenario !== 'evidence',
    intent: null,
    dispatchCount: 0,
    receipt: null,
    message,
    journal: [{ revision: 0, state: 'CREATED', message }],
  };
}

function transition(run, state, message, changes = {}) {
  const revision = run.revision + 1;
  return {
    ...run, ...changes, state, revision, message,
    journal: [...run.journal, { revision, state, message }],
  };
}

// Represents the response of a synthetic provider when queried by the demo.
// It is kept out of materialized caller state until a response is accepted.
export function syntheticReceipt(run) {
  if (!run.intent || run.dispatchCount !== 1) return null;
  return { ...run.intent, id: 'receipt/demo-01', status: 'committed' };
}

function receiptMatches(run, receipt) {
  return !!(run.intent && receipt && typeof receipt.id === 'string' && receipt.id.trim()
    && receipt.status === 'committed'
    && receipt.operation === run.intent.operation
    && receipt.destination === run.intent.destination
    && receipt.artifact === run.intent.artifact);
}

export function stepRun(run) {
  switch (run.state) {
    case 'CREATED':
      return run.evidencePresent
        ? transition(run, 'VALIDATED', 'Required source is present. The input contract is satisfied.')
        : transition(run, 'BLOCKED_EVIDENCE', 'Required source is missing. Validation stops here; no delivery was dispatched.');
    case 'VALIDATED':
      if (run.destination !== 'approved/demo') {
        return transition(run, 'DENIED_POLICY', 'The destination is outside the approved scope. No intent or dispatch is permitted.');
      }
      return transition(run, 'PREPARED', 'Authorized destination and verified artifact identity are bound into an immutable delivery intent.', {
        intent: { operation: run.operation, destination: run.destination, artifact: run.artifact },
      });
    case 'PREPARED': {
      const artifact = run.scenario === 'mutation' ? 'artifact/v2' : run.artifact;
      if (!run.intent || artifact !== run.intent.artifact) {
        return transition(run, 'REJECTED_MUTATION', 'The current artifact differs from the verified intent. Dispatch is rejected; the new artifact needs validation.', { artifact });
      }
      if (run.destination !== run.intent.destination || run.destination !== 'approved/demo'
        || run.operation !== run.intent.operation) {
        return transition(run, 'DENIED_POLICY', 'The operation or destination changed after preparation. The prior authorization no longer applies.');
      }
      return transition(run, 'ATTEMPTING', 'The dispatch boundary has been crossed once. The caller is awaiting a matching receipt.', { dispatchCount: 1 });
    }
    case 'ATTEMPTING':
      if (run.scenario === 'timeout') {
        return transition(run, 'UNCERTAIN', 'No receipt arrived. The remote outcome is unknown to the caller. Ordinary retry is disabled; reconcile the receipt.');
      }
      return transition(run, 'COMPLETED', 'A committed receipt matches the operation, destination, and verified artifact. Delivery is confirmed.', { receipt: syntheticReceipt(run) });
    default:
      return run;
  }
}

export function reconcileRun(run, receipt) {
  if (run.state !== 'UNCERTAIN') return run;
  if (!receiptMatches(run, receipt)) {
    return transition(run, 'UNCERTAIN', 'The queried receipt is absent or does not match this intent. Completion remains blocked; no additional dispatch is allowed.');
  }
  return transition(run, 'COMPLETED', 'Reconciliation found a matching committed receipt. Delivery is confirmed without dispatching a second time.', { receipt: { ...receipt } });
}

export function callerState(run) {
  return {
    state: run.state,
    revision: run.revision,
    operation: run.operation,
    destination: run.destination,
    currentArtifact: run.artifact,
    verifiedArtifact: run.intent?.artifact ?? null,
    dispatchCount: run.dispatchCount,
    receipt: run.receipt,
  };
}

export function mountLab(root) {
  const find = (selector) => root.querySelector(selector);
  const scenario = find('#scenario');
  const step = find('#step');
  const reconcile = find('#reconcile');
  const reset = find('#reset');
  const journal = find('#journal');
  const badge = find('#state-badge');
  if (!scenario || !step || !reconcile || !reset || !journal || !badge) return;
  let run = createRun(scenario.value);

  function render() {
    find('#revision').textContent = `revision ${run.revision}`;
    find('#state-json').textContent = JSON.stringify(callerState(run), null, 2);
    find('#transition-explanation').textContent = run.message;
    badge.textContent = run.state;
    badge.dataset.tone = run.state === 'COMPLETED' ? 'complete' : activeStates.has(run.state) ? 'active' : 'blocked';
    journal.replaceChildren(...run.journal.map((entry) => {
      const row = document.createElement('li');
      const title = document.createElement('strong');
      const description = document.createElement('p');
      title.textContent = `${String(entry.revision).padStart(2, '0')} / ${entry.state}`;
      description.textContent = entry.message;
      row.append(title, description);
      return row;
    }));
    root.querySelectorAll('[data-stage]').forEach((stage) => {
      stage.classList.toggle('visited', run.journal.some((entry) => entry.state === stage.dataset.stage));
      if (stage.dataset.stage === run.state) stage.setAttribute('aria-current', 'step');
      else stage.removeAttribute('aria-current');
    });
    step.disabled = !activeStates.has(run.state);
    reconcile.hidden = run.state !== 'UNCERTAIN';
  }

  step.addEventListener('click', () => {
    const hadFocus = document.activeElement === step;
    run = stepRun(run);
    render();
    if (hadFocus && step.disabled) (reconcile.hidden ? reset : reconcile).focus();
  });
  reconcile.addEventListener('click', () => {
    const hadFocus = document.activeElement === reconcile;
    run = reconcileRun(run, syntheticReceipt(run));
    render();
    if (hadFocus && reconcile.hidden) reset.focus();
  });
  reset.addEventListener('click', () => {
    run = createRun(scenario.value);
    render();
    step.focus();
  });
  scenario.addEventListener('change', () => {
    run = createRun(scenario.value);
    render();
  });
  render();
  root.hidden = false;
}

export const bootExecutionLab = mountLab;

// ============================================================================
// Transactional Karpathy Loop + Holdout Gate (klh v2.2 + cloudroom.dev fabric)
// ============================================================================

export const KARPATHY_SCENARIOS = Object.freeze([
  'verified_fix',
  'monkey_patched_assert',
  'null_test_failed',
  'transfer_hash_mismatch',
]);
const karpathyScenarios = new Set(KARPATHY_SCENARIOS);

export const KARPATHY_STAGES = Object.freeze([
  'BASELINE',
  'PATCH',
  'UNIT_CHECK',
  'HOLDOUT_CHECK',
  'COUNCIL_REVIEW',
  'KEEP',
]);
const activeKarpathyStates = new Set([
  'BASELINE',
  'PATCH',
  'UNIT_CHECK',
  'HOLDOUT_CHECK',
  'COUNCIL_REVIEW',
]);

const BASE_COMMIT = 'base/9f4c21a';
const CANDIDATE_COMMIT = 'cand/3b8e10d';

export function createKarpathyRun(scenario = 'verified_fix') {
  if (!karpathyScenarios.has(scenario)) {
    throw new RangeError('Unknown Karpathy Loop simulation scenario');
  }
  const message =
    'Baseline pinned at base/9f4c21a. Pre-spawn safety.ts gate (macAccessLevel="off", cloud GitHub disconnected, atomic CreditLedger quota reservation) ready for transfer.ts manifest check.';
  return {
    scenario,
    state: 'BASELINE',
    revision: 0,
    unitId: 'unit/semaphore-handoff',
    attempt: 1,
    baseCommit: BASE_COMMIT,
    worktreeHead: BASE_COMMIT,
    candidateCommit: null,
    safetyGate: { macAccessLevel: 'off', githubConnected: false, creditSpendUsd: 0 },
    manifestVerified: null,
    vmPromptReleased: false,
    quarantineClean: null,
    nullTestRedOnBase: null,
    unitSuite: 'pending',
    holdoutSuite: 'pending',
    councilVerdict: 'pending',
    failureCode: null,
    resultsTsv: [],
    message,
    journal: [{ revision: 0, state: 'BASELINE', message }],
  };
}

function transitionKarpathy(run, state, message, changes = {}) {
  const revision = run.revision + 1;
  return {
    ...run,
    ...changes,
    state,
    revision,
    message,
    journal: [...run.journal, { revision, state, message }],
  };
}

export function stepKarpathyRun(run) {
  switch (run.state) {
    case 'BASELINE': {
      if (run.scenario === 'transfer_hash_mismatch') {
        const entry = {
          attempt: run.attempt,
          commit: BASE_COMMIT,
          status: 'crash',
          reason: 'INPUT_TRANSFER_UNVERIFIED',
        };
        return transitionKarpathy(
          run,
          'GIT_RESET_HARD',
          'SHA-256 manifest verification failed inside the cloudroom.dev VM before worker prompt release (INPUT_TRANSFER_UNVERIFIED). Prompt withheld; worktree stays pinned at base/9f4c21a.',
          {
            manifestVerified: false,
            vmPromptReleased: false,
            quarantineClean: false,
            failureCode: 'INPUT_TRANSFER_UNVERIFIED',
            worktreeHead: BASE_COMMIT,
            candidateCommit: null,
            resultsTsv: [...run.resultsTsv, entry],
          },
        );
      }
      const patchNote =
        run.scenario === 'monkey_patched_assert'
          ? 'Worker proposed cand/3b8e10d, silently overriding node:assert assert.equal inside a helper.'
          : run.scenario === 'null_test_failed'
            ? 'Worker proposed cand/3b8e10d with regress/cache-stale.test.ts claiming an upstream bug fix.'
            : 'Worker proposed single-hypothesis fix cand/3b8e10d + regress/semaphore-handoff.test.ts; pulled into local quarantine (no symlinks, NFC-clean, .git intact).';
      return transitionKarpathy(
        run,
        'PATCH',
        `Sorted SHA-256 manifest verified inside VM; worker prompt released. ${patchNote}`,
        {
          manifestVerified: true,
          vmPromptReleased: true,
          quarantineClean: true,
          candidateCommit: CANDIDATE_COMMIT,
          worktreeHead: CANDIDATE_COMMIT,
        },
      );
    }

    case 'PATCH': {
      if (run.scenario === 'null_test_failed') {
        return transitionKarpathy(
          run,
          'UNIT_CHECK',
          'Fixed-budget local runner executes regress/cache-stale.test.ts against unchanged BASE first (null_tested_regression gate): test unexpectedly PASSES on unpatched BASE.',
          {
            nullTestRedOnBase: false,
            unitSuite: 'vacuous-pass',
          },
        );
      }
      const unitDetail =
        run.scenario === 'monkey_patched_assert'
          ? 'Mutable worktree test command exits 0 because shimmed assert.equal masked the failing assertion.'
          : 'regress/ test fails on unchanged BASE and passes on cand/3b8e10d; all deterministic unit checks pass inside fixed budget.';
      return transitionKarpathy(run, 'UNIT_CHECK', unitDetail, {
        nullTestRedOnBase: true,
        unitSuite: 'pass',
      });
    }

    case 'UNIT_CHECK': {
      if (run.scenario === 'null_test_failed') {
        const entry = {
          attempt: run.attempt,
          commit: CANDIDATE_COMMIT,
          status: 'discard',
          reason: 'NULL_TEST_PASSED_ON_BASE',
        };
        return transitionKarpathy(
          run,
          'GIT_RESET_HARD',
          'Rejected by null_tested_regression gate: regression test passed on unchanged BASE, proving it does not witness the defect. git reset --hard base/9f4c21a executed; discard logged to results.tsv.',
          {
            worktreeHead: BASE_COMMIT,
            candidateCommit: null,
            failureCode: 'NULL_TEST_PASSED_ON_BASE',
            resultsTsv: [...run.resultsTsv, entry],
          },
        );
      }
      if (run.scenario === 'monkey_patched_assert') {
        return transitionKarpathy(
          run,
          'HOLDOUT_CHECK',
          'Independent local re-execution against immutable read-only holdout suite FAILS under clean node:assert runtime. Escalating diff to Sealed Advisor Council.',
          {
            holdoutSuite: 'fail',
          },
        );
      }
      return transitionKarpathy(
        run,
        'HOLDOUT_CHECK',
        'Hidden out-of-worktree holdout suite passes 100% in an isolated local evaluator that the worker could never read or mutate.',
        {
          holdoutSuite: 'pass',
        },
      );
    }

    case 'HOLDOUT_CHECK': {
      if (run.scenario === 'monkey_patched_assert') {
        return transitionKarpathy(
          run,
          'COUNCIL_REVIEW',
          'Kernel-sealed tool-less Advisor Council (Gemini 4 Carbon) audits the raw diff and flags tampering with node:assert assert.equal.',
          {
            councilVerdict: 'rejected: assert.equal monkey-patch',
          },
        );
      }
      return transitionKarpathy(
        run,
        'COUNCIL_REVIEW',
        'Kernel-sealed tool-less Advisor Council (Gemini 4 Carbon + GPT-6 Astra) verifies minimal diff, invariant preservation, and zero evaluator tampering.',
        {
          councilVerdict: 'approved',
        },
      );
    }

    case 'COUNCIL_REVIEW': {
      if (run.scenario === 'monkey_patched_assert' || run.holdoutSuite !== 'pass') {
        const entry = {
          attempt: run.attempt,
          commit: CANDIDATE_COMMIT,
          status: 'discard',
          reason: 'MONKEY_PATCHED_ASSERT',
        };
        return transitionKarpathy(
          run,
          'GIT_RESET_HARD',
          'Transactional rollback: git reset --hard base/9f4c21a wipes the contaminated candidate. results.tsv records discard (MONKEY_PATCHED_ASSERT) so subsequent attempts never repeat the exploit.',
          {
            worktreeHead: BASE_COMMIT,
            candidateCommit: null,
            failureCode: 'MONKEY_PATCHED_ASSERT',
            resultsTsv: [...run.resultsTsv, entry],
          },
        );
      }
      const entry = {
        attempt: run.attempt,
        commit: CANDIDATE_COMMIT,
        status: 'keep',
        reason: 'ALL_GATES_VERIFIED',
      };
      return transitionKarpathy(
        run,
        'KEEP',
        'Candidate cand/3b8e10d promoted! Unit suite, null-test witness, hidden holdout suite, and Sealed Council all verified. keep appended to results.tsv for outer DAG join.',
        {
          worktreeHead: CANDIDATE_COMMIT,
          failureCode: null,
          resultsTsv: [...run.resultsTsv, entry],
        },
      );
    }

    default:
      return run;
  }
}

export function karpathyState(run) {
  return {
    state: run.state,
    revision: run.revision,
    unitId: run.unitId,
    worktreeHead: run.worktreeHead,
    candidateCommit: run.candidateCommit,
    safetyGate: run.safetyGate,
    manifestVerified: run.manifestVerified,
    vmPromptReleased: run.vmPromptReleased,
    nullTestRedOnBase: run.nullTestRedOnBase,
    unitSuite: run.unitSuite,
    holdoutSuite: run.holdoutSuite,
    councilVerdict: run.councilVerdict,
    failureCode: run.failureCode,
    resultsTsv: run.resultsTsv,
  };
}

export function formatResultsTsv(run) {
  const header = 'attempt\tcommit\tstatus\treason';
  if (!run.resultsTsv.length) return `${header}\n# awaiting terminal verdict`;
  const rows = run.resultsTsv.map(
    (r) => `${r.attempt}\t${r.commit}\t${r.status}\t${r.reason}`,
  );
  return [header, ...rows].join('\n');
}

export function mountKarpathyLab(root) {
  const find = (selector) => root.querySelector(selector);
  const scenario = find('#karpathy-scenario');
  const step = find('#karpathy-step');
  const reset = find('#karpathy-reset');
  const journal = find('#karpathy-journal');
  const badge = find('#karpathy-badge');
  const tsvNode = find('#karpathy-tsv');
  if (!scenario || !step || !reset || !journal || !badge) return;
  let run = createKarpathyRun(scenario.value);

  function render() {
    find('#karpathy-revision').textContent = `revision ${run.revision} · head ${run.worktreeHead}`;
    find('#karpathy-json').textContent = JSON.stringify(karpathyState(run), null, 2);
    if (tsvNode) tsvNode.textContent = formatResultsTsv(run);
    find('#karpathy-explanation').textContent = run.message;
    badge.textContent = run.state;
    badge.dataset.tone =
      run.state === 'KEEP'
        ? 'complete'
        : activeKarpathyStates.has(run.state)
          ? 'active'
          : 'blocked';
    journal.replaceChildren(
      ...run.journal.map((entry) => {
        const row = document.createElement('li');
        const title = document.createElement('strong');
        const description = document.createElement('p');
        title.textContent = `${String(entry.revision).padStart(2, '0')} / ${entry.state}`;
        description.textContent = entry.message;
        row.append(title, description);
        return row;
      }),
    );
    root.querySelectorAll('[data-karpathy-stage]').forEach((stage) => {
      const stageName = stage.dataset.karpathyStage;
      const isResetStage = stageName === 'KEEP' && run.state === 'GIT_RESET_HARD';
      stage.classList.toggle(
        'visited',
        run.journal.some((entry) => entry.state === stageName),
      );
      stage.classList.toggle('is-reset', isResetStage);
      const labelNode = stage.querySelector('[data-stage-label]');
      if (labelNode && stageName === 'KEEP') {
        labelNode.textContent =
          run.state === 'GIT_RESET_HARD' ? 'GIT_RESET_HARD' : 'KEEP / RESET';
      }
      if (stageName === run.state || isResetStage) {
        stage.setAttribute('aria-current', 'step');
      } else {
        stage.removeAttribute('aria-current');
      }
    });
    step.disabled = !activeKarpathyStates.has(run.state);
  }

  step.addEventListener('click', () => {
    const hadFocus = document.activeElement === step;
    run = stepKarpathyRun(run);
    render();
    if (hadFocus && step.disabled) reset.focus();
  });
  reset.addEventListener('click', () => {
    run = createKarpathyRun(scenario.value);
    render();
    step.focus();
  });
  scenario.addEventListener('change', () => {
    run = createKarpathyRun(scenario.value);
    render();
  });
  render();
  root.hidden = false;
}

// ============================================================================
// Perihelion Cockpit 5-Zoom Plates
// ============================================================================

export const PERIHELION_PLATES = Object.freeze([
  {
    id: 'fleet',
    code: '01 / FLEET & CREDIT LEDGER',
    tabLabel: '01 Fleet Overview',
    title: 'Perihelion Fleet Deck & Atomic CreditLedger Quota Gate',
    src: '/assets/showcase/karpathy-loop-harness/01-perihelion-fleet-overview.webp',
    src640: '/assets/showcase/karpathy-loop-harness/01-perihelion-fleet-overview-640.webp',
    alt: 'Perihelion Loop cockpit overview showing active worktrees, run health, and atomic CreditLedger reservations',
    plane: 'CONTROL PLANE · klh v2.2',
    metric: '30,079 LOC · Bounded-Budget Gate',
    caption:
      'Live fleet command deck tracking concurrent isolated git worktrees, atomic CreditLedger budget reservations, and pre-spawn safety.ts invariants (macAccessLevel === "off", cloud GitHub disconnected).',
  },
  {
    id: 'dag',
    code: '02 / TYPED OUTER DAG & GATE',
    tabLabel: '02 Outer DAG & Gate',
    title: 'Typed Execution Graph & Single High-Undo-Cost Human Gate',
    src: '/assets/showcase/karpathy-loop-harness/02-run-dag-human-gate.webp',
    src640: '/assets/showcase/karpathy-loop-harness/02-run-dag-human-gate-640.webp',
    alt: 'Perihelion Loop outer DAG view displaying typed node contracts, parallel worktree lanes, and human approval gate',
    plane: 'CONTROL → EXECUTION · Loops & Graphs',
    metric: 'Max 3 Retries · 2-Dry-Round Stop',
    caption:
      'Every node declares ONE JOB · ONE INPUT · ONE OUTPUT · FAILS AS. Edges exist strictly where named artifacts travel; independent units execute in parallel worktrees and pause once at irreversible boundaries.',
  },
  {
    id: 'sandbox',
    code: '03 / KARPATHY INNER SANDBOX',
    tabLabel: '03 Karpathy Sandbox',
    title: 'Transactional Inner Loop, Exact-Bytes Transfer & Quarantine',
    src: '/assets/showcase/karpathy-loop-harness/03-unit-karpathy-loop-sandbox.webp',
    src640: '/assets/showcase/karpathy-loop-harness/03-unit-karpathy-loop-sandbox-640.webp',
    alt: 'Unit Karpathy Loop sandbox telemetry with SHA-256 manifest verification, fixed-budget check logs, and results.tsv ledger',
    plane: 'EXECUTION → EVIDENCE · transfer.ts',
    metric: 'SHA-256 Sorted Manifest · NFC Quarantine',
    caption:
      'Workspace bytes + sorted SHA-256 manifest push via room-cli vm push and verify inside the Linux VM before prompt release; returned diffs enter local quarantine before independent local holdout re-execution.',
  },
  {
    id: 'council',
    code: '04 / FRONTIER COUNCIL & ROUTER',
    tabLabel: '04 Frontier Council',
    title: '7-Tier Multi-Provider Frontier Router & Sealed Advisor Council',
    src: '/assets/showcase/karpathy-loop-harness/04-providers-frontier-council.webp',
    src640: '/assets/showcase/karpathy-loop-harness/04-providers-frontier-council-640.webp',
    alt: 'Frontier provider rotation schedule and kernel-sealed tool-less Advisor Council adversarial diff review',
    plane: 'MODEL BOUNDARY · Sealed Advisors',
    metric: '7 Frontier Tiers · Tool-Less Diff Audit',
    caption:
      'Seamless --resume rotation across quota-governed 5-hour rate windows (Claude Fable 5.2 → Gemini 4 Carbon → Codex GPT-6 Astra → Claude Opus 5.5 → Gemini 4 Argon → Codex GPT-6.1 Sol → Grok 4.7) paired with kernel-sealed advisors that caught a live assert.equal monkey-patch.',
  },
  {
    id: 'graphify',
    code: '05 / GRAPHIFY STRUCTURAL MAP',
    tabLabel: '05 Graphify AST Map',
    title: 'Persistent Knowledge Graph & Blast-Radius Topology',
    src: '/assets/showcase/karpathy-loop-harness/05-graphify-knowledge-graph.webp',
    src640: '/assets/showcase/karpathy-loop-harness/05-graphify-knowledge-graph-640.webp',
    alt: 'Graphify knowledge graph topology highlighting module communities, god-nodes, and dependency edges',
    plane: 'EVIDENCE PLANE · Structural Memory',
    metric: '20,911+ Nodes · Deterministic Bisect',
    caption:
      'Before a worker touches source files, Perihelion queries structural dependency communities and contract edges so unit scopes stay surgical and cross-module regressions are caught before merge.',
  },
]);

// ============================================================================
// Site-wide Horological & Interactive Instrument Wiring
// ============================================================================

export function mountSiteUI(doc = document) {
  const win = doc.defaultView;
  if (!win) return;

  // 1. Sticky Scroll-Progress Header & Mobile Drawer
  const header = doc.querySelector('.site-header');
  const navToggle = doc.querySelector('[data-nav-toggle]');
  const mainNav = doc.querySelector('#main-nav');

  const updateScroll = () => {
    if (!header) return;
    const scrolled = win.scrollY > 12;
    header.classList.toggle('is-scrolled', scrolled);
    const maxScroll = Math.max(1, doc.documentElement.scrollHeight - win.innerHeight);
    const ratio = Math.min(1, Math.max(0, win.scrollY / maxScroll));
    header.style.setProperty('--scroll-progress', ratio.toFixed(4));
  };
  updateScroll();
  win.addEventListener('scroll', updateScroll, { passive: true });
  win.addEventListener('resize', updateScroll, { passive: true });

  if (navToggle && mainNav) {
    const closeMenu = () => {
      mainNav.classList.remove('is-open');
      header?.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };
    navToggle.addEventListener('click', () => {
      const next = !mainNav.classList.contains('is-open');
      mainNav.classList.toggle('is-open', next);
      header?.classList.toggle('is-open', next);
      navToggle.setAttribute('aria-expanded', String(next));
    });
    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
    win.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        closeMenu();
        navToggle.focus();
      }
    });
  }

  // Active section observer for primary nav + field-notes TOC
  if ('IntersectionObserver' in win) {
    const navLinks = [...doc.querySelectorAll('.nav-list a[href^="#"], .contents nav a[href^="#"]')];
    const byId = new Map();
    navLinks.forEach((link) => {
      const id = link.getAttribute('href')?.slice(1);
      if (!id) return;
      if (!byId.has(id)) byId.set(id, []);
      byId.get(id).push(link);
    });
    const observer = new win.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          const groupSelector = entry.target.classList.contains('chapter')
            ? '.contents nav a[href^="#"]'
            : '.nav-list a[href^="#"]';
          doc.querySelectorAll(groupSelector).forEach((el) => el.classList.remove('is-active'));
          (byId.get(id) || []).forEach((el) => el.classList.add('is-active'));
        });
      },
      { rootMargin: '-18% 0px -68% 0px', threshold: 0 },
    );
    byId.forEach((_, id) => {
      const target = doc.getElementById(id);
      if (target) observer.observe(target);
    });
  }

  // 2. Dual-Face .dev / .com Medallion Vitrine & Motion Gate
  const reducedQuery = win.matchMedia?.('(prefers-reduced-motion: reduce)');
  let motionPaused = Boolean(reducedQuery?.matches);
  const syncMotion = () => {
    doc.documentElement.classList.toggle('motion-paused', motionPaused);
    doc.querySelectorAll('[data-motion-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(motionPaused));
      btn.textContent = motionPaused ? 'Resume motion' : 'Pause motion';
    });
  };

  const medallion = doc.querySelector('[data-medallion]');
  if (medallion) {
    const flipButtons = doc.querySelectorAll('[data-medallion-flip]');
    const faceStatus = medallion.querySelector('[data-medallion-status]');
    const stage = medallion.querySelector('[data-medallion-stage]');
    const comJump = medallion.querySelector('[data-medallion-com-link]');
    const finePointerQuery = win.matchMedia?.('(hover: hover) and (pointer: fine)');

    const setFace = (face) => {
      medallion.dataset.face = face;
      const isCom = face === 'com';
      flipButtons.forEach((btn) => {
        btn.setAttribute('aria-pressed', String(isCom));
      });
      if (faceStatus) {
        faceStatus.textContent = isCom
          ? 'COMMERCIAL STUDIO · THEHARNESSLAB.COM · CLIENT SOFTWARE & AUTOMATION'
          : 'ENGINEERING SEAL · THEHARNESSLAB.DEV · SYSTEMS R&D FOUNDRY';
      }
      if (comJump) {
        comJump.dataset.highlighted = String(isCom);
      }
    };

    flipButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        setFace(medallion.dataset.face === 'com' ? 'dev' : 'com');
      });
    });

    if (stage) {
      const clampTilt = (deg) => Math.max(-3.5, Math.min(3.5, deg));
      stage.addEventListener('pointermove', (e) => {
        if (motionPaused || reducedQuery?.matches || !finePointerQuery?.matches) return;
        if (e.pointerType && e.pointerType !== 'mouse') return;
        const rect = stage.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        stage.style.setProperty('--tilt-y', `${clampTilt(nx * 7).toFixed(2)}deg`);
        stage.style.setProperty('--tilt-x', `${clampTilt(-ny * 7).toFixed(2)}deg`);
      });
      stage.addEventListener('pointerleave', () => {
        stage.style.setProperty('--tilt-y', '0deg');
        stage.style.setProperty('--tilt-x', '0deg');
      });
    }

    doc.querySelectorAll('[data-motion-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        motionPaused = !motionPaused;
        if (motionPaused && stage) {
          stage.style.setProperty('--tilt-y', '0deg');
          stage.style.setProperty('--tilt-x', '0deg');
        }
        syncMotion();
      });
    });

    reducedQuery?.addEventListener?.('change', (e) => {
      motionPaused = e.matches;
      syncMotion();
    });

    setFace('dev');
    syncMotion();
  }

  // 3. Execution Lab / Karpathy Loop Switcher (stacked 0px-jump grid panels)
  const labTabs = [...doc.querySelectorAll('[data-lab-tab]')];
  const labPanels = [...doc.querySelectorAll('[data-lab-panel]')];
  if (labTabs.length && labPanels.length) {
    const selectLab = (targetName, focusTab = false) => {
      labTabs.forEach((tab) => {
        const active = tab.dataset.labTab === targetName;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        if (active && focusTab) tab.focus();
      });
      labPanels.forEach((panel) => {
        const active = panel.dataset.labPanel === targetName;
        panel.hidden = false;
        panel.classList.toggle('is-inactive', !active);
        panel.setAttribute('aria-hidden', String(!active));
        if ('inert' in panel) panel.inert = !active;
      });
    };
    labTabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => selectLab(tab.dataset.labTab));
      tab.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const next = labTabs[(idx + dir + labTabs.length) % labTabs.length];
        selectLab(next.dataset.labTab, true);
      });
    });
    selectLab('execution');
  }

  // 4. Perihelion 5-Zoom Cockpit Explorer + Native <dialog> Lightbox
  const explorer = doc.querySelector('[data-perihelion-explorer]');
  const lightbox = doc.querySelector('#perihelion-lightbox');
  if (explorer) {
    const tabs = [...explorer.querySelectorAll('[data-cockpit-tab]')];
    const panel = explorer.querySelector('#cockpit-panel');
    const img = explorer.querySelector('[data-cockpit-img]');
    const codeEl = explorer.querySelector('[data-cockpit-code]');
    const titleEl = explorer.querySelector('[data-cockpit-title]');
    const planeEl = explorer.querySelector('[data-cockpit-plane]');
    const metricEl = explorer.querySelector('[data-cockpit-metric]');
    const captionEl = explorer.querySelector('[data-cockpit-caption]');
    const zoomTrigger = explorer.querySelector('[data-cockpit-zoom]');
    const stageZoom = explorer.querySelector('[data-cockpit-stage-zoom]');
    let activeIndex = 0;
    let lastTrigger = null;

    const renderModal = () => {
      if (!lightbox) return;
      const plate = PERIHELION_PLATES[activeIndex];
      const modalImg = lightbox.querySelector('[data-lightbox-img]');
      const modalTitle = lightbox.querySelector('[data-lightbox-title]');
      const modalCounter = lightbox.querySelector('[data-lightbox-counter]');
      const modalCaption = lightbox.querySelector('[data-lightbox-caption]');
      if (modalImg) {
        modalImg.src = plate.src;
        modalImg.alt = plate.alt;
      }
      if (modalTitle) modalTitle.textContent = plate.title;
      if (modalCounter) modalCounter.textContent = `${activeIndex + 1} / ${PERIHELION_PLATES.length}`;
      if (modalCaption) modalCaption.textContent = plate.caption;
    };

    const selectPlate = (index, focusTab = false) => {
      activeIndex = (index + PERIHELION_PLATES.length) % PERIHELION_PLATES.length;
      const plate = PERIHELION_PLATES[activeIndex];
      tabs.forEach((tab, i) => {
        const active = i === activeIndex;
        tab.setAttribute('aria-selected', String(active));
        tab.classList.toggle('is-active', active);
        tab.tabIndex = active ? 0 : -1;
        if (active && focusTab) tab.focus();
      });
      if (panel && tabs[activeIndex]?.id) {
        panel.setAttribute('aria-labelledby', tabs[activeIndex].id);
      }
      if (img) {
        img.loading = 'eager';
        img.src = plate.src;
        img.srcset = `${plate.src640} 640w, ${plate.src} 1440w`;
        img.alt = plate.alt;
      }
      stageZoom?.setAttribute('aria-label', `Inspect full-resolution plate: ${plate.title}`);
      if (codeEl) codeEl.textContent = plate.code;
      if (titleEl) titleEl.textContent = plate.title;
      if (planeEl) planeEl.textContent = plate.plane;
      if (metricEl) metricEl.textContent = plate.metric;
      if (captionEl) captionEl.textContent = plate.caption;
      renderModal();
    };

    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => selectPlate(idx));
      tab.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        selectPlate(idx + (e.key === 'ArrowRight' ? 1 : -1), true);
      });
    });

    const openLightbox = (trigger) => {
      if (!lightbox || typeof lightbox.showModal !== 'function') return;
      lastTrigger = trigger;
      renderModal();
      lightbox.showModal();
    };

    zoomTrigger?.addEventListener('click', () => openLightbox(zoomTrigger));
    if (stageZoom) {
      stageZoom.addEventListener('click', () => openLightbox(stageZoom));
    } else {
      img?.addEventListener('click', () => openLightbox(zoomTrigger || img));
    }

    if (lightbox) {
      lightbox.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => {
        selectPlate(activeIndex - 1);
      });
      lightbox.querySelector('[data-lightbox-next]')?.addEventListener('click', () => {
        selectPlate(activeIndex + 1);
      });
      lightbox.querySelector('[data-lightbox-close]')?.addEventListener('click', () => {
        lightbox.close();
      });
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.close();
      });
      lightbox.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          selectPlate(activeIndex + 1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          selectPlate(activeIndex - 1);
        }
      });
      lightbox.addEventListener('close', () => {
        lastTrigger?.focus?.();
      });
    }
  }
}

if (typeof document !== 'undefined') {
  const execRoot = document.querySelector('[data-lab]');
  if (execRoot) mountLab(execRoot);
  const karpathyRoot = document.querySelector('[data-karpathy-lab]');
  if (karpathyRoot) mountKarpathyLab(karpathyRoot);
  mountSiteUI(document);
}
