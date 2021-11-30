/**
 * @jest-environment node
 */

import path        from 'path'

import { Service } from '../src'

jest.setTimeout(10000)

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
      const watcher = await new Service(path.join(__dirname, 'fixtures/simple')).watch()

      await closeWatcher(watcher)

      expect(true).toBe(true)
    })
  })
})
