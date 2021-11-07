import { BaseCommand }   from '@yarnpkg/cli'
import { Configuration } from '@yarnpkg/core'
import { Project }       from '@yarnpkg/core'
import { StreamReport }  from '@yarnpkg/core'
import { MessageName }   from '@yarnpkg/core'
import { Option }        from 'clipanion'

import type * as Runtime from '@monstrs/yarn-runtime'

class TypeCheckCommand extends BaseCommand {
  static paths = [['typecheck']]

  args: Array<string> = Option.Rest({ required: 0 })

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const { TypeScript }: typeof Runtime = require('@monstrs/yarn-runtime')
    const ts = new TypeScript(project.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await report.startTimerPromise('Typecheck', async () => {
          const diagnostics = ts.check(
            this.args.length > 0
              ? this.args
              : project.topLevelWorkspace.manifest.workspaceDefinitions.map(
                  (definition) => definition.pattern
                )
          )

          diagnostics.forEach((diagnostic) => {
            ts.formatDiagnostic(diagnostic)
              .split('\n')
              .map((line) => report.reportError(MessageName.UNNAMED, line))
          })
        })
      }
    )

    return commandReport.exitCode()
  }
}

export { TypeCheckCommand }
