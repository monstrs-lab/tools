import lintStaged  from 'lint-staged'
import { Command } from 'clipanion'

import { config }  from './config'

class PreCommitCommand extends Command {
  @Command.Path(`precommit`)
  async execute() {
    try {
      const passed = await lintStaged({
        config,
        debug: false,
      })

      process.exit(passed ? 0 : 1)
    } catch (error) {
      process.exit(1)
    }
  }
}

export { PreCommitCommand }
