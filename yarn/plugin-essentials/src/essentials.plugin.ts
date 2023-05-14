import type { Plugin }       from '@yarnpkg/core'

import { SetVersionCommand } from './set-version.command.js'

export const plugin: Plugin = {
  commands: [SetVersionCommand],
}
