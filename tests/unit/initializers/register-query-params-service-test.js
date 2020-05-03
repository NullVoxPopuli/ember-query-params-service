import Application from '@ember/application';

import { initialize } from 'dummy/initializers/register-query-params-service';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Initializer | register-query-params-service', function (hooks) {
  setupTest(hooks);

  class TestApplication extends Application {}

  hooks.beforeEach(function () {
    TestApplication.initializer({
      name: 'initializer under test',
      initialize,
    });

    this.application = TestApplication.create({ autoboot: false });
  });

  hooks.afterEach(function () {
    run(this.application, 'destroy');
  });

  // Replace this with your real tests.
  test('it works', async function (assert) {
    await this.application.boot();

    assert.ok(true);
  });
});
