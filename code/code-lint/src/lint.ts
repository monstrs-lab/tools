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
    const ignorer = ignore().add(ignoreConfig)

    return this.engine.executeOnFiles(
      files.filter((file) => ignorer.filter([path.relative(this.cwd, file)]).length !== 0)
    )
  }

  lint() {
    const patterns = createPatterns(this.cwd)

    const files = globby.sync(patterns, { dot: true, nodir: true } as any)

    // @ts-ignore
    return this.lintFiles(files)
  }

  format(results: any, format = 'stylish') {
    const formatter: any = this.engine.getFormatter(format)

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
