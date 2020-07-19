import execa       from 'execa'
import { Command } from 'clipanion'

class TypeCheckCommand extends Command {
  @Command.Path(`typecheck`)
  async execute() {
    try {
      await execa('yarn', ['pnpify', 'tsc', '--noEmit', '-p', process.cwd()], {
        stdio: 'inherit',
      })
    } catch (error) {
      if (error.stderr) {
        this.context.stdout.write(error.stderr)
      }

      if (error.exitCode !== 0) {
        process.exit(error.exitCode === null ? 0 : error.exitCode)
      }
    }
  }
}

export { TypeCheckCommand }
