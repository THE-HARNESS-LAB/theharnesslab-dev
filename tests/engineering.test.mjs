import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SCENARIOS,
  createRun,
  stepRun,
  reconcileRun,
  syntheticReceipt,
  callerState,
  mountLab,
  bootExecutionLab,
  KARPATHY_SCENARIOS,
  KARPATHY_STAGES,
  createKarpathyRun,
  stepKarpathyRun,
  karpathyState,
  formatResultsTsv,
  PERIHELION_PLATES,
} from '../engineering.mjs';

const advance = (run, count) => {
  for (let i = 0; i < count; i++) run = stepRun(run);
  return run;
};

const advanceKarpathy = (run, count) => {
  for (let i = 0; i < count; i++) run = stepKarpathyRun(run);
  return run;
};

// ============================================================================
// Original 13 Execution Lab tests (100% preserved)
// ============================================================================

test('normal run confirms exactly one dispatch with a bound receipt', () => {
  const run = advance(createRun(), 4);
  assert.equal(run.state, 'COMPLETED');
  assert.equal(run.dispatchCount, 1);
  assert.deepEqual(run.receipt, {
    operation: 'delivery/demo-01', destination: 'approved/demo', artifact: 'artifact/v1',
    id: 'receipt/demo-01', status: 'committed',
  });
  assert.deepEqual(run.journal.map(({ state }) => state), ['CREATED', 'VALIDATED', 'PREPARED', 'ATTEMPTING', 'COMPLETED']);
  assert.deepEqual(run.journal.map(({ revision }) => revision), [0, 1, 2, 3, 4]);
});

for (const [scenario, state] of [['evidence', 'BLOCKED_EVIDENCE'], ['policy', 'DENIED_POLICY'], ['mutation', 'REJECTED_MUTATION']]) {
  test(`${scenario} is rejected before any effect and cannot step past the gate`, () => {
    const run = advance(createRun(scenario), 8);
    assert.equal(run.state, state);
    assert.equal(run.dispatchCount, 0);
    assert.equal(run.receipt, null);
    assert.equal(stepRun(run), run);
    assert.equal(reconcileRun(run, syntheticReceipt(run)), run);
    if (scenario === 'mutation') {
      assert.equal(run.intent.artifact, 'artifact/v1');
      assert.equal(run.artifact, 'artifact/v2');
    }
  });
}

test('lost receipt leaves caller uncertain; reconciliation never redispatches', () => {
  const run = advance(createRun('timeout'), 4);
  assert.equal(run.state, 'UNCERTAIN');
  assert.equal(run.dispatchCount, 1);
  assert.equal(callerState(run).receipt, null);
  assert.equal(stepRun(run), run);
  const completed = reconcileRun(run, syntheticReceipt(run));
  assert.equal(completed.state, 'COMPLETED');
  assert.equal(completed.dispatchCount, 1);
  assert.equal(completed.revision, 5);
  assert.equal(stepRun(completed), completed);
  assert.equal(reconcileRun(completed, syntheticReceipt(completed)), completed);
});

for (const field of ['operation', 'destination', 'artifact', 'status', 'id']) {
  test(`reconciliation rejects a mismatched ${field}`, () => {
    const run = advance(createRun('timeout'), 4);
    const receipt = { ...syntheticReceipt(run), [field]: field === 'id' ? '' : 'unrelated' };
    const rejected = reconcileRun(run, receipt);
    assert.equal(rejected.state, 'UNCERTAIN');
    assert.equal(rejected.receipt, null);
    assert.equal(rejected.dispatchCount, 1);
    assert.equal(stepRun(rejected), rejected);
  });
}

test('absent provider receipt cannot establish completion', () => {
  const run = advance(createRun('timeout'), 4);
  assert.equal(reconcileRun(run, null).state, 'UNCERTAIN');
  assert.equal(syntheticReceipt(createRun()), null);
});

test('changed destination or operation invalidates prepared authority', () => {
  const prepared = advance(createRun(), 2);
  for (const changes of [{ destination: 'unapproved/demo' }, { operation: 'delivery/other' }]) {
    const run = stepRun({ ...prepared, ...changes });
    assert.equal(run.state, 'DENIED_POLICY');
    assert.equal(run.dispatchCount, 0);
  }
});

test('pure transitions preserve old snapshots and reject unknown scenarios', () => {
  const original = createRun();
  const snapshot = structuredClone(original);
  advance(original, 4);
  assert.deepEqual(original, snapshot);
  assert.throws(() => createRun('unknown'), RangeError);
});

// ============================================================================
// Karpathy Loop + Holdout Gate & Perihelion Exports tests
// ============================================================================

test('legacy and new module exports stay aligned', () => {
  assert.deepEqual(SCENARIOS, ['normal', 'timeout', 'evidence', 'policy', 'mutation']);
  assert.equal(bootExecutionLab, mountLab);
  assert.deepEqual(KARPATHY_SCENARIOS, [
    'verified_fix',
    'monkey_patched_assert',
    'null_test_failed',
    'transfer_hash_mismatch',
  ]);
  assert.deepEqual(KARPATHY_STAGES, [
    'BASELINE',
    'PATCH',
    'UNIT_CHECK',
    'HOLDOUT_CHECK',
    'COUNCIL_REVIEW',
    'KEEP',
  ]);
  assert.equal(PERIHELION_PLATES.length, 5);
});

test('verified_fix traverses full Karpathy Loop and commits KEEP to results.tsv', () => {
  const run = advanceKarpathy(createKarpathyRun('verified_fix'), 5);
  assert.equal(run.state, 'KEEP');
  assert.equal(run.worktreeHead, 'cand/3b8e10d');
  assert.equal(run.manifestVerified, true);
  assert.equal(run.vmPromptReleased, true);
  assert.equal(run.nullTestRedOnBase, true);
  assert.equal(run.unitSuite, 'pass');
  assert.equal(run.holdoutSuite, 'pass');
  assert.equal(run.councilVerdict, 'approved');
  assert.equal(run.failureCode, null);
  assert.deepEqual(run.journal.map(({ state }) => state), [
    'BASELINE',
    'PATCH',
    'UNIT_CHECK',
    'HOLDOUT_CHECK',
    'COUNCIL_REVIEW',
    'KEEP',
  ]);
  assert.deepEqual(run.resultsTsv, [
    { attempt: 1, commit: 'cand/3b8e10d', status: 'keep', reason: 'ALL_GATES_VERIFIED' },
  ]);
  assert.match(formatResultsTsv(run), /1\tcand\/3b8e10d\tkeep\tALL_GATES_VERIFIED/);
  assert.equal(stepKarpathyRun(run), run);
});

test('monkey_patched_assert passes mutable unit check, fails holdout + council, and triggers GIT_RESET_HARD', () => {
  const run = advanceKarpathy(createKarpathyRun('monkey_patched_assert'), 8);
  assert.equal(run.state, 'GIT_RESET_HARD');
  assert.equal(run.unitSuite, 'pass');
  assert.equal(run.holdoutSuite, 'fail');
  assert.match(run.councilVerdict, /assert\.equal/);
  assert.equal(run.worktreeHead, 'base/9f4c21a');
  assert.equal(run.candidateCommit, null);
  assert.equal(run.failureCode, 'MONKEY_PATCHED_ASSERT');
  assert.deepEqual(run.journal.map(({ state }) => state), [
    'BASELINE',
    'PATCH',
    'UNIT_CHECK',
    'HOLDOUT_CHECK',
    'COUNCIL_REVIEW',
    'GIT_RESET_HARD',
  ]);
  assert.deepEqual(run.resultsTsv, [
    { attempt: 1, commit: 'cand/3b8e10d', status: 'discard', reason: 'MONKEY_PATCHED_ASSERT' },
  ]);
  assert.equal(stepKarpathyRun(run), run);
});

test('null_test_failed rejects regression tests that pass on unchanged BASE via GIT_RESET_HARD', () => {
  const run = advanceKarpathy(createKarpathyRun('null_test_failed'), 8);
  assert.equal(run.state, 'GIT_RESET_HARD');
  assert.equal(run.nullTestRedOnBase, false);
  assert.equal(run.worktreeHead, 'base/9f4c21a');
  assert.equal(run.candidateCommit, null);
  assert.equal(run.failureCode, 'NULL_TEST_PASSED_ON_BASE');
  assert.deepEqual(run.journal.map(({ state }) => state), [
    'BASELINE',
    'PATCH',
    'UNIT_CHECK',
    'GIT_RESET_HARD',
  ]);
  assert.deepEqual(run.resultsTsv, [
    { attempt: 1, commit: 'cand/3b8e10d', status: 'discard', reason: 'NULL_TEST_PASSED_ON_BASE' },
  ]);
});

test('transfer_hash_mismatch blocks prompt release inside cloud VM before any patch', () => {
  const run = advanceKarpathy(createKarpathyRun('transfer_hash_mismatch'), 8);
  assert.equal(run.state, 'GIT_RESET_HARD');
  assert.equal(run.manifestVerified, false);
  assert.equal(run.vmPromptReleased, false);
  assert.equal(run.worktreeHead, 'base/9f4c21a');
  assert.equal(run.candidateCommit, null);
  assert.equal(run.failureCode, 'INPUT_TRANSFER_UNVERIFIED');
  assert.deepEqual(run.journal.map(({ state }) => state), ['BASELINE', 'GIT_RESET_HARD']);
  assert.deepEqual(run.resultsTsv, [
    { attempt: 1, commit: 'base/9f4c21a', status: 'crash', reason: 'INPUT_TRANSFER_UNVERIFIED' },
  ]);
});

test('Karpathy state machine is pure, exposes structured view, and rejects unknown scenarios', () => {
  const initial = createKarpathyRun('verified_fix');
  const snapshot = structuredClone(initial);
  const next = advanceKarpathy(initial, 3);
  assert.deepEqual(initial, snapshot);
  assert.equal(karpathyState(next).state, 'HOLDOUT_CHECK');
  assert.deepEqual(karpathyState(next).safetyGate, {
    macAccessLevel: 'off',
    githubConnected: false,
    creditSpendUsd: 0,
  });
  assert.throws(() => createKarpathyRun('invalid_mode'), RangeError);
});
