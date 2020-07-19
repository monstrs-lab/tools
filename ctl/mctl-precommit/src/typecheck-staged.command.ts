import execa       from 'execa'
import { Command } from 'clipanion'

class TypeCheckStagedCommand extends Command {
  @Command.Rest({ required: 0 })
  files: Array<string> = []

  @Command.Path(`staged`, `typecheck`)
  async execute() {
    try {
      await execa('yarn', ['pnpify', 'tsc', '--noEmit', ...this.files], {
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

export { TypeCheckStagedCommand }
