import commitlint from '@commitlint/lint'
import load       from '@commitlint/load'

import { config } from './config'

const lint = async (message: string) => {
  const options = await load(config)

  return commitlint(
    message,
    options.rules,
    options.parserPreset ? { parserOpts: options.parserPreset.parserOpts } : {}
  )
}

export { lint }
