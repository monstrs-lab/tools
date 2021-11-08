import { EOL }              from 'node:os'

import { BaseCommand }      from '@yarnpkg/cli'
import { Configuration }    from '@yarnpkg/core'
import { Project }          from '@yarnpkg/core'
import { StreamReport }     from '@yarnpkg/core'
import { MessageName }      from '@yarnpkg/core'
import { PortablePath }     from '@yarnpkg/fslib'
import { xfs }              from '@yarnpkg/fslib'
import { ppath }            from '@yarnpkg/fslib'
import { codeFrameColumns } from '@babel/code-frame'

import { AnnotationLevel }  from '@monstrs/github-checks-utils'
import { Annotation }       from '@monstrs/github-checks-utils'
import { Conclusion }       from '@monstrs/github-checks-utils'
import { completeCheck }      from '@monstrs/github-checks-utils'
import { startCheck }      from '@monstrs/github-checks-utils'
import { createCheck }      from '@monstrs/github-checks-utils'
import type * as Runtime    from '@monstrs/yarn-runtime'

class ChecksTypeCheckCommand extends BaseCommand {
  static paths = [['checks', 'typecheck']]

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const {
      TypeScript,
      flattenDiagnosticMessageText,
    }: typeof Runtime = require('@monstrs/yarn-runtime')
    const ts = new TypeScript(project.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await report.startTimerPromise('Typecheck', async () => {
          try {
            const checkId = await startCheck('TypeCheck')

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

            const conclusion = diagnostics.length > 0 ? Conclusion.Failure : Conclusion.Success

            await completeCheck(checkId, 'TypeCheck', conclusion, {
              title:
                conclusion === Conclusion.Failure ? `Errors ${annotations.length}` : 'Successful',
              summary:
                conclusion === Conclusion.Failure
                  ? `Found ${annotations.length} errors`
                  : 'All checks passed',
              annotations,
            })
          } catch (error) {
            await createCheck('TypeCheck', Conclusion.Failure, {
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
