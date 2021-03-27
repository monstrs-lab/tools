import { Command } from 'clipanion'

import { unit }    from '@monstrs/code-test'

class TestUnitCommand extends Command {
  @Command.Boolean(`-u,--update-shapshot`)
  updateSnapshot: boolean = false

  @Command.Path(`test:unit`)
  async execute() {
    await unit(process.cwd(), {
      updateSnapshot: this.updateSnapshot,
    })
  }
}

export { TestUnitCommand }
