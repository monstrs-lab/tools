import { access }               from 'node:fs/promises'

import { BaseCommand }          from '@yarnpkg/cli'
import { Configuration }        from '@yarnpkg/core'
import { StreamReport }         from '@yarnpkg/core'
import { MessageName }          from '@yarnpkg/core'

import React                    from 'react'
import rimraf                   from 'rimraf'
import { Option }               from 'clipanion'

import { TypeScriptDiagnostic } from '@monstrs/cli-ui-typescript-diagnostic-component'
import { TypeScript }           from '@monstrs/code-typescript'
import { SpinnerProgress }      from '@monstrs/yarn-run-utils'
import { renderStatic }         from '@monstrs/cli-ui-renderer'

class AppLibraryBuildCommand extends BaseCommand {
  static paths = [['app', 'library', 'build']]

  target = Option.String(`-t,--target`, './dist')

  source? = Option.String(`-s,--source`)

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
            const ts = new TypeScript(this.source || this.context.cwd)

            const diagnostics = await ts.build(['./src'], {
              module: 'commonjs' as any,
              outDir: this.target,
              declaration: true,
            })

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

  protected async cleanTarget() {
    try {
      await access(this.target)

      rimraf.sync(this.target)
      // eslint-disable-next-line no-empty
    } catch {}
  }
}

export { AppLibraryBuildCommand }
