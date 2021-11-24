import { PortablePath }     from '@yarnpkg/fslib'
import { xfs }              from '@yarnpkg/fslib'

import { coderuntime } from '@monstrs/yarn-testing'

import { makeTemporaryEnv } from './utils'

/*
const {
  tests: {getPackageDirectoryPath},
  yarn: {readManifest},
} = require(`pkg-tests-core`);
const {parseSyml} = require(`@yarnpkg/parsers`);
*/

jest.setTimeout(20000)

describe(`Commands`, () => {
  describe(`add`, () => {
    test(
      `it should add a new regular dependency to the current project (explicit semver)`,
      makeTemporaryEnv(
        {
          '@monstrs/code-runtime': coderuntime.path
        },
        async ({ path, run, source }) => {
          //await run(`add`, `portal:${process.cwd()}/yarn/runtime`);
          //await run('add', 'prettier')
          await run('install')
          //await run('format')

          await expect(
            xfs.readJsonPromise(`${path}/package.json` as PortablePath)
          ).resolves.toMatchObject({
            dependencies: {
              [`no-deps`]: `1.0.0`,
            },
          })
        }
      )
    )
  })
})
