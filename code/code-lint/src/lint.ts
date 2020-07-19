/* eslint-disable no-restricted-syntax */
import globby                                     from 'globby'
import ignore                                     from 'ignore'
import path                                       from 'path'
import { CLIEngine }                              from 'eslint'

import { createPatterns, ignore as ignoreConfig } from './config'

class Linter {
  engine: CLIEngine

  cwd: string

  constructor(projectCwd?: string) {
    this.cwd = projectCwd || process.cwd()

    this.engine = new CLIEngine({
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
    return this.engine.executeOnFiles(files)
  }

  lint() {
    const ignorer = ignore().add(ignoreConfig)

    const patterns = createPatterns(this.cwd)

    const filePaths = globby
      .sync(patterns, { dot: true, nodir: true } as any)
      .filter((filePath) => ignorer.filter([path.relative(this.cwd, filePath)]).length !== 0)

    return this.lintFiles(filePaths)
  }

  format(results: any, format = 'stylish') {
    const { engine } = this
    const formatter: any = engine.getFormatter(format)

    let rulesMeta

    return formatter(results, {
      get rulesMeta() {
        if (!rulesMeta) {
          rulesMeta = {}

          // @ts-ignore
          for (const [ruleId, rule] of engine.getRules()) {
            rulesMeta[ruleId] = rule.meta
          }
        }
        return rulesMeta
      },
    })
  }
}

export { Linter }
