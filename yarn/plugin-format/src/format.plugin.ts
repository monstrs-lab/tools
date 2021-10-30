import { Plugin }        from '@yarnpkg/core'

import { FormatCommand } from './format.command'

const plugin: Plugin = {
  commands: [FormatCommand],
}

export { plugin }
export default plugin