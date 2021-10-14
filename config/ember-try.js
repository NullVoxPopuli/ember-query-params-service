/* global Promise */
'use strict';

const getChannelURL = require('ember-source-channel-url');

const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = function () {
  return Promise.all([
    getChannelURL('release'),
    getChannelURL('beta'),
    getChannelURL('canary'),
  ]).then((urls) => {
    return {
      useYarn: true,
      scenarios: [
        embroiderSafe(),
        embroiderOptimized(),
        {
          name: 'ember-3.13',
          npm: { devDependencies: { 'ember-source': '~3.13' } },
        },
        {
          name: 'ember-3.14',
          npm: { devDependencies: { 'ember-source': '~3.14' } },
        },
        {
          name: 'ember-3.16',
          npm: { devDependencies: { 'ember-source': '~3.16' } },
        },
        {
          name: 'ember-3.18',
          npm: { devDependencies: { 'ember-source': '~3.18' } },
        },
        {
          name: 'ember-3.20',
          npm: { devDependencies: { 'ember-source': '~3.20' } },
        },
        {
          name: 'ember-3.24',
          npm: { devDependencies: { 'ember-source': '~3.24' } },
        },
        {
          name: 'ember-3.28',
          npm: { devDependencies: { 'ember-source': '~3.28' } },
        },
        {
          name: 'ember-release',
          npm: {
            devDependencies: { 'ember-source': urls[0], webpack: '^5.58.2' },
            dependencies: { 'ember-auto-import': '^2.2.2' },
          },
        },
        {
          name: 'ember-beta',
          npm: {
            devDependencies: { 'ember-source': urls[1], webpack: '^5.58.2' },
            dependencies: { 'ember-auto-import': '^2.2.2' },
          },
        },
        {
          name: 'ember-canary',
          npm: {
            devDependencies: { 'ember-source': urls[2], webpack: '^5.58.2' },
            dependencies: { 'ember-auto-import': '^2.2.2' },
          },
        },
        // The default `.travis.yml` runs this scenario via `yarn test`,
        // not via `ember try`. It's still included here so that running
        // `ember try:each` manually or from a customized CI config will run it
        // along with all the other scenarios.
        {
          name: 'ember-default',
          npm: {
            devDependencies: {},
          },
        },
      ],
    };
  });
};
