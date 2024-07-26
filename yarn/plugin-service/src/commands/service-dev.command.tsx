import { Configuration }          from '@yarnpkg/core'
import { StreamReport }           from '@yarnpkg/core'

import { Service }                from '@monstrs/code-service'
import { SpinnerProgress }        from '@monstrs/yarn-run-utils'

import { AbstractServiceCommand } from './abstract-service.command.jsx'

class ServiceDevCommand extends AbstractServiceCommand {
  static override paths = [['service', 'dev']]

  async execute(): Promise<number> {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await report.startTimerPromise('Service Development', async () => {
          const progress = new SpinnerProgress(this.context.stdout, configuration)

          progress.start()

          try {
            const service = await Service.initialize(this.context.cwd)

            await service.watch((logRecord) => {
              progress.end()

              this.renderLogRecord(logRecord, report)
            })
          } catch (error) {
            progress.end()

            this.renderLogRecord(error as Error, report)
          }
        })
      }
    )

    return commandReport.exitCode()
  }
}

export { ServiceDevCommand }
