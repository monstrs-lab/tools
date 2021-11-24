import { dymanicRequire } from './utils'

export const prettier = dymanicRequire.resolve('prettier')
export const prettierPluginTypescript = dymanicRequire.resolve(
  '@monstrs/prettier-typescript-plugin'
)
export const prettierPluginPackageJson = dymanicRequire.resolve('prettier-plugin-packagejson')
