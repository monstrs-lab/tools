/* eslint-disable no-restricted-syntax */

import packageJson             from '@monstrs/yarn-cli/package.json'
import { PluginConfiguration } from '@yarnpkg/core'

import { getDynamicLibs }      from './getDynamicLibs'

export function getPluginConfiguration(): PluginConfiguration {
  const plugins = new Set<string>()
  for (const dependencyName of packageJson['@yarnpkg/builder'].bundles.standard)
    plugins.add(dependencyName)

  const modules = getDynamicLibs()
  for (const plugin of plugins) modules.set(plugin, require(plugin).default)

  return { plugins, modules }
}
