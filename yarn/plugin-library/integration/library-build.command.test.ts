import type { PortablePath } from '@yarnpkg/fslib'

import { Filename }          from '@yarnpkg/fslib'
import { describe }          from '@jest/globals'
import { expect }            from '@jest/globals'
import { test }              from '@jest/globals'
import { xfs }               from '@yarnpkg/fslib'
import { ppath }             from '@yarnpkg/fslib'

import { makeTemporaryEnv }  from '@monstrs/yarn-test-utils'

describe('yarn', () => {
  describe('commands', () => {
    describe('library', () => {
      test(
        'it should build withouth errors',
        makeTemporaryEnv(
          {
            dependencies: {
              '@monstrs/tools-runtime': 'workspace:*',
              typescript: '^5.2.2',
            },
          },
          async ({ path, run }) => {
            await run('install')

            await xfs.mkdirPromise(ppath.join(path, 'src' as PortablePath))
            await xfs.writeFilePromise(
              ppath.join(path, 'src/index.ts' as PortablePath),
              'export const test = (n: number) => n * 2'
            )

            const { code } = await run('library', 'build', {
              env: {
                NODE_OPTIONS: `--require ${ppath.join(path, Filename.pnpCjs)} --loader ${ppath.join(path, Filename.pnpEsmLoader)}`,
              },
            })

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
