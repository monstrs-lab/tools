import { Command }       from 'clipanion'

import { formatProject } from '@monstrs/code-format'
import { formatFiles }   from '@monstrs/code-format'

class FormatCommand extends Command {
  @Command.Rest({ required: 0 })
  files: Array<string> = []

  @Command.Path(`format`)
  async execute() {
    if (this.files.length > 0) {
      formatFiles(this.files)
    } else {
      formatProject()
    }
  }
}

export { FormatCommand }
