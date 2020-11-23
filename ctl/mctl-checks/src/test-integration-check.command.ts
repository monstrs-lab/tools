import { Command } from 'clipanion'

import { integration } from '@monstrs/code-test'

import { BaseTestCheckCommand } from './base-test-check.command'

class TestIntegrationCheckCommand extends BaseTestCheckCommand {
  @Command.Path(`check`, `test:integration`)
  async execute() {
    const { results }: any = await integration(process.cwd(), { silent: true })

    await super.executeResults(results, 'Integration')
  }
}

export { TestIntegrationCheckCommand }
