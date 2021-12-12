import { relative }           from 'node:path'
import { join }               from 'node:path'

import typescriptEslint       from '@typescript-eslint/eslint-plugin'

import jsxA11y                from 'eslint-plugin-jsx-a11y'
import react                  from 'eslint-plugin-react'
import reactHooks             from 'eslint-plugin-react-hooks'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import globby                 from 'globby'
import ignorer                from 'ignore'
import { ESLint }             from 'eslint'

import baseConfig             from '@monstrs/config-eslint'

import { ignore }             from './linter.patterns'
import { createPatterns }     from './linter.patterns'

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

    const eslint = new ESLint({
      ignore: false,
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      useEslintrc: false,
      cwd: this.cwd,
      cacheLocation: join(this.cwd, '.yarn', '.eslintcache'),
      baseConfig,
      plugins: {
        react,
        'jsx-a11y': jsxA11y,
        'react-hooks': reactHooks,
        '@typescript-eslint': typescriptEslint,
        'eslint-plugin-react-hooks': eslintPluginReactHooks,
      },
    })

    const results = await eslint.lintFiles(
      files.filter((file) => ignored.filter([relative(this.cwd, file)]).length !== 0)
    )

    return results.flat()
  }
}
