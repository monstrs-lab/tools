/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable global-require */

import { join }                  from 'node:path'
import { Worker }                from 'node:worker_threads'

import type { AggregatedResult } from '@jest/test-result'
import type { Config }           from '@jest/types'

import { getContent }            from './tester.worker.content'

export class TesterWorker {
  static async run(
    cwd: string,
    type: 'integration' | 'unit',
    options?: Partial<Config.Argv>,
    files?: Array<string>
  ): Promise<AggregatedResult> {
    return new Promise((resolve, reject) => {
      const pnpPath = process.versions.pnp
        ? require('module').findPnpApi(__filename).resolveRequest('pnpapi', null)
        : join(process.cwd(), '.pnp.cjs')

      const content: Array<string> = []

      content.push(`require('${pnpPath}').setup()`)

      if (process.env.TOOLS_DEV_MODE) {
        content.push(`require('@monstrs/tools-setup-ts-execution')\n`)
      }

      content.push(getContent())

      const worker = new Worker(content.join('\n'), {
        eval: true,
        workerData: {
          type,
          cwd,
          options,
          files: files || [],
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
