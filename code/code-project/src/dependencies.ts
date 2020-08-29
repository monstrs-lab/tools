/* eslint-disable no-restricted-syntax */

import { Configuration, Project }         from '@yarnpkg/core'
import { WorkspaceResolver, structUtils } from '@yarnpkg/core'
import { PortablePath }                   from '@yarnpkg/fslib'
import { getPluginConfiguration }         from '@yarnpkg/cli'
import { promises as fs }                 from 'fs'

const FORCE_UNPLUGGED_PACKAGES = new Set([
  'nan',
  'node-gyp',
  'node-pre-gyp',
  'node-addon-api',
  'fsevents',
  'core-js',
  'core-js-pure',
])

export const getProjectUnpluggedDependencies = async (): Promise<Set<String>> => {
  const configuration = await Configuration.find(
    process.cwd() as PortablePath,
    getPluginConfiguration()
  )

  const { project } = await Project.find(configuration, process.cwd() as PortablePath)

  const unplugged = await fs.readdir(configuration.get(`pnpUnpluggedFolder`))

  const dependenciesNames = new Set<string>()

  project.originalPackages.forEach((pkg) => {
    if (unplugged.includes(structUtils.slugifyLocator(pkg))) {
      const ident = structUtils.requirableIdent(pkg)

      if (!FORCE_UNPLUGGED_PACKAGES.has(ident)) {
        dependenciesNames.add(ident)
      }
    }
  })

  return dependenciesNames
}

export const getProjectDependenciesNames = async (): Promise<Set<String>> => {
  const configuration = await Configuration.find(
    process.cwd() as PortablePath,
    getPluginConfiguration()
  )

  const { project } = await Project.find(configuration, process.cwd() as PortablePath)

  const dependenciesNames = new Set<string>()

  project.originalPackages.forEach((pkg) => {
    if (!pkg.reference.startsWith(WorkspaceResolver.protocol)) {
      dependenciesNames.add(structUtils.requirableIdent(pkg))
    }
  })

  return dependenciesNames
}
