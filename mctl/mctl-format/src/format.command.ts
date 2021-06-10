import { Command }       from 'clipanion'
import { Option }        from 'clipanion'

import { formatProject } from '@monstrs/code-format'
import { formatFiles }   from '@monstrs/code-format'

class FormatCommand extends Command {
  static paths = [['format']]

  files: Array<string> = Option.Rest({ required: 0 })

  async execute() {
    if (this.files.length > 0) {
      formatFiles(this.files)
    } else {
      formatProject()
    }
  }
}

export { FormatCommand }
