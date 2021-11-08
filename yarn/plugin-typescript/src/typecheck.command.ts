import { BaseCommand }     from '@yarnpkg/cli'
import { Configuration }   from '@yarnpkg/core'
import { Project }         from '@yarnpkg/core'
import { StreamReport }    from '@yarnpkg/core'
import { MessageName }     from '@yarnpkg/core'
import { Option }          from 'clipanion'

import type * as Runtime   from '@monstrs/yarn-runtime'
import { SpinnerProgress } from '@monstrs/yarn-run-utils'

import { typecheck }       from './typecheck.worker'

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
          const progress = new SpinnerProgress(this.context.stdout, configuration)

          progress.start()

          try {
            const outputs = await typecheck(
              project.cwd,
              this.args.length > 0
                ? this.args
                : project.topLevelWorkspace.manifest.workspaceDefinitions.map(
                    (definition) => definition.pattern
                  )
            )

            progress.end()

            outputs.map((line) => report.reportError(MessageName.UNNAMED, line))
          } catch (error) {
            progress.end()

            report.reportError(MessageName.UNNAMED, (error as any).message)
          }
        })
      }
    )

    return commandReport.exitCode()
  }
}

export { TypeCheckCommand }
