import { Command }             from 'clipanion'

import { Linter }              from '@monstrs/code-lint'

import { eslintResultsFormat } from '@monstrs/github-checks-utils'
import { createCheck }         from '@monstrs/github-checks-utils'
import { Conclusion }          from '@monstrs/github-checks-utils'

class LintCheckCommand extends Command {
  @Command.Path(`check`, `lint`)
  async execute() {
    const cwd: string = process.env.GITHUB_WORKSPACE || process.cwd()

    const linter = new Linter(cwd)

    const { results } = linter.lint()

    const annotations = eslintResultsFormat(results, process.env.GITHUB_WORKSPACE || process.cwd())

    const warnings: number = annotations.filter(
      (annotation) => annotation.annotation_level === 'warning'
    ).length

    const errors: number = annotations.filter(
      (annotation) => annotation.annotation_level === 'failure'
    ).length

    await createCheck('Lint', annotations.length > 0 ? Conclusion.Failure : Conclusion.Success, {
      title: annotations.length > 0 ? `Errors ${errors}, Warnings ${warnings}` : 'Successful',
      summary:
        annotations.length > 0
          ? `Found ${errors} errors and ${warnings} warnings`
          : 'All checks passed',
      annotations,
    })
  }
}

export { LintCheckCommand }
