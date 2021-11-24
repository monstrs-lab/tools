import { Plugin }            from '@yarnpkg/core'

import { afterAllInstalled } from './after-all-installed.hook'

const dynamicRequire = eval('require') || require

export const plugin: Plugin = {
  hooks: {
    afterAllInstalled,
    setupScriptEnvironment() {
      //dynamicRequire(process.cwd() + '/.pnp.cjs').setup()
      require('fs').writeFileSync('/tmp/s.txt', process.versions.pnp || 'empty')
    }
  },
}
