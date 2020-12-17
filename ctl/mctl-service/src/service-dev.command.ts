import { Command }           from 'clipanion'

import { watch }             from '@monstrs/code-service'
import { StartServerPlugin } from '@monstrs/webpack-start-server-plugin'

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
  @Command.Path(`service`, `dev`)
  async execute() {
    const plugins = [
      {
        name: 'start-server',
        use: StartServerPlugin,
        args: [{ stdout: this.context.stdout, stderr: this.context.stderr }],
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
