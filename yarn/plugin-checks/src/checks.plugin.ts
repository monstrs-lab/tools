import type { Plugin }                  from '@yarnpkg/core'

import { ChecksLintCommand }            from './commands/index.js'
import { ChecksReleaseCommand }         from './commands/index.js'
import { ChecksRunCommand }             from './commands/index.js'
import { ChecksTestIntegrationCommand } from './commands/index.js'
import { ChecksTestUnitCommand }        from './commands/index.js'
import { ChecksTypeCheckCommand }       from './commands/index.js'

export const plugin: Plugin = {
  commands: [
    ChecksTestIntegrationCommand,
    ChecksTestUnitCommand,
    ChecksTypeCheckCommand,
    ChecksLintCommand,
    ChecksReleaseCommand,
    ChecksRunCommand,
  ],
}
