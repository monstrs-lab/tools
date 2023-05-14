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

const isUpdateNeeded = (from: object, to: object) =>
  Object.keys(from).some((key) => {
    if (Array.isArray(from[key])) {
      return false
    }

    return from[key] !== to[key]
  })

export class TypesConfigSyncCommand extends BaseCommand {
  static paths = [['types', 'config', 'sync']]

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await report.startTimerPromise('TypeScript Cofnig Sync', async () => {
          const tsconfigpath = ppath.join(
            project.topLevelWorkspace.cwd,
            'tsconfig.json' as PortablePath
          )

          const exists = (await xfs.existsPromise(tsconfigpath))
            ? await xfs.readJsonPromise(tsconfigpath)
            : { compilerOptions: {} }

          if (isUpdateNeeded(tsconfig.compilerOptions, exists.compilerOptions)) {
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
          }
        })
      }
    )

    return commandReport.exitCode()
  }
}
