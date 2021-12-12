import { join }        from 'node:path'
import { Worker }      from 'node:worker_threads'

import type { ESLint } from 'eslint'

import { getContent }  from './linter.worker.content'

export class LinterWorker {
  static async run(files: Array<string>, config): Promise<Array<ESLint.LintResult>> {
    return new Promise((resolve, reject) => {
      const pnpPath = process.versions.pnp
        ? require('module').findPnpApi(__filename).resolveRequest('pnpapi', null)
        : join(process.cwd(), '.pnp.cjs')

      const worker = new Worker(getContent(), {
        eval: true,
        execArgv: ['--require', pnpPath, ...process.execArgv],
        workerData: {
          files,
          config,
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
