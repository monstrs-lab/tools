import { rm }                   from 'node:fs/promises'
import { join }                 from 'node:path'

import { BaseCommand }          from '@yarnpkg/cli'
import { Configuration }        from '@yarnpkg/core'
import { StreamReport }         from '@yarnpkg/core'
import { MessageName }          from '@yarnpkg/core'
import { Project }              from '@yarnpkg/core'
import { Filename }             from '@yarnpkg/fslib'
import { scriptUtils }          from '@yarnpkg/core'
import { execUtils }            from '@yarnpkg/core'
import { xfs }                  from '@yarnpkg/fslib'
import { Option }               from 'clipanion'
import { isEnum }               from 'typanion'
import React                    from 'react'

import { ErrorInfo }            from '@monstrs/cli-ui-error-info-component'
import { TypeScriptDiagnostic } from '@monstrs/cli-ui-typescript-diagnostic-component'
import { TypeScript }           from '@monstrs/code-typescript'
import { SpinnerProgress }      from '@monstrs/yarn-run-utils'
import { renderStatic }         from '@monstrs/cli-ui-renderer'

export class LibraryBuildCommand extends BaseCommand {
  static override paths = [['library', 'build']]

  target = Option.String('-t,--target', './dist')

  module: 'commonjs' | 'nodenext' = Option.String('-m,--module', 'nodenext', {
    validator: isEnum(['nodenext', 'commonjs']),
  })

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

    const args: Array<string> = []

    if (this.target) {
      args.push('-t')
      args.push(this.target)
    }

    if (this.module) {
      args.push('-m')
      args.push(this.module)
    }

    const binFolder = await xfs.mktempPromise()

    const { code } = await execUtils.pipevp('yarn', ['library', 'build', ...args], {
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
            const typescript = await TypeScript.initialize(this.context.cwd)

            const diagnostics = await typescript.build([join(this.context.cwd, './src')], {
              outDir: join(this.context.cwd, this.target),
              module: this.module as any,
              declaration: true,
            })

            progress.end()

            diagnostics.forEach((diagnostic) => {
              const output = renderStatic(<TypeScriptDiagnostic {...diagnostic} />)

              output.split('\n').forEach((line) => {
                report.reportError(MessageName.UNNAMED, line)
              })
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

  protected async cleanTarget(): Promise<void> {
    try {
      await rm(this.target, { recursive: true, force: true })
      // eslint-disable-next-line no-empty
    } catch {}
  }
}
