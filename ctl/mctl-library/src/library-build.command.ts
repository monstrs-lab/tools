import { Command }    from 'clipanion'

import { TypeScript } from '@monstrs/code-typescript'

class LibraryBuildCommand extends Command {
  @Command.String(`-t,--target`)
  target: string = './dist'

  @Command.Path(`library`, `build`)
  async execute() {
    const ts = new TypeScript()

    const result = ts.build(['./src'], {
      declaration: true,
      module: 'commonjs',
      outDir: this.target,
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

export { LibraryBuildCommand }
