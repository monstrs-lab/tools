import { Command } from 'clipanion'

import { Linter } from '@monstrs/code-lint'

class LintStagedCommand extends Command {
  @Command.Rest({ required: 0 })
  files: Array<string> = []

  @Command.Path(`staged`, `lint`)
  async execute() {
    const linter = new Linter()

    const { results, errorCount } = linter.lintFiles(this.files)
    const output = linter.format(results)

    if (output) {
      this.context.stdout.write(output)
    }

    process.exit(errorCount ? 1 : 0)
  }
}

export { LintStagedCommand }
