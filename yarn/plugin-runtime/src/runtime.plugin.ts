import { Plugin }          from '@yarnpkg/core'

import { validateProject } from './validate-project.hook.js'

export const plugin: Plugin = {
  hooks: {
    validateProject,
  },
}
