import test from 'node:test';
import assert from 'node:assert/strict';
import { ensureBuild } from './helpers/ensure-build.mjs';

class BadRequest {
  constructor(data = {}) {
    Object.assign(this, data);
  }
}

test('Mediator returns standardized error when handler output is invalid', async () => {
  await ensureBuild();
  const [{ Mediator }, { Registry }] = await Promise.all([
    import('../dist/mediator.js'),
    import('../dist/registry.js')
  ]);

  const registry = new Registry();
  registry.registerHandler('BadRequest', async () => {
    return { foo: 'bar' };
  });

  const mediator = new Mediator(registry);
  const result = await mediator.send(new BadRequest());

  assert.equal(result.isError(), true);
  assert.equal(result.errors[0]?.code, 'INVALID_HANDLER_RESULT');
});
