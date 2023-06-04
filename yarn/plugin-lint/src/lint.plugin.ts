import type { Plugin } from '@yarnpkg/core'

import { LintCommand } from './commands/index.js'

export const plugin: Plugin = {
  commands: [LintCommand],
}
