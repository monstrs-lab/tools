import { Command }    from 'clipanion'

import { TypeScript } from '@monstrs/code-typescript'

class TypeCheckStagedCommand extends Command {
  @Command.Rest({ required: 0 })
  files: Array<string> = []

  @Command.Path(`staged`, `typecheck`)
  async execute() {
    const ts = new TypeScript()

    const result = ts.check(this.files)

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

export { TypeCheckStagedCommand }
