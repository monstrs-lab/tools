import type { ServiceLogRecord } from '@monstrs/code-service'

import { EvalWorker }            from '@monstrs/code-worker-utils'

import { getContent }            from './service.worker.content.js'

export class ServiceWorker {
  constructor(protected readonly cwd: string) {}

  async run(cwd: string): Promise<Array<ServiceLogRecord>> {
    process.chdir(this.cwd)

    return EvalWorker.run<Array<ServiceLogRecord>>(this.cwd, getContent(), {
      environment: 'production',
      cwd,
    })
  }

  async watch(cwd: string, callback: (logRecord: ServiceLogRecord) => void): Promise<void> {
    process.chdir(this.cwd)

    return EvalWorker.watch<ServiceLogRecord>(
      this.cwd,
      getContent(),
      {
        environment: 'development',
        cwd,
      },
      callback
    )
  }
}
