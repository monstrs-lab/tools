import { BaseCommand }     from '@yarnpkg/cli'
import { Configuration }   from '@yarnpkg/core'
import { Project }         from '@yarnpkg/core'
import { StreamReport }    from '@yarnpkg/core'
import { MessageName }     from '@yarnpkg/core'
import { Filename }        from '@yarnpkg/fslib'
import { execUtils }       from '@yarnpkg/core'
import { scriptUtils }     from '@yarnpkg/core'
import { xfs }             from '@yarnpkg/fslib'

import { Formatter }       from '@monstrs/code-format'
import { Icons }           from '@monstrs/code-icons'
import { Linter }          from '@monstrs/code-lint'
import { SpinnerProgress } from '@monstrs/yarn-run-utils'

export class UiIconsGenerateCommand extends BaseCommand {
  static override paths = [['ui', 'icons', 'generate']]

  override async execute(): Promise<number> {
    const nodeOptions = process.env.NODE_OPTIONS ?? ''

    if (nodeOptions.includes(Filename.pnpCjs) && nodeOptions.includes(Filename.pnpEsmLoader)) {
      return this.executeRegular()
    }

    return this.executeProxy()
  }

  async executeProxy(): Promise<number> {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const binFolder = await xfs.mktempPromise()

    const { code } = await execUtils.pipevp('yarn', ['ui', 'icons', 'generate'], {
      cwd: this.context.cwd,
      stdin: this.context.stdin,
      stdout: this.context.stdout,
      stderr: this.context.stderr,
      env: await scriptUtils.makeScriptEnv({ binFolder, project }),
    })

    return code
  }

  async executeRegular(): Promise<number> {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await report.startTimerPromise('Icons compile', async () => {
          const progress = new SpinnerProgress(this.context.stdout, configuration)

          progress.start()

          try {
            const formatter = new Formatter(this.context.cwd)
            const linter = await Linter.initialize(project.cwd, this.context.cwd)
            const icons = await Icons.initialize(this.context.cwd)

            await icons.generate()
            await formatter.format([])
            await linter.lint([], { fix: true })

            progress.end()
          } catch (error) {
            progress.end()

            report.reportError(
              MessageName.UNNAMED,
              error instanceof Error ? error.message : 'Error generate icons'
            )
          }
        })
      }
    )

    return commandReport.exitCode()
  }
}
