import { AggregatedResult }       from '@jest/test-result'
import { Config }                 from '@jest/types'
import { runCLI }                 from '@jest/core'

import { buildIntegrationConfig } from './jest.config'
import { buildUnitConfig }        from './jest.config'

const unit = async (
  project: string,
  options?: Partial<Config.Argv>,
  files?: string[]
): Promise<{
  results: AggregatedResult
  globalConfig: Config.GlobalConfig
}> => {
  process.env.TS_JEST_DISABLE_VER_CHECKER = 'true'

  const argv: any = {
    rootDir: project,
    ci: false,
    detectLeaks: false,
    detectOpenHandles: false,
    errorOnDeprecated: false,
    listTests: false,
    passWithNoTests: true,
    runTestsByPath: false,
    testLocationInResults: true,
    config: JSON.stringify(buildUnitConfig(project)),
    maxConcurrency: 5,
    notifyMode: 'failure-change',
    _: files || [],
    ...options,
  }

  return runCLI(argv, [project])
}

const integration = async (
  project: string,
  options?: Partial<Config.Argv>,
  files?: string[]
): Promise<{
  results: AggregatedResult
  globalConfig: Config.GlobalConfig
}> => {
  process.env.TS_JEST_DISABLE_VER_CHECKER = 'true'

  const argv: any = {
    rootDir: project,
    ci: false,
    detectLeaks: false,
    detectOpenHandles: false,
    errorOnDeprecated: false,
    listTests: false,
    passWithNoTests: true,
    runTestsByPath: false,
    testLocationInResults: true,
    config: JSON.stringify(buildIntegrationConfig(project)),
    maxConcurrency: 5,
    notifyMode: 'failure-change',
    _: files || [],
    ...options,
  }

  return runCLI(argv, [project])
}

export { unit, integration }
