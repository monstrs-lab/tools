import { join }                from 'node:path'

import { StreamReport }        from '@yarnpkg/core'
import { Configuration }       from '@yarnpkg/core'
import { Project }             from '@yarnpkg/core'
import { Filename }            from '@yarnpkg/fslib'
import { scriptUtils }         from '@yarnpkg/core'
import { execUtils }           from '@yarnpkg/core'
import { xfs }                 from '@yarnpkg/fslib'

import { Tester }              from '@monstrs/code-test'

import { AbstractTestCommand } from './abstract-test.command.jsx'

export class TestUnitCommand extends AbstractTestCommand {
  static override paths = [['test', 'unit']]

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

    if (this.bail) {
      args.push('-b')
    }

    if (this.updateSnapshot) {
      args.push('-u')
    }

    if (this.findRelatedTests) {
      args.push('-f')
    }

    const binFolder = await xfs.mktempPromise()

    const { code } = await execUtils.pipevp('yarn', ['test', 'unit', ...args, ...this.files], {
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
    const { project, workspace } = await Project.find(configuration, this.context.cwd)

    const args: Array<string> = []

    if (workspace) {
      if (this.files.length > 0) {
        const scope = this.context.cwd.replace(project.cwd, '')

        this.files.forEach((file) =>
          args.push(join(scope.startsWith('/') ? scope.substr(1) : scope, file)))
      } else {
        const scope = this.context.cwd.replace(project.cwd, '')

        args.push(scope.startsWith('/') ? scope.substr(1) : scope)
      }
    } else if (this.files.length > 0) {
      this.files.forEach((file) => args.push(file))
    }

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async () => {
        this.wrapOutput()

        const tester = await Tester.initialize(project.cwd)

        await tester.unit(
          {
            findRelatedTests: this.findRelatedTests,
            updateSnapshot: this.updateSnapshot,
            bail: this.bail,
          },
          args
        )
      }
    )

    return commandReport.exitCode()
  }
}
