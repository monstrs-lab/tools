import type { Plugin }                from '@yarnpkg/core'

import { ProjectConfigUpdateCommand } from './project-config-update.command.js'
import { ProjectRuntimeSyncCommand }  from './project-runtime-sync.command.js'
import { afterYarnVersionSet }        from './after-yarn-version-set.hook.js'

export const plugin: Plugin = {
  commands: [ProjectConfigUpdateCommand, ProjectRuntimeSyncCommand],
  hooks: {
    afterYarnVersionSet,
  },
}
