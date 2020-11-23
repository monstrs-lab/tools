import path from 'path'
import { Command } from 'clipanion'
import { bootstrap } from 'commitizen/dist/cli/git-cz'

class CommitCommand extends Command {
  @Command.Rest({ required: 0 })
  args: Array<string> = []

  @Command.Path(`commit`)
  async execute() {
    try {
      bootstrap(
        {
          cliPath: require.resolve('commitizen/package.json').replace('package.json', ''),
          config: {
            path: path.join(__dirname, '../adapter/index.js'),
          },
        },
        [null, ...this.args]
      )
    } catch (error) {
      this.context.stdout.write(error.message)

      process.exit(1)
    }
  }
}

export { CommitCommand }
