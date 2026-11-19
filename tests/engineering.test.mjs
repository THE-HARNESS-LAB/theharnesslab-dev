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
  QUAT_DEV,
  QUAT_COM,
  BEARING_TAU_SEC,
  MAX_SPIN_RAD_S,
  SETTLE_SPEED_RAD_S,
  quatNormalize,
  quatMultiply,
  quatFromAngularDelta,
  quatSlerpShortest,
  quatVisibleFace,
  quatToMatrix3d,
  quatToGlMat3,
  createBearingState,
  computeReleaseVelocity,
  stepBearingPhysics,
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

// ============================================================================
// 3D Quaternion & Heavy Steel-Bearing Medallion Physics tests
// ============================================================================

test('quaternion basis, matrix3d column-major output, and visible face match canonical seals', () => {
  assert.equal(quatVisibleFace(QUAT_DEV), 'dev');
  assert.equal(quatVisibleFace(QUAT_COM), 'com');
  assert.equal(quatToMatrix3d(QUAT_DEV), 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)');
  assert.equal(quatToMatrix3d(QUAT_COM), 'matrix3d(-1,0,0,0,0,1,0,0,0,0,-1,0,0,0,0,1)');

  // Multi-axis composition stays unit-norm with zero gimbal singularity at 90deg pitch
  let q = [...QUAT_DEV];
  q = quatNormalize(quatMultiply(quatFromAngularDelta(Math.PI / 2, 0, 0), q));
  q = quatNormalize(quatMultiply(quatFromAngularDelta(0, Math.PI / 3, 0.25), q));
  assert.ok(Math.abs(Math.hypot(...q) - 1) < 1e-9);
  assert.match(quatToMatrix3d(q), /^matrix3d\(/);
});

test('release velocity scales with drag aggression, caps at MAX_SPIN_RAD_S, and zeroes after pointer hold', () => {
  const gentle = computeReleaseVelocity(
    [
      { t: 0, drx: 0, dry: 0, drz: 0 },
      { t: 40, drx: 0.04, dry: 0.06, drz: 0 },
      { t: 80, drx: 0.04, dry: 0.06, drz: 0 },
    ],
    82,
  );
  const aggressive = computeReleaseVelocity(
    [
      { t: 0, drx: 0, dry: 0, drz: 0 },
      { t: 25, drx: -0.55, dry: 0.72, drz: 0.03 },
      { t: 50, drx: -0.62, dry: 0.84, drz: 0.04 },
    ],
    52,
  );
  const gentleSpeed = Math.hypot(...gentle);
  const aggressiveSpeed = Math.hypot(...aggressive);
  assert.ok(gentleSpeed > 1 && gentleSpeed < 4, `gentle speed ${gentleSpeed}`);
  assert.ok(aggressiveSpeed > 25 && aggressiveSpeed <= MAX_SPIN_RAD_S + 1e-9, `aggressive speed ${aggressiveSpeed}`);
  assert.ok(aggressive[0] < 0 && aggressive[1] > 0, 'preserves diagonal 3D spin direction');

  const heldStill = computeReleaseVelocity(
    [
      { t: 0, drx: 0, dry: 0, drz: 0 },
      { t: 30, drx: 0.5, dry: 0.5, drz: 0 },
    ],
    160,
  );
  assert.deepEqual(heldStill, [0, 0, 0]);
});

test('fast flick coasts smoothly for 6-9 seconds on bearings and settles upright without upside-down parking', () => {
  assert.equal(BEARING_TAU_SEC, 3.2);
  assert.equal(SETTLE_SPEED_RAD_S, 1.1);

  let state = {
    ...createBearingState('dev'),
    mode: 'spin',
    omega: [-14, 22, 1.5], // ~26.1 rad/s diagonal fast flick
    active: true,
  };
  let elapsed = 0;
  const dt = 1 / 60;
  while (state.active && elapsed < 15) {
    state = stepBearingPhysics(state, dt);
    elapsed += dt;
  }
  assert.equal(state.active, false, 'bearing spin eventually comes to rest');
  assert.ok(elapsed >= 6.0 && elapsed <= 9.6, `expected 6-9s heavy bearing spin, got ${elapsed.toFixed(2)}s`);
  const target = state.face === 'com' ? QUAT_COM : QUAT_DEV;
  const dot = Math.abs(
    state.q[0] * target[0] + state.q[1] * target[1] + state.q[2] * target[2] + state.q[3] * target[3],
  );
  assert.ok(1 - dot < 1e-5, 'settled cleanly to canonical upright seal orientation');

  // Upside-down reverse face [0, 1, 0, 0] rights smoothly to upright QUAT_COM [0, 0, 1, 0]
  let inverted = {
    ...createBearingState('com'),
    mode: 'spin',
    q: [0, 1, 0, 0],
    omega: [0.2, 0, 0],
    face: 'com',
    active: true,
  };
  for (let i = 0; i < 240 && inverted.active; i += 1) {
    inverted = stepBearingPhysics(inverted, 1 / 60);
  }
  assert.equal(inverted.active, false);
  assert.equal(inverted.face, 'com');
  assert.equal(quatToMatrix3d(inverted.q), quatToMatrix3d(QUAT_COM));

  // Quick-click flip transitions cleanly to opposite face
  let flip = {
    ...createBearingState('dev'),
    mode: 'flip',
    flipElapsed: 0,
    flipDuration: 0.68,
    flipStartQ: [...QUAT_DEV],
    flipTargetFace: 'com',
    active: true,
  };
  for (let i = 0; i < 60 && flip.active; i += 1) {
    flip = stepBearingPhysics(flip, 1 / 60);
  }
  assert.equal(flip.active, false);
  assert.equal(flip.face, 'com');
  assert.equal(quatToMatrix3d(flip.q), quatToMatrix3d(QUAT_COM));
});

test('quatToGlMat3 maps CSS 3D bearing orientation cleanly into orthonormal WebGL SO(3) space', () => {
  const mDev = quatToGlMat3(QUAT_DEV);
  assert.equal(mDev.length, 9);
  assert.deepEqual([...mDev], [1, 0, 0, 0, 1, 0, 0, 0, 1]);

  const mCom = quatToGlMat3(QUAT_COM);
  assert.deepEqual([...mCom].map((n) => (Math.abs(n) < 1e-6 ? 0 : n)), [-1, 0, 0, 0, 1, 0, 0, 0, -1]);

  // Drag right (positive dry): front normal (0,0,+1) tilts toward +X in WebGL
  const qRight = quatFromAngularDelta(0, 0.7, 0);
  const mRight = quatToGlMat3(qRight);
  assert.ok(mRight[6] > 0.6, `expected front normal +X > 0.6, got ${mRight[6]}`);
  assert.ok(Math.abs(mRight[7]) < 1e-6);

  // Drag down (negative drx): front normal (0,0,+1) tilts toward -Y (down) in WebGL (+Y up)
  const qDown = quatFromAngularDelta(-0.7, 0, 0);
  const mDown = quatToGlMat3(qDown);
  assert.ok(mDown[7] < -0.6, `expected front normal -Y < -0.6, got ${mDown[7]}`);

  // Arbitrary 3D diagonal orientation stays proper SO(3): R^T R = I and det(R) = +1
  const qDiag = quatNormalize(
    quatMultiply(quatFromAngularDelta(-0.55, 0.82, 0.31), quatFromAngularDelta(0.2, -0.4, 0.15)),
  );
  const m = quatToGlMat3(qDiag);
  const det =
    m[0] * (m[4] * m[8] - m[7] * m[5]) -
    m[3] * (m[1] * m[8] - m[7] * m[2]) +
    m[6] * (m[1] * m[5] - m[4] * m[2]);
  assert.ok(Math.abs(det - 1) < 1e-5, `expected det=+1, got ${det}`);
  for (let col = 0; col < 3; col += 1) {
    const lenSq = m[col * 3] ** 2 + m[col * 3 + 1] ** 2 + m[col * 3 + 2] ** 2;
    assert.ok(Math.abs(lenSq - 1) < 1e-5, `column ${col} unit length`);
  }
});
