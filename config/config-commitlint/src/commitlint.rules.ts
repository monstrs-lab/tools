import type { QualifiedRules } from '@commitlint/types'

import { COMMIT_TYPE_ENUM }    from './commitlint.enums.js'

export const rules: QualifiedRules = {
  'body-leading-blank': [1, 'always'],
  'body-max-line-length': [2, 'always', 180],
  'footer-leading-blank': [1, 'always'],
  'footer-max-line-length': [2, 'always', 100],
  'header-max-length': [2, 'always', 140],
  'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
  'subject-empty': [2, 'never'],
  'subject-full-stop': [2, 'never', '.'],
  'type-case': [2, 'always', 'lower-case'],
  'type-empty': [2, 'never'],
  'type-enum': [2, 'always', Object.keys(COMMIT_TYPE_ENUM)],
  'scope-case': [2, 'always', 'lower-case'],
  'scope-empty': [2, 'never'],
}
