import { BaseCommand }          from '@yarnpkg/cli'
import { Configuration }        from '@yarnpkg/core'
import { Project }              from '@yarnpkg/core'
import { StreamReport }         from '@yarnpkg/core'
import { MessageName }          from '@yarnpkg/core'

import React                    from 'react'
import { Option }               from 'clipanion'

import { TypeScriptDiagnostic } from '@monstrs/cli-ui-typescript-diagnostic-component'
import { TypeScript }           from '@monstrs/code-typescript'
import { SpinnerProgress }      from '@monstrs/yarn-run-utils'
import { renderStatic }         from '@monstrs/cli-ui-renderer'

class TypeCheckCommand extends BaseCommand {
  static paths = [['typecheck']]

  args: Array<string> = Option.Rest({ required: 0 })

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await report.startTimerPromise('Typecheck', async () => {
          const progress = new SpinnerProgress(this.context.stdout, configuration)

          progress.start()

          try {
            const ts = new TypeScript(project.cwd)

            const diagnostics = await ts.check(
              this.args.length > 0
                ? this.args
                : project.topLevelWorkspace.manifest.workspaceDefinitions.map(
                    (definition) => definition.pattern
                  )
            )

            progress.end()

            diagnostics.forEach((diagnostic) => {
              const output = renderStatic(<TypeScriptDiagnostic {...diagnostic} />)

              output.split('\n').forEach((line) => report.reportError(MessageName.UNNAMED, line))
            })
          } catch (error: any) {
            progress.end()

            const lines = (error?.message || '').split('\n').filter(Boolean)

            lines.forEach((line) => {
              report.reportError(MessageName.UNNAMED, line)
            })
          }
        })
      }
    )

    return commandReport.exitCode()
  }
}

export { TypeCheckCommand }
