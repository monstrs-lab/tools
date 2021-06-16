import { BaseCommand } from '@yarnpkg/cli'
import lintStaged      from 'lint-staged'

const config = {
  '*.{yml,yaml,json,graphql,md}': 'yarn mctl format',
  '*.{js,jsx,ts,tsx}': ['yarn mctl format', 'yarn mctl lint'],
  '*.{ts,tsx}': ['yarn mctl typecheck'],
  '*.{tsx,ts}': ['yarn mctl test:unit --bail --find-related-tests'],
}

export class CommitStagedCommand extends BaseCommand {
  static paths = [['commit', 'staged']]

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
