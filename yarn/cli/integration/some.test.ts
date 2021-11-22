import { PortablePath }     from '@yarnpkg/fslib'
import { xfs }              from '@yarnpkg/fslib'

import { makeTemporaryEnv } from './utils'

/*
const {
  tests: {getPackageDirectoryPath},
  yarn: {readManifest},
} = require(`pkg-tests-core`);
const {parseSyml} = require(`@yarnpkg/parsers`);
*/

describe(`Commands`, () => {
  describe(`add`, () => {
    test(
      `it should add a new regular dependency to the current project (explicit semver)`,
      makeTemporaryEnv({}, async ({ path, run, source }) => {
        console.log(process.cwd())
        //await run(`add`, `portal:${process.cwd()}/yarn/runtime`);
        await run('install')
        await run('format')

        await expect(
          xfs.readJsonPromise(`${path}/package.json` as PortablePath)
        ).resolves.toMatchObject({
          dependencies: {
            [`no-deps`]: `1.0.0`,
          },
        })
      })
    )
  })
})
