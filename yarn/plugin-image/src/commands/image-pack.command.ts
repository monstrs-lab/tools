import type { Workspace } from '@yarnpkg/core'
import type { TagPolicy } from '@monstrs/code-pack'

import { BaseCommand }    from '@yarnpkg/cli'
import { Configuration }  from '@yarnpkg/core'
import { Project }        from '@yarnpkg/core'
import { StreamReport }   from '@yarnpkg/core'
import { structUtils }    from '@yarnpkg/core'
import { stringify }      from '@iarna/toml'
import { execUtils }      from '@yarnpkg/core'
import { xfs }            from '@yarnpkg/fslib'
import { ppath }          from '@yarnpkg/fslib'
import { toFilename }     from '@yarnpkg/fslib'
import { Option }         from 'clipanion'

import { tagUtils }       from '@monstrs/code-pack'
import { packUtils }      from '@monstrs/yarn-pack-utils'

const forRepository = async (repo: string) => {
  const descriptor = {
    project: {
      id: repo,
      name: repo,
      version: '0.0.1',
    },
    build: {
      exclude: ['.git', '.yarn/unplugged'],
    },
  }

  const descriptorPath = ppath.join(await xfs.mktempPromise(), toFilename('project.toml'))

  await xfs.writeFilePromise(descriptorPath, stringify(descriptor))

  return descriptorPath
}

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
          const destination = await xfs.mktempPromise()

          report.reportInfo(
            null,
            `Package workspace ${
              workspace.manifest.name
                ? structUtils.prettyIdent(configuration, workspace.manifest.name)
                : workspace.relativeCwd
            } to ${destination}`
          )

          await packUtils.pack(configuration, project, workspace, report, destination)

          // Fix lockfile generation
          await execUtils.pipevp('yarn', ['install'], {
            cwd: destination,
            stdin: this.context.stdin,
            stdout: this.context.stdout,
            stderr: this.context.stderr,
            end: execUtils.EndStrategy.ErrorCode,
            env: Object.keys(process.env).reduce((result, key) => {
              if (key.includes('GITHUB') || key.startsWith('CI')) {
                return result
              }

              return {
                ...result,
                [key]: process.env[key],
              }
            }, {}),
          })

          const repo: string = workspace.manifest.raw.name.replace('@', '').replace(/\//g, '-')
          const image: string = `${this.registry}${repo}`

          const tag = await tagUtils.getTag(this.tagPolicy || 'revision')

          const descriptorPath = await forRepository(repo)

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
            `Workspace ${
              workspace.manifest.name
                ? structUtils.prettyIdent(configuration, workspace.manifest.name)
                : workspace.relativeCwd
            } not allowed for package.`
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
}

export { ImagePackCommand }
