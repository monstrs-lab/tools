import { BaseCommand }     from '@yarnpkg/cli'
import { Configuration }   from '@yarnpkg/core'
import { StreamReport }    from '@yarnpkg/core'
import { MessageName }     from '@yarnpkg/core'
import { Project }         from '@yarnpkg/core'

import React               from 'react'

import { ErrorInfo }       from '@monstrs/cli-ui-error-info-component'
import { LogRecord }       from '@monstrs/cli-ui-log-record-component'
import { ServiceWorker }   from '@monstrs/code-service-worker'
import { SpinnerProgress } from '@monstrs/yarn-run-utils'
import { renderStatic }    from '@monstrs/cli-ui-renderer'

class ServiceDevCommand extends BaseCommand {
  static paths = [['service', 'dev']]

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

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
            await new ServiceWorker(this.context.cwd, project.cwd).watch((logRecord) => {
              progress.end()

              renderStatic(<LogRecord {...logRecord} />, process.stdout.columns - 12)
                .split('\n')
                .forEach((line) => {
                  report.reportInfo(MessageName.UNNAMED, line)
                })
            })
          } catch (error) {
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

export { ServiceDevCommand }
