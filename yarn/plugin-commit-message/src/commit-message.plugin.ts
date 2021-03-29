import { Plugin }                   from '@yarnpkg/core'

import { CommitMessageLintCommand } from './commit-message-lint.command'

export const plugin: Plugin = {
  commands: [CommitMessageLintCommand],
}
