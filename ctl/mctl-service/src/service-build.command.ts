import { Command }    from 'clipanion'

import { TypeScript } from '@monstrs/code-typescript'

class ServiceBuildCommand extends Command {
  @Command.Path(`service`, `build`)
  async execute() {
    const ts = new TypeScript()

    const result = ts.build(['./src'], {
      declaration: false,
      module: 'commonjs',
    })

    Object.values(result)
      .flat()
      .forEach((diagnostic) => {
        this.context.stdout.write(ts.formatDiagnostic(diagnostic))
      })

    if (result.errors.length > 0) {
      process.exit(1)
    }
  }
}

export { ServiceBuildCommand }
