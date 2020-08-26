import { Command } from 'clipanion'

import { watch }   from '@monstrs/code-service'

class ServiceStartCommand extends Command {
  @Command.Path(`service`, `start`)
  async execute() {
    const watcher = await watch({ cwd: process.cwd() }, (error) => {
      if (error) {
        this.context.stdout.write(error)
      }
    })

    process.on('SIGINT', () => {
      watcher.close()
      process.exit()
    })

    process.on('SIGTERM', () => {
      watcher.close()
      process.exit()
    })
  }
}

export { ServiceStartCommand }
