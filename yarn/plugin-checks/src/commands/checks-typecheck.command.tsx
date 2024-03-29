import type { PortablePath }             from '@yarnpkg/fslib'

import type { Annotation }               from '../utils/index.js'

import { EOL }                           from 'node:os'

import { BaseCommand }                   from '@yarnpkg/cli'
import { Configuration }                 from '@yarnpkg/core'
import { Project }                       from '@yarnpkg/core'
import { StreamReport }                  from '@yarnpkg/core'
import { MessageName }                   from '@yarnpkg/core'
import { codeFrameColumns }              from '@babel/code-frame'
import { xfs }                           from '@yarnpkg/fslib'
import { ppath }                         from '@yarnpkg/fslib'
import React                             from 'react'

import { TypeScriptDiagnostic }          from '@monstrs/cli-ui-typescript-diagnostic-component'
import { TypeScriptWorker }              from '@monstrs/code-typescript-worker'
import { renderStatic }                  from '@monstrs/cli-ui-renderer'
import { flattenDiagnosticMessageText }  from '@monstrs/code-typescript'
import { getLineAndCharacterOfPosition } from '@monstrs/code-typescript'

import { GitHubChecks }                  from '../utils/index.js'
import { AnnotationLevel }               from '../utils/index.js'

class ChecksTypeCheckCommand extends BaseCommand {
  static override paths = [['checks', 'typecheck']]

  async execute(): Promise<number> {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await report.startTimerPromise('Type Check', async () => {
          const checks = new GitHubChecks('types:check')

          const { id: checkId } = await checks.start()

          try {
            const ts = new TypeScriptWorker(project.cwd)

            const diagnostics = await ts.check(
              project.cwd,
              project.topLevelWorkspace.manifest.workspaceDefinitions.map(
                (definition) => definition.pattern
              )
            )

            diagnostics.forEach((diagnostic) => {
              const output = renderStatic(<TypeScriptDiagnostic {...diagnostic} />)

              output.split('\n').forEach((line) => {
                report.reportInfo(MessageName.UNNAMED, line)
              })
            })

            const annotations: Array<Annotation> = []

            diagnostics.forEach((diagnostic) => {
              if (diagnostic.file) {
                const position =
                  (diagnostic.file as any).lineMap && diagnostic.start
                    ? getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start)
                    : null

                annotations.push({
                  path: ppath.normalize(
                    ppath.relative(project.cwd, diagnostic.file.fileName as PortablePath)
                  ),
                  title: flattenDiagnosticMessageText(diagnostic.messageText, EOL)
                    .split(EOL)
                    .at(0)!,
                  message: flattenDiagnosticMessageText(diagnostic.messageText, EOL),
                  start_line: position ? position.line + 1 : 0,
                  end_line: position ? position.line + 1 : 0,
                  raw_details: position
                    ? codeFrameColumns(
                        // eslint-disable-next-line n/no-sync
                        xfs.readFileSync(diagnostic.file.fileName as PortablePath).toString(),
                        {
                          start: {
                            line: position.line + 1,
                            column: position.character + 1,
                          },
                        },
                        { highlightCode: false }
                      )
                    : flattenDiagnosticMessageText(diagnostic.messageText, EOL),
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
              title: 'Types check run failed',
              summary: error instanceof Error ? error.message : (error as string),
            })
          }
        })
      }
    )

    return commandReport.exitCode()
  }
}

export { ChecksTypeCheckCommand }
