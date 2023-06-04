import type { Plugin }             from '@yarnpkg/core'

import { FilesChangedListCommand } from './commands/index.js'

export const plugin: Plugin = {
  commands: [FilesChangedListCommand],
}
