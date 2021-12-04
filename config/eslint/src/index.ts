import prettierConfig from '@monstrs/config-prettier'

import rules          from './rules'

const parser = require.resolve('@typescript-eslint/parser')
const resolver = require.resolve('eslint-import-resolver-node')

export default {
  parser,
  env: { node: true, browser: true, jest: true, es6: true },
  globals: {},
  noInlineConfig: undefined,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      generators: false,
      objectLiteralDuplicateProperties: false,
    },
    ecmaVersion: 6,
    sourceType: 'module',
  },
  //plugins: ['import', 'react', 'jsx-a11y', 'react-hooks', '@typescript-eslint', 'prettier'],
  plugins: ['react', 'jsx-a11y', 'react-hooks', '@typescript-eslint'],
  reportUnusedDisableDirectives: true,

  rules: {
    ...rules,
    //'prettier/prettier': ['error', prettierConfig],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '.mts', '.mtsx'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
  settings: {
    react: {
      pragma: 'React',
      version: '17.0.2',
    },
    'import/parsers': {
      [parser]: ['.ts', '.tsx', '.mts', '.mtsx', '.d.ts'],
    },
    'import/resolver': {
      [resolver]: {
        extensions: ['.mjs', '.mts', '.mtsx', '.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    },
    'import/extensions': ['.js', '.ts', '.mjs', '.jsx', '.tsx', '.mts', '.mtsx'],
    propWrapperFunctions: ['forbidExtraProps', 'exact', 'Object.freeze'],
    'import/core-modules': [],
    'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
  },
}
