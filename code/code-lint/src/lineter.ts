import { relative }               from 'node:path'
import { join }                   from 'node:path'

import globby                     from 'globby'
import ignore                     from 'ignore'
import { Ignore }                 from 'ignore'
import { ESLint }                 from 'eslint'

import { ignore as ignoreConfig } from './config'
import { createPatterns }         from './config'

export class Linter {
  engine: ESLint

  ignorer: Ignore

  constructor(private readonly cwd: string) {
    this.ignorer = ignore().add(ignoreConfig)

    this.engine = new ESLint({
      ignore: false,
      baseConfig: {
        extends: [require.resolve('../rules/base')],
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      useEslintrc: false,
      cwd: join(__dirname, '../'),
      cacheLocation: join(this.cwd, '.yarn', '.eslintcache'),
    })
  }

  async lint(files?: Array<string>) {
    if (files && files.length > 0) {
      return this.lintFiles(files)
    }

    return this.lintProject()
  }

  async lintProject() {
    return this.lintFiles(await globby(createPatterns(this.cwd), { dot: true, nodir: true } as any))
  }

  async lintFiles(files: Array<string> = []) {
    const results = await this.engine.lintFiles(
      files.filter((file) => this.ignorer.filter([relative(this.cwd, file)]).length !== 0)
    )

    return results.flat()
  }

  loadFormatter(format: string = 'stylish') {
    return this.engine.loadFormatter(format)
  }
}
