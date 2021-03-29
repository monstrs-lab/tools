import { Plugin }                from '@yarnpkg/core'

import { ChangedForeachCommand } from './changed-foreach.command'
import { ChangedListCommand }    from './changed-list.command'

export const plugin: Plugin = {
  commands: [ChangedForeachCommand, ChangedListCommand],
}
