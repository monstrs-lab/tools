import { PortablePath }     from '@yarnpkg/fslib'
import { describe }         from '@jest/globals'
import { expect }           from '@jest/globals'
import { test }             from '@jest/globals'
import { xfs }              from '@yarnpkg/fslib'

import { makeTemporaryEnv } from '@monstrs/yarn-test-utils'

describe('yarn', () => {
  describe('commands', () => {
    describe('library', () => {
      test(
        'it should build withouth errors',
        makeTemporaryEnv(
          {
            dependencies: {
              '@monstrs/code-runtime': 'workspace:*',
              typescript: '^5.0.3',
            },
          },
          async ({ path, run, source }) => {
            await run('install')

            await xfs.mkdirPromise(`${path}/src` as PortablePath)
            await xfs.writeFilePromise(
              `${path}/src/index.ts` as PortablePath,
              'export const test = (n: number) => n * 2'
            )

            const { code } = await run('library', 'build')

            expect(code).toBe(0)

            await expect(
              xfs.readFilePromise(`${path}/dist/index.js` as PortablePath, 'utf8')
            ).resolves.toContain('const test = (n) => n * 2;')
          }
        )
      )
    })
  })
})
