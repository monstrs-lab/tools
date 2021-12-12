import type { Diagnostic } from 'typescript'

import { EvalWorker }      from '@monstrs/code-worker-utils'

import { getContent }      from './typescript.worker.content'

export class TypeScriptWorker {
  constructor(protected readonly cwd: string) {}

  async run(config, noEmit: boolean): Promise<Array<Diagnostic>> {
    const originalCwd = process.cwd()

    process.chdir(this.cwd)

    return EvalWorker.run(getContent(), {
      cwd: originalCwd,
      config,
      noEmit,
    })
  }
}
