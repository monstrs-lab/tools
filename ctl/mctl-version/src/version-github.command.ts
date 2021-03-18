import { Command }                  from 'clipanion'
import execa                        from 'execa'

import { Workspace, getWorkspaces } from '@monstrs/code-project'
import { getChangedFiles }          from '@monstrs/code-changes'

class VersionGithubCommand extends Command {
  @Command.Boolean(`--no-private`)
  publicOnly: boolean = false

  @Command.String(`--strategy`)
  strategy: string = 'patch'

  @Command.Boolean(`-v,--verbose`)
  verbose: boolean = false

  @Command.Path(`version:github`)
  async execute() {
    const changedFiles = await getChangedFiles()

    if (this.verbose) {
      this.context.stdout.write('Changed files:\n')

      changedFiles.forEach((changedFile) => this.context.stdout.write(`${changedFile}\n`))

      this.context.stdout.write('\n')
    }

    const candidates: Array<Workspace> = await getWorkspaces(changedFiles, true)

    if (this.verbose) {
      this.context.stdout.write('Changed workspaces:\n')

      candidates.forEach((workspace) => this.context.stdout.write(`${workspace.cwd}\n`))

      this.context.stdout.write('\n')
    }

    const workspaces = this.publicOnly
      ? candidates.filter((workspace) => workspace.manifest.private !== true)
      : candidates

    if (this.verbose) {
      this.context.stdout.write('Public workspaces:\n')

      workspaces.forEach((workspace) => this.context.stdout.write(`${workspace.cwd}\n`))

      this.context.stdout.write('\n')
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const workspace of workspaces) {
      // eslint-disable-next-line no-await-in-loop
      await execa(
        'yarn',
        ['workspace', workspace.manifest.raw.name, 'version', '--deferred', this.strategy],
        {
          stdio: 'inherit',
        }
      )
    }
  }
}

export { VersionGithubCommand }
