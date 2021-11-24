import { PortablePath }     from '@yarnpkg/fslib'
import { xfs }              from '@yarnpkg/fslib'

import { coderuntime }      from '@monstrs/yarn-testing'

import { makeTemporaryEnv } from './utils'

jest.setTimeout(60000)

describe(`Commands`, () => {
  describe(`add`, () => {
    test(
      `it should add a new regular dependency to the current project (explicit semver)`,
      makeTemporaryEnv(
        {
          dependencies: {
            ['@monstrs/code-runtime']:
              'file:/Users/andreylinko/workspace/lab/tools/code/code-runtime/package.tgz',
          },
          resolutions: {
            typescript: '4.4.4',
          },
        },
        async ({ path, run, source }) => {
          console.log(coderuntime.path)
          //await run(`add`, `portal:${process.cwd()}/yarn/runtime`);
          //await run('add', `@monstrs/code-runtime@${coderuntime.path}`)
          await run('install')
          //await run('format')
          console.log(await xfs.readJsonPromise(`${path}/package.json` as PortablePath))
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
