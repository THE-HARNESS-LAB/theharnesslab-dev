import test from 'node:test';
import assert from 'node:assert/strict';
import { createRun, stepRun, reconcileRun, syntheticReceipt, callerState } from '../engineering.mjs';

const advance = (run, count) => {
  for (let i = 0; i < count; i++) run = stepRun(run);
  return run;
};

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
