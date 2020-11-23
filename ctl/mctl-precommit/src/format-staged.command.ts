import { Command } from 'clipanion'

import { formatFiles } from '@monstrs/code-format'

class FormatStagedCommand extends Command {
  @Command.Rest({ required: 0 })
  files: Array<string> = []

  @Command.Path(`staged`, `format`)
  async execute() {
    formatFiles(this.files)
  }
}

export { FormatStagedCommand }
