import type { ESLint }      from '@monstrs/tools-runtime/eslint'
import type { LintOptions } from '@monstrs/code-lint'

import { EvalWorker }       from '@monstrs/code-worker-utils'

import { getContent }       from './linter.worker.content.js'

export class LinterWorker {
  constructor(private readonly cwd: string) {}

  async run(files: Array<string> = [], options?: LintOptions): Promise<Array<ESLint.LintResult>> {
    return EvalWorker.run(getContent(), {
      cwd: this.cwd,
      options,
      files,
    })
  }
}
