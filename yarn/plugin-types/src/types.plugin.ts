import type { Plugin }       from '@yarnpkg/core'

import { TypesCheckCommand } from './types-check.command.jsx'

export const plugin: Plugin = {
  commands: [TypesCheckCommand],
}
