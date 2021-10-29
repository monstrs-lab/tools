/* eslint-disable no-restricted-syntax */
import globby                                     from 'globby'
import ignore                                     from 'ignore'
import path                                       from 'path'
import { ESLint }                                 from 'eslint'

import { createPatterns, ignore as ignoreConfig } from './config'

class Linter {
  engine: ESLint

  cwd: string

  constructor(projectCwd?: string) {
    this.cwd = projectCwd || process.cwd()

    this.engine = new ESLint({
      ignore: false,
      baseConfig: {
        extends: [require.resolve('../rules/base')],
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      useEslintrc: false,
      cwd: path.join(__dirname, '../'),
      cacheLocation: path.join(this.cwd, '.yarn', '.eslintcache'),
    })
  }

  lintFiles(files: string[] = []) {
    const ignorer = ignore().add(ignoreConfig)

    return this.engine.lintFiles(
      files.filter((file) => ignorer.filter([path.relative(this.cwd, file)]).length !== 0)
    )
  }

  lint() {
    const ignorer = ignore().add(ignoreConfig)

    const patterns = createPatterns(this.cwd)

    const files = globby
      .sync(patterns, { dot: true, nodir: true } as any)
      .filter((file) => ignorer.filter([path.relative(this.cwd, file)]).length !== 0)

    return this.lintFiles(files)
  }

  async format(results: any, format = 'stylish') {
    const { engine } = this
    const formatter = await engine.loadFormatter(format)

    return formatter.format(results)
  }
}

export { Linter }
