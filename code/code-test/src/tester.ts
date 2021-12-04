/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import { accessSync }       from 'node:fs'
import { join }             from 'node:path'

import { AggregatedResult } from '@jest/test-result'
import type { Config }           from '@jest/types'

import { integration }      from '@monstrs/config-jest'
import { unit }             from '@monstrs/config-jest'

import { TesterWorker }     from './tester.worker'

const isFileExists = (file) => {
  try {
    accessSync(file)

    return true
  } catch {
    return false
  }
}

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
