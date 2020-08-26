import { Command } from 'clipanion'

import { build }   from '@monstrs/code-service'

class ServiceBuildCommand extends Command {
  @Command.Path(`service`, `build`)
  async execute() {
    const { errors, warnings } = await build({ cwd: process.cwd() })

    errors.forEach((error) => {
      this.context.stdout.write(error.message)
    })

    warnings.forEach((warning) => {
      this.context.stdout.write(warning.message)
    })

    if (errors.length > 0) {
      process.exit(1)
    }
  }
}

export { ServiceBuildCommand }
