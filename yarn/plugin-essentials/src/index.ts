import { Plugin }        from '@yarnpkg/core'

import { CommitCommand } from '@monstrs/yarn-plugin-commit'

const plugin: Plugin = {
  commands: [CommitCommand],
}

export default plugin
