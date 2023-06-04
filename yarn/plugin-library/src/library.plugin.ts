import type { Plugin }            from '@yarnpkg/core'

import { LibraryBuildCommand }    from './commands/index.js'
import { beforeWorkspacePacking } from './hooks/index.js'

export const plugin: Plugin = {
  hooks: {
    beforeWorkspacePacking,
  },
  commands: [LibraryBuildCommand],
}
