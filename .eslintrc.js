module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['ember', 'prettier', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  env: {
    browser: true,
  },
  rules: {
    // ember specific
    'ember/avoid-leaking-state-in-ember-objects': 'warn',
    'ember/no-ember-testing-in-module-scope': 'off', // needed for tasks atm
    'ember/use-brace-expansion': 'off', // won't matter with @tracked

    // cleanliness & consistency
    'no-console': 'warn',
    'no-cond-assign': 'off',
    'no-useless-escape': 'off',
    'require-yield': 'off',
    '@typescript-eslint/camelcase': 'off', // temp disable, because route params are snake case
    'getter-return': 'off',

    // typescript
    '@typescript-eslint/no-explicit-any': 'off', // someday we'll have decorator types
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    // this one has to be disabled, because not all of my deps use real types
    // ... or, my custom type defs are incorrect
    '@typescript-eslint/interface-name-prefix': 'off', // ['error', 'always'],
    // typescript isn't smart enough to know when we _know_ data will exist
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off', // implicit return types are fine

    // prettier
    'prettier/prettier': 'error',

    // better handled by prettier:
    '@typescript-eslint/indent': 'off',
  },
  overrides: [
    // node files
    {
      files: [
        '.ember-cli.js',
        '.eslintrc.js',
        '.prettierrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'index.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js',
      ],
      excludedFiles: ['addon/**', 'addon-test-support/**', 'app/**', 'tests/dummy/app/**'],
      env: {
        browser: false,
        node: true,
      },
      plugins: ['node'],
      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'node/no-unpublished-require': 'off', // we live dangerously here
        'node/no-extraneous-require': 'off', // incorrect?
      }),
    },
  ],
};
