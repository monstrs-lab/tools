import { Command }               from 'clipanion'

import { integration }           from '@monstrs/code-test'
import { formatJestTestResults } from '@monstrs/github-checks-utils'
import { createCheck }           from '@monstrs/github-checks-utils'
import { Conclusion }            from '@monstrs/github-checks-utils'

class TestIntegrationCheckCommand extends Command {
  @Command.Path(`check`, `test:integration`)
  async execute() {
    const { results } = await integration(process.cwd(), { silent: true })

    const annotations = formatJestTestResults(
      results,
      process.env.GITHUB_WORKSPACE || process.cwd()
    )

    await createCheck(
      'Test:Integration',
      annotations.length > 0 ? Conclusion.Failure : Conclusion.Success,
      {
        title: annotations.length > 0 ? `Errors ${annotations.length}` : 'Successful',
        summary:
          annotations.length > 0 ? `Found ${annotations.length} errors` : 'All checks passed',
        annotations,
      }
    )
  }
}

export { TestIntegrationCheckCommand }
