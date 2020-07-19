import execa                           from 'execa'
import fs                              from 'fs'
import path                            from 'path'
import { Command }                     from 'clipanion'

import { getChangedFiles, getVersion } from '@monstrs/code-changes'
import { getWorkspaces }               from '@monstrs/code-workspaces'

interface BuildCommandOptions {
  dockerfile: string
  registry: string
}

class DockerBuildCommand extends Command {
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

  @Command.Path(`docker`, `build`)
  async execute() {
    const codeVersion = await getVersion()
    const version = this.tagPrefix ? `${this.tagPrefix}-${codeVersion}` : codeVersion

    let workspaces = []

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

    const workspaceWithDockerfiles = workspaces.filter((workspace) =>
      fs.existsSync(path.join(workspace.cwd, 'Dockerfile'))
    )

    const commands: BuildCommandOptions[] = []

    workspaceWithDockerfiles.forEach((workspace) => {
      const dockerfile = path.join(workspace.cwd, 'Dockerfile').replace(`${process.cwd()}/`, '')
      const registry = `${this.registry}${workspace.manifest.name.scope}-${workspace.manifest.name.name}`

      commands.push({
        dockerfile,
        registry,
      })
    })

    const pushTags: string[] = []

    // eslint-disable-next-line no-restricted-syntax
    for (const command of commands) {
      const currentVersion = `${command.registry}:${version}`
      const latestVersion = `${command.registry}:latest`

      // eslint-disable-next-line no-await-in-loop
      await execa(
        'docker',
        ['build', '-t', currentVersion, '-t', latestVersion, '--file', command.dockerfile, '.'],
        { stdio: 'inherit' }
      )

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
  }
}

export { DockerBuildCommand }
