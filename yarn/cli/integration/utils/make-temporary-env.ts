/* Copy/Paste https://github.com/yarnpkg/berry/blob/master/packages/acceptance-tests/pkg-tests-core/sources/utils/exec.ts */
/* eslint-disable */

import { npath }     from '@yarnpkg/fslib'

import { URL }       from 'url'
import { delimiter } from 'path'

import * as exec     from './exec'
import * as fs       from './fs'
import * as tests    from './tests'

const { generatePkgDriver } = tests
const { execFile } = exec
const { createTemporaryFolder } = fs

export const makeTemporaryEnv = generatePkgDriver({
  getName() {
    return `yarn`
  },
  async runDriver(path, [command, ...args], { cwd, projectFolder, registryUrl, env, ...config }) {
    const rcEnv: Record<string, any> = {}
    for (const [key, value] of Object.entries(config))
      rcEnv[`YARN_${key.replace(/([A-Z])/g, `_$1`).toUpperCase()}`] = Array.isArray(value)
        ? value.join(`;`)
        : value

    const nativePath = npath.fromPortablePath(path)
    const tempHomeFolder = npath.fromPortablePath(await createTemporaryFolder())

    const cwdArgs = typeof projectFolder !== `undefined` ? [projectFolder] : []

    const yarnBinary = require.resolve(`${__dirname}/../../bundles/yarn.js`)
    //const yarnBinary = require.resolve(`${__dirname}/../../src/cli.dev.js`)
    const res = await execFile(process.execPath, [yarnBinary, ...cwdArgs, command, ...args], {
      cwd: cwd || path,
      env: {
        [`HOME`]: tempHomeFolder,
        [`USERPROFILE`]: tempHomeFolder,
        [`PATH`]: `${nativePath}/bin${delimiter}${process.env.PATH}`,
        [`TEST_ENV`]: `true`,
        [`YARN_GLOBAL_FOLDER`]: `${nativePath}/.yarn/global`,
        // Otherwise we'd send telemetry event when running tests
        [`YARN_ENABLE_TELEMETRY`]: `0`,
        // Otherwise snapshots relying on this would break each time it's bumped
        [`YARN_CACHE_KEY_OVERRIDE`]: `0`,
        // Otherwise the output isn't stable between runs
        [`YARN_ENABLE_TIMERS`]: `false`,
        [`YARN_ENABLE_PROGRESS_BARS`]: `false`,
        // Otherwise the output wouldn't be the same on CI vs non-CI
        [`YARN_ENABLE_INLINE_BUILDS`]: `false`,
        [`YARN_PREFER_AGGREGATE_CACHE_INFO`]: `false`,
        // Otherwise we would more often test the fallback rather than the real logic
        [`YARN_PNP_FALLBACK_MODE`]: `none`,
        // Otherwise tests fail on systems where this is globally set to true
        [`YARN_ENABLE_GLOBAL_CACHE`]: `false`,
        // Older versions of Windows need this set to not have node throw an error
        [`NODE_SKIP_PLATFORM_CHECK`]: `1`,
        ...rcEnv,
        ...env,
      },
    })

    if (process.env.JEST_LOG_SPAWNS) {
      console.log(`===== stdout:`)
      console.log(res.stdout)
      console.log(`===== stderr:`)
      console.log(res.stderr)
    }

    return res
  },
})
