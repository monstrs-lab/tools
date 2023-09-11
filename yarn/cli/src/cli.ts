/* eslint-disable @typescript-eslint/no-unsafe-call */

import { npath }                  from '@yarnpkg/fslib'
import { ppath }                  from '@yarnpkg/fslib'
import { runExit }                from '@yarnpkg/cli'

// @ts-expect-error
import { getPluginConfiguration } from '@monstrs/yarn-cli-tools'

import packageJson                from '../package.json' assert { type: 'json' }

const pc = getPluginConfiguration(packageJson['@yarnpkg/builder'].bundles.standard)

if (pc.then) {
  pc.then(async (pluginConfiguration: ReturnType<getPluginConfiguration>) =>
    runExit(process.argv.slice(2), {
      cwd: ppath.cwd(),
      selfPath: npath.toPortablePath(npath.resolve(process.argv[1])),
      pluginConfiguration,
    }))
} else {
  runExit(process.argv.slice(2), {
    cwd: ppath.cwd(),
    selfPath: npath.toPortablePath(npath.resolve(process.argv[1])),
    pluginConfiguration: pc,
  })
}
