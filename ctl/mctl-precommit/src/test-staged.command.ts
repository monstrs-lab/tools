import { Command } from 'clipanion'

import { test }    from '@monstrs/code-test'

class TestStagedCommand extends Command {
  @Command.Rest({ required: 0 })
  files: Array<string> = []

  @Command.Path(`staged`, `test`)
  async execute() {
    await test(process.cwd(), { bail: true, findRelatedTests: true }, this.files)
  }
}

export { TestStagedCommand }
