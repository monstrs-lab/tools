import { Command } from 'clipanion'

import { integration } from '@monstrs/code-test'

class TestIntegrationCommand extends Command {
  @Command.Path(`test:integration`)
  async execute() {
    await integration(process.cwd())
  }
}

export { TestIntegrationCommand }
