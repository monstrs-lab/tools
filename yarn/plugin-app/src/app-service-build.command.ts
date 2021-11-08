import { BaseCommand }     from '@yarnpkg/cli'
import { Configuration }   from '@yarnpkg/core'
import { StreamReport }    from '@yarnpkg/core'
import { MessageName }     from '@yarnpkg/core'

import { SpinnerProgress } from '@monstrs/yarn-run-utils'
import type * as Runtime   from '@monstrs/yarn-runtime'

class AppServiceBuildCommand extends BaseCommand {
  static paths = [['app', 'service', 'build']]

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)

    // eslint-disable-next-line global-require
    const { Service }: typeof Runtime = require('@monstrs/yarn-runtime')

    const service = new Service(this.context.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        const { errors, warnings }: Runtime.ServiceBuildResult = await report.startTimerPromise(
          'Service build',
          async () => {
            const progress = new SpinnerProgress(this.context.stdout, configuration)

            try {
              progress.start()

              const result = await service.build()

              progress.end()

              return result
            } catch (error) {
              progress.end()

              report.reportError(MessageName.UNNAMED, (error as any).message)

              return { errors: [], warnings: [] }
            }
          }
        )

        if (warnings.length > 0) {
          await report.startTimerPromise('Service Build Warnings:', async () => {
            warnings.forEach((warning) =>
              report.reportWarning(MessageName.UNNAMED, warning.message)
            )
          })
        }

        if (errors.length > 0) {
          await report.startTimerPromise('Service Build Errors:', async () => {
            errors.forEach((error) => report.reportWarning(MessageName.UNNAMED, error.message))
          })
        }
      }
    )

    return commandReport.exitCode()
  }
}

export { AppServiceBuildCommand }
