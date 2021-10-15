import { setOwner } from '@ember/application';
import { getContext, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

import { queryParam } from 'ember-query-params-service';

import type ApplicationInstance from '@ember/application/instance';

function getOwner() {
  const { owner } = getContext() as any;

  return owner as ApplicationInstance;
}

export function getService<T>(name: string): T {
  const service = getOwner().lookup(`service:${name}`);

  return service;
}

module('Unit | Utility | @queryParam', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    await visit('/');
  });

  module('a default value is set', function (hooks) {
    class Scenario {
      @queryParam strongestAvenger: string | undefined = 'Captain Marvel';
    }

    let scenario: Scenario;

    hooks.beforeEach(function () {
      scenario = new Scenario();
      setOwner(scenario, getOwner());
    });

    test('a default value can be used', function (assert) {
      assert.equal(scenario.strongestAvenger, 'Captain Marvel');
    });

    test('the URL does not contain the default value', function (assert) {
      assert.notOk(
        window.location.search.includes('strongestAvenger'),
        'the query param should not exist'
      );
    });

    module('the param becomes set', function (hooks) {
      hooks.beforeEach(function () {
        scenario.strongestAvenger = 'Thor';
      });

      test('the default is no longer returned', function (assert) {
        assert.equal(scenario.strongestAvenger, 'Thor');
      });

      module('the param becomes unset', function (hooks) {
        hooks.beforeEach(function () {
          scenario.strongestAvenger = undefined;
        });

        test('the default value is back', function (assert) {
          assert.equal(scenario.strongestAvenger, 'Captain Marvel');
        });
      });
    });
  });

  module('a different name can be used on the url', function (hooks) {
    class Scenario {
      @queryParam('strongest-avenger') strongestAvenger: string | undefined = 'Captain Marvel';
    }

    let scenario: Scenario;

    hooks.beforeEach(function () {
      scenario = new Scenario();
      setOwner(scenario, getOwner());
      scenario.strongestAvenger = 'Thor';
    });

    test('the URL contains the correct name', function (assert) {
      assert.ok(
        window.location.search.includes('strongest-avenger'),
        'the correct name is used in the URL'
      );
      assert.ok(
        window.location.search.includes('strongest-avenger=Thor'),
        'the correct name has the correct value'
      );
    });
  });
});
