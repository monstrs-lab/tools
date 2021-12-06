import { join }            from 'node:path'
import { Worker }          from 'node:worker_threads'

import type { Diagnostic } from 'typescript'

import { getContent }      from './typescript.worker.content'

export class TypeScriptWorker {
  static async run(cwd: string, config, noEmit: boolean): Promise<Array<Diagnostic>> {
    return new Promise((resolve, reject) => {
      const pnpPath = process.versions.pnp
        ? // eslint-disable-next-line global-require
          require('module').findPnpApi(__filename).resolveRequest('pnpapi', null)
        : join(process.cwd(), '.pnp.cjs')

      const content: Array<string> = []

      content.push(`require('${pnpPath}').setup()`)
      content.push(getContent())

      const originalCwd = process.cwd()
      process.chdir(cwd)

      const worker = new Worker(content.join('\n'), {
        eval: true,
        workerData: {
          cwd: originalCwd,
          config,
          noEmit,
        },
      })

      const exitHandler = (code: number) => {
        if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`))
      }

      worker.once('message', (result) => {
        process.chdir(originalCwd)

        worker.off('error', reject)
        worker.off('exit', exitHandler)

        resolve(result)
      })

      worker.once('error', reject)
      worker.once('exit', exitHandler)
    })
  }
}
