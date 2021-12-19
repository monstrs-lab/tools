import { Plugin }               from '@yarnpkg/core'

import { PackImageCommand }     from './pack-image.command'
import { PackWorkspaceCommand } from './pack-workspace.command'

export const plugin: Plugin = {
  commands: [PackImageCommand, PackWorkspaceCommand],
}
