import { BaseCommand }     from '@yarnpkg/cli'
import { Configuration }   from '@yarnpkg/core'
import { StreamReport }    from '@yarnpkg/core'
import { MessageName }     from '@yarnpkg/core'
import { Project }         from '@yarnpkg/core'

import React               from 'react'

import { ErrorInfo }       from '@monstrs/cli-ui-error-info-component'
import { ServiceWorker }   from '@monstrs/code-service-worker'
import { SpinnerProgress } from '@monstrs/yarn-run-utils'
import { renderStatic }    from '@monstrs/cli-ui-renderer'

class ServiceBuildCommand extends BaseCommand {
  static paths = [['service', 'build']]

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await report.startTimerPromise('Service build', async () => {
          const progress = new SpinnerProgress(this.context.stdout, configuration)

          try {
            progress.start()

            const { errors, warnings } = await new ServiceWorker(
              this.context.cwd,
              project.cwd
            ).run()

            progress.end()

            warnings.forEach((warning) =>
              report.reportWarning(MessageName.UNNAMED, warning.message))

            errors.forEach((error) => report.reportError(MessageName.UNNAMED, error.message))
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

export { ServiceBuildCommand }
