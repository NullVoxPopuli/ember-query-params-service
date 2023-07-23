'use strict';

const getChannelURL = require('ember-source-channel-url');

module.exports = async function () {
  return {
    usePnpm: true,
    command: 'pnpm turbo run test',
    buildManagerOptions() {
      return ['--ignore-scripts', '--no-frozen-lockfile', '--no-lockfile'];
    },
    scenarios: [
      {
        name: 'ember-3.13',
        npm: {
          devDependencies: {
            'ember-source': '~3.13',
            'ember-cli': '^4.0.0',
            'ember-qunit': '^5.0.0',
            '@ember/test-helpers': '^2.1.0',
            'ember-cli-htmlbars': '^5.0.0',
            '@embroider/core': null,
            '@embroider/compat': null,
            '@embroider/webpack': null,
          },
        },
      },
      {
        name: 'ember-3.14',
        npm: {
          devDependencies: {
            'ember-source': '~3.14',
            'ember-cli': '^4.0.0',
            'ember-qunit': '^5.0.0',
            '@ember/test-helpers': '^2.1.0',
            'ember-cli-htmlbars': '^5.0.0',
            '@embroider/core': null,
            '@embroider/compat': null,
            '@embroider/webpack': null,
          },
        },
      },
      {
        name: 'ember-3.16',
        npm: {
          devDependencies: {
            'ember-source': '~3.16',
            'ember-cli': '^4.0.0',
            'ember-qunit': '^5.0.0',
            '@ember/test-helpers': '^2.1.0',
            'ember-cli-htmlbars': '^5.0.0',
            '@embroider/core': null,
            '@embroider/compat': null,
            '@embroider/webpack': null,
          },
        },
      },
      {
        name: 'ember-3.18',
        npm: {
          devDependencies: {
            'ember-source': '~3.18',
            'ember-cli': '^4.0.0',
            'ember-qunit': '^5.0.0',
            '@ember/test-helpers': '^2.1.0',
            'ember-cli-htmlbars': '^5.0.0',
            '@embroider/core': null,
            '@embroider/compat': null,
            '@embroider/webpack': null,
          },
        },
      },
      {
        name: 'ember-3.20',
        npm: {
          devDependencies: {
            'ember-source': '~3.20',
            'ember-cli': '^4.0.0',
            'ember-qunit': '^5.0.0',
            '@ember/test-helpers': '^2.1.0',
            'ember-cli-htmlbars': '^5.0.0',
            '@embroider/core': null,
            '@embroider/compat': null,
            '@embroider/webpack': null,
          },
        },
      },
      {
        name: 'ember-3.24',
        npm: {
          devDependencies: {
            'ember-source': '~3.24',
            'ember-cli': '^4.0.0',
            'ember-qunit': '^5.0.0',
            '@ember/test-helpers': '^2.1.0',
            'ember-cli-htmlbars': '^5.0.0',
            '@embroider/core': null,
            '@embroider/compat': null,
            '@embroider/webpack': null,
          },
        },
      },
      {
        name: 'ember-3.28',
        npm: {
          devDependencies: {
            'ember-source': '~3.28',
            'ember-cli': '^4.0.0',
            'ember-qunit': '^5.0.0',
            '@ember/test-helpers': '^2.1.0',
          },
        },
      },
      {
        name: 'ember-4.4',
        npm: {
          devDependencies: {
            'ember-source': '~4.4.0',
          },
        },
      },
      {
        name: 'ember-4.8',
        npm: {
          devDependencies: {
            'ember-source': '~4.8.0',
          },
        },
      },
      {
        name: 'ember-4.12',
        npm: {
          devDependencies: {
            'ember-source': '~4.12.0',
          },
        },
      },
      {
        name: 'ember-5.0',
        npm: {
          devDependencies: {
            'ember-source': '~5.0.0',
          },
        },
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release'),
          },
        },
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('beta'),
          },
        },
      },
      {
        name: 'ember-canary',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('canary'),
          },
        },
      },
    ],
  };
};
