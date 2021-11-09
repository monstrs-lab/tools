import { readFileSync }     from 'node:fs'

import { BaseCommand }      from '@yarnpkg/cli'
import { StreamReport }     from '@yarnpkg/core'
import { Configuration }    from '@yarnpkg/core'
import { MessageName }      from '@yarnpkg/core'
import { Project }          from '@yarnpkg/core'
import { codeFrameColumns } from '@babel/code-frame'

import type * as Runtime    from '@monstrs/yarn-runtime'
import type { LintResult }  from '@monstrs/yarn-runtime'
import type { Severity }    from '@monstrs/yarn-runtime'

import { GitHubChecks }     from './github.checks'
import { AnnotationLevel }  from './github.checks'
import { Annotation }       from './github.checks'

class ChecksLintCommand extends BaseCommand {
  static paths = [['checks', 'lint']]

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    // eslint-disable-next-line global-require
    const { Linter }: typeof Runtime = require('@monstrs/yarn-runtime') as typeof Runtime

    const linter = new Linter(project.cwd)

    const formatter = await linter.loadFormatter()

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        const checks = new GitHubChecks('Lint')

        const { id: checkId } = await checks.start()

        // eslint-disable-next-line consistent-return
        const results = await report.startTimerPromise('Lint', async () => {
          try {
            return await linter.lint()
          } catch (error) {
            await checks.failure({
              title: 'Lint run failed',
              summary: (error as any).message,
            })
          }
        })

        if (results) {
          const output = formatter.format(results)

          if (output) {
            output.split('\n').map((line) => report.reportInfo(MessageName.UNNAMED, line))
          }

          const annotations = this.formatResults(results, project.cwd)

          const warnings: number = annotations.filter(
            (annotation) => annotation.annotation_level === 'warning'
          ).length

          const errors: number = annotations.filter(
            (annotation) => annotation.annotation_level === 'failure'
          ).length

          await checks.complete(checkId, {
            title: annotations.length > 0 ? `Errors ${errors}, Warnings ${warnings}` : 'Successful',
            summary:
              annotations.length > 0
                ? `Found ${errors} errors and ${warnings} warnings`
                : 'All checks passed',
            annotations,
          })
        }
      }
    )

    return commandReport.exitCode()
  }

  private getAnnotationLevel(severity: Severity): AnnotationLevel {
    if (severity === 1) {
      return AnnotationLevel.Warning
    }

    return AnnotationLevel.Failure
  }

  private formatResults(results: Array<LintResult>, cwd?: string): Array<Annotation> {
    return results
      .filter((result) => result.messages?.length > 0)
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
            title: `(${message.ruleId}): ${message.message}`,
            message: message.message,
          }
        }))
      .flat()
  }
}

export { ChecksLintCommand }
