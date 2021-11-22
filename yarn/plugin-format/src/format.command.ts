import { BaseCommand }     from '@yarnpkg/cli'
import { StreamReport }    from '@yarnpkg/core'
import { MessageName }     from '@yarnpkg/core'
import { Configuration }   from '@yarnpkg/core'
import { Project }         from '@yarnpkg/core'

import { Option }          from 'clipanion'

import { Formatter }       from '@monstrs/code-format'
import { SpinnerProgress } from '@monstrs/yarn-run-utils'

class FormatCommand extends BaseCommand {
  static paths = [['format']]

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
        await report.startTimerPromise('Format', async () => {
          const progress = new SpinnerProgress(this.context.stdout, configuration)
          const errors: Array<string> = []

          progress.start()

          try {
            await new Formatter(project.cwd).format(this.files)
          } catch (error: any) {
            ;(error.message || '').split('\n').forEach((line) => {
              errors.push(line)
            })
          }

          progress.end()

          errors.forEach((line) => report.reportError(MessageName.UNNAMED, line))
        })
      }
    )

    return commandReport.exitCode()
  }
}

export { FormatCommand }
