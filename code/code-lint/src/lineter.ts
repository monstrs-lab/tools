import type { ESLint }             from '@monstrs/tools-runtime/eslint'
import type { Linter as ESLinter } from '@monstrs/tools-runtime/eslint'

import { readFile }                from 'node:fs/promises'
import { writeFile }               from 'node:fs/promises'
import { relative }                from 'node:path'
import { join }                    from 'node:path'

import { globby }                  from 'globby'
import ignorer                     from 'ignore'

import { ignore }                  from './linter.patterns.js'
import { createPatterns }          from './linter.patterns.js'
import { createLintResult }        from './linter.utils.js'

export interface LintOptions {
  fix?: boolean
}

export class Linter {
  private ignore: ignorer.Ignore

  protected constructor(
    private readonly linter: ESLinter,
    private readonly config: Array<ESLinter.Config>,
    private readonly cwd: string
  ) {
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
          project: join(rootCwd, 'tsconfig.json'),
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

    for await (const file of files) {
      if (this.ignore.filter([relative(this.cwd, file)]).length !== 0) {
        results.push(await this.lintFile(file, options))
      }
    }

    return results
  }

  async lintProject(options?: LintOptions): Promise<Array<ESLint.LintResult>> {
    return this.lintFiles(await globby(createPatterns(this.cwd), { dot: true }), options)
  }

  async lint(files?: Array<string>, options?: LintOptions): Promise<Array<ESLint.LintResult>> {
    if (files && files.length > 0) {
      return this.lintFiles(files, options)
    }

    return this.lintProject(options)
  }
}
