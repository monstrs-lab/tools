import { BaseCommand }          from '@yarnpkg/cli'
import { Configuration }        from '@yarnpkg/core'
import { Project }              from '@yarnpkg/core'
import { Cache }                from '@yarnpkg/core'
import { StreamReport }         from '@yarnpkg/core'
import { PortablePath }         from '@yarnpkg/fslib'
import { xfs }                  from '@yarnpkg/fslib'
import { patchUtils }           from '@yarnpkg/plugin-patch'
import { Command }              from 'clipanion'

import { copyRcFile }           from '@monstrs/yarn-pack-utils'
import { copyPlugins }          from '@monstrs/yarn-pack-utils'
import { copyYarnRelease }      from '@monstrs/yarn-pack-utils'
import { copyManifests }        from '@monstrs/yarn-pack-utils'
import { copyCacheMarkedFiles } from '@monstrs/yarn-pack-utils'
import { generateLockfile }     from '@monstrs/yarn-pack-utils'
import { copyProtocolFiles }    from '@monstrs/yarn-pack-utils'
import { parseSpec }            from '@monstrs/yarn-pack-utils'

class AppPackSourceCommand extends BaseCommand {
  @Command.String('-d,--destination')
  destination!: PortablePath

  @Command.Path('app', 'pack', 'source')
  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)

    const { project } = await Project.find(configuration, this.context.cwd)

    const cache = await Cache.find(configuration)

    const report = await StreamReport.start(
      {
        configuration,
        stdout: this.context.stdout,
      },
      // eslint-disable-next-line no-shadow
      async (report) => {
        await report.startTimerPromise('Resolution Step', async () => {
          await project.resolveEverything({ report, cache })
        })

        await report.startTimerPromise('Fetch Step', async () => {
          await project.fetchEverything({ report, cache })
        })

        await xfs.mkdirpPromise(this.destination)

        await copyRcFile(project, this.destination, report)

        await copyPlugins(project, this.destination, report)

        await copyYarnRelease(project, this.destination, report)

        await copyManifests(project.workspaces, this.destination, report)

        await copyProtocolFiles(project, this.destination, report, (descriptor) => {
          if (descriptor.range.startsWith('exec:')) {
            const parsed = parseSpec(descriptor.range)

            if (parsed?.parentLocator) {
              return {
                parentLocator: parsed.parentLocator,
                paths: [parsed.path],
              }
            }

            return undefined
            // eslint-disable-next-line no-else-return
          } else if (descriptor.range.startsWith('patch:')) {
            const { parentLocator, patchPaths: paths } = patchUtils.parseDescriptor(descriptor)

            if (parentLocator) {
              return { parentLocator, paths }
            }

            return undefined
          }

          return undefined
        })

        await copyCacheMarkedFiles(project, cache, this.destination, report)

        await generateLockfile(project, this.destination, report)
      }
    )

    return report.exitCode()
  }
}

export { AppPackSourceCommand }
