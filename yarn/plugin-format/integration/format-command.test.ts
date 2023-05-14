import type { PortablePath } from '@yarnpkg/fslib'

import { describe }          from '@jest/globals'
import { expect }            from '@jest/globals'
import { test }              from '@jest/globals'
import { xfs }               from '@yarnpkg/fslib'
import { ppath }             from '@yarnpkg/fslib'

import { makeTemporaryEnv }  from '@monstrs/yarn-test-utils'

describe('yarn', () => {
  describe('commands', () => {
    describe('format', () => {
      test(
        'it should split imports',
        makeTemporaryEnv({}, async ({ path, run, source }) => {
          await run('install')

          const filePath = ppath.join(path, 'split-imports.ts' as PortablePath)

          await xfs.writeFilePromise(
            filePath,
            `
import { a, b } from './c'
import { d } from './e'
`
          )

          await run('format')

          await expect(xfs.readFilePromise(filePath, 'utf8')).resolves.toMatchSnapshot()
        })
      )

      test(
        'it should order imports',
        makeTemporaryEnv({}, async ({ path, run, source }) => {
          await run('install')

          const filePath = ppath.join(path, 'order-imports.ts' as PortablePath)

          await xfs.writeFilePromise(
            filePath,
            `
import { a } from './c'
import { b } from '@scope/name'
import type { c } from './d'
          `
          )

          await run('format')

          await expect(xfs.readFilePromise(filePath, 'utf8')).resolves.toMatchSnapshot()
        })
      )

      test(
        'it should align imports',
        makeTemporaryEnv({}, async ({ path, run, source }) => {
          await run('install')

          const filePath = ppath.join(path, 'align-imports.ts' as PortablePath)

          await xfs.writeFilePromise(
            filePath,
            `
import { first } from './a'
import { second } from './a'
import type { type } from './a'
import third from './a'
          `
          )

          await run('format')

          await expect(xfs.readFilePromise(filePath, 'utf8')).resolves.toMatchSnapshot()
        })
      )
    })
  })
})
