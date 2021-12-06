import { access }               from 'node:fs/promises'
import { join } from 'node:path'

import { BaseCommand }          from '@yarnpkg/cli'
import { Configuration }        from '@yarnpkg/core'
import { StreamReport }         from '@yarnpkg/core'
import { MessageName }          from '@yarnpkg/core'

import React                    from 'react'
import rimraf                   from 'rimraf'
import { Option }               from 'clipanion'

import { ErrorInfo }            from '@monstrs/cli-ui-error-info-component'
import { TypeScriptDiagnostic } from '@monstrs/cli-ui-typescript-diagnostic-component'
import { TypeScript }           from '@monstrs/code-typescript'
import { SpinnerProgress }      from '@monstrs/yarn-run-utils'
import { renderStatic }         from '@monstrs/cli-ui-renderer'

class AppLibraryBuildCommand extends BaseCommand {
  static paths = [['app', 'library', 'build']]

  target = Option.String('-t,--target', './dist')

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await this.cleanTarget()

        await report.startTimerPromise('Library Build', async () => {
          const progress = new SpinnerProgress(this.context.stdout, configuration)

          progress.start()

          try {
            const ts = new TypeScript(configuration.projectCwd!)

            const diagnostics = await ts.build([join(this.context.cwd, './src')], {
              outDir: join(this.context.cwd, this.target),
              module: 'commonjs' as any,
              declaration: true,
            })

            progress.end()

            diagnostics.forEach((diagnostic) => {
              const output = renderStatic(<TypeScriptDiagnostic {...diagnostic} />)

              output.split('\n').forEach((line) => report.reportError(MessageName.UNNAMED, line))
            })
          } catch (error) {
            progress.end()

            renderStatic(<ErrorInfo error={error as Error} />, process.stdout.columns - 12)
              .split('\n')
              .forEach((line) => {
                report.reportError(MessageName.UNNAMED, line)
              })
          }
        })
      }
    )

    return commandReport.exitCode()
  }

  protected async cleanTarget() {
    try {
      await access(this.target)

      rimraf.sync(this.target)
      // eslint-disable-next-line no-empty
    } catch {}
  }
}

export { AppLibraryBuildCommand }
