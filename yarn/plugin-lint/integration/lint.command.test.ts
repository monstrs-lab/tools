import type { PortablePath } from '@yarnpkg/fslib'

import { describe }          from '@jest/globals'
import { expect }            from '@jest/globals'
import { test }              from '@jest/globals'
import { xfs }               from '@yarnpkg/fslib'
import { ppath }             from '@yarnpkg/fslib'

import { makeTemporaryEnv }  from '@monstrs/yarn-test-utils'

describe('yarn', () => {
  describe('commands', () => {
    describe('lint', () => {
      test(
        'it should lint withouth errors',
        makeTemporaryEnv(
          {
            dependencies: {
              typescript: '^5.2.2',
              '@monstrs/tools-runtime': 'workspace:*',
            },
          },
          async ({ path, run }) => {
            await run('install')

            await xfs.writeFilePromise(
              ppath.join(path, 'success.ts' as PortablePath),
              `const n = (v: number): number => v; n(5);`
            )

            await xfs.writeFilePromise(
              ppath.join(path, 'tsconfig.json' as PortablePath),
              '{"include": ["success.ts"]}'
            )

            const { code, stdout } = await run('lint')

            expect(code).toBe(0)
            expect(stdout).toContain('➤ YN0000: ┌ Lint\n➤ YN0000: └ Completed\n➤ YN0000: Done')
          }
        )
      )
    })

    test(
      'it should lint with errors',
      makeTemporaryEnv(
        {
          dependencies: {
            typescript: '^5.2.2',
            '@monstrs/tools-runtime': 'workspace:*',
          },
        },
        async ({ path, run }) => {
          await run('install')

          await xfs.writeFilePromise(ppath.join(path, 'invalid.ts' as PortablePath), 'const n = 5')
          await xfs.writeFilePromise(
            ppath.join(path, 'tsconfig.json' as PortablePath),
            '{"include": ["invalid.ts"]}'
          )

          try {
            await run('lint')
          } catch (error: any) {
            expect(error.code).toBe(1)
            expect(error.stdout).toContain(
              "'n' is assigned a value but never used @typescript-eslint/no-unused-vars"
            )
            expect(error.stdout).toContain('> 1 | const n = 5')
            expect(error.stdout).toContain('invalid.ts:1:7')
          }
        }
      )
    )
  })
})
