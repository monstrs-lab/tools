import { Command }     from 'clipanion'

import { integration } from '@monstrs/code-test'

class TestIntegrationCommand extends Command {
  @Command.Boolean(`-u,--update-shapshot`)
  updateSnapshot: boolean = false

  @Command.Path(`test:integration`)
  async execute() {
    await integration(process.cwd(), {
      updateSnapshot: this.updateSnapshot,
    })
  }
}

export { TestIntegrationCommand }
