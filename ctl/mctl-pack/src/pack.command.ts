import execa                           from 'execa'
import fs                              from 'fs'
import tempy                           from 'tempy'
import { Command }                     from 'clipanion'
import { stringify }                   from '@iarna/toml'

import { Workspace, getWorkspaces }    from '@monstrs/code-project'
import { getChangedFiles, getVersion } from '@monstrs/code-changes'

interface BuildCommandOptions {
  name: string
  path: string
  registry: string
}

class PackCommand extends Command {
  @Command.String(`-r,--registry`)
  registry: string = ''

  @Command.String(`-t,--tag-prefix`)
  tagPrefix: string = ''

  @Command.Boolean(`-a,--all`)
  all: boolean = false

  @Command.Boolean(`-p,--push`)
  push: boolean = false

  @Command.Boolean(`-v,--verbose`)
  verbose: boolean = false

  @Command.String(`-e,--tags-output-file`)
  tagsOutputFile: string

  @Command.Path(`pack`)
  async execute() {
    const revision = await getVersion()
    const version = this.tagPrefix ? `${this.tagPrefix}-${revision}` : revision

    let workspaces: Array<Workspace> = []

    if (this.all) {
      workspaces = await getWorkspaces()
    } else {
      const changedFiles = await getChangedFiles()

      if (this.verbose) {
        this.context.stdout.write('Changed files:\n')

        changedFiles.forEach((changedFile) => this.context.stdout.write(`${changedFile}\n`))

        this.context.stdout.write('\n')
      }

      workspaces = await getWorkspaces(changedFiles, true)
    }

    if (this.verbose) {
      this.context.stdout.write('Changed workspaces:\n')

      workspaces.forEach((workspace) => this.context.stdout.write(`${workspace.cwd}\n`))

      this.context.stdout.write('\n')
    }

    const commands: BuildCommandOptions[] = []

    workspaces.forEach((workspace: Workspace) => {
      const { scripts, name } = workspace.manifest

      const buildCommand = scripts.get('build')

      if (name && buildCommand && buildCommand.includes('mctl service build')) {
        const image = [name.name, name.scope].filter(Boolean).join('-')
        const registry = `${this.registry}${image}`

        commands.push({
          name: workspace.manifest.raw.name,
          path: workspace.cwd,
          registry,
        })
      }
    })

    const pushTags: string[] = []

    // eslint-disable-next-line no-restricted-syntax
    for (const command of commands) {
      const currentVersion = `${command.registry}:${version}`
      const latestVersion = `${command.registry}:latest`

      const descriptor = {
        project: {
          id: command.name,
          name: command.name,
          version: '0.0.1',
        },
        build: {
          exclude: ['.git', '.yarn/unplugged'],
          env: [
            {
              name: 'WORKSPACE',
              value: command.name,
            },
          ],
        },
      }

      const descriptorPath = tempy.file({ extension: 'toml' })

      fs.writeFileSync(descriptorPath, stringify(descriptor))

      // eslint-disable-next-line no-await-in-loop
      await execa(
        'pack',
        [
          'build',
          latestVersion,
          '--descriptor',
          descriptorPath,
          '--buildpack',
          'monstrs/buildpack-yarn-workspace:0.0.1',
          '--builder',
          'monstrs/builder-base:buster',
        ],
        {
          stdio: 'inherit',
        }
      )

      // eslint-disable-next-line no-await-in-loop
      await execa('docker', ['tag', latestVersion, currentVersion], { stdio: 'inherit' })

      if (this.push) {
        pushTags.push(currentVersion)
        pushTags.push(latestVersion)
      }
    }

    if (pushTags.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const pushTag of pushTags) {
        // eslint-disable-next-line no-await-in-loop
        await execa('docker', ['push', pushTag], {
          stdio: 'inherit',
        })
      }
    }

    if (this.tagsOutputFile) {
      fs.writeFileSync(this.tagsOutputFile, JSON.stringify(pushTags))
    }
  }
}

export { PackCommand }
