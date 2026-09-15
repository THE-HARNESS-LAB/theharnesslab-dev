// A deterministic teaching model. No I/O, persistence, credentials, or real effects.
const scenarios = new Set(['normal', 'timeout', 'evidence', 'policy', 'mutation']);
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

if (typeof document !== 'undefined') {
  const root = document.querySelector('[data-lab]');
  if (root) mountLab(root);
}
