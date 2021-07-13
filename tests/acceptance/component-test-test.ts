import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | component test', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /baz', async function(assert) {
    await visit('/baz');
    await click('[data-test-qp-update]');
    assert
      .dom('[data-test-qp-state]')
      .hasText('new', 'The query parameter has been updated in the component and is reflected on screen');
  });
});
