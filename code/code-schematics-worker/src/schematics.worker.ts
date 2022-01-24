import type { DryRunEvent } from '@angular-devkit/schematics'

import { EvalWorker }       from '@monstrs/code-worker-utils'

import { getContent }       from './schematics.worker.content'

export interface SchematicsWorkerRunOptions {
  type: 'generate' | 'migrate'
  cwd: string
  force: boolean
  dryRun: boolean
  schematicName: string
  migrationVersion: string
  options: object
}

export class SchematicsWorker {
  constructor(
    private readonly cwd: string,
    private readonly force = false,
    private readonly dryRun = false
  ) {}

  generate(schematicName: string, options = {}): Promise<Array<DryRunEvent>> {
    return EvalWorker.run(getContent(), {
      type: 'generate',
      cwd: this.cwd,
      force: this.force,
      dryRun: this.dryRun,
      schematicName,
      options,
    })
  }

  migrate(
    schematicName: string,
    migrationVersion: string,
    options = {}
  ): Promise<Array<DryRunEvent>> {
    return EvalWorker.run(getContent(), {
      type: 'migrate',
      cwd: this.cwd,
      force: this.force,
      dryRun: this.dryRun,
      migrationVersion,
      schematicName,
      options,
    })
  }
}
