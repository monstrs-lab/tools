import { Command }       from 'clipanion'

import { formatProject } from '@monstrs/code-format'

class FormatCommand extends Command {
  @Command.Path(`format`)
  async execute() {
    formatProject()
  }
}

export { FormatCommand }
