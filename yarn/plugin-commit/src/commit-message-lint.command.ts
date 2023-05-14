import { BaseCommand }  from '@yarnpkg/cli'

import { CommitLinter } from '@monstrs/code-commit'
import { read }         from '@monstrs/code-commit'

class CommitMessageLintCommand extends BaseCommand {
  static paths = [['commit', 'message', 'lint']]

  async execute() {
    const linter = new CommitLinter()

    const messages = await read({ edit: true })
    const results = await Promise.all(messages.map(linter.lint))

    const output = linter.format({ results })

    if (output !== '') {
      this.context.stdout.write(output)
    }

    return results.some((result) => !result.valid) ? 1 : 0
  }
}

export { CommitMessageLintCommand }
