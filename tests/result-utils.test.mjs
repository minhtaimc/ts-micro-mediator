import test from 'node:test';
import assert from 'node:assert/strict';
import { ensureBuild } from './helpers/ensure-build.mjs';

test('isResult validates genuine Result objects only', async () => {
  await ensureBuild();

  const [{ isResult }, { ok }] = await Promise.all([
    import('../dist/result-utils.js'),
    import('ts-micro-result')
  ]);

  const success = ok({ id: '1' });
  assert.equal(isResult(success), true, 'Expected ok() helper to produce a Result');

  const fake = { isOk: () => true, isError: () => false, hasWarning: () => false, errors: [] };
  assert.equal(isResult(fake), false, 'Plain object should not be treated as Result');

  assert.equal(isResult(null), false);
  assert.equal(isResult({}), false);
});
