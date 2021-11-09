import { EOL }              from 'node:os'

import { BaseCommand }      from '@yarnpkg/cli'
import { Configuration }    from '@yarnpkg/core'
import { Project }          from '@yarnpkg/core'
import { StreamReport }     from '@yarnpkg/core'
import { MessageName }      from '@yarnpkg/core'
import { PortablePath }     from '@yarnpkg/fslib'
import { codeFrameColumns } from '@babel/code-frame'
import { xfs }              from '@yarnpkg/fslib'
import { ppath }            from '@yarnpkg/fslib'

import type * as Runtime    from '@monstrs/yarn-runtime'

import { GitHubChecks }     from './github.checks'
import { AnnotationLevel }  from './github.checks'
import { Annotation }       from './github.checks'

class ChecksTypeCheckCommand extends BaseCommand {
  static paths = [['checks', 'typecheck']]

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    // eslint-disable-next-line global-require
    const { TypeScript }: typeof Runtime = require('@monstrs/yarn-runtime')
    // eslint-disable-next-line global-require
    const { flattenDiagnosticMessageText }: typeof Runtime = require('@monstrs/yarn-runtime')

    const ts = new TypeScript(project.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await report.startTimerPromise('Typecheck', async () => {
          const checks = new GitHubChecks('TypeCheck')

          const { id: checkId } = await checks.start()

          try {
            const diagnostics = ts.check(
              project.topLevelWorkspace.manifest.workspaceDefinitions.map(
                (definition) => definition.pattern
              )
            )

            diagnostics.forEach((diagnostic) => {
              ts.formatDiagnostic(diagnostic)
                .split('\n')
                .map((line) => report.reportInfo(MessageName.UNNAMED, line))
            })

            const annotations: Array<Annotation> = []

            diagnostics.forEach((diagnostic) => {
              if (diagnostic.file) {
                const position = diagnostic.file.getLineAndCharacterOfPosition(
                  diagnostic.start || 0
                )

                annotations.push({
                  path: ppath.normalize(
                    ppath.relative(project.cwd, diagnostic.file.fileName as PortablePath)
                  ),
                  title: flattenDiagnosticMessageText(diagnostic.messageText, EOL)
                    .split(EOL)
                    .at(0) as string,
                  message: flattenDiagnosticMessageText(diagnostic.messageText, EOL),
                  start_line: position.line + 1,
                  end_line: position.line + 1,
                  raw_details: codeFrameColumns(
                    xfs.readFileSync(diagnostic.file.fileName as PortablePath).toString(),
                    {
                      start: {
                        line: position.line + 1,
                        column: position.character + 1,
                      },
                    },
                    { highlightCode: false }
                  ),
                  annotation_level: AnnotationLevel.Failure,
                })
              }
            })

            await checks.complete(checkId, {
              title: diagnostics.length > 0 ? `Errors ${annotations.length}` : 'Successful',
              summary:
                diagnostics.length > 0 ? `Found ${annotations.length} errors` : 'All checks passed',
              annotations,
            })
          } catch (error) {
            await checks.failure({
              title: 'TypeCheck run failed',
              summary: (error as any).message,
            })
          }
        })
      }
    )

    return commandReport.exitCode()
  }
}

export { ChecksTypeCheckCommand }
