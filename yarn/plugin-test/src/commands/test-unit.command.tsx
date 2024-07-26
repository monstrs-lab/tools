import { join }                from 'node:path'

import { StreamReport }        from '@yarnpkg/core'
import { Configuration }       from '@yarnpkg/core'
import { Project }             from '@yarnpkg/core'

import { Tester }              from '@monstrs/code-test'

import { AbstractTestCommand } from './abstract-test.command.jsx'

class TestUnitCommand extends AbstractTestCommand {
  static override paths = [['test', 'unit']]

  async execute(): Promise<number> {
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

export { TestUnitCommand }
