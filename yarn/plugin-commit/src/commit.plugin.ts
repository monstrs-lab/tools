import { Plugin }                   from '@yarnpkg/core'

import { CommitMessageLintCommand } from './commit-message-lint.command'
import { CommitStagedLintCommand }  from './commit-staged-lint.command'
import { CommitCommand }            from './commit.command'

export const plugin: Plugin = {
  commands: [CommitMessageLintCommand, CommitStagedLintCommand, CommitCommand],
}
