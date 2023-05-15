import typescriptEslint       from '@typescript-eslint/eslint-plugin'
import parser                 from '@typescript-eslint/parser'
import nextjs                 from '@next/eslint-plugin-next'
import jsxA11y                from 'eslint-plugin-jsx-a11y'
import react                  from 'eslint-plugin-react'
import reactHooks             from 'eslint-plugin-react-hooks'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import node                   from 'eslint-plugin-n'
import security               from 'eslint-plugin-security'

import { rules }              from './rules/index.js'

export default [
  {
    rules,
    plugins: {
      'eslint-plugin-react-hooks': eslintPluginReactHooks,
      '@typescript-eslint': typescriptEslint,
      'react-hooks': reactHooks,
      '@next/next': nextjs,
      'jsx-a11y': jsxA11y,
      n: node,
      security,
      react,
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
]
