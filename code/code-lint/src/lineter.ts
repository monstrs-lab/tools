import { relative }       from 'node:path'
import { join }           from 'node:path'

import globby             from 'globby'
import ignorer            from 'ignore'
import type { ESLint }    from 'eslint'

import { LinterWorker }   from './linter.worker'
import { config }         from './linter.config'
import { ignore }         from './linter.patterns'
import { createPatterns } from './linter.patterns'

export class Linter {
  constructor(private readonly cwd: string) {}

  async lint(files?: Array<string>): Promise<Array<ESLint.LintResult>> {
    if (files && files.length > 0) {
      return this.lintFiles(files)
    }

    return this.lintProject()
  }

  async lintProject(): Promise<Array<ESLint.LintResult>> {
    return this.lintFiles(await globby(createPatterns(this.cwd), { dot: true, nodir: true } as any))
  }

  async lintFiles(files: Array<string> = []): Promise<Array<ESLint.LintResult>> {
    const ignored = ignorer().add(ignore)

    const results: Array<any> = await LinterWorker.run(
      files.filter((file) => ignored.filter([relative(this.cwd, file)]).length !== 0),
      {
        ignore: false,
        baseConfig: config(),
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        useEslintrc: false,
        cwd: join(__dirname, '../'),
        cacheLocation: join(this.cwd, '.yarn', '.eslintcache'),
      }
    )

    return results.flat()
  }
}
