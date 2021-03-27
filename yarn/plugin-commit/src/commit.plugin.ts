import { Plugin }        from '@yarnpkg/core'

import { CommitCommand } from './commit.command'

export const plugin: Plugin = {
  commands: [CommitCommand],
}
