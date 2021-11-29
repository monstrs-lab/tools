import { Workspace }              from '@yarnpkg/core'
import { Configuration }          from '@yarnpkg/core'
import { Project }                from '@yarnpkg/core'
import { WorkspaceResolver }      from '@yarnpkg/core'
import { ThrowReport }            from '@yarnpkg/core'
import { Filename }               from '@yarnpkg/fslib'
import { PortablePath }           from '@yarnpkg/fslib'
import { structUtils }            from '@yarnpkg/core'
import { xfs }                    from '@yarnpkg/fslib'
import { ppath }                  from '@yarnpkg/fslib'
import { prepareForPack }         from '@yarnpkg/plugin-pack/lib/packUtils'
import { genPackList }            from '@yarnpkg/plugin-pack/lib/packUtils'
import { genPackStream }          from '@yarnpkg/plugin-pack/lib/packUtils'

import { getPluginConfiguration } from '@monstrs/yarn-cli'

const beforeWorkspacePacking = (workspace, rawManifest) => {
  for (const descriptor of workspace.manifest.dependencies.values()) {
    if (descriptor.range.startsWith(WorkspaceResolver.protocol)) {
      const targetWorkspace = workspace.project.tryWorkspaceByDescriptor(descriptor)

      if (targetWorkspace) {
        const target = ppath.resolve(targetWorkspace.cwd, `package.tgz` as Filename)

        Object.keys(rawManifest.dependencies).forEach((key) => {
          const { scope, name } = structUtils.parseDescriptor(key)

          if (scope === descriptor.scope && name === descriptor.name) {
            rawManifest.dependencies[key] = `file:${target}`
          }
        })
      }
    }
  }
}

export class CodeRuntime {
  async init() {
    const { plugins, modules } = getPluginConfiguration()

    plugins.add('coderuntime-test-pack-hook')
    modules.set('coderuntime-test-pack-hook', {
      hooks: {
        beforeWorkspacePacking,
      },
    })

    const configuration = await Configuration.find(process.cwd() as PortablePath, {
      plugins,
      modules,
    })
    const { project, workspace } = await Project.find(configuration, process.cwd() as PortablePath)

    const runtime = workspace!
      .getRecursiveWorkspaceChildren()
      .find(
        (ws) => ws.manifest.name?.scope === 'monstrs' && ws.manifest.name?.name === 'code-runtime'
      )

    if (runtime) {
      process.env.CODE_RUNTIME_TEST_PACK = '1'

      await project.restoreInstallState()

      await this.packWorkspace(project, configuration, runtime)
    }
  }

  async packWorkspace(project: Project, configuration: Configuration, workspace: Workspace) {
    for (const descriptor of workspace.manifest.dependencies.values()) {
      if (descriptor.range.startsWith(WorkspaceResolver.protocol)) {
        const dependent = project.tryWorkspaceByDescriptor(descriptor)

        if (dependent) {
          await this.packWorkspace(project, configuration, dependent)
        }
      }
    }

    const target = ppath.resolve(workspace.cwd, 'package.tgz' as Filename)

    await prepareForPack(workspace, { report: new ThrowReport() }, async () => {
      const files = await genPackList(workspace)

      const pack = await genPackStream(workspace, files)
      const write = xfs.createWriteStream(target)

      pack.pipe(write)

      await new Promise((resolve) => {
        write.on('finish', resolve)
      })
    })
  }
}
