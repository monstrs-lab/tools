import { Command } from 'clipanion'

import { test }    from '@monstrs/code-test'

class TestCommand extends Command {
  @Command.Path(`test`)
  async execute() {
    await test(process.cwd())
  }
}

export { TestCommand }
