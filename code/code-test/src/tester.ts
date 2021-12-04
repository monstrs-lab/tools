/* eslint-disable global-require */

import { join }             from 'node:path'

import type { Config }      from '@jest/types'

import { AggregatedResult } from '@jest/test-result'

import { TesterWorker }     from './tester.worker'

export class Tester {
  constructor(private readonly cwd: string) {
    this.prepareEnv()
  }

  private prepareEnv() {
    process.env.TS_JEST_DISABLE_VER_CHECKER = 'true'

    const pnpPath = this.getPnpApiPath()

    process.env.NODE_OPTIONS = process.env.NODE_OPTIONS
      ? [process.env.NODE_OPTIONS, `--require ${pnpPath}`].join(' ')
      : `--require ${pnpPath}`
  }

  private getPnpApiPath() {
    if (process.versions.pnp) {
      return require('module').findPnpApi(__filename).resolveRequest('pnpapi', null)
    }

    return join(process.cwd(), '.pnp.cjs')
  }

  async unit(options?: Partial<Config.Argv>, files?: string[]): Promise<AggregatedResult> {
    return TesterWorker.run(this.cwd, 'unit', options, files)
  }

  async integration(options?: Partial<Config.Argv>, files?: string[]): Promise<AggregatedResult> {
    return TesterWorker.run(this.cwd, 'integration', options, files)
  }
}
