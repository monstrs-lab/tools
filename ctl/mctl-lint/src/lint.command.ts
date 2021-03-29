import { Command } from 'clipanion'

import { Linter }  from '@monstrs/code-lint'

class LintCommand extends Command {
  @Command.Rest({ required: 0 })
  files: Array<string> = []

  @Command.Path(`lint`)
  async execute() {
    const linter = new Linter()

    const { results, errorCount } =
      this.files.length > 0 ? linter.lintFiles(this.files) : linter.lint()

    const output = linter.format(results)

    if (output) {
      this.context.stdout.write(output)
    }

    process.exit(errorCount ? 1 : 0)
  }
}

export { LintCommand }
