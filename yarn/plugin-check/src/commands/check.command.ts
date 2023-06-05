import { BaseCommand } from '@yarnpkg/cli'

class CheckCommand extends BaseCommand {
  static paths = [['check']]

  async execute() {
    await this.cli.run(['format'])
    await this.cli.run(['types', 'check'])
    await this.cli.run(['lint'])
  }
}

export { CheckCommand }