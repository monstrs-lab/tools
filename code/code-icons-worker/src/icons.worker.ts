import { EvalWorker } from '@monstrs/code-worker-utils'

import { getContent } from './icons.worker.content.js'

export class IconsWorker {
  constructor(private readonly cwd: string) {}

  async run(cwd: string) {
    return EvalWorker.run(this.cwd, getContent(), {
      cwd,
    })
  }
}
