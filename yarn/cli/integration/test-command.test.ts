import { PortablePath }     from '@yarnpkg/fslib'
import { xfs }              from '@yarnpkg/fslib'

import { makeTemporaryEnv } from './utils'

jest.setTimeout(120000)

describe('yarn', () => {
  describe('commands', () => {
    describe('test', () => {
      test(
        'it should test unit withouth errors',
        makeTemporaryEnv(
          {
            dependencies: {
              '@jest/core': '^27.4.4',
              '@monstrs/config-jest': '*',
              typescript: '^4.5.3',
            },
          },
          async ({ path, run, source }) => {
            await run('install')

            await xfs.writeFilePromise(
              `${path}/unit-success.test.ts` as PortablePath,
              `
test('success', () => {
  expect(true).toBe(true)
})
`
            )

            const { code, stdout, stderr } = await run('test', 'unit')

            expect(code).toBe(0)
            expect(stdout).toContain('Done')
            expect(stderr).toContain('Test Suites: 1 passed, 1 total')
            expect(stderr).toContain('Tests:       1 passed, 1 total')
          }
        )
      )

      test(
        'it should test unit with errors',
        makeTemporaryEnv(
          {
            dependencies: {
              '@jest/core': '^27.4.4',
              '@monstrs/config-jest': '*',
              typescript: '^4.5.3',
            },
          },
          async ({ path, run, source }) => {
            await run('install')

            await xfs.writeFilePromise(
              `${path}/unit-invalid.test.ts` as PortablePath,
              `
test('success', () => {
  expect(true).toBe(false)
})
`
            )

            const { code, stdout, stderr } = await run('test', 'unit')

            expect(code).toBe(0)
            expect(stdout).toContain('Done')
            expect(stderr).toContain('Test Suites: 1 failed, 1 total')
            expect(stderr).toContain('Tests:       1 failed, 1 total')
          }
        )
      )

      test(
        'it should test integration withouth errors',
        makeTemporaryEnv(
          {
            dependencies: {
              '@jest/core': '^27.4.4',
              '@monstrs/config-jest': '*',
              typescript: '^4.5.3',
            },
          },
          async ({ path, run, source }) => {
            await run('install')

            await xfs.mkdirPromise(`${path}/integration` as PortablePath)
            await xfs.writeFilePromise(
              `${path}/integration/success.test.ts` as PortablePath,
              `
test('success', () => {
  expect(true).toBe(true)
})
`
            )

            const { code, stdout, stderr } = await run('test', 'integration')

            expect(code).toBe(0)
            expect(stdout).toContain('Done')
            expect(stderr).toContain('Test Suites: 1 passed, 1 total')
            expect(stderr).toContain('Tests:       1 passed, 1 total')
          }
        )
      )

      test(
        'it should test integration with errors',
        makeTemporaryEnv(
          {
            dependencies: {
              '@jest/core': '^27.4.4',
              '@monstrs/config-jest': '*',
              typescript: '^4.5.3',
            },
          },
          async ({ path, run, source }) => {
            await run('install')

            await xfs.mkdirPromise(`${path}/integration` as PortablePath)
            await xfs.writeFilePromise(
              `${path}/integration/invalid.test.ts` as PortablePath,
              `
test('success', () => {
  expect(true).toBe(false)
})
`
            )

            const { code, stdout, stderr } = await run('test', 'integration')

            expect(code).toBe(0)
            expect(stdout).toContain('Done')
            expect(stderr).toContain('Test Suites: 1 failed, 1 total')
            expect(stderr).toContain('Tests:       1 failed, 1 total')
          }
        )
      )
    })
  })
})
