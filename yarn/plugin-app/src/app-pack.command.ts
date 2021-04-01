import { BaseCommand }   from '@yarnpkg/cli'
import { Configuration } from '@yarnpkg/core'
import { Project }       from '@yarnpkg/core'
import { StreamReport }  from '@yarnpkg/core'
import { execUtils }     from '@yarnpkg/core'
import tempy             from 'tempy'
import { stringify }     from '@iarna/toml'
import { PortablePath }  from '@yarnpkg/fslib'
import { xfs }           from '@yarnpkg/fslib'
import { Command }       from 'clipanion'

import { getVersion }    from '@monstrs/code-changes'

class AppPackCommand extends BaseCommand {
  @Command.String(`-r,--registry`)
  registry: string = ''

  @Command.String(`-t,--tag-policy`)
  tagPolicy: string = 'revision'

  @Command.Boolean(`-p,--publish`)
  publish: boolean = false

  @Command.Path('app', 'pack')
  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)

    const { project } = await Project.find(configuration, this.context.cwd)

    const workspace = project.getWorkspaceByFilePath(this.context.cwd)

    const { scripts, name } = workspace.manifest

    const buildCommand = scripts.get('build')

    const canBundle = [
      'mctl service build',
      'mctl renderer build',
      'build-storybook',
      'next build',
      'builder build library',
      'app service build',
      'app library build',
      'app renderer build',
    ].some((command) => buildCommand?.includes(command))

    const report = await StreamReport.start(
      {
        configuration,
        stdout: this.context.stdout,
      },
      // eslint-disable-next-line no-shadow
      async (report) => {
        if (!(name && canBundle)) {
          report.reportInfo(
            null,
            `Workspace ${workspace.manifest.raw.name} not allowed for package.`
          )
        } else {
          const repo = [name.name, name.scope].filter(Boolean).join('-')
          const registry = `${this.registry}${repo}`

          const version = await this.getVersion()

          const currentVersion = `${registry}:${version}`
          const latestVersion = `${registry}:latest`

          const descriptor = {
            project: {
              id: workspace.manifest.raw.name,
              name: workspace.manifest.raw.name,
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

          const descriptorPath = tempy.file({ extension: 'toml' })

          await xfs.writeFilePromise(descriptorPath as PortablePath, stringify(descriptor))

          const args = [
            'build',
            currentVersion,
            '--descriptor',
            descriptorPath,
            '--buildpack',
            'monstrs/buildpack-yarn-workspace:0.0.2',
            '--builder',
            'monstrs/builder-base:buster',
            '--tag',
            latestVersion,
          ]

          if (this.publish) {
            args.push('--publish')
          }

          await execUtils.pipevp('pack', args, {
            env: process.env,
            cwd: project.cwd,
            stdin: this.context.stdin,
            stdout: this.context.stdout,
            stderr: this.context.stderr,
            end: execUtils.EndStrategy.ErrorCode,
          })
        }
      }
    )

    return report.exitCode()
  }

  async getVersion() {
    const revision = await getVersion()
    const hash = revision.substr(0, 7)

    if (this.tagPolicy === 'hash-timestamp') {
      return `${hash}-${Date.now()}`
    }

    return revision
  }
}

export { AppPackCommand }
