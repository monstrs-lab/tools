import type { AggregatedResult } from '@jest/test-result'
import type { Config }           from '@jest/types'
import type { runCLI }           from '@monstrs/tools-runtime/jest'

import { constants }             from 'node:fs'
import { access }                from 'node:fs/promises'
import { join }                  from 'node:path'

export class Tester {
  protected constructor(
    private readonly run: typeof runCLI,
    private readonly config: { unit: object; integration: object },
    private readonly cwd: string
  ) {}

  static async initialize(cwd: string): Promise<Tester> {
    const { runCLI, unit, integration } = await import('@monstrs/tools-runtime/jest')

    return new Tester(runCLI, { unit, integration }, cwd)
  }

  async unit(options?: Partial<Config.Argv>, files?: Array<string>): Promise<AggregatedResult> {
    process.env.TS_JEST_DISABLE_VER_CHECKER = 'true'

    const setup = {
      globalSetup: (await this.isConfigExists('.config/test/unit/global-setup.ts'))
        ? join(this.cwd, '.config/test/unit/global-setup.ts')
        : undefined,
      globalTeardown: (await this.isConfigExists('.config/test/unit/global-teardown.ts'))
        ? join(this.cwd, '.config/test/unit/global-teardown.ts')
        : undefined,
      setupFilesAfterEnv: (await this.isConfigExists('.config/test/unit/setup.ts'))
        ? [join(this.cwd, '.config/test/unit/setup.ts')]
        : [],
    }

    const argv = {
      rootDir: this.cwd,
      ci: false,
      detectLeaks: false,
      detectOpenHandles: false,
      errorOnDeprecated: false,
      listTests: false,
      passWithNoTests: true,
      runTestsByPath: false,
      testLocationInResults: true,
      config: JSON.stringify({ ...this.config.unit, ...setup }),
      maxConcurrency: 5,
      notifyMode: 'failure-change',
      _: files || [],
      $0: '',
      ...options,
    }

    const { results } = await this.run(argv, [this.cwd])

    return results
  }

  async integration(
    options?: Partial<Config.Argv>,
    files?: Array<string>
  ): Promise<AggregatedResult> {
    process.env.TS_JEST_DISABLE_VER_CHECKER = 'true'

    const setup = {
      globalSetup: (await this.isConfigExists('.config/test/integration/global-setup.ts'))
        ? join(this.cwd, '.config/test/integration/global-setup.ts')
        : undefined,
      globalTeardown: (await this.isConfigExists('.config/test/integration/global-teardown.ts'))
        ? join(this.cwd, '.config/test/integration/global-teardown.ts')
        : undefined,
      setupFilesAfterEnv: (await this.isConfigExists('.config/test/integration/setup.ts'))
        ? [join(this.cwd, '.config/test/integration/setup.ts')]
        : [],
    }

    const argv = {
      rootDir: this.cwd,
      ci: false,
      detectLeaks: false,
      detectOpenHandles: false,
      errorOnDeprecated: false,
      listTests: false,
      passWithNoTests: true,
      runTestsByPath: false,
      testLocationInResults: true,
      config: JSON.stringify({ ...this.config.integration, ...setup }),
      maxConcurrency: 1,
      notifyMode: 'failure-change',
      _: files || [],
      $0: '',
      ...options,
    }

    const { results } = await this.run(argv, [this.cwd])

    return results
  }

  private async isConfigExists(file: string): Promise<boolean> {
    try {
      await access(join(this.cwd, file), constants.R_OK)

      return true
    } catch {
      return false
    }
  }
}
