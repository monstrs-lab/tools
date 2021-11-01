import { access }        from 'node:fs/promises'

import { BaseCommand }   from '@yarnpkg/cli'
import { Configuration } from '@yarnpkg/core'
import { Project }       from '@yarnpkg/core'
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
    const { project } = await Project.find(configuration, this.context.cwd)

    const { TypeScript }: typeof Runtime = require('@monstrs/yarn-runtime')
    const ts = new TypeScript(this.source || this.context.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await this.cleanTarget()

        await report.startTimerPromise('Library build', async () => {
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
    /*
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)

    const { project } = await Project.find(configuration, this.context.cwd)

    await this.cli.run(['mctl', 'library', 'build', '--source', this.context.cwd], {
      cwd: project.cwd,
    })
    */
  }

  protected async cleanTarget() {
    try {
      await access(this.target)

      rimraf.sync(this.target)
    } catch {}
  }
}

export { AppLibraryBuildCommand }
