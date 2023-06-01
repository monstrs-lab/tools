import type { PortablePath } from '@yarnpkg/fslib'

import { BaseCommand }       from '@yarnpkg/cli'
import { Configuration }     from '@yarnpkg/core'
import { Project }           from '@yarnpkg/core'
import { StreamReport }      from '@yarnpkg/core'
import { xfs }               from '@yarnpkg/fslib'
import { ppath }             from '@yarnpkg/fslib'
import deepmerge             from 'deepmerge'

import tsconfig              from '@monstrs/config-typescript'

const combineMerge = (target, source, options) => {
  const destination = target.slice()

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
    } else if (options.isMergeableObject(item)) {
      destination[index] = deepmerge(target[index], item, options)
    } else if (target.indexOf(item) === -1) {
      destination.push(item)
    }
  })

  return destination
}

export class ToolsSyncTSConfigCommand extends BaseCommand {
  static paths = [['tools', 'sync', 'tsconfig']]

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await report.startTimerPromise('Tools sync typescript config', async () => {
          const tsconfigpath = ppath.join(
            project.topLevelWorkspace.cwd,
            'tsconfig.json' as PortablePath
          )

          const exists = (await xfs.existsPromise(tsconfigpath))
            ? await xfs.readJsonPromise(tsconfigpath)
            : { compilerOptions: {} }

          await xfs.writeFilePromise(
            ppath.join(project.topLevelWorkspace.cwd, 'project.types.d.ts' as PortablePath),
            '/// <reference types="@monstrs/tools-runtime/types" />'
          )

          const config = deepmerge(
            exists,
            { compilerOptions: tsconfig.compilerOptions },
            { arrayMerge: combineMerge }
          )

          await xfs.writeJsonPromise(tsconfigpath, {
            ...config,
            include: Array.from(
              new Set(['project.types.d.ts', ...((config as any).include || [])])
            ),
          })
        })
      }
    )

    return commandReport.exitCode()
  }
}
