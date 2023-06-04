import type { Plugin }                     from '@yarnpkg/core'

import { WorkspacesChangedForeachCommand } from './commands/index.js'
import { WorkspacesChangedListCommand }    from './commands/index.js'

export const plugin: Plugin = {
  commands: [WorkspacesChangedForeachCommand, WorkspacesChangedListCommand],
}
