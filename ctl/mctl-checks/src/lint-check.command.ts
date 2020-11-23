import { Command } from 'clipanion'
import { Linter as EslintLinter } from 'eslint'

import { Linter } from '@monstrs/code-lint'

import { Annotation, AnnotationLevel, Conclusion, createCheck } from './github'

const getAnnotationLevel = (severity: EslintLinter.Severity): AnnotationLevel => {
  if (severity === 1) {
    return AnnotationLevel.Warning
  }

  return AnnotationLevel.Failure
}

class LintCheckCommand extends Command {
  @Command.Path(`check`, `lint`)
  async execute() {
    const cwd: string = process.env.GITHUB_WORKSPACE || process.cwd()

    const linter = new Linter(cwd)

    const { results } = linter.lint()

    const annotations: Annotation[] = []

    results.forEach(({ filePath, messages = [] }: EslintLinter.LintMessage) => {
      if (messages.length === 0) {
        return
      }

      messages.forEach((message: any) => {
        const line = (message.line || 0) + 1

        annotations.push({
          path: filePath.substring(cwd.length + 1),
          start_line: line,
          end_line: line,
          annotation_level: getAnnotationLevel(message.severity),
          raw_details: `(${message.ruleId}): ${message.message}`,
          title: message.ruleId || 'unknown/rule',
          message: message.message,
        })
      })
    })

    const warnings: number = annotations.filter(
      (annotation) => annotation.annotation_level === 'warning'
    ).length

    const errors: number = annotations.filter(
      (annotation) => annotation.annotation_level === 'failure'
    ).length

    await createCheck('Lint', annotations.length > 0 ? Conclusion.Failure : Conclusion.Success, {
      title: annotations.length > 0 ? `Errors ${errors}, Warnings ${warnings}` : 'Successful',
      summary:
        annotations.length > 0
          ? `Found ${errors} errors and ${warnings} warnings`
          : 'All checks passed',
      annotations,
    })
  }
}

export { LintCheckCommand }
