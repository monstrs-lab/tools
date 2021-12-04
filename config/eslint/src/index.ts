import type { Linter } from 'eslint'

import rules           from './rules'

const config: Linter.Config<Linter.RulesRecord> = {
  parser: require.resolve('@typescript-eslint/parser'),
  env: { node: true, browser: true, jest: true, es6: true },
  globals: {},
  noInlineConfig: undefined,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      generators: false,
      objectLiteralDuplicateProperties: false,
    },
    ecmaVersion: 6 as any,
    sourceType: 'module' as any,
  },
  plugins: ['react', 'jsx-a11y', 'react-hooks', '@typescript-eslint'],
  reportUnusedDisableDirectives: true,

  rules,
  overrides: [
    {
      files: ['*.ts', '*.tsx', '.mts', '.mtsx'],
    },
  ],
  settings: {
    react: {
      pragma: 'React',
      version: '17.0.2',
    },
    propWrapperFunctions: ['forbidExtraProps', 'exact', 'Object.freeze'],
  },
}

export default config
