import { BaseCommand } from '@yarnpkg/cli'
import { Command }     from 'clipanion'
import lintStaged      from 'lint-staged'

import { config }      from './lint-staged.config'

export class PreCommitCommand extends BaseCommand {
  @Command.Path('precommit')
  async execute() {
    try {
      const passed = await lintStaged({
        config,
        debug: false,
      })

      return passed ? 0 : 1
    } catch {
      return 1
    }
  }
}
