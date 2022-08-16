module.exports = {
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  env: {
    browser: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true,
    },
  },

  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    semi: ['error', 'never'],
    'comma-dangle': ['error', 'only-multiline'],
    'arrow-parens': ['error', 'as-needed'],
    'consistent-return': 'off',
    'no-restricted-globals': 'off',
    'global-require': 'off',
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    'no-plusplus': 'off',
    'object-curly-newline': 'off',
    'class-methods-use-this': 'off',
    'no-use-before-define': 'off',
    radix: 'off',
    'operator-linebreak': 'off',
    'implicit-arrow-linebreak': 'off',
    'no-restricted-syntax': 'off',
    'max-len': 'off',

    'react/jsx-filename-extension': [
      0,
      {
        extensions: ['.ts', 'tsx'],
      },
    ],
    'react/jsx-wrap-multilines': 'off',
    'react/prop-types': 'off',
    'react/destructuring-assignment': 'off',
    'react/no-danger': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/function-component-definition': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'react/no-array-index-key': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-unescaped-entities': 'off',
    'jsx-curly-brace-presence': 'off',
    'react/jsx-curly-brace-presence': 'off',

    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/alt-text': 'off',
    'jsx-a11y/media-has-caption': 'off',

    'import/no-dynamic-require': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',

    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    indent: 'off',
    '@typescript-eslint/indent': ['error', 2],
  },
}
