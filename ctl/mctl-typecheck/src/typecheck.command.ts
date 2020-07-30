import { Command }          from 'clipanion'

import { TypeScript }       from '@monstrs/code-typescript'
import { getRootWorkspace } from '@monstrs/code-workspaces'

class TypeCheckCommand extends Command {
  @Command.Path(`typecheck`)
  async execute() {
    const ts = new TypeScript()

    const { manifest } = await getRootWorkspace()

    const result = ts.check(manifest.workspaceDefinitions.map((definition) => definition.pattern))

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

export { TypeCheckCommand }
