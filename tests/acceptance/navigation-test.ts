import { module, test } from 'qunit';
import { visit, currentURL, settled } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { getService } from '../helpers/get-service';
import QueryParamsService from 'ember-query-params-service/src/services/query-params';

function getQPService() {
  return getService<QueryParamsService>('query-params');
}

module('Acceptance | Navigation', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function() {
    await visit('/');
  });

  test('initially, no qeury params are set', function(assert) {
    let queryParams = Object.keys(getQPService().current);

    assert.ok(queryParams.length === 0, 'there are 0 query params');
  });

  module('visiting a path with query params', function(hooks) {
    hooks.beforeEach(async function() {
      await visit('/foo?a=1');
    });

    test('the service shows a query param', function(assert) {
      let service = getQPService()
      let queryParams = Object.keys(service.current);

      assert.ok(queryParams.includes('a'), 'has the queryParam "a"');
      assert.equal(service.current.a, '1');
    });

    module('setting a query param is reflected in the URL', function(hooks) {
      let service: QueryParamsService;

      hooks.beforeEach(function() {
        service = getQPService();

        service.current.b = '2';
      });

      test('the old query param is still present', function(assert) {
        let queryParams = Object.keys(service.current);

        assert.ok(queryParams.includes('a'), 'has the queryParam "a"');
        assert.equal(service.current.a, '1');
      });

      test('there is a new query param as well', function(assert) {
        let queryParams = Object.keys(service.current);

        assert.ok(queryParams.includes('b'), 'has the queryParam "b"');
        assert.equal(service.current.b, '2');
      });
    });

    module('visiting a different route', function(hooks) {
      hooks.beforeEach(async function() {
        await visit('/bar')
      });

      test('the query params are cleared', function(assert) {
        let service = getQPService()
        let queryParams = Object.keys(service.current);

        assert.ok(queryParams.length === 0, `there are 0 query params: (${JSON.stringify(service.current)})`);
      });

      module('navigating bock to the previous route', function(hooks) {
        hooks.beforeEach(async function() {
          window.history.back();
          await settled();
        });

        test('the service shows a query param', function(assert) {
          let service = getQPService()
          let queryParams = Object.keys(service.current);

          assert.ok(queryParams.includes('a'), 'has the queryParam "a"');
          assert.equal(service.current.a, '1');
        });
      });
    });
  });
});
