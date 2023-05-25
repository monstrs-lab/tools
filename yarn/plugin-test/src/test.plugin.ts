import type { Plugin }            from '@yarnpkg/core'

import { TestIntegrationCommand } from './test-integration.command.jsx'
import { TestUnitCommand }        from './test-unit.command.jsx'

export const plugin: Plugin = {
  commands: [TestIntegrationCommand, TestUnitCommand],
}
