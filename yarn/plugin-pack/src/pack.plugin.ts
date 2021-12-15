import { Plugin }               from '@yarnpkg/core'

import { PackBuildPackCommand } from './pack-buildpack.command'
import { PackSourceCommand }    from './pack-source.command'

export const plugin: Plugin = {
  commands: [PackSourceCommand, PackBuildPackCommand],
}
