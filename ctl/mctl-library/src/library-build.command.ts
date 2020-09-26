import rimraf             from 'rimraf'
import { Command }        from 'clipanion'
import { promises as fs } from 'fs'

import { TypeScript }     from '@monstrs/code-typescript'

class LibraryBuildCommand extends Command {
  @Command.String(`-t,--target`)
  target: string = './dist'

  @Command.Path(`library`, `build`)
  async execute() {
    await this.cleanTarget()

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

  protected async cleanTarget() {
    try {
      await fs.access(this.target)
    } catch {
      return
    }

    try {
      rimraf.sync(this.target)
      // eslint-disable-next-line
    } catch {}
  }
}

export { LibraryBuildCommand }
