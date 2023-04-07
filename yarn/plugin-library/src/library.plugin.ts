import { Plugin }                 from '@yarnpkg/core'

import { LibraryBuildCommand }    from './library-bulid.command.jsx'
import { beforeWorkspacePacking } from './before-workspace-packing.hook.js'

export const plugin: Plugin = {
  hooks: {
    beforeWorkspacePacking,
  },
  commands: [LibraryBuildCommand],
}
