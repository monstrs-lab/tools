import { BaseCommand } from '@yarnpkg/cli'
import { Command }     from 'clipanion'

class TypeCheckCommand extends BaseCommand {
  @Command.Rest({ required: 0 })
  args: Array<string> = []

  @Command.Path(`typecheck`)
  async execute() {
    await this.cli.run(['mctl', 'typecheck', ...this.args])
  }
}

export { TypeCheckCommand }
