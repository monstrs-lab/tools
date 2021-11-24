import { Workspace }              from '@yarnpkg/core'
import { Configuration }          from '@yarnpkg/core'
import { Project }                from '@yarnpkg/core'
import { WorkspaceResolver }      from '@yarnpkg/core'
import { ThrowReport }            from '@yarnpkg/core'
import { Filename }               from '@yarnpkg/fslib'
import { PortablePath }           from '@yarnpkg/fslib'
import { xfs }                    from '@yarnpkg/fslib'
import { ppath }                  from '@yarnpkg/fslib'
import { prepareForPack }         from '@yarnpkg/plugin-pack/lib/packUtils'
import { genPackList }             from '@yarnpkg/plugin-pack/lib/packUtils'
import { genPackStream }          from '@yarnpkg/plugin-pack/lib/packUtils'

import { getPluginConfiguration } from '@monstrs/yarn-cli'

export class CodeRuntime {
  #path!: string

  get path() {
    return this.#path
  }

  async init() {
    const configuration = await Configuration.find(
      process.cwd() as PortablePath,
      getPluginConfiguration()
    )
    const { project, workspace } = await Project.find(configuration, process.cwd() as PortablePath)

    const runtime = workspace!
      .getRecursiveWorkspaceChildren()
      .find(
        (ws) => ws.manifest.name?.scope === 'monstrs' && ws.manifest.name?.name === 'code-runtime'
      )

    if (runtime) {
      await project.restoreInstallState()

      const target = await this.packWorkspace(project, configuration, runtime)

      this.#path = `file:${target}`
    }
  }

  async packWorkspace(project: Project, configuration: Configuration, workspace: Workspace) {
    for (const descriptor of workspace.manifest.dependencies.values()) {
      if (descriptor.range.startsWith(WorkspaceResolver.protocol)) {
        const dependent = project.tryWorkspaceByDescriptor(descriptor)

        if (dependent) {
          const target = await this.packWorkspace(project, configuration, dependent)

          descriptor.range = `file:${target}`
        }
      }
    }

    const target = ppath.resolve(workspace.cwd, `package.tgz` as Filename)

    await prepareForPack(workspace, { report: new ThrowReport() }, async () => {
      const files = await genPackList(workspace)

      const pack = await genPackStream(workspace, files)
      const write = xfs.createWriteStream(target)

      pack.pipe(write)

      await new Promise((resolve) => {
        write.on(`finish`, resolve)
      })
    })

    return target
  }
}
