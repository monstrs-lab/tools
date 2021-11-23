import { Workspace }              from '@yarnpkg/core'
import { Configuration }          from '@yarnpkg/core'
import { Project }                from '@yarnpkg/core'
import { WorkspaceResolver }      from '@yarnpkg/core'
import { PortablePath }           from '@yarnpkg/fslib'

import { getPluginConfiguration } from '@monstrs/yarn-cli'

export class CodeRuntime {
  async init() {
    const configuration = await Configuration.find(
      process.cwd() as PortablePath,
      getPluginConfiguration()
    )
    const { project, workspace } = await Project.find(configuration, process.cwd() as PortablePath)

    const runtime = workspace!
      .getRecursiveWorkspaceChildren()
      .find(
        (ws) => ws.manifest.name?.scope === 'monstrs' && ws.manifest.name?.name === 'yarn-runtime'
      )

    if (runtime) {
      await this.packWorkspace(project, runtime)
    }
  }

  async packWorkspace(project: Project, workspace: Workspace) {
    for (const descriptor of workspace.manifest.dependencies.values()) {
      if (descriptor.range.startsWith(WorkspaceResolver.protocol)) {
        const dependent = project.tryWorkspaceByDescriptor(descriptor)

        if (dependent) {
          await this.packWorkspace(project, dependent)
        }
      }
    }
  }
}
