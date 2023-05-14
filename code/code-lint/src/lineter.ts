import type { ESLint }        from '@monstrs/tools-runtime/eslint'

import { readFile }           from 'node:fs/promises'
import { writeFile }          from 'node:fs/promises'
import { relative }           from 'node:path'
import { join }               from 'node:path'

import { globby }             from 'globby'
import ignorerPkg             from 'ignore'
import deepmerge              from 'deepmerge'

import { Linter as ESLinter } from '@monstrs/tools-runtime/eslint'
import { eslintconfig }       from '@monstrs/tools-runtime/eslint'

import { ignore }             from './linter.patterns.js'
import { createPatterns }     from './linter.patterns.js'
import { createLintResult }   from './linter.utils.js'

// TODO: moduleResolution
const ignorer = ignorerPkg as any

export interface LintOptions {
  fix?: boolean
}

export class Linter {
  private linter: ESLinter

  private ignore: typeof ignorer

  constructor(private readonly cwd: string) {
    this.linter = new ESLinter({ configType: 'flat' } as any)
    this.ignore = ignorer().add(ignore)
  }

  protected get config(): ESLinter.Config<ESLinter.RulesRecord, ESLinter.RulesRecord> {
    return [
      deepmerge(eslintconfig[0], {
        languageOptions: {
          parserOptions: {
            project: join(this.cwd, 'tsconfig.json'),
          },
        },
      }),
      { files: ['**/*.*'] },
    ] as ESLinter.Config<ESLinter.RulesRecord, ESLinter.RulesRecord>
  }

  async lintFile(filename, options?: LintOptions): Promise<ESLint.LintResult> {
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
    return Promise.all(
      files
        .filter((file) => this.ignore.filter([relative(this.cwd, file)]).length !== 0)
        .map(async (filename) => this.lintFile(filename, options))
    )
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
