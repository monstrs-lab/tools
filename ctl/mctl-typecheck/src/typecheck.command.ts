import { Command }          from 'clipanion'

import { TypeScript }       from '@monstrs/code-typescript'
import { getRootWorkspace } from '@monstrs/code-project'

class TypeCheckCommand extends Command {
  @Command.Rest({ required: 0 })
  files: Array<string> = []

  @Command.Path(`typecheck`)
  async execute() {
    const ts = new TypeScript()

    const { manifest } = await getRootWorkspace()

    const workspaces: Array<string> = manifest.workspaceDefinitions.map(
      (definition) => definition.pattern
    )

    const result = this.files.length > 0 ? ts.check(this.files) : ts.check(workspaces)

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
