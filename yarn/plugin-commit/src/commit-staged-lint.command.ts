import { BaseCommand } from '@yarnpkg/cli'
import { Command }     from 'clipanion'
import lintStaged      from 'lint-staged'

const config = {
  '*.{yml,yaml,json,graphql,md}': 'yarn mctl staged format',
  '*.{js,jsx,ts,tsx}': ['yarn mctl staged format', 'yarn mctl staged lint'],
  '*.{ts,tsx}': ['yarn mctl staged typecheck'],
  '*.{tsx,ts}': ['yarn mctl staged test'],
}

export class CommitStagedLintCommand extends BaseCommand {
  @Command.Path('commit', 'staged', 'lint')
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
