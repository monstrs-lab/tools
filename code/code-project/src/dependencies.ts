/* eslint-disable no-restricted-syntax */

import { Configuration, Project }         from '@yarnpkg/core'
import { WorkspaceResolver, structUtils } from '@yarnpkg/core'
import { PortablePath }                   from '@yarnpkg/fslib'
import { getPluginConfiguration }         from '@yarnpkg/cli'

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
