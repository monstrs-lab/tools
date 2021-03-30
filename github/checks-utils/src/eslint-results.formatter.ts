import { Linter as EslintLinter } from 'eslint'

import { AnnotationLevel }        from './checks.interfaces'
import { Annotation }             from './checks.interfaces'

const getAnnotationLevel = (severity: EslintLinter.Severity): AnnotationLevel => {
  if (severity === 1) {
    return AnnotationLevel.Warning
  }

  return AnnotationLevel.Failure
}

export const eslintResultsFormat = (
  results: EslintLinter.LintMessage[],
  cwd?: string
): Annotation[] => {
  const annotations: Annotation[] = results
    .filter((result) => result.message?.length > 0)
    .map(({ filePath, messages = [] }) =>
      messages.map((message) => {
        const line = (message.line || 0) + 1

        return {
          path: cwd ? filePath.substring(cwd.length + 1) : filePath,
          start_line: line,
          end_line: line,
          annotation_level: getAnnotationLevel(message.severity),
          raw_details: `(${message.ruleId}): ${message.message}`,
          title: message.ruleId || 'unknown/rule',
          message: message.message,
        }
      })
    )
    .flat()

  return annotations
}
