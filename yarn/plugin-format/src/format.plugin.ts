import type { Plugin }   from '@yarnpkg/core'

import { FormatCommand } from './commands/index.js'

export const plugin: Plugin = {
  commands: [FormatCommand],
}
