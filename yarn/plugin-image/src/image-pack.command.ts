import { BaseCommand }           from '@yarnpkg/cli'
import { Workspace }             from '@yarnpkg/core'
import { Configuration }         from '@yarnpkg/core'
import { Project }               from '@yarnpkg/core'
import { Cache }                 from '@yarnpkg/core'
import { StreamReport }          from '@yarnpkg/core'
import { Report }                from '@yarnpkg/core'
import { PortablePath }          from '@yarnpkg/fslib'
import { stringify }             from '@iarna/toml'
import { structUtils }           from '@yarnpkg/core'
import { execUtils }             from '@yarnpkg/core'
import { xfs }                   from '@yarnpkg/fslib'
import { ppath }                 from '@yarnpkg/fslib'
import { toFilename }            from '@yarnpkg/fslib'
import { patchUtils }            from '@yarnpkg/plugin-patch'

import tempy                     from 'tempy'
import { Option }                from 'clipanion'

import { TagPolicy }             from '@monstrs/code-pack'
import { tagUtils }              from '@monstrs/code-pack'
import { copyRcFile }            from '@monstrs/yarn-pack-utils'
import { copyPlugins }           from '@monstrs/yarn-pack-utils'
import { copyYarnRelease }       from '@monstrs/yarn-pack-utils'
import { copyManifests }         from '@monstrs/yarn-pack-utils'
import { copyCacheMarkedFiles }  from '@monstrs/yarn-pack-utils'
import { generateLockfile }      from '@monstrs/yarn-pack-utils'
import { copyProtocolFiles }     from '@monstrs/yarn-pack-utils'
import { parseSpec }             from '@monstrs/yarn-pack-utils'
import { getRequiredWorkspaces } from '@monstrs/yarn-pack-utils'
import { clearUnusedWorkspaces } from '@monstrs/yarn-pack-utils'
import { packWorkspace }         from '@monstrs/yarn-pack-utils'

class ImagePackCommand extends BaseCommand {
  static paths = [['image', 'pack']]

  registry: string = Option.String('-r,--registry', { required: true })

  tagPolicy?: TagPolicy = Option.String('-t,--tag-policy')

  publish: boolean = Option.Boolean('-p,--publish', false)

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)

    const { project } = await Project.find(configuration, this.context.cwd)

    const workspace = project.getWorkspaceByFilePath(this.context.cwd)

    const commandReport = await StreamReport.start(
      {
        configuration,
        stdout: this.context.stdout,
      },
      async (report) => {
        if (this.isWorkspaceAllowedForBundle(workspace)) {
          const destination = tempy.directory() as PortablePath

          await this.bundle(configuration, project, workspace, report, destination)

          const repo = workspace.manifest.raw.name.replace('@', '').replace(/\//g, '-')
          const image = `${this.registry}${repo}`

          const tag = await tagUtils.getTag(this.tagPolicy || 'revision')

          const descriptor = {
            project: {
              id: repo,
              name: repo,
              version: '0.0.1',
            },
            build: {
              exclude: ['.git', '.yarn/unplugged'],
              env: [
                {
                  name: 'WORKSPACE',
                  value: workspace.manifest.raw.name,
                },
              ],
            },
          }

          const descriptorPath = ppath.join(await xfs.mktempPromise(), toFilename('project.toml'))

          await xfs.writeFilePromise(descriptorPath, stringify(descriptor))

          const args = [
            'build',
            `${image}:${tag}`,
            '--verbose',
            '--buildpack',
            'monstrs/buildpack-yarn-workspace:0.0.3',
            '--builder',
            'monstrs/builder-base:buster',
            '--descriptor',
            descriptorPath,
            '--tag',
            `${image}:latest`,
          ]

          if (this.publish) {
            args.push('--publish')
          }

          await execUtils.pipevp('pack', args, {
            cwd: destination,
            env: process.env,
            stdin: this.context.stdin,
            stdout: this.context.stdout,
            stderr: this.context.stderr,
            end: execUtils.EndStrategy.ErrorCode,
          })
        } else {
          report.reportInfo(
            null,
            `Workspace ${workspace.manifest.raw.name} not allowed for package.`
          )
        }
      }
    )

    return commandReport.exitCode()
  }

  isWorkspaceAllowedForBundle(workspace: Workspace): boolean {
    const { scripts, name } = workspace.manifest

    const buildCommand = scripts.get('build')

    const hasAllowedBuildScript = [
      'mctl service build',
      'mctl renderer build',
      'build-storybook',
      'next build',
      'builder build library',
      'app service build',
      'app renderer build',
      'service build',
      'renderer build',
    ].some((command) => buildCommand?.includes(command))

    return hasAllowedBuildScript && Boolean(name)
  }

  async bundle(
    configuration: Configuration,
    project: Project,
    workspace: Workspace,
    report: Report,
    destination: PortablePath
  ) {
    const requiredWorkspaces = getRequiredWorkspaces(project, [workspace], true)

    clearUnusedWorkspaces(project, requiredWorkspaces, true)

    const cache = await Cache.find(configuration)

    await report.startTimerPromise('Resolution Step', async () => {
      await project.resolveEverything({ report, cache })
    })

    await report.startTimerPromise('Fetch Step', async () => {
      await project.fetchEverything({ report, cache })
    })

    await xfs.mkdirpPromise(destination)

    await report.startTimerPromise('Copy RC files', async () => {
      await copyRcFile(project, destination, report)
    })

    await report.startTimerPromise('Copy plugins', async () => {
      await copyPlugins(project, destination, report)
    })

    await report.startTimerPromise('Copy Yarn releases', async () => {
      await copyYarnRelease(project, destination, report)
    })

    await report.startTimerPromise('Copy manifests', async () => {
      await copyManifests(project.workspaces, destination, report)
    })

    await report.startTimerPromise('Copy protocol files', async () => {
      await copyProtocolFiles(project, destination, report, (descriptor) => {
        if (descriptor.range.startsWith('exec:')) {
          const parsed = parseSpec(descriptor.range)

          if (parsed?.parentLocator) {
            return {
              parentLocator: parsed.parentLocator,
              paths: [parsed.path],
            }
          }

          return undefined
        }

        if (descriptor.range.startsWith('patch:')) {
          const { parentLocator, patchPaths: paths } = patchUtils.parseDescriptor(descriptor)

          if (parentLocator) {
            return { parentLocator, paths }
          }
        }

        return undefined
      })
    })

    await report.startTimerPromise('Copy cache marked files', async () => {
      await copyCacheMarkedFiles(project, cache, destination, report)
    })

    await generateLockfile(project, destination, report)

    for await (const ws of requiredWorkspaces) {
      const name = ws.manifest.name ? structUtils.stringifyIdent(ws.manifest.name) : ''

      await report.startTimerPromise(`Pack workspace ${name}`, async () => {
        await packWorkspace(ws, destination, report)
      })
    }
  }
}

export { ImagePackCommand }
