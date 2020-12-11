import { Command } from 'clipanion'
import execa       from 'execa'
import fs          from 'fs-extra'
import path        from 'path'

import { build }   from '@monstrs/code-service'

class RendererBuildCommand extends Command {
  @Command.Path(`renderer`, `build`)
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

    await execa('yarn', ['next', 'build', 'src'], {
      stdio: 'inherit',
    })

    await fs.copy(
      path.join(process.cwd(), 'src', '.next'),
      path.join(process.cwd(), 'dist', '.next')
    )
  }
}

export { RendererBuildCommand }
