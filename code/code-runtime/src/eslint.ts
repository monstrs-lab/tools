import { dymanicRequire } from './utils'

export const eslint = dymanicRequire.resolve('eslint')
export const eslintConfig = dymanicRequire.resolve('@monstrs/config-eslint')

export const eslintPlugins = dymanicRequire('@monstrs/config-eslint/plugins')
