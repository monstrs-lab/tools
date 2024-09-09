import assert            from 'node:assert/strict'
import { join }          from 'node:path'
import { test }          from 'node:test'
import { fileURLToPath } from 'node:url'

import { Service }       from '../src/index.js'

test('should build service with empty logs', async () => {
  const service = await Service.initialize(
    join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures/simple')
  )

  const logRecords = await service.build()

  assert.deepEqual(logRecords, [])
})
