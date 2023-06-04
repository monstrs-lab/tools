import type { Plugin }      from '@yarnpkg/core'

import { ImagePackCommand } from './commands/index.js'

export const plugin: Plugin = {
  commands: [ImagePackCommand],
}
