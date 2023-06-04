import type { Plugin }            from '@yarnpkg/core'

import { TestIntegrationCommand } from './commands/index.js'
import { TestUnitCommand }        from './commands/index.js'

export const plugin: Plugin = {
  commands: [TestIntegrationCommand, TestUnitCommand],
}
