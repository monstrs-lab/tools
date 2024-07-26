import { BaseCommand }     from '@yarnpkg/cli'
import { StreamReport }    from '@yarnpkg/core'
import { Configuration }   from '@yarnpkg/core'
import { MessageName }     from '@yarnpkg/core'
import { Project }         from '@yarnpkg/core'
import { Option }          from 'clipanion'
import React               from 'react'

import { ErrorInfo }       from '@monstrs/cli-ui-error-info-component'
import { ESLintResult }    from '@monstrs/cli-ui-eslint-result-component'
import { Linter }          from '@monstrs/code-lint'
import { SpinnerProgress } from '@monstrs/yarn-run-utils'
import { renderStatic }    from '@monstrs/cli-ui-renderer'

class LintCommand extends BaseCommand {
  static override paths = [['lint']]

  fix = Option.Boolean('--fix')

  files: Array<string> = Option.Rest({ required: 0 })

  async execute(): Promise<number> {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await report.startTimerPromise('Lint', async () => {
          const progress = new SpinnerProgress(this.context.stdout, configuration)

          progress.start()

          try {
            const linter = await Linter.initialize(project.cwd, this.context.cwd)

            const results = await linter.lint(this.files, {
              fix: this.fix,
            })

            progress.end()

            results
              .filter((result) => result.messages.length > 0)
              .forEach((result) => {
                const output = renderStatic(<ESLintResult {...result} />)

                output.split('\n').forEach((line) => {
                  report.reportError(MessageName.UNNAMED, line)
                })
              })
          } catch (error: any) {
            progress.end()

            renderStatic(<ErrorInfo error={error as Error} />, process.stdout.columns - 12)
              .split('\n')
              .forEach((line) => {
                report.reportError(MessageName.UNNAMED, line)
              })
          }
        })
      }
    )

    return commandReport.exitCode()
  }
}

export { LintCommand }
