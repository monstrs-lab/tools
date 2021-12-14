import type { AggregatedResult } from '@jest/test-result'
import type { Config }           from '@jest/types'

import { EvalWorker }            from '@monstrs/code-worker-utils'

import { getContent }            from './tester.worker.content'

export class TesterWorker {
  constructor(private readonly cwd: string) {}

  async run(
    type: 'integration' | 'unit',
    options?: Partial<Config.Argv>,
    files?: Array<string>
  ): Promise<AggregatedResult> {
    return EvalWorker.run(getContent(), {
      cwd: this.cwd,
      type,
      options,
      files,
    })
  }
}