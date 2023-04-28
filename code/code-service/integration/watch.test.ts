import { join }          from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe }      from '@jest/globals'
import { expect }        from '@jest/globals'
import { it }            from '@jest/globals'

import { Service }       from '../src/index.js'

const closeWatcher = (watcher): Promise<void> =>
  new Promise((resolve) => {
    watcher.close(() => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
  })

describe('service', () => {
  describe('watch', () => {
    it('simple', async () => {
      const watcher = await new Service(
        join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures/simple')
      ).watch(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

      await closeWatcher(watcher)

      expect(true).toBe(true)
    })
  })
})
