import { access }        from 'node:fs/promises'

import { BaseCommand }   from '@yarnpkg/cli'
import { Configuration } from '@yarnpkg/core'
import { StreamReport }  from '@yarnpkg/core'
import { MessageName }   from '@yarnpkg/core'
import { Option }        from 'clipanion'
import rimraf            from 'rimraf'

import type * as Runtime from '@monstrs/yarn-runtime'

class AppLibraryBuildCommand extends BaseCommand {
  static paths = [['app', 'library', 'build']]

  target = Option.String(`-t,--target`, './dist')

  source? = Option.String(`-s,--source`)

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)

    // eslint-disable-next-line global-require
    const { TypeScript }: typeof Runtime = require('@monstrs/yarn-runtime')

    const ts = new TypeScript(this.source || this.context.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await this.cleanTarget()

        await report.startTimerPromise('Library Build', async () => {
          const diagnostics = ts.build(['./src'], {
            module: 'commonjs' as any,
            outDir: this.target,
            declaration: true,
          })

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

  protected async cleanTarget() {
    try {
      await access(this.target)

      rimraf.sync(this.target)
      // eslint-disable-next-line no-empty
    } catch {}
  }
}

export { AppLibraryBuildCommand }
