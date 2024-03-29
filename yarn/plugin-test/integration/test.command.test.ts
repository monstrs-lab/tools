import type { PortablePath } from '@yarnpkg/fslib'

import { describe }          from '@jest/globals'
import { expect }            from '@jest/globals'
import { test }              from '@jest/globals'
import { xfs }               from '@yarnpkg/fslib'
import { ppath }             from '@yarnpkg/fslib'

import { makeTemporaryEnv }  from '@monstrs/yarn-test-utils'

describe('yarn', () => {
  describe('commands', () => {
    describe('test', () => {
      test(
        'it should test unit withouth errors',
        makeTemporaryEnv(
          {
            dependencies: {
              '@monstrs/tools-runtime': 'workspace:*',
              typescript: '^5.2.2',
            },
          },
          async ({ path, run }) => {
            await run('install')

            await xfs.writeFilePromise(
              ppath.join(path, 'unit-success.test.ts' as PortablePath),
              `test('success', () => { expect(true).toBe(true) })`
            )

            const { code, stdout, stderr } = await run('test', 'unit')

            expect(code).toBe(0)
            expect(stdout).toContain('Done')
            expect(stderr).toContain('PASS ./unit-success.test.ts')
          }
        )
      )

      test(
        'it should test unit with errors',
        makeTemporaryEnv(
          {
            dependencies: {
              '@monstrs/tools-runtime': 'workspace:*',
              typescript: '^5.2.2',
            },
          },
          async ({ path, run }) => {
            await run('install')

            await xfs.writeFilePromise(
              ppath.join(path, 'unit-invalid.test.ts' as PortablePath),
              `test('success', () => { expect(true).toBe(false) })`
            )

            const { code, stdout, stderr } = await run('test', 'unit')

            expect(code).toBe(0)
            expect(stdout).toContain('Done')
            expect(stderr).toContain('FAIL ./unit-invalid.test.ts')
          }
        )
      )

      test(
        'it should test integration withouth errors',
        makeTemporaryEnv(
          {
            dependencies: {
              '@monstrs/tools-runtime': 'workspace:*',
              typescript: '^5.2.2',
            },
          },
          async ({ path, run }) => {
            await run('install')

            await xfs.mkdirPromise(ppath.join(path, 'integration' as PortablePath))
            await xfs.writeFilePromise(
              ppath.join(path, 'integration/success.test.ts' as PortablePath),
              `test('success', () => { expect(true).toBe(true) })`
            )

            const { code, stdout, stderr } = await run('test', 'integration')

            expect(code).toBe(0)
            expect(stdout).toContain('Done')
            expect(stderr).toContain('PASS integration/success.test.ts')
          }
        )
      )

      test(
        'it should test integration with errors',
        makeTemporaryEnv(
          {
            dependencies: {
              '@monstrs/tools-runtime': 'workspace:*',
              typescript: '^5.2.2',
            },
          },
          async ({ path, run }) => {
            await run('install')

            await xfs.mkdirPromise(ppath.join(path, 'integration' as PortablePath))
            await xfs.writeFilePromise(
              ppath.join(path, 'integration/invalid.test.ts' as PortablePath),
              `test('success', () => { expect(true).toBe(false) })`
            )

            const { code, stdout, stderr } = await run('test', 'integration')

            expect(code).toBe(0)
            expect(stdout).toContain('Done')
            expect(stderr).toContain('FAIL integration/invalid.test.ts')
          }
        )
      )
    })
  })
})
