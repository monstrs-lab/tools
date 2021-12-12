import { join }             from 'node:path'
import { Worker }           from 'node:worker_threads'

import type { DryRunEvent } from '@angular-devkit/schematics'

import { getContent }       from './schematics.worker.content'

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
  constructor(
    private readonly cwd: string,
    private readonly force = false,
    private readonly dryRun = false
  ) {}

  async run(
    type: 'migrate' | 'generate',
    schematicName: string,
    options = {}
  ): Promise<Array<DryRunEvent>> {
    return new Promise((resolve, reject) => {
      const pnpPath = process.versions.pnp
        ? require('module').findPnpApi(__filename).resolveRequest('pnpapi', null)
        : join(process.cwd(), '.pnp.cjs')

      const worker = new Worker(getContent(), {
        eval: true,
        workerData: {
          type,
          cwd: this.cwd,
          force: this.force,
          dryRun: this.dryRun,
          schematicName,
          options,
        },
        execArgv: ['--require', pnpPath, ...process.execArgv],
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

  generate(schematicName: string, options = {}) {
    return this.run('generate', schematicName, options)
  }

  migrate(schematicName: string, options = {}) {
    return this.run('migrate', schematicName, options)
  }
}
