import type { LintOutcome }   from '@commitlint/types'

import commitformatPkg        from '@commitlint/format'

import { rules }              from './commit.rules.js'
import { lint as commitlint } from './commitlint.js'

// TODO: moduleResolution
const commitformat = commitformatPkg.default || commitformatPkg

export class CommitLinter {
  async lint(message: string): Promise<LintOutcome> {
    return commitlint(message, rules)
  }

  format(
    report,
    options = {
      helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
    }
  ) {
    return commitformat(report, options)
  }
}
