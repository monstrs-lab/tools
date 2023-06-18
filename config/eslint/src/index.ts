import type { Linter }        from 'eslint'

import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import parser                 from '@typescript-eslint/parser'
import nextjsPlugin           from '@next/eslint-plugin-next'
import jsxA11yPlugin          from 'eslint-plugin-jsx-a11y'
import reactPlugin            from 'eslint-plugin-react'
import reactHooksPlugin       from 'eslint-plugin-react-hooks'
import nodePlugin             from 'eslint-plugin-n'
import securityPlugin         from 'eslint-plugin-security'

import { typescript }         from './rules/index.js'
import { security }           from './rules/index.js'
import { nextjs }             from './rules/index.js'
import { react }              from './rules/index.js'
import { node }               from './rules/index.js'
import { base }               from './rules/index.js'

const config: Array<Linter.FlatConfig> = [
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    rules: {
      ...typescript,
      ...security,
      ...nextjs,
      ...react,
      ...node,
      ...base,
    },
    plugins: {
      'eslint-plugin-react-hooks': reactHooksPlugin,
      // @ts-expect-error
      '@typescript-eslint': typescriptEslintPlugin,
      'react-hooks': reactHooksPlugin,
      '@next/next': nextjsPlugin,
      'jsx-a11y': jsxA11yPlugin,
      n: nodePlugin,
      security: securityPlugin,
      react: reactPlugin,
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    settings: {
      react: {
        pragma: 'React',
        version: '18',
      },
      propWrapperFunctions: ['forbidExtraProps', 'exact', 'Object.freeze'],
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {},
      // @ts-expect-error
      parser,
      parserOptions: {
        project: true,
        ecmaFeatures: {
          jsx: true,
          generators: false,
          objectLiteralDuplicateProperties: false,
        },
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },
]

export default config
