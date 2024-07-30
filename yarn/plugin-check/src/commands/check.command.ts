import { BaseCommand } from '@yarnpkg/cli'

export class CheckCommand extends BaseCommand {
  static override paths = [['check']]

  async execute(): Promise<void> {
    await this.cli.run(['format'])
    await this.cli.run(['types', 'check'])
    await this.cli.run(['lint'])
  }
}
