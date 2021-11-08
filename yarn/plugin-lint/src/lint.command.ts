import { StreamReport }    from '@yarnpkg/core'
import { Configuration }   from '@yarnpkg/core'
import { MessageName }     from '@yarnpkg/core'
import { Project }         from '@yarnpkg/core'
import { BaseCommand }     from '@yarnpkg/cli'
import { Option }          from 'clipanion'

import { SpinnerProgress } from '@monstrs/yarn-run-utils'

import { lint }            from './lint.worker'

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
            const outputs = await lint(project.cwd, this.files)

            progress.end()

            outputs.map((line) => report.reportError(MessageName.UNNAMED, line))
          } catch (error) {
            progress.end()

            report.reportError(MessageName.UNNAMED, (error as any).message)
          }
        })
      }
    )

    return commandReport.exitCode()
  }
}

export { LintCommand }
