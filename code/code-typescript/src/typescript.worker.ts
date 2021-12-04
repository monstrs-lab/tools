/* eslint-disable @typescript-eslint/quotes */

import { join }            from 'node:path'
import { Worker }          from 'node:worker_threads'

import type { Diagnostic } from 'typescript'

import { getContent }      from './typescript.worker.content'

export class TypeScriptWorker {
  static async run(cwd: string, config, noEmit: boolean): Promise<Array<Diagnostic>> {
    return new Promise((resolve, reject) => {
      const pnpPath = process.versions.pnp
        ? require('module').findPnpApi(__filename).resolveRequest('pnpapi', null)
        : join(process.cwd(), '.pnp.cjs')

      const worker = new Worker([`require('${pnpPath}').setup()`, getContent()].join('\n'), {
        eval: true,
        workerData: {
          cwd,
          config,
          noEmit,
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
