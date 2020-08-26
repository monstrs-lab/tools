import { Command } from 'clipanion'

import { watch }   from '@monstrs/code-service'

const waitSignals = (watcher) =>
  new Promise((resolve) => {
    process.on('SIGINT', () => {
      watcher.close(() => resolve())
    })

    process.on('SIGTERM', () => {
      watcher.close(() => resolve())
    })
  })

class ServiceStartCommand extends Command {
  @Command.Path(`service`, `start`)
  async execute() {
    const watcher = await watch({ cwd: process.cwd() }, (error) => {
      if (error) {
        this.context.stdout.write(error)
      }
    })

    await waitSignals(watcher)
  }
}

export { ServiceStartCommand }
