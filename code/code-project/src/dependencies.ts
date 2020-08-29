/* eslint-disable no-restricted-syntax */

import { Configuration, Project }         from '@yarnpkg/core'
import { WorkspaceResolver, structUtils } from '@yarnpkg/core'
import { PortablePath }                   from '@yarnpkg/fslib'
import { getPluginConfiguration }         from '@yarnpkg/cli'
import fg from 'fast-glob'
import path from 'path'
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

export const getTempProjectUnpluggedDependencies = async (): Promise<Set<String>> => {
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

export const getProjectUnpluggedDependencies = async (): Promise<Set<String>> => {
  const configuration = await Configuration.find(
    process.cwd() as PortablePath,
    getPluginConfiguration()
  )

  const entries = await fg('**/*/package.json', { cwd: configuration.get(`pnpUnpluggedFolder`) })

  const dependenciesNames = new Set<string>()

  await Promise.all(
    entries.map(entry => path.join(configuration.get(`pnpUnpluggedFolder`), entry)).map(async entry => {
      try {
        const { name } = JSON.parse((await fs.readFile(entry)).toString())

        if (name && !FORCE_UNPLUGGED_PACKAGES.has(name)) {
          dependenciesNames.add(name)
        }
      } catch {}
    })
  )

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
