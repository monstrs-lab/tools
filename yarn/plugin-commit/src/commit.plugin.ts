import type { Plugin }              from '@yarnpkg/core'

import { CommitMessageLintCommand } from './commands/index.js'
import { CommitMessageCommand }     from './commands/index.js'
import { CommitStagedCommand }      from './commands/index.js'

export const plugin: Plugin = {
  commands: [CommitMessageCommand, CommitMessageLintCommand, CommitStagedCommand],
}
