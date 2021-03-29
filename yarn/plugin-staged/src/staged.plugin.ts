import { Plugin }           from '@yarnpkg/core'

import { PreCommitCommand } from './precommit.command'

export const plugin: Plugin = {
  commands: [PreCommitCommand],
}
