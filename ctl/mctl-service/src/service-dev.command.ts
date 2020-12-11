import { Command } from 'clipanion'

import { watch }   from '@monstrs/code-service'

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
    const watcher = await watch({ cwd: process.cwd() }, (error): undefined => {
      if (error) {
        this.context.stdout.write(error)
      }

      return undefined
    })

    await waitSignals(watcher)
  }
}

export { ServiceDevCommand }
