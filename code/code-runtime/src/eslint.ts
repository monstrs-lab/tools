import { dymanicRequire } from './utils'

export const eslint = dymanicRequire.resolve('eslint')

export const eslintConfigBestPractices = dymanicRequire.resolve(
  'eslint-config-airbnb-base/rules/best-practices'
)
export const eslintConfigErrors = dymanicRequire.resolve('eslint-config-airbnb-base/rules/errors')
export const eslintConfigNode = dymanicRequire.resolve('eslint-config-airbnb-base/rules/node')
export const eslintConfigStyle = dymanicRequire.resolve('eslint-config-airbnb-base/rules/style')
export const eslintConfigVariables = dymanicRequire.resolve(
  'eslint-config-airbnb-base/rules/variables'
)
export const eslintConfigEs6 = dymanicRequire.resolve('eslint-config-airbnb-base/rules/es6')
export const eslintConfigStrict = dymanicRequire.resolve('eslint-config-airbnb-base/rules/strict')
export const eslintConfigImports = dymanicRequire.resolve('eslint-config-airbnb-base/rules/imports')
export const eslintConfigReact = dymanicRequire.resolve('eslint-config-airbnb/rules/react')
export const eslintConfigReactA11y = dymanicRequire.resolve('eslint-config-airbnb/rules/react-a11y')
export const eslintConfigHooks = dymanicRequire.resolve('eslint-config-airbnb/hooks')
export const eslintConfigPrettier = dymanicRequire.resolve('eslint-config-prettier')

export const eslintTypescriptParser = dymanicRequire.resolve('@typescript-eslint/parser')
export const eslintImportResolverNode = dymanicRequire.resolve('eslint-import-resolver-node')

export const eslintPluginPrettier = dymanicRequire.resolve('eslint-plugin-prettier')
export const eslintPluginTypescript = dymanicRequire.resolve('@typescript-eslint/eslint-plugin')
