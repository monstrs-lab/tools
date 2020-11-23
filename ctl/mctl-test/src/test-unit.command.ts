import { Command } from 'clipanion'

import { unit } from '@monstrs/code-test'

class TestUnitCommand extends Command {
  @Command.Path(`test:unit`)
  async execute() {
    await unit(process.cwd())
  }
}

export { TestUnitCommand }
