import type { AggregatedResult } from '@jest/test-result'

import type { Annotation }       from './github.checks.js'

import { BaseCommand }           from '@yarnpkg/cli'

import { AnnotationLevel }       from './github.checks.js'

export abstract class AbstractChecksTestCommand extends BaseCommand {
  formatResults(results: AggregatedResult, cwd?: string): Array<Annotation> {
    return results.testResults
      .map(({ testResults, testFilePath }) =>
        testResults
          .filter((testResult) => testResult.status === 'failed')
          .map((testResult) => ({
            path: cwd ? testFilePath.substring(cwd.length + 1) : testFilePath,
            start_line: testResult.location ? testResult.location.line + 1 : 1,
            end_line: testResult.location ? testResult.location.line + 1 : 1,
            annotation_level: AnnotationLevel.Failure,
            raw_details: testResult.failureMessages.join('\n'),
            title: testResult.ancestorTitles.join(' '),
            message: testResult.title,
          })))
      .flat()
  }
}
