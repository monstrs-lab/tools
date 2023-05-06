import { Plugin }                 from '@yarnpkg/core'

import { TypesConfigSyncCommand } from './types-config-sync.command.jsx'
import { TypesCheckCommand }      from './types-check.command.jsx'

export const plugin: Plugin = {
  commands: [TypesCheckCommand, TypesConfigSyncCommand],
}
