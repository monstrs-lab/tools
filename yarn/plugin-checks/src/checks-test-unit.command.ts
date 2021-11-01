import { StreamReport }              from '@yarnpkg/core'
import { Configuration }             from '@yarnpkg/core'
import { Project }                   from '@yarnpkg/core'

import { Conclusion }                from '@monstrs/github-checks-utils'
import { createCheck }               from '@monstrs/github-checks-utils'
import type * as Runtime             from '@monstrs/yarn-runtime'

import { AbstractChecksTestCommand } from './abstract-checks-test.command'

class ChecksTestUnitCommand extends AbstractChecksTestCommand {
  static paths = [['checks', 'test', 'unit']]

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const { Tester }: typeof Runtime = require('@monstrs/yarn-runtime') as typeof Runtime
    const tester = new Tester(project.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async () => {
        try {
          const results = await tester.unit()

          const annotations = this.formatResults(results, project.cwd)

          await createCheck(
            'Test:Unit',
            annotations.length > 0 ? Conclusion.Failure : Conclusion.Success,
            {
              title: annotations.length > 0 ? `Errors ${annotations.length}` : 'Successful',
              summary:
                annotations.length > 0 ? `Found ${annotations.length} errors` : 'All checks passed',
              annotations,
            }
          )
        } catch (error) {
          await createCheck('Test:Unit', Conclusion.Failure, {
            title: 'Test:Unit run failed',
            summary: (error as any).message,
          })
        }
      }
    )

    return commandReport.exitCode()
  }
}

export { ChecksTestUnitCommand }
