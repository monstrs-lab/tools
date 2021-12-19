import { BaseCommand }   from '@yarnpkg/cli'
import { Configuration } from '@yarnpkg/core'
import { Project }       from '@yarnpkg/core'
import { StreamReport }  from '@yarnpkg/core'
import { execUtils }     from '@yarnpkg/core'

import { Option }        from 'clipanion'

import { TagPolicy }     from '@monstrs/code-pack'
import { pack }          from '@monstrs/code-pack'

class ImagePackCommand extends BaseCommand {
  static paths = [['pack', 'image']]

  registry: string = Option.String('-r,--registry', { required: true })

  tagPolicy?: TagPolicy = Option.String('-t,--tag-policy')

  publish: boolean = Option.Boolean('-p,--publish', false)

  builder?: string = Option.String('--builder')

  buildpack?: string = Option.String('--buildpack')

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
      'app renderer build',
      'service build',
      'renderer build',
    ].some((command) => buildCommand?.includes(command))

    const commandReport = await StreamReport.start(
      {
        configuration,
        stdout: this.context.stdout,
      },
      async (report) => {
        if (name && canBundle) {
          await pack(
            {
              workspace: workspace.manifest.raw.name,
              registry: this.registry,
              publish: this.publish,
              tagPolicy: this.tagPolicy || 'revision',
              buildpack: this.buildpack,
              builder: this.builder,
            },
            {
              env: process.env,
              cwd: project.cwd,
              stdin: this.context.stdin,
              stdout: this.context.stdout,
              stderr: this.context.stderr,
              end: execUtils.EndStrategy.ErrorCode,
            }
          )
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
}

export { ImagePackCommand }
