import { Command }                  from 'clipanion'

import { watch }                    from '@monstrs/code-service'
import { StartServerPlugin }        from '@monstrs/webpack-start-server-plugin'
import { StartServerPluginOptions } from '@monstrs/webpack-start-server-plugin'

import { dashboard }                from './dashboard'

const waitSignals = (watcher): Promise<void> =>
  new Promise((resolve) => {
    process.on('SIGINT', () => {
      watcher.close(() => resolve())
    })

    process.on('SIGTERM', () => {
      watcher.close(() => resolve())
    })
  })

class ServiceDevCommand extends Command {
  @Command.Boolean(`-d,--dashboard`)
  dashboard: boolean = false

  @Command.Path(`service`, `dev`)
  async execute() {
    const startServerPluginArgs: Partial<StartServerPluginOptions> = {}

    if (this.dashboard) {
      const processWatcher = dashboard()

      startServerPluginArgs.onWorkerStart = processWatcher.change
      startServerPluginArgs.onWorkerExit = processWatcher.change
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

    const watcher = await watch({ cwd: process.cwd() }, plugins, (error): undefined => {
      if (error) {
        this.context.stdout.write(error)
      }

      return undefined
    })

    await waitSignals(watcher)
  }
}

export { ServiceDevCommand }
