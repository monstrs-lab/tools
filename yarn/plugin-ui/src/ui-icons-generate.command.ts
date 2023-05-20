import { BaseCommand }     from '@yarnpkg/cli'
import { Configuration }   from '@yarnpkg/core'
import { StreamReport }    from '@yarnpkg/core'
import { MessageName }     from '@yarnpkg/core'

import { IconsWorker }     from '@monstrs/code-icons-worker'
import { SpinnerProgress } from '@monstrs/yarn-run-utils'

export class UiIconsGenerateCommand extends BaseCommand {
  static paths = [['ui', 'icons', 'generate']]

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await report.startTimerPromise('Icons compile', async () => {
          const progress = new SpinnerProgress(this.context.stdout, configuration)

          progress.start()

          try {
            await new IconsWorker(this.context.cwd).run()

            progress.end()
          } catch (error) {
            progress.end()

            report.reportError(
              MessageName.UNNAMED,
              error instanceof Error ? error.message : 'Error generate icons'
            )
          }
        })
      }
    )

    return commandReport.exitCode()
  }
}
