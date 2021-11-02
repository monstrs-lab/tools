import { PassThrough }              from 'node:stream'

import { BaseCommand }              from '@yarnpkg/cli'
import { Configuration }            from '@yarnpkg/core'
import { StreamReport }             from '@yarnpkg/core'
import { MessageName }              from '@yarnpkg/core'
import { Option }                   from 'clipanion'

import { StartServerPlugin }        from '@monstrs/webpack-start-server-plugin'
import { StartServerPluginOptions } from '@monstrs/webpack-start-server-plugin'
import { PrettyLogsTransform }      from '@monstrs/cli-ui-pretty-logs'
import type * as Runtime            from '@monstrs/yarn-runtime'

class AppServiceDevCommand extends BaseCommand {
  static paths = [['app', 'service', 'dev']]

  prettyLogs = Option.Boolean(`-p,--pretty-logs`, true)

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)

    const { Service }: typeof Runtime = require('@monstrs/yarn-runtime')
    const service = new Service(this.context.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async () => {
        const startServerPluginArgs: Partial<StartServerPluginOptions> = {}

        if (this.prettyLogs) {
          const formatter = new PassThrough()

          startServerPluginArgs.stdout = formatter
          startServerPluginArgs.stderr = formatter

          formatter.pipe(new PrettyLogsTransform()).pipe(process.stdout)
        } else {
          startServerPluginArgs.stdout = this.context.stdout
          startServerPluginArgs.stderr = this.context.stderr
        }

        const plugins = [
          {
            name: 'start-server',
            use: StartServerPlugin,
            args: [startServerPluginArgs],
          },
        ]

        const watcher = await service.watch(plugins, (error): undefined => {
          if (error) {
            this.context.stdout.write(error)
          }

          return undefined
        })

        await this.waitSignals(watcher)
      }
    )

    return commandReport.exitCode()
  }

  private waitSignals(watcher): Promise<void> {
    return new Promise((resolve) => {
      process.on('SIGINT', () => {
        watcher.close(() => resolve())
      })

      process.on('SIGTERM', () => {
        watcher.close(() => resolve())
      })
    })
  }
}

export { AppServiceDevCommand }
