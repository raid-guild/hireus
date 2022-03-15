const defaultRules = [
  'react-app',
  'eslint:recommended',
  'prettier',
  // any other plugins or custom configuration you'd like to extend from.
];

const envRule = process.env.NODE_ENV === 'production' ? 'error' : 'warn';

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  extends: defaultRules,
  rules: {
    'array-callback-return': 'warn',
    'consistent-return': 'warn',
    'default-case': 'warn',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    // etc.
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: ['@typescript-eslint', 'simple-import-sort'],
      extends: [
        ...defaultRules,
        'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
        // any other TypeScript specific config (from a plugin, or custom)
      ],
      rules: {
        'react-hooks/exhaustive-deps': envRule,
        'react/prop-types': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/no-explicit-any': envRule,
        '@typescript-eslint/no-unused-vars': envRule,
        '@typescript-eslint/no-unused-expressions': 'warn',
        'react/react-in-jsx-scope': 'off',
        'jsx-a11y/img-redundant-alt': envRule,
        'simple-import-sort/imports': envRule,
        'simple-import-sort/exports': envRule,
        'no-console': envRule,
        'prettier/prettier': [
          envRule,
          {
            endOfLine: 'auto',
          },
        ],
        // etc.
      },
    },
  ],
  settings: {
    react: {
      // React version. "detect" automatically picks the version you have installed.
      version: 'detect',
    },
  },
};
