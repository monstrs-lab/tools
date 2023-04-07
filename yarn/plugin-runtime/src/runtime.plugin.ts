import { Plugin }          from '@yarnpkg/core'

import { validateProject } from './validate-project.hook.ts'

export const plugin: Plugin = {
  hooks: {
    validateProject,
  },
}
