import { BaseCommand }     from '@yarnpkg/cli'
import { StreamReport }    from '@yarnpkg/core'
import { MessageName }     from '@yarnpkg/core'
import { Configuration }   from '@yarnpkg/core'
import { Project }         from '@yarnpkg/core'
import { Option }          from 'clipanion'

import { SpinnerProgress } from '@monstrs/yarn-run-utils'

import { format }          from './format.worker'

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

          progress.start()

          try {
            await format(project.cwd, this.files)

            progress.end()
          } catch (error) {
            report.reportError(MessageName.UNNAMED, (error as any).message)
            progress.end()
          }
        })
      }
    )

    return commandReport.exitCode()
  }
}

export { FormatCommand }
