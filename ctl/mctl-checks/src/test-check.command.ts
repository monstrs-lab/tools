import { Command }                                              from 'clipanion'

import { test }                                                 from '@monstrs/code-test'

import { Annotation, AnnotationLevel, Conclusion, createCheck } from './github'

class TestCheckCommand extends Command {
  @Command.Path(`check`, `test`)
  async execute() {
    const { results }: any = await test(process.cwd(), { silent: true })

    const cwd: string = process.env.GITHUB_WORKSPACE || process.cwd()

    const assertions = results.testResults
      .reduce(
        (result: any, testResult: any) => [
          ...result,
          ...testResult.testResults.map((assertion: any) => ({
            ...assertion,
            path: testResult.testFilePath.substring(cwd.length + 1),
          })),
        ],
        []
      )
      .filter((assertion: any) => assertion.status === 'failed')

    const annotations: Annotation[] = assertions.map((assertion: any) => ({
      path: assertion.path,
      start_line: assertion.location ? assertion.location.line + 1 : 1,
      end_line: assertion.location ? assertion.location.line + 1 : 1,
      annotation_level: AnnotationLevel.Failure,
      raw_details: assertion.failureMessages.join('\n'),
      title: assertion.ancestorTitles.join(' '),
      message: assertion.title,
    }))

    await createCheck('Test', annotations.length > 0 ? Conclusion.Failure : Conclusion.Success, {
      title: annotations.length > 0 ? `Errors ${annotations.length}` : 'Successful',
      summary: annotations.length > 0 ? `Found ${annotations.length} errors` : 'All checks passed',
      annotations,
    })
  }
}

export { TestCheckCommand }
