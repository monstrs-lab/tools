import type { webpack }  from '@monstrs/tools-runtime/webpack'

import assert            from 'node:assert/strict'
import { join }          from 'node:path'
import { test }          from 'node:test'
import { fileURLToPath } from 'node:url'

import { Service }       from '../src/index.js'

const closeWatcher = async (watcher: webpack.Watching): Promise<void> =>
  new Promise((resolve) => {
    watcher.close(() => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
  })

test('should watch service', async () => {
  const service = await Service.initialize(
    join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures/simple')
  )

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const watcher: webpack.Watching = await service.watch(() => {})

  await closeWatcher(watcher)

  assert.ok(true)
})
