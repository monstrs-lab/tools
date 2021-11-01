import type { ESLint } from 'eslint'
import type { Linter } from 'eslint'

export type LintResult = ESLint.LintResult
export type Severity = Linter.Severity

export * from './lineter'
export * from './lint.progress-report'
