import { AggregatedResult } from '@jest/test-result'
import { Config }           from '@jest/types'
import { runCLI }           from '@jest/core'

import { config }           from './jest.config'

const test = async (
  project: string,
  options?: any,
  files?: string[]
): Promise<{
  results: AggregatedResult
  globalConfig: Config.GlobalConfig
}> => {
  const argv: any = {
    rootDir: project,
    ci: false,
    detectLeaks: false,
    detectOpenHandles: false,
    errorOnDeprecated: false,
    listTests: false,
    passWithNoTests: false,
    runTestsByPath: false,
    testLocationInResults: true,
    config: JSON.stringify(config),
    maxConcurrency: 5,
    notifyMode: 'failure-change',
    _: files || [],
    ...options,
  }

  return runCLI(argv, [project])
}

export { test }
