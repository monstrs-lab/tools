import type { ServiceLogRecord } from '@monstrs/code-service'

import { EvalWorker }            from '@monstrs/code-worker-utils'

import { getContent }            from './service.worker.content.js'

export class ServiceWorker {
  constructor(protected readonly cwd: string, protected readonly rootCwd: string) {}

  async run(): Promise<Array<ServiceLogRecord>> {
    process.chdir(this.rootCwd)

    return EvalWorker.run<Array<ServiceLogRecord>>(getContent(), {
      cwd: this.cwd,
      environment: 'production',
    })
  }

  async watch(callback: (logRecord: ServiceLogRecord) => void) {
    process.chdir(this.rootCwd)

    return EvalWorker.watch<ServiceLogRecord>(
      getContent(),
      {
        environment: 'development',
        cwd: this.cwd,
      },
      callback
    )
  }
}
