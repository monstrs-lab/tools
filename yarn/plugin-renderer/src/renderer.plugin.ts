import type { Plugin }          from '@yarnpkg/core'

import { RendererBuildCommand } from './renderer-build.command.js'
import { RendererDevCommand }   from './renderer-dev.command.js'

export const plugin: Plugin = {
  commands: [RendererBuildCommand, RendererDevCommand],
}
