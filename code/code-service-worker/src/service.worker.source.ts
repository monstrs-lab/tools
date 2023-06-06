import { parentPort } from 'node:worker_threads'
import { workerData } from 'node:worker_threads'

import { Service }    from '@monstrs/code-service'

const { environment, cwd } = workerData

const waitSignals = async (watcher): Promise<void> =>
  new Promise((resolve) => {
    process.on('SIGINT', () => {
      watcher.close(() => {
        resolve()
      })
    })

    process.on('SIGTERM', () => {
      watcher.close(() => {
        resolve()
      })
    })
  })

const execute = async (): Promise<void> => {
  if (environment === 'production') {
    parentPort!.postMessage(await new Service(cwd).build())
  }

  if (environment === 'development') {
    const watcher = await new Service(cwd).watch((message) => {
      parentPort!.postMessage(message)
    })

    await waitSignals(watcher)
  }
}

await execute()
