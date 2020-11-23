import { Command } from 'clipanion'

import { unit } from '@monstrs/code-test'

import { BaseTestCheckCommand } from './base-test-check.command'

class TestUnitCheckCommand extends BaseTestCheckCommand {
  @Command.Path(`check`, `test:unit`)
  async execute() {
    const { results }: any = await unit(process.cwd(), { silent: true })

    await super.executeResults(results, 'Unit')
  }
}

export { TestUnitCheckCommand }
