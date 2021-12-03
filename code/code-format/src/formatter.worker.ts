import { Worker }     from 'node:worker_threads'

import { getContent } from './formatter.worker.content'

export class FormatterWorker {
  static async run(files: Array<string>) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(getContent(), {
        eval: true,
        workerData: {
          files,
        },
      })

      const exitHandler = (code: number) => {
        if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`))
      }

      worker.once('message', (result) => {
        worker.off('error', reject)
        worker.off('exit', exitHandler)
        resolve(result)
      })

      worker.once('error', reject)
      worker.once('exit', exitHandler)
    })
  }
}
