import { BaseCommand }   from '@yarnpkg/cli'

import type * as Runtime from '@monstrs/yarn-runtime'

class CommitMessageLintCommand extends BaseCommand {
  static paths = [['commit', 'message', 'lint']]

  async execute() {
    const { CommitLinter, read }: typeof Runtime =
      // eslint-disable-next-line global-require
      require('@monstrs/yarn-runtime') as typeof Runtime

    const linter = new CommitLinter()

    const messages = await read({ edit: true })
    const results = await Promise.all(messages.map(linter.lint))

    const output = linter.format({ results })

    if (output !== '') {
      this.context.stdout.write(output)
    }

    return results.some((result) => result.valid === false) ? 1 : 0
  }
}

export { CommitMessageLintCommand }
