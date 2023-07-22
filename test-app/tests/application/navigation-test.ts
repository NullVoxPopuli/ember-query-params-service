import { click, currentRouteName, currentURL, settled, visit } from '@ember/test-helpers';
import { module, skip, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

import { getQPService } from '../get-service';

import type { QueryParamsService } from 'ember-query-params-service';

module('Acceptance | Navigation', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    await visit('/');
  });

  hooks.afterEach(function () {
    let service = getQPService();

    Object.keys(service.current).forEach((key) => {
      service.current[key] = undefined;
      delete service.current[key];
    });
  });

  test('initially, no query params are set', function (assert) {
    let service = getQPService();
    let queryParams = Object.keys(service.current);

    assert.strictEqual(queryParams.length, 0, 'there are 0 query params');
  });

  module('setting query params', function (hooks) {
    hooks.beforeEach(async function () {
      await visit('/');
    });

    module('setting on a route that we are not currently on', function (hooks) {
      hooks.beforeEach(function (assert) {
        assert.equal(currentRouteName(), 'index');
        assert.notOk(
          window.location.search.includes('a=1'),
          'the query param should not exist yet'
        );

        getQPService().byPath['/foo'] = { a: 1 };
      });

      test('the URL is not updated', function (assert) {
        assert.strictEqual(currentURL(), '/');
        assert.notOk(
          window.location.search.includes('a=1'),
          'the query param should not exist yet'
        );
      });

      test('the services current query params are not populated', function (assert) {
        let service = getQPService();

        assert.deepEqual(service.current, {}, 'the current set of query params is empty');
        assert.strictEqual(
          service.byPath['/']?.['a'],
          undefined,
          'the current path entry in byPath does not have the query param'
        );
      });

      module(
        'when navigating to the route that we had previously set query params on',
        function (hooks) {
          hooks.beforeEach(async function () {
            await visit('foo');
          });

          test('the query params appear', function (assert) {
            const qp = window.location.search;

            assert.ok(qp.includes('a=1'), `a=1 should exist in the URL: ${qp || 'not set'}`);
          });

          test('the services current query params are populated', function (assert) {
            let service = getQPService();

            assert.strictEqual(service.current['a'], 1, 'the value on current query params is set');
            assert.strictEqual(
              service.byPath['/foo']?.['a'],
              1,
              'the value is set on the byPath cache'
            );
          });
        }
      );
    });

    module('sets query params on the active route', function (hooks) {
      hooks.beforeEach(function (assert) {
        assert.equal(currentRouteName(), 'index');
        assert.notOk(
          window.location.search.includes('a=1'),
          'the query param should not exist yet'
        );

        getQPService().current['a'] = '1';
      });

      test('the URL is updated', function (assert) {
        assert.ok(window.location.search.includes('a=1'));
      });

      test('the services current query params are populated', function (assert) {
        let service = getQPService();

        assert.strictEqual(service.current['a'], '1');
        assert.strictEqual(service.byPath['/']?.['a'], '1');
      });

      test('the question mark is not displayed if there are no query params', function (assert) {
        assert.ok(window.location.search.includes('?'));
        getQPService().current['a'] = undefined;
        assert.notOk(window.location.search.includes('?'));
      });
    });
  });

  module('default values', function () {
    test('a default value does not affect the URL', async function (assert) {
      assert
        .dom('[data-test-strongest-avenger] span')
        .containsText('Captain Marvel', 'default value is present');
      assert.notOk(window.location.search.includes('Captain'), 'the query param should not exist');
    });

    module('the value is set', function (hooks) {
      hooks.beforeEach(async function () {
        await click('[data-test-strongest-avenger] [data-test-set]');
      });

      test('the default value is no longer present', function (assert) {
        assert
          .dom('[data-test-strongest-avenger] span')
          .containsText('Thor', 'set value is present');
        assert.dom('[data-test-strongest-avenger] span').doesNotContainText('Captain');
        assert.ok(window.location.search.includes('Thor'), 'the query param should exist');
      });

      module('the value is unset', function (hooks) {
        hooks.beforeEach(async function () {
          await click('[data-test-strongest-avenger] [data-test-unset]');
        });

        test('the default value is present once again', function (assert) {
          assert
            .dom('[data-test-strongest-avenger] span')
            .containsText('Captain', 'default value is present');
          assert.dom('[data-test-strongest-avenger] span').doesNotContainText('Thor');

          assert.notOk(
            window.location.search.includes('Captain'),
            'the query param should not exist'
          );
        });
      });
    });
  });

  module('visiting a path with query params', function (hooks) {
    hooks.beforeEach(async function () {
      await visit('/foo?a=1');
    });

    test('the service shows a query param', function (assert) {
      let service = getQPService();
      let queryParams = Object.keys(service.current);

      assert.ok(queryParams.includes('a'), 'has the queryParam "a"');
      assert.strictEqual(service.current['a'], '1');
    });

    module('setting a query param is reflected in the URL', function (hooks) {
      let service: QueryParamsService;

      hooks.beforeEach(function () {
        service = getQPService();

        service.current['b'] = '2';
      });

      test('the old query param is still present', function (assert) {
        let queryParams = Object.keys(service.current);

        assert.ok(queryParams.includes('a'), 'has the queryParam "a"');
        assert.strictEqual(service.current['a'], '1');
      });

      test('there is a new query param as well', function (assert) {
        let queryParams = Object.keys(service.current);

        assert.ok(queryParams.includes('b'), 'has the queryParam "b"');
        assert.strictEqual(service.current['b'], '2');
      });
    });

    module('visiting a different route', function (hooks) {
      hooks.beforeEach(async function () {
        await visit('/bar');
      });

      test('the query params are cleared', function (assert) {
        let service = getQPService();
        let queryParams = Object.keys(service.current);

        assert.strictEqual(
          queryParams.length,
          0,
          `there are 0 query params: (${JSON.stringify(service.current)})`
        );
      });

      module('navigating bock to the previous route', function (hooks) {
        hooks.beforeEach(async function () {
          // how do you test going back?
          // currently this navigates away from the test window...
          window.history.back();
          await settled();
        });

        skip('the service shows a query param', function (assert) {
          let service = getQPService();
          let queryParams = Object.keys(service.current);

          assert.ok(queryParams.includes('a'), 'has the queryParam "a"');
          assert.equal(service.current['a'], '1');
        });
      });
    });
  });

  module('query param is reflected in the URL sorted', function (hooks) {
    let service: QueryParamsService;

    hooks.beforeEach(function () {
      service = getQPService();
    });

    test('setting params', function (assert) {
      service.current['delta'] = '4';
      service.current['beta'] = '2';

      let indexDelta = window.location.search.indexOf('delta');
      let indexBeta = window.location.search.indexOf('beta');

      assert.ok(indexBeta < indexDelta, 'params are sorted');
    });

    test('visiting a route', async function (assert) {
      await visit('/bar?b=4&a=2');

      let indexB = window.location.search.indexOf('b');
      let indexA = window.location.search.indexOf('a');

      assert.ok(indexA < indexB, 'params are sorted');
    });
  });

  // module('locationType is the default and there is a hash in the URL', function () {});
});
