import commitlint      from '@commitlint/lint'
import { LintOutcome } from '@commitlint/types'

import { load }        from './config'

const lint = async (message: string): Promise<LintOutcome> => {
  const { rules } = await load()

  return commitlint(message, rules)
}

export { lint }
