import { BaseCommand } from '@yarnpkg/cli'

// @ts-ignore
import lintStaged      from 'lint-staged'
import { Option }      from 'clipanion'

const config = {
  '*.{yml,yaml,json,graphql,md}': 'yarn format',
  '*.{js,jsx,ts,tsx}': ['yarn format', 'yarn lint'],
  '*.{ts,tsx}': ['yarn typecheck'],
  '*.{tsx,ts}': ['yarn test unit --bail --find-related-tests'],
}

export class CommitStagedCommand extends BaseCommand {
  static paths = [['commit', 'staged']]

  args: Array<string> = Option.Rest({ required: 0 })

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
