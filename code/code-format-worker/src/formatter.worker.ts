import { EvalWorker } from '@monstrs/code-worker-utils'

import { getContent } from './formatter.worker.content.js'

export class FormatterWorker {
  constructor(private readonly cwd: string) {}

  async run(cwd: string, files: Array<string>) {
    return EvalWorker.run(this.cwd, getContent(), {
      cwd,
      files,
    })
  }
}
