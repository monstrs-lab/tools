import type { webpack }  from '@monstrs/tools-runtime/webpack'

import { join }          from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe }      from '@jest/globals'
import { expect }        from '@jest/globals'
import { it }            from '@jest/globals'

import { Service }       from '../src/index.js'

const closeWatcher = async (watcher: webpack.Watching): Promise<void> =>
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
      const service = await Service.initialize(
        join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures/simple')
      )

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const watcher: webpack.Watching = await service.watch(() => {})

      await closeWatcher(watcher)

      expect(true).toBe(true)
    })
  })
})
