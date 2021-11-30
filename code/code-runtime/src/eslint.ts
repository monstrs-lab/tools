/* eslint-disable global-require */

import { dymanicRequire } from './utils'

export const eslint = dymanicRequire.resolve('eslint')
export const eslintConfig = dymanicRequire.resolve('@monstrs/eslint-config')

export const eslintPlugins = {
  import: require('eslint-plugin-import'),
  react: require('eslint-plugin-react'),
  'jsx-a11y': require('eslint-plugin-jsx-a11y'),
  'react-hooks': require('eslint-plugin-react-hooks'),
  '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
  prettier: require('eslint-plugin-prettier'),
  'eslint-plugin-react-hooks': require('eslint-plugin-react-hooks'),
}
