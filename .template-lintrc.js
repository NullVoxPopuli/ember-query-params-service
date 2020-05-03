'use strict';

module.exports = {
  extends: 'octane',
  rules: {
    quotes: 'single',
    'no-inline-styles': false,
    'no-implicit-this': true,
    'no-invalid-interactive': {
      additionalInteractiveTags: ['a'],
    },
    'attribute-indentation': false,
  },
};
