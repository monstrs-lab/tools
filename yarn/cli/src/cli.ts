import { YarnVersion }            from '@yarnpkg/core'
import { main }                   from '@yarnpkg/cli'

// @ts-expect-error
import { getPluginConfiguration } from '@monstrs/yarn-cli-tools'

import packageJson                from '../package.json' assert { type: 'json' }

const pc = getPluginConfiguration(packageJson['@yarnpkg/builder'].bundles.standard)

if (pc.then) {
  pc.then(async (pluginConfiguration) =>
    main({
      binaryVersion: YarnVersion || '<unknown>',
      pluginConfiguration,
    }))
} else {
  main({
    binaryVersion: YarnVersion || '<unknown>',
    pluginConfiguration: pc,
  })
}
