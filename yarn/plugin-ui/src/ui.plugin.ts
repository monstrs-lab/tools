import type { Plugin }            from '@yarnpkg/core'

import { UiIconsGenerateCommand } from './ui-icons-generate.command.js'

export const plugin: Plugin = {
  commands: [UiIconsGenerateCommand],
}
