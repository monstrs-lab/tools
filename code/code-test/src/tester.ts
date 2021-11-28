import { join }                   from 'node:path'

import { AggregatedResult }       from '@jest/test-result'
import { Config }                 from '@jest/types'

import { buildIntegrationConfig } from './jest.config'
import { buildUnitConfig }        from './jest.config'

//import { jestCore }               from '@monstrs/code-runtime'

export class Tester {
  constructor(private readonly cwd: string) {
    this.prepareEnv()
  }

  private prepareEnv() {
    process.env.TS_JEST_DISABLE_VER_CHECKER = 'true'

    if (process.versions.pnp) {
      const pnpPath = require('module').findPnpApi(__filename).resolveRequest('pnpapi', null)

      process.env.NODE_OPTIONS = process.env.NODE_OPTIONS
        ? [process.env.NODE_OPTIONS, `--require ${pnpPath}`].join(' ')
        : `--require ${pnpPath}`
    } else {
      process.env.NODE_OPTIONS = process.env.NODE_OPTIONS
        ? [process.env.NODE_OPTIONS, `--require ${join(process.cwd(), '.pnp.cjs')}`].join(' ')
        : `--require ${join(process.cwd(), '.pnp.cjs')}`
    }
  }

  async unit(options?: Partial<Config.Argv>, files?: string[]): Promise<AggregatedResult> {
    const argv: any = {
      rootDir: this.cwd,
      ci: false,
      detectLeaks: false,
      detectOpenHandles: false,
      errorOnDeprecated: false,
      listTests: false,
      passWithNoTests: true,
      runTestsByPath: false,
      testLocationInResults: true,
      config: JSON.stringify(buildUnitConfig(this.cwd)),
      maxConcurrency: 5,
      notifyMode: 'failure-change',
      _: files || [],
      ...options,
    }

    const { results } = await require(require('@monstrs/code-runtime').jestCore).runCLI(argv, [
      this.cwd,
    ])

    return results
  }

  async integration(options?: Partial<Config.Argv>, files?: string[]): Promise<AggregatedResult> {
    process.env.TS_JEST_DISABLE_VER_CHECKER = 'true'

    const argv: any = {
      rootDir: this.cwd,
      ci: false,
      detectLeaks: false,
      detectOpenHandles: false,
      errorOnDeprecated: false,
      listTests: false,
      passWithNoTests: true,
      runTestsByPath: false,
      testLocationInResults: true,
      config: JSON.stringify(buildIntegrationConfig(this.cwd)),
      maxConcurrency: 5,
      notifyMode: 'failure-change',
      _: files || [],
      ...options,
    }

    const { results } = await require(require('@monstrs/code-runtime').jestCore).runCLI(argv, [
      this.cwd,
    ])

    return results
  }
}
