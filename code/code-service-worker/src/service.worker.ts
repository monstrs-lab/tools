import { join }               from 'node:path'
import { Worker }             from 'node:worker_threads'

import { ServiceBuildResult } from '@monstrs/code-service'

import { getContent }         from './service.worker.content'

export class ServiceWorker {
  static async run(cwd: string): Promise<ServiceBuildResult> {
    return new Promise((resolve, reject) => {
      const pnpPath = process.versions.pnp
        ? // eslint-disable-next-line global-require
          require('module').findPnpApi(__filename).resolveRequest('pnpapi', null)
        : join(process.cwd(), '.pnp.cjs')

      const content: Array<string> = []

      content.push(`require('${pnpPath}').setup()`)

      if (process.env.TOOLS_DEV_MODE) {
        // eslint-disable-next-line @typescript-eslint/quotes
        content.push(`require('@monstrs/tools-setup-ts-execution')\n`)
      }

      content.push(getContent())

      const worker = new Worker(content.join('\n'), {
        eval: true,
        workerData: {
          cwd,
          environment: 'production',
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

  static async watch(cwd: string, callback) {
    return new Promise((resolve, reject) => {
      const pnpPath = process.versions.pnp
        ? // eslint-disable-next-line global-require
          require('module').findPnpApi(__filename).resolveRequest('pnpapi', null)
        : join(process.cwd(), '.pnp.cjs')

      const content: Array<string> = []

      content.push(`require('${pnpPath}').setup()`)

      if (process.env.TOOLS_DEV_MODE) {
        // eslint-disable-next-line @typescript-eslint/quotes
        content.push(`require('@monstrs/tools-setup-ts-execution')\n`)
      }

      content.push(getContent())

      const worker = new Worker(content.join('\n'), {
        eval: true,
        workerData: {
          cwd,
          environment: 'development',
        },
      })

      const exitHandler = (code: number) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`))
        } else {
          resolve(null)
        }
      }

      worker.on('message', callback)

      worker.once('error', reject)
      worker.once('exit', exitHandler)
    })
  }
}
