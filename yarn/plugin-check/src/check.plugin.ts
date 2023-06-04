import type { Plugin }  from '@yarnpkg/core'

import { CheckCommand } from './commands/index.js'

export const plugin: Plugin = {
  commands: [CheckCommand],
}
