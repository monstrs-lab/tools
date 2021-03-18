import { Command }                  from 'clipanion'
import execa                        from 'execa'

import { Workspace, getWorkspaces } from '@monstrs/code-project'
import { getLocalChangedFiles }     from '@monstrs/code-changes'

class VersionPublishCommand extends Command {
  @Command.Boolean(`-v,--verbose`)
  verbose: boolean = false

  @Command.Path(`version:publish`)
  async execute() {
    await execa('yarn', ['version', 'apply', '--all'], {
      stdio: 'inherit',
    })

    const changedFiles = await getLocalChangedFiles()

    if (this.verbose) {
      this.context.stdout.write('Changed files:\n')

      changedFiles.forEach((changedFile) => this.context.stdout.write(`${changedFile}\n`))

      this.context.stdout.write('\n')
    }

    const candidates: Array<Workspace> = await getWorkspaces(changedFiles, false)

    if (this.verbose) {
      this.context.stdout.write('Changed workspaces:\n')

      candidates.forEach((workspace) => this.context.stdout.write(`${workspace.cwd}\n`))

      this.context.stdout.write('\n')
    }

    const workspaces = candidates.filter((workspace) => workspace.manifest.private !== true)

    if (this.verbose) {
      this.context.stdout.write('Public workspaces:\n')

      workspaces.forEach((workspace) => this.context.stdout.write(`${workspace.cwd}\n`))

      this.context.stdout.write('\n')
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const workspace of workspaces) {
      // eslint-disable-next-line no-await-in-loop
      await execa('yarn', ['workspace', workspace.manifest.raw.name, 'build'], {
        stdio: 'inherit',
      })

      // eslint-disable-next-line no-await-in-loop
      await execa('yarn', ['workspace', workspace.manifest.raw.name, 'npm', 'publish'], {
        stdio: 'inherit',
      })
    }
  }
}

export { VersionPublishCommand }
