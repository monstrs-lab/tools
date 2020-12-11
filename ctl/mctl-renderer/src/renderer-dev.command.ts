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

class RendererDevCommand extends Command {
  @Command.Path(`renderer`, `dev`)
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

export { RendererDevCommand }
