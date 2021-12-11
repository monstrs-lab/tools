import { BaseCommand }   from '@yarnpkg/cli'
import { Configuration } from '@yarnpkg/core'
import { StreamReport }  from '@yarnpkg/core'
import { MessageName }   from '@yarnpkg/core'

import React             from 'react'

import { ErrorInfo }     from '@monstrs/cli-ui-error-info-component'
import { LogRecord }     from '@monstrs/cli-ui-log-record-component'
import { ServiceWorker } from '@monstrs/code-service-worker'
import { renderStatic }  from '@monstrs/cli-ui-renderer'

class ServiceDevCommand extends BaseCommand {
  static paths = [['service', 'dev']]

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await report.startTimerPromise('Service Development', async () => {
          try {
            await ServiceWorker.watch(this.context.cwd, (logRecord) => {
              renderStatic(<LogRecord {...logRecord} />, process.stdout.columns - 12)
                .split('\n')
                .forEach((line) => {
                  report.reportInfo(MessageName.UNNAMED, line)
                })
            })
          } catch (error) {
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

export { ServiceDevCommand }
