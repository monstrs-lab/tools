import { Command } from 'clipanion'

import { format, lint, read } from '@monstrs/code-commitlint'

class CommitmsgCommand extends Command {
  @Command.Path(`commitmsg`)
  async execute() {
    const messages = await read({ edit: true })

    const results = await Promise.all(messages.map(lint))

    const report: any = results.reduce(
      (info: any, result: any) => ({
        valid: result.valid ? info.valid : false,
        errorCount: info.errorCount + result.errors.length,
        warningCount: info.warningCount + result.warnings.length,
        results: [...info.results, result],
      }),
      {
        valid: true,
        errorCount: 0,
        warningCount: 0,
        results: [],
      }
    )

    const output = format(report, {
      helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
    })

    if (output !== '') {
      this.context.stdout.write(output)
    }

    if (!report.valid) {
      process.exit(1)
    }
  }
}

export { CommitmsgCommand }
