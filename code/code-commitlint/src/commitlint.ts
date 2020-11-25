import commitlint from '@commitlint/lint'

import { load }   from './config'

const lint = async (message: string) => {
  const { rules } = await load()

  return commitlint(message, rules)
}

export { lint }
