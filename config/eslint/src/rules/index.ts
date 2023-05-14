import type { Linter }         from 'eslint'

import { rules as typescript } from './typescript.rules.js'
import { rules as promises }   from './promises.rules.js'
import { rules as security }   from './security.rules.js'
import { rules as nextjs }     from './nextjs.rules.js'
import { rules as react }      from './react.rules.js'
import { rules as node }       from './node.rules.js'
import { rules as base }       from './base.rules.js'

export const rules: Linter.RulesRecord = {
  ...typescript,
  ...promises,
  ...security,
  ...nextjs,
  ...react,
  ...node,
  ...base,
}
