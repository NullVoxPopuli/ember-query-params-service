'use strict';

module.exports = {
  presets: ['@babel/preset-typescript'],
  plugins: [
    ['@babel/plugin-transform-typescript', { allowDeclareFields: true }],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-private-methods',
  ],
};
