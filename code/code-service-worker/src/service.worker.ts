import type { ServiceBuildResult } from '@monstrs/code-service'

import { EvalWorker }              from '@monstrs/code-worker-utils'

import { getContent }              from './service.worker.content'

export class ServiceWorker {
  constructor(protected readonly cwd: string) {}

  async run(): Promise<ServiceBuildResult> {
    return EvalWorker.run<ServiceBuildResult>(getContent(), {
      cwd: this.cwd,
      environment: 'production',
    })
  }

  async watch(onMessage) {
    return EvalWorker.watch(
      getContent(),
      {
        environment: 'development',
        cwd: this.cwd,
      },
      onMessage
    )
  }
}
