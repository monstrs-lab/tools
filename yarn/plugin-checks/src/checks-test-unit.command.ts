import { StreamReport }              from '@yarnpkg/core'
import { Configuration }             from '@yarnpkg/core'
import { Project }                   from '@yarnpkg/core'

import type * as Runtime             from '@monstrs/yarn-runtime'

import { AbstractChecksTestCommand } from './abstract-checks-test.command'
import { GitHubChecks }              from './github.checks'

class ChecksTestUnitCommand extends AbstractChecksTestCommand {
  static paths = [['checks', 'test', 'unit']]

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    // eslint-disable-next-line global-require
    const { Tester }: typeof Runtime = require('@monstrs/yarn-runtime') as typeof Runtime

    const tester = new Tester(project.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async () => {
        const checks = new GitHubChecks('Test:Unit')

        const { id: checkId } = await checks.start()

        try {
          const results = await tester.unit()

          const annotations = this.formatResults(results, project.cwd)

          await checks.complete(checkId, {
            title: annotations.length > 0 ? `Errors ${annotations.length}` : 'Successful',
            summary:
              annotations.length > 0 ? `Found ${annotations.length} errors` : 'All checks passed',
            annotations,
          })
        } catch (error) {
          await checks.failure({
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
