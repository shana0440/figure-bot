module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/eslint-recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    indent: ['error', 2, { SwitchCase: 1, ignoredNodes: 'ConditionalExprssion' }],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-console': 0,
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'none',
      },
    ],
  },
};
