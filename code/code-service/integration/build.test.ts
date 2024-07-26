import { join }          from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe }      from '@jest/globals'
import { expect }        from '@jest/globals'
import { it }            from '@jest/globals'

import { Service }       from '../src/index.js'

describe('service', () => {
  describe('build', () => {
    it('simple', async () => {
      const service = await Service.initialize(
        join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures/simple')
      )

      const logRecords = await service.build()

      expect(logRecords).toEqual([])
    })
  })
})
