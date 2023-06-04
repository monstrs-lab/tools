import type { Plugin }         from '@yarnpkg/core'

import { ServiceBuildCommand } from './commands/index.js'
import { ServiceDevCommand }   from './commands/index.js'

export const plugin: Plugin = {
  commands: [ServiceBuildCommand, ServiceDevCommand],
}
