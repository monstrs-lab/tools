import { join }       from 'node:path'
import { Worker }     from 'node:worker_threads'

import { getContent } from './schematics.worker.content'

export interface SchematicsWorkerRunOptions {
  type: 'generate' | 'migrate'
  cwd: string
  force: boolean
  dryRun: boolean
  schematicName: string
  migrationVersion: string
  options: object
}

export class SchematicsWorker {
  static async run(options: Partial<SchematicsWorkerRunOptions>) {
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
        workerData: options,
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
