import type { ESLint }             from '@monstrs/tools-runtime/eslint'
import type { Linter as ESLinter } from '@monstrs/tools-runtime/eslint'

import EventEmitter                from 'node:events'
import { readFile }                from 'node:fs/promises'
import { writeFile }               from 'node:fs/promises'
import { relative }                from 'node:path'

import { globby }                  from 'globby'
import ignorer                     from 'ignore'

import { ignore }                  from './linter.patterns.js'
import { createPatterns }          from './linter.patterns.js'
import { createLintResult }        from './linter.utils.js'

export interface LintOptions {
  fix?: boolean
}

export class Linter extends EventEmitter {
  private ignore: ignorer.Ignore

  protected constructor(
    private readonly linter: ESLinter,
    private readonly config: Array<ESLinter.Config>,
    private readonly cwd: string
  ) {
    super()

    this.ignore = ignorer.default().add(ignore)
  }

  static async initialize(rootCwd: string, cwd: string): Promise<Linter> {
    const { Linter: LinterConstructor } = await import('@monstrs/tools-runtime/eslint')
    const { eslintconfig } = await import('@monstrs/tools-runtime/eslint')

    const linter = new LinterConstructor({ configType: 'flat' })

    const config = eslintconfig.map((item) => ({
      ...item,
      languageOptions: {
        ...(item.languageOptions || {}),
        parserOptions: {
          ...(item.languageOptions?.parserOptions || {}),
          tsconfigRootDir: rootCwd,
        },
      },
    }))

    return new Linter(linter, config, cwd)
  }

  async lintFile(filename: string, options?: LintOptions): Promise<ESLint.LintResult> {
    const source = await readFile(filename, 'utf8')

    if (options?.fix) {
      const { messages, fixed, output } = this.linter.verifyAndFix(source, this.config, {
        filename,
      })

      if (fixed) {
        await writeFile(filename, output, 'utf8')
      }

      return createLintResult(filename, output, messages)
    }

    return createLintResult(
      filename,
      source,
      this.linter.verify(source, this.config, {
        filename,
      })
    )
  }

  async lintFiles(
    files: Array<string> = [],
    options?: LintOptions
  ): Promise<Array<ESLint.LintResult>> {
    const results: Array<ESLint.LintResult> = []

    this.emit('start', { files })

    for await (const file of files) {
      this.emit('lint:start', { file })

      const result = await this.lintFile(file, options)

      results.push(result)

      this.emit('lint:end', { result })
    }

    this.emit('end', { results })

    return results
  }

  async lint(files?: Array<string>, options?: LintOptions): Promise<Array<ESLint.LintResult>> {
    const filesForLint =
      files && files.length > 0 ? files : await globby(createPatterns(this.cwd), { dot: true })

    return this.lintFiles(
      filesForLint.filter((file) => this.ignore.filter([relative(this.cwd, file)]).length !== 0),
      options
    )
  }
}
