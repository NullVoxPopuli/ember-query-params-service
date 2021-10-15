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

  module('Params with default values as strings', function (hooks) {
    class Scenario {
      @queryParam('strongest-avenger', { defaultValue: 'Thor'}) strongestAvenger: string | undefined;
    }

    let scenario: Scenario;

    hooks.beforeEach(function () {
      scenario = new Scenario();
      setOwner(scenario, getOwner());
    });

    test('gets the default value from the options', function (assert) {
      assert.equal(
        scenario.strongestAvenger,
        'Thor',
        'default value from options'
      );
    });

    test('the URL does not contain the param when it is the default', function (assert) {
      debugger;
      scenario.strongestAvenger = 'Captain Marvel';
      assert.ok(
        window.location.search.includes('strongest-avenger'),
        'the param is present'
      );
      scenario.strongestAvenger = 'Thor';
      assert.notOk(
        window.location.search.includes('strongest-avenger=Thor'),
        'the param is not present'
      );
      assert.equal(
        scenario.strongestAvenger,
        'Thor',
        'the param still has correct value'
      );
    });
  });

  module('Params with default values as booleans', function () {

    module('default is false', function (hooks) {
      class Scenario {
        @queryParam('active', {defaultValue: false}) active: boolean | undefined;
      }

      let scenario: Scenario;

      hooks.beforeEach(function () {
        scenario = new Scenario();
        setOwner(scenario, getOwner());
      });

      test('gets the default value from the options', function (assert) {
        assert.equal(
          scenario.active,
          false,
          'default value from options'
        );
      });

      test('the URL does not contain the param when it is the default', function (assert) {
        scenario.active = true;
        assert.ok(
          window.location.search.includes('active'),
          'the param is present'
        );
        scenario.active = false;
        assert.notOk(
          window.location.search.includes('active'),
          'the param is not present'
        );
        assert.equal(
          scenario.active,
          false,
          'the param still has correct value'
        );
      });
    });

    module('default is true', function (hooks) {
      class Scenario {
        @queryParam('active', {defaultValue: true}) active: boolean | undefined;
      }

      let scenario: Scenario;

      hooks.beforeEach(function () {
        scenario = new Scenario();
        setOwner(scenario, getOwner());
      });

      test('gets the default value from the options', function (assert) {
        assert.equal(
          scenario.active,
          true,
          'default value from options'
        );
      });

      test('the URL does not contain the param when it is the default', function (assert) {
        scenario.active = false;
        assert.ok(
          window.location.search.includes('active'),
          'the param is present'
        );
        scenario.active = true;
        assert.notOk(
          window.location.search.includes('active'),
          'the param is not present'
        );
        assert.equal(
          scenario.active,
          true,
          'the param still has correct value'
        );
      });
    });
  });

  module('Params with default values as numbers', function () {

    module('default is 0', function (hooks) {
      class Scenario {
        @queryParam('page', {defaultValue: 0}) page: number | undefined;
      }

      let scenario: Scenario;

      hooks.beforeEach(function () {
        scenario = new Scenario();
        setOwner(scenario, getOwner());
      });

      test('gets the default value from the options', function (assert) {
        assert.equal(
          scenario.page,
          0,
          'default value from options'
        );
      });

      test('the URL does not contain the param when it is the default', function (assert) {
        debugger;
        scenario.page = 1;
        assert.ok(
          window.location.search.includes('page'),
          'the param is present'
        );
        scenario.page = 0;
        assert.notOk(
          window.location.search.includes('page'),
          'the param is not present'
        );
        assert.equal(
          scenario.page,
          0,
          'the param still has correct value'
        );
      });
    });

    module('default is 1', function (hooks) {
      class Scenario {
        @queryParam('page', {defaultValue: 1}) page: number | undefined;
      }

      let scenario: Scenario;

      hooks.beforeEach(function () {
        scenario = new Scenario();
        setOwner(scenario, getOwner());
      });

      test('gets the default value from the options', function (assert) {
        assert.equal(
          scenario.page,
          1,
          'default value from options'
        );
      });

      test('the URL does not contain the param when it is the default', function (assert) {
        debugger;
        scenario.page = 0;
        assert.ok(
          window.location.search.includes('page'),
          'the param is present'
        );
        scenario.page = 1;
        assert.notOk(
          window.location.search.includes('page'),
          'the param is not present'
        );
        assert.equal(
          scenario.page,
          1,
          'the param still has correct value'
        );
      });
    });
  });

});
