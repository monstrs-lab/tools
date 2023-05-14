import type { Linter as ESLinter } from '@monstrs/tools-runtime/eslint'

export const createLintResult = (
  filePath: string,
  source: string,
  messages: Array<ESLinter.LintMessage>
) => ({
  filePath,
  source,
  messages,
  fixableErrorCount: 0,
  fixableWarningCount: 0,
  usedDeprecatedRules: [],
  suppressedMessages: [],
  errorCount: messages.filter((message) => message.severity === 1).length,
  fatalErrorCount: messages.filter((message) => message.severity === 0).length,
  warningCount: messages.filter((message) => message.severity === 2).length,
})
