import type { PortablePath } from '@yarnpkg/fslib'

import { describe }          from '@jest/globals'
import { expect }            from '@jest/globals'
import { test }              from '@jest/globals'
import { xfs }               from '@yarnpkg/fslib'
import { ppath }             from '@yarnpkg/fslib'

import { makeTemporaryEnv }  from '@monstrs/yarn-test-utils'

const content = `
import { createServer } from 'node:http'

const port = 3000

createServer((req, res) => {
  res.writeHead(200)
  res.end('Hello World!')
}).listen(port)
`

describe('yarn', () => {
  describe('commands', () => {
    describe('service', () => {
      test(
        'it should build withouth errors',
        makeTemporaryEnv(
          {
            dependencies: {
              '@monstrs/code-runtime': 'workspace:*',
            },
          },
          async ({ path, run, source }) => {
            await run('install')

            await xfs.mkdirPromise(ppath.join(path, 'src' as PortablePath))
            await xfs.writeFilePromise(ppath.join(path, 'src/index.ts' as PortablePath), content)

            const { code, stdout } = await run('service', 'build')

            expect(code).toBe(0)
            expect(stdout).toContain('➤ YN0000: └ Completed')

            await expect(
              xfs.readFilePromise(`${path}/dist/index.js` as PortablePath, 'utf8')
            ).resolves.toContain('Hello World!')
          }
        )
      )
    })
  })
})
