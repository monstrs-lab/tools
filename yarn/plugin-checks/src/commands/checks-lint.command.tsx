/* eslint-disable n/no-sync */

import type { ESLint }      from '@monstrs/tools-runtime/eslint'
import type { Linter }      from '@monstrs/tools-runtime/eslint'

import type { Annotation }  from '../utils/index.js'

import { readFileSync }     from 'node:fs'

import { BaseCommand }      from '@yarnpkg/cli'
import { StreamReport }     from '@yarnpkg/core'
import { Configuration }    from '@yarnpkg/core'
import { MessageName }      from '@yarnpkg/core'
import { Project }          from '@yarnpkg/core'
import { codeFrameColumns } from '@babel/code-frame'
import React                from 'react'

import { ESLintResult }     from '@monstrs/cli-ui-eslint-result-component'
import { LinterWorker }     from '@monstrs/code-lint-worker'
import { renderStatic }     from '@monstrs/cli-ui-renderer'

import { GitHubChecks }     from '../utils/index.js'
import { AnnotationLevel }  from '../utils/index.js'

class ChecksLintCommand extends BaseCommand {
  static override paths = [['checks', 'lint']]

  async execute(): Promise<number> {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        const checks = new GitHubChecks('lint')

        const { id: checkId } = await checks.start()

        await report.startTimerPromise('Lint', async () => {
          try {
            const results = await new LinterWorker(project.cwd).run(project.cwd)

            results
              .filter((result) => result.messages.length > 0)
              .forEach((result) => {
                const output = renderStatic(<ESLintResult {...result} />)

                output.split('\n').forEach((line) => {
                  report.reportInfo(MessageName.UNNAMED, line)
                })
              })

            const annotations = this.formatResults(results, project.cwd)

            const warnings: number = annotations.filter(
              (annotation) => annotation.annotation_level === AnnotationLevel.Warning
            ).length

            const errors: number = annotations.filter(
              (annotation) => annotation.annotation_level === AnnotationLevel.Failure
            ).length

            await checks.complete(checkId, {
              title:
                annotations.length > 0 ? `Errors ${errors}, Warnings ${warnings}` : 'Successful',
              summary:
                annotations.length > 0
                  ? `Found ${errors} errors and ${warnings} warnings`
                  : 'All checks passed',
              annotations,
            })
          } catch (error) {
            await checks.failure({
              title: 'Lint run failed',
              summary: error instanceof Error ? error.message : (error as string),
            })
          }
        })
      }
    )

    return commandReport.exitCode()
  }

  private getAnnotationLevel(severity: Linter.Severity): AnnotationLevel {
    if (severity === 1) {
      return AnnotationLevel.Warning
    }

    return AnnotationLevel.Failure
  }

  private formatResults(results: Array<ESLint.LintResult>, cwd?: string): Array<Annotation> {
    return results
      .filter((result) => result.messages.length > 0)
      .map(({ filePath, messages = [] }) =>
        messages.map((message) => {
          const line = (message.line || 0) + 1

          return {
            path: cwd ? filePath.substring(cwd.length + 1) : filePath,
            start_line: line,
            end_line: line,
            annotation_level: this.getAnnotationLevel(message.severity),
            raw_details: codeFrameColumns(
              readFileSync(filePath).toString(),
              {
                start: { line: message.line || 0, column: message.column || 0 },
              },
              { highlightCode: false }
            ),
            title: `(${message.ruleId || 'unknown'}): ${message.message}`,
            message: message.message,
          }
        }))
      .flat()
  }
}

export { ChecksLintCommand }
