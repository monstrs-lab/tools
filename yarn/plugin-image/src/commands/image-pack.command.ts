import type { TagPolicy }    from '@monstrs/code-pack'
import type { Workspace }    from '@yarnpkg/core'
import type { PortablePath } from '@yarnpkg/fslib'

import { BaseCommand }       from '@yarnpkg/cli'
import { Configuration }     from '@yarnpkg/core'
import { Project }           from '@yarnpkg/core'
import { StreamReport }      from '@yarnpkg/core'
import { stringify }         from '@iarna/toml'
import { structUtils }       from '@yarnpkg/core'
import { execUtils }         from '@yarnpkg/core'
import { xfs }               from '@yarnpkg/fslib'
import { ppath }             from '@yarnpkg/fslib'
import { Option }            from 'clipanion'

import { tagUtils }          from '@monstrs/code-pack'
import { packUtils }         from '@monstrs/yarn-pack-utils'

const forRepository = async (repo: string, workspace: string, packConfiguration: { require?: Array<string> } = {}): Promise<PortablePath> => {
  const envs = [
    {
      name: 'WORKSPACE',
      value: workspace,
    },
    {
      name: 'CNB_USER_ID',
      value: '1001',
    },
  ]

  if (packConfiguration.require && packConfiguration.require.length > 0) {
    envs.push({
      name: 'BP_REQUIRE',
      value: packConfiguration.require.join(','),
    })
  }

  const descriptor = {
    project: {
      id: repo,
      name: repo,
      version: '0.0.1',
    },
    build: {
      exclude: ['.git'],
      env: envs
    },
  }

  const descriptorPath = ppath.join(await xfs.mktempPromise(), 'project.toml')

  await xfs.writeFilePromise(descriptorPath, stringify(descriptor))

  return descriptorPath
}

class ImagePackCommand extends BaseCommand {
  static override paths = [['image', 'pack']]

  registry: string = Option.String('-r,--registry', { required: true })

  tagPolicy?: TagPolicy = Option.String('-t,--tag-policy')

  publish: boolean = Option.Boolean('-p,--publish', false)

  async execute(): Promise<number> {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)

    const { project } = await Project.find(configuration, this.context.cwd)

    const workspace: Workspace = project.getWorkspaceByFilePath(this.context.cwd)

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

          const repo: string = (workspace.manifest.raw.name as string)
            .replace('@', '')
            .replace(/\//g, '-')
          const image: string = `${this.registry}${repo}`

          const tag = await tagUtils.getTag(this.tagPolicy || 'revision')

          const descriptorPath = await forRepository(repo, workspace.manifest.raw.name as string, workspace.manifest.raw.packConfiguration as { require?: Array<string> })

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
      'storybook build',
      'next build',
      'builder build library',
      'app service build',
      'app renderer build',
      'service build',
      'renderer build',
      'strapi build',
    ].some((command) => buildCommand?.includes(command))

    return hasAllowedBuildScript && Boolean(name)
  }
}

export { ImagePackCommand }
