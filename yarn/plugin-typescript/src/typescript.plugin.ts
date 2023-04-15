import { Plugin }            from '@yarnpkg/core'

import { TypeCheckCommand }  from './typecheck.command.jsx'
import { afterAllInstalled } from './after-all-installed.hook.js'

export const plugin: Plugin = {
  commands: [TypeCheckCommand],
  hooks: {
    afterAllInstalled,
  },
}
