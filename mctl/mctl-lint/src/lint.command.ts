import { Command }       from 'clipanion'
import { Option }        from 'clipanion'
import { writeFileSync } from 'fs'

import { Linter }        from '@monstrs/code-lint'

class LintCommand extends Command {
  static paths = [['lint']]

  report = Option.String('-r,--report')

  files: Array<string> = Option.Rest({ required: 0 })

  async execute() {
    const linter = new Linter()

    const { results, errorCount } =
      this.files.length > 0 ? linter.lintFiles(this.files) : linter.lint()

    const output = linter.format(results)

    if (this.report) {
      writeFileSync(this.report, JSON.stringify(results, null, 2))
    }

    if (output) {
      this.context.stdout.write(output)
    }

    process.exit(errorCount ? 1 : 0)
  }
}

export { LintCommand }
