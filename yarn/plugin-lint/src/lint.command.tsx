import { BaseCommand }     from '@yarnpkg/cli'
import { StreamReport }    from '@yarnpkg/core'
import { Configuration }   from '@yarnpkg/core'
import { MessageName }     from '@yarnpkg/core'
import { Project }         from '@yarnpkg/core'

import React               from 'react'
import { Option }          from 'clipanion'

import { ESLintResult }    from '@monstrs/cli-ui-eslint-result-component'
import { Linter }          from '@monstrs/code-lint'
import { SpinnerProgress } from '@monstrs/yarn-run-utils'
import { renderStatic }    from '@monstrs/cli-ui-renderer'

class LintCommand extends BaseCommand {
  static paths = [['lint']]

  files: Array<string> = Option.Rest({ required: 0 })

  async execute() {
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
            const linter = new Linter(project.cwd)

            const results = await linter.lint(this.files)

            progress.end()

            results
              .filter((result) => result.messages.length > 0)
              .forEach((result) => {
                const output = renderStatic(<ESLintResult {...result} />)

                output.split('\n').forEach((line) => report.reportError(MessageName.UNNAMED, line))
              })
            console.log(results.length, 'asdfasd')
          } catch (error: any) {
            progress.end()

            const lines = (error?.message || '').split('\n').filter(Boolean)

            lines.forEach((line) => {
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
