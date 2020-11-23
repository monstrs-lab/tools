import { Command } from 'clipanion'

import { TypeScript } from '@monstrs/code-typescript'
import { getRootWorkspace } from '@monstrs/code-project'

class TypeCheckCommand extends Command {
  @Command.Path(`typecheck`)
  async execute() {
    const ts = new TypeScript()

    const { manifest } = await getRootWorkspace()

    const workspaces: Array<string> = manifest.workspaceDefinitions.map(
      (definition) => definition.pattern
    )

    const result = ts.check(workspaces)

    Object.values(result)
      .flat()
      .forEach((diagnostic) => {
        this.context.stdout.write(ts.formatDiagnostic(diagnostic))
        this.context.stdout.write('\n\n')
      })

    if (result.errors.length > 0) {
      process.exit(1)
    }
  }
}

export { TypeCheckCommand }
