import { Configuration }          from '@yarnpkg/core'
import { StreamReport }           from '@yarnpkg/core'
import { Project }                from '@yarnpkg/core'

import { ServiceWorker }          from '@monstrs/code-service-worker'
import { SpinnerProgress }        from '@monstrs/yarn-run-utils'

import { AbstractServiceCommand } from './abstract-service.command.jsx'

class ServiceBuildCommand extends AbstractServiceCommand {
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

            const logRecords = await new ServiceWorker(project.cwd).run(this.context.cwd)

            progress.end()

            logRecords.forEach((logRecord) => {
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

export { ServiceBuildCommand }
