import path             from 'path'
import waitForLocalhost from 'wait-for-localhost'

import { watch }        from '../src'

const closeWatcher = (watcher): Promise<void> =>
  new Promise((resolve) => watcher.close(() => resolve()))

describe('service', () => {
  describe('watch', () => {
    it('simple', async () => {
      const watcher = await watch({ cwd: path.join(__dirname, 'fixtures/simple') })

      await waitForLocalhost({ port: 3000 })
      await closeWatcher(watcher)

      expect(true).toBe(true)
    })
  })
})
