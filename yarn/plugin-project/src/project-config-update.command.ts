import { BaseCommand } from '@yarnpkg/cli'

export class ProjectConfigUpdateCommand extends BaseCommand {
  static paths = [['project', 'config', 'update']]

  async execute() {
    let exitCode = await this.cli.run(['project', 'runtime', 'sync'])

    if (exitCode !== 0) {
      return exitCode
    }

    exitCode = await this.cli.run(['install'])

    return exitCode
  }
}
