import { Plugin }             from '@yarnpkg/core'

import { InitProjectCommand } from './init-project.command'
import { MigrationUpCommand } from './migration-up.command'

export const plugin: Plugin = {
  commands: [InitProjectCommand, MigrationUpCommand],
}
